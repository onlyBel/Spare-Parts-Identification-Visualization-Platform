from sqlalchemy import Column, Integer, String, Float, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from database import Base


class Equipment(Base):
    __tablename__ = "equipment"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    model = Column(String, index=True)
    brand = Column(String, index=True)
    category = Column(String)
    description = Column(Text)
    diagram_data = Column(JSON)  # Stores component relationships for visualization
    
    parts = relationship("EquipmentPart", back_populates="equipment")


class Part(Base):
    __tablename__ = "parts"
    
    id = Column(Integer, primary_key=True, index=True)
    part_number = Column(String, unique=True, index=True)
    name = Column(String, index=True)
    description = Column(Text)
    category = Column(String)
    specifications = Column(JSON)
    image_url = Column(String)
    weight = Column(Float)
    dimensions = Column(String)
    
    equipment_relations = relationship("EquipmentPart", back_populates="part")
    inventory = relationship("Inventory", back_populates="part")
    related_parts = relationship("RelatedPart", foreign_keys="[RelatedPart.part_id]", back_populates="part")


class EquipmentPart(Base):
    __tablename__ = "equipment_parts"
    
    id = Column(Integer, primary_key=True, index=True)
    equipment_id = Column(Integer, ForeignKey("equipment.id"))
    part_id = Column(Integer, ForeignKey("parts.id"))
    position = Column(String)  # Position in diagram
    quantity = Column(Integer)
    
    equipment = relationship("Equipment", back_populates="parts")
    part = relationship("Part", back_populates="equipment_relations")


class Inventory(Base):
    __tablename__ = "inventory"
    
    id = Column(Integer, primary_key=True, index=True)
    part_id = Column(Integer, ForeignKey("parts.id"))
    location = Column(String, index=True)
    quantity = Column(Integer)
    reserved_quantity = Column(Integer, default=0)
    last_updated = Column(String)
    
    part = relationship("Part", back_populates="inventory")


class RelatedPart(Base):
    __tablename__ = "related_parts"
    
    id = Column(Integer, primary_key=True, index=True)
    part_id = Column(Integer, ForeignKey("parts.id"))
    related_part_id = Column(Integer, ForeignKey("parts.id"))
    relationship_type = Column(String)  # "compatible", "alternative", "service_kit"
    
    part = relationship("Part", foreign_keys=[part_id], back_populates="related_parts")
