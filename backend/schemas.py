from pydantic import BaseModel
from typing import List, Optional, Dict, Any


class EquipmentBase(BaseModel):
    name: str
    model: str
    brand: str
    category: str
    description: Optional[str] = None
    diagram_data: Optional[Dict[str, Any]] = None


class Equipment(EquipmentBase):
    id: int
    
    class Config:
        from_attributes = True


class PartBase(BaseModel):
    part_number: str
    name: str
    description: Optional[str] = None
    category: Optional[str] = None
    specifications: Optional[Dict[str, Any]] = None
    image_url: Optional[str] = None
    weight: Optional[float] = None
    dimensions: Optional[str] = None


class Part(PartBase):
    id: int
    
    class Config:
        from_attributes = True


class PartWithInventory(Part):
    inventory: List[Dict[str, Any]] = []
    compatible_equipment: List[Dict[str, Any]] = []
    related_parts: List[Dict[str, Any]] = []


class EquipmentPartBase(BaseModel):
    equipment_id: int
    part_id: int
    position: Optional[str] = None
    quantity: int = 1


class EquipmentPart(EquipmentPartBase):
    id: int
    
    class Config:
        from_attributes = True


class InventoryBase(BaseModel):
    part_id: int
    location: str
    quantity: int
    reserved_quantity: int = 0


class Inventory(InventoryBase):
    id: int
    last_updated: str
    
    class Config:
        from_attributes = True


class RelatedPartBase(BaseModel):
    part_id: int
    related_part_id: int
    relationship_type: str


class RelatedPart(RelatedPartBase):
    id: int
    
    class Config:
        from_attributes = True


class SearchRequest(BaseModel):
    query: str
    category: Optional[str] = None
    brand: Optional[str] = None


class OrderRequest(BaseModel):
    part_id: int
    quantity: int
    location: str
    customer_name: str
    customer_email: str
