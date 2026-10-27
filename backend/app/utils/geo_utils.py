import math
from datetime import datetime
from typing import List, Tuple, Optional

def haversine_distance_meters(coord1: List[float], coord2: List[float]) -> float:
    """
    Calculate geodesic distance between two [longitude, latitude] coordinates in meters.
    """
    if not coord1 or not coord2 or len(coord1) < 2 or len(coord2) < 2:
        return 999999.0
    
    lon1, lat1 = coord1[0], coord1[1]
    lon2, lat2 = coord2[0], coord2[1]
    
    R = 6371000  # Earth radius in meters
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)
    
    a = math.sin(delta_phi / 2.0)**2 + \
        math.cos(phi1) * math.cos(phi2) * \
        math.sin(delta_lambda / 2.0)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    
    return R * c

def calculate_date_overlap(start1_str: str, end1_str: str, start2_str: str, end2_str: str) -> Tuple[bool, int, Optional[str], Optional[str]]:
    """
    Given two YYYY-MM-DD date ranges, returns:
    (has_overlap, overlap_days, overlap_start, overlap_end)
    """
    try:
        s1 = datetime.strptime(start1_str, "%Y-%m-%d")
        e1 = datetime.strptime(end1_str, "%Y-%m-%d")
        s2 = datetime.strptime(start2_str, "%Y-%m-%d")
        e2 = datetime.strptime(end2_str, "%Y-%m-%d")
        
        latest_start = max(s1, s2)
        earliest_end = min(e1, e2)
        
        delta = (earliest_end - latest_start).days + 1
        if delta > 0:
            return True, delta, latest_start.strftime("%Y-%m-%d"), earliest_end.strftime("%Y-%m-%d")
        return False, 0, None, None
    except Exception:
        return False, 0, None, None
