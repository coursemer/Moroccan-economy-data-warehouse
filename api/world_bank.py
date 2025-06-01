import requests
import logging
from typing import Dict, Optional, Any
from .models import IndicatorData

logger = logging.getLogger(__name__)

class WorldBankAPI:
    """API client for World Bank economic indicators"""
    BASE_URL: str = "https://api.worldbank.org/v2"
    
    @staticmethod
    def get_maroc_indicators() -> Dict[str, IndicatorData]:
        """
        Fetch Moroccan economic indicators from World Bank API
        
        Returns:
            Dict[str, IndicatorData]: Dictionary mapping indicator names to their values and years
        """
        try:
            # Indicateurs pour le Maroc (MA)
            indicators: Dict[str, str] = {
                "GDP": "NY.GDP.MKTP.CD",  # GDP (current US$)
                "Inflation": "FP.CPI.TOTL.ZG",  # Inflation, consumer prices (annual %)
                "Unemployment": "SL.UEM.TOTL.ZS",  # Unemployment, total (% of total labor force)
                "Public Debt": "GC.DOD.TOTL.GD.ZS",  # Central government debt, total (% of GDP)
                "Foreign Direct Investment": "BX.KLT.DINV.CD.WD",  # Foreign direct investment, net inflows (BoP, current US$)
                "Trade Balance": "BX.TRF.GNFS.CD",  # Balance of trade (BoP, current US$)
            }
            
            results: Dict[str, IndicatorData] = {}
            for name, code in indicators.items():
                url = f"{WorldBankAPI.BASE_URL}/country/MA/indicator/{code}?format=json"
                response = requests.get(url)
                if response.status_code == 200:
                    data = response.json()
                    if data and len(data) > 1 and data[1]:
                        latest_data = data[1][0]
                        if latest_data and latest_data.get("value") is not None:
                            results[name] = IndicatorData(
                                value=float(latest_data["value"]),
                                year=latest_data.get("date", "N/A")
                            )
            return results
        except Exception as e:
            logger.error(f"Error fetching World Bank data: {e}")
            return {}
