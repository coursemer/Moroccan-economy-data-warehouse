import logging
from typing import Dict, Optional, Any
from .models import IndicatorData, ExchangeRateData
from .world_bank import WorldBankAPI
from .ecb import ECBAPI
from .mef import MEFData

logger = logging.getLogger(__name__)

def update_economic_data() -> Dict[str, Any]:
    """
    Update economic data from all sources
    
    Returns:
        Dict[str, Any]: Dictionary containing all economic data
    """
    try:
        # Get World Bank indicators
        world_bank_data = WorldBankAPI.get_maroc_indicators()
        
        # Get ECB exchange rates
        ecb_data = ECBAPI.get_exchange_rates()
        
        # Get MEF data from API
        mef_data = MEFData.get_data()
        
        return {
            "world_bank": world_bank_data,
            "ecb": ecb_data,
            "mef": mef_data
        }
    except Exception as e:
        logger.error(f"Error updating economic data: {e}")
        return {}
