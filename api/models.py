from dataclasses import dataclass
from typing import Dict, Optional, Any, List, Tuple
import logging

logger = logging.getLogger(__name__)

@dataclass
class IndicatorData:
    """Data class for economic indicators"""
    value: float
    year: str

@dataclass
class ExchangeRateData:
    """Data class for exchange rate information"""
    exchange_rate: float
    date: str

@dataclass
class EconomicIndicator:
    """Data class for economic indicators with value, year, and unit"""
    value: float
    year: str
    unit: str

@dataclass
class SectorData:
    """Data class for sector economic data"""
    contribution: Dict[str, float]
    sub_sectors: Dict[str, Dict[str, float]]
    key_indicators: Dict[str, Dict[str, float]]

@dataclass
class RegionData:
    """Data class for regional economic data"""
    contribution: Dict[str, float]
    key_indicators: Dict[str, Dict[str, float]]
