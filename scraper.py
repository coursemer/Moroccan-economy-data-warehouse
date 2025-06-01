import requests
from bs4 import BeautifulSoup
import json
import re
import logging
from datetime import datetime
import time

logger = logging.getLogger(__name__)

class AlternativeDataSources:
    def __init__(self):
        self.alternative_sources = {
            # Sources officielles internationales
            'world_bank': {
                'base_url': 'https://data.worldbank.org/country/morocco',
                'api_url': 'https://api.worldbank.org/v2/country/MAR/indicator',
                'indicators': {
                    'gdp_growth': 'NY.GDP.MKTP.KD.ZG',
                    'unemployment': 'SL.UEM.TOTL.ZS',
                    'inflation': 'FP.CPI.TOTL.ZG',
                    'population': 'SP.POP.TOTL'
                }
            },
            
            # IMF Data
            'imf': {
                'base_url': 'https://www.imf.org/en/Countries/MAR',
                'data_url': 'https://www.imf.org/external/datamapper/datasets',
                'api_base': 'https://www.imf.org/external/datamapper/api/v1'
            },
            
            # OECD Data
            'oecd': {
                'base_url': 'https://data.oecd.org/morocco.htm',
                'api_url': 'https://stats.oecd.org/restsdmx/sdmx.ashx/GetData',
                'datasets': ['MEI', 'QNA', 'LFS']
            },
            
            # Trading Economics
            'trading_economics': {
                'base_url': 'https://tradingeconomics.com/morocco',
                'indicators': [
                    '/gdp-growth-rate',
                    '/unemployment-rate',
                    '/inflation-rate',
                    '/interest-rate'
                ]
            },
            
            # CEIC Data
            'ceic': {
                'base_url': 'https://www.ceicdata.com/en/country/morocco'
            },
            
            # Central Bank of Morocco (Bank Al-Maghrib)
            'bank_al_maghrib': {
                'base_url': 'https://www.bkam.ma',
                'statistics_url': 'https://www.bkam.ma/en/Statistics',
                'publications_url': 'https://www.bkam.ma/en/Publications-and-research'
            },
            
            # Ministry of Economy and Finance
            'ministry_economy': {
                'base_url': 'https://www.finances.gov.ma',
                'budget_url': 'https://www.finances.gov.ma/fr/Pages/budget.aspx'
            },
            
            # African Development Bank
            'afdb': {
                'base_url': 'https://www.afdb.org/en/countries/north-africa/morocco',
                'data_portal': 'https://dataportal.opendataforafrica.org/morocco'
            }
        }
        
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })

    def scrape_world_bank_api(self):
        """Scraper les données de la Banque Mondiale via API"""
        try:
            logger.info("Récupération des données Banque Mondiale...")
            
            results = {}
            base_url = self.alternative_sources['world_bank']['api_url']
            indicators = self.alternative_sources['world_bank']['indicators']
            
            for key, indicator in indicators.items():
                try:
                    url = f"{base_url}/{indicator}?format=json&date=2020:2024&per_page=5"
                    response = self.session.get(url, timeout=15)
                    response.raise_for_status()
                    
                    data = response.json()
                    if len(data) > 1 and data[1]:
                        # Prendre la valeur la plus récente non nulle
                        for entry in data[1]:
                            if entry['value'] is not None:
                                results[key] = {
                                    'value': float(entry['value']),
                                    'year': entry['date'],
                                    'indicator': indicator
                                }
                                break
                    
                    time.sleep(0.5)  # Respecter les limites de l'API
                    
                except Exception as e:
                    logger.warning(f"Erreur indicateur {key}: {e}")
                    continue
            
            if results:
                logger.info(f"Données Banque Mondiale récupérées: {len(results)} indicateurs")
                return {
                    'source': 'World Bank API',
                    'timestamp': datetime.now().isoformat(),
                    'data': results
                }
                
        except Exception as e:
            logger.error(f"Erreur API Banque Mondiale: {e}")
        
        return None

    def scrape_trading_economics(self):
        """Scraper Trading Economics"""
        try:
            logger.info("Récupération des données Trading Economics...")
            
            base_url = self.alternative_sources['trading_economics']['base_url']
            indicators = self.alternative_sources['trading_economics']['indicators']
            
            results = {}
            
            for indicator in indicators:
                try:
                    url = f"{base_url}{indicator}"
                    response = self.session.get(url, timeout=15)
                    response.raise_for_status()
                    
                    soup = BeautifulSoup(response.content, 'html.parser')
                    
                    # Chercher la valeur principale (généralement dans un div avec class "data-value")
                    value_elements = soup.find_all(['div', 'span'], 
                                                 class_=re.compile(r'(data-value|indicator-value|current-value)', re.I))
                    
                    for element in value_elements:
                        text = element.get_text().strip()
                        # Extraire les nombres avec pourcentage
                        match = re.search(r'([\d.,]+)\s*%?', text)
                        if match:
                            try:
                                value = float(match.group(1).replace(',', ''))
                                results[indicator.replace('/', '').replace('-', '_')] = {
                                    'value': value,
                                    'url': url,
                                    'extracted_text': text
                                }
                                break
                            except ValueError:
                                continue
                    
                    time.sleep(2)  # Délai entre les requêtes
                    
                except Exception as e:
                    logger.warning(f"Erreur {indicator}: {e}")
                    continue
            
            if results:
                logger.info(f"Données Trading Economics récupérées: {len(results)} indicateurs")
                return {
                    'source': 'Trading Economics',
                    'timestamp': datetime.now().isoformat(),
                    'data': results
                }
                
        except Exception as e:
            logger.error(f"Erreur Trading Economics: {e}")
        
        return None

    def scrape_imf_data(self):
        """Scraper les données du FMI"""
        try:
            logger.info("Récupération des données FMI...")
            
            # Page principale du Maroc sur le site du FMI
            url = self.alternative_sources['imf']['base_url']
            response = self.session.get(url, timeout=15)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            results = {}
            
            # Chercher les tableaux de données économiques
            tables = soup.find_all('table')
            for table in tables:
                rows = table.find_all('tr')
                for row in rows:
                    cells = row.find_all(['td', 'th'])
                    if len(cells) >= 2:
                        indicator = cells[0].get_text().strip().lower()
                        value_text = cells[-1].get_text().strip()
                        
                        # Extraire les valeurs numériques
                        match = re.search(r'([\d.,]+)\s*%?', value_text)
                        if match:
                            try:
                                value = float(match.group(1).replace(',', ''))
                                
                                if 'gdp' in indicator or 'pib' in indicator:
                                    results['gdp_growth'] = value
                                elif 'unemployment' in indicator or 'chômage' in indicator:
                                    results['unemployment_rate'] = value
                                elif 'inflation' in indicator:
                                    results['inflation_rate'] = value
                                    
                            except ValueError:
                                continue
            
            if results:
                logger.info(f"Données FMI récupérées: {len(results)} indicateurs")
                return {
                    'source': 'IMF',
                    'timestamp': datetime.now().isoformat(),
                    'data': results
                }
                
        except Exception as e:
            logger.error(f"Erreur FMI: {e}")
        
        return None

    def scrape_afdb_data(self):
        """Scraper les données de la Banque Africaine de Développement"""
        try:
            logger.info("Récupération des données BAD...")
            
            url = self.alternative_sources['afdb']['base_url']
            response = self.session.get(url, timeout=15)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Chercher les statistiques dans les sections de données
            results = {}
            
            # Chercher dans les divs contenant des statistiques
            stat_divs = soup.find_all('div', class_=re.compile(r'(stat|data|indicator)', re.I))
            
            for div in stat_divs:
                text = div.get_text().lower()
                
                # Patterns pour différents indicateurs
                patterns = {
                    'gdp_growth': r'gdp.*growth.*?([\d.,]+)\s*%',
                    'unemployment': r'unemployment.*?([\d.,]+)\s*%',
                    'poverty': r'poverty.*?([\d.,]+)\s*%'
                }
                
                for key, pattern in patterns.items():
                    match = re.search(pattern, text, re.IGNORECASE)
                    if match:
                        try:
                            value = float(match.group(1).replace(',', '.'))
                            results[key] = value
                        except ValueError:
                            continue
            
            if results:
                logger.info(f"Données BAD récupérées: {len(results)} indicateurs")
                return {
                    'source': 'African Development Bank',
                    'timestamp': datetime.now().isoformat(),
                    'data': results
                }
                
        except Exception as e:
            logger.error(f"Erreur BAD: {e}")
        
        return None

    def get_alternative_economic_data(self):
        """Récupérer les données de toutes les sources alternatives"""
        all_data = {}
        
        scrapers = [
            ('world_bank', self.scrape_world_bank_api),
            ('trading_economics', self.scrape_trading_economics),
            ('imf', self.scrape_imf_data),
            ('afdb', self.scrape_afdb_data)
        ]
        
        for source_name, scraper_func in scrapers:
            try:
                logger.info(f"Tentative de scraping: {source_name}")
                data = scraper_func()
                if data:
                    all_data[source_name] = data
                time.sleep(3)  # Délai entre les sources
            except Exception as e:
                logger.error(f"Erreur source {source_name}: {e}")
                continue
        
        return all_data

    def get_consolidated_data(self):
        """Consolider les données de toutes les sources"""
        raw_data = self.get_alternative_economic_data()
        
        consolidated = {
            'gdp_growth': [],
            'unemployment_rate': [],
            'inflation_rate': [],
            'sources_used': []
        }
        
        # Extraire et consolider les données
        for source_name, source_data in raw_data.items():
            consolidated['sources_used'].append(source_data['source'])
            
            if 'data' in source_data:
                data = source_data['data']
                
                # Mapper les différentes clés vers nos indicateurs standards
                key_mappings = {
                    'gdp_growth': ['gdp_growth', 'gdp_growth_rate', 'economic_growth'],
                    'unemployment_rate': ['unemployment', 'unemployment_rate', 'jobless_rate'],
                    'inflation_rate': ['inflation', 'inflation_rate', 'cpi_inflation']
                }
                
                for target_key, possible_keys in key_mappings.items():
                    for key in possible_keys:
                        if key in data:
                            value_info = data[key]
                            if isinstance(value_info, dict) and 'value' in value_info:
                                consolidated[target_key].append({
                                    'value': value_info['value'],
                                    'source': source_data['source'],
                                    'timestamp': source_data['timestamp']
                                })
                            elif isinstance(value_info, (int, float)):
                                consolidated[target_key].append({
                                    'value': value_info,
                                    'source': source_data['source'],
                                    'timestamp': source_data['timestamp']
                                })
                            break
        
        # Calculer les moyennes ou prendre les valeurs les plus récentes
        final_data = {}
        for indicator, values in consolidated.items():
            if indicator == 'sources_used':
                final_data[indicator] = values
            elif values:
                # Prendre la moyenne des valeurs disponibles
                numeric_values = [v['value'] for v in values if isinstance(v['value'], (int, float))]
                if numeric_values:
                    final_data[indicator] = {
                        'average': sum(numeric_values) / len(numeric_values),
                        'values': values,
                        'count': len(numeric_values)
                    }
        
        return final_data

# Exemple d'utilisation
if __name__ == "__main__":
    scraper = AlternativeDataSources()
    
    # Récupérer les données consolidées
    data = scraper.get_consolidated_data()
    
    # Afficher les résultats
    print(json.dumps(data, indent=2, ensure_ascii=False, default=str))