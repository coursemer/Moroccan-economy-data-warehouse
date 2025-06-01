import requests
import logging
from typing import Optional, Any
from .models import ExchangeRateData

logger = logging.getLogger(__name__)

class ECBAPI:
    """API client for European Central Bank exchange rates"""
    BASE_URL: str = "https://sdw-wsrest.ecb.europa.eu/service"
    
    @staticmethod
    def get_exchange_rates() -> Optional[ExchangeRateData]:
        """
        Fetch Moroccan Dirham to Euro exchange rate from ECB API
        
        Returns:
            Optional[ExchangeRateData]: Exchange rate data or None if not available
        """
        try:
            # Exchange rates for Moroccan Dirham (MAD)
            url = f"{ECBAPI.BASE_URL}/data/EXR/M.MAD.EUR.SP00.A?detail=dataonly"
            response = requests.get(url)
            if response.status_code == 200:
                data = response.json()
                if data and "dataSets" in data and data["dataSets"]:
                    series = data["dataSets"][0]["series"]
                    if "0:0:0:0:0" in series and "observations" in series["0:0:0:0:0"]:
                        observations = series["0:0:0:0:0"]["observations"]
                        if observations:
                            latest_date = max(observations.keys())
                            latest_rate = observations[latest_date][0]
                            if latest_rate is not None:
                                return ExchangeRateData(
                                    exchange_rate=float(latest_rate),
                                    date=latest_date
                                )
        except Exception as e:
            logger.error(f"Error fetching ECB data: {e}")
            return None
