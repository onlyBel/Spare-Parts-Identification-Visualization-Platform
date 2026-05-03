from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import uvicorn
from datetime import datetime

from database import engine, SessionLocal, Base
from models import Equipment, Part, EquipmentPart, Inventory, RelatedPart
from schemas import (
    Equipment, EquipmentBase,
    Part, PartBase, PartWithInventory,
    EquipmentPart as EquipmentPartSchema,
    Inventory as InventorySchema,
    SearchRequest, OrderRequest
)

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Spare Parts Identification API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def root():
    return {"message": "Spare Parts Identification & Visualization API", "version": "1.0.0"}


@app.get("/api/equipment", response_model=List[Equipment])
def get_equipment(
    brand: Optional[str] = None,
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Equipment)
    if brand:
        query = query.filter(Equipment.brand == brand)
    if category:
        query = query.filter(Equipment.category == category)
    return query.all()


@app.get("/api/equipment/{equipment_id}", response_model=Equipment)
def get_equipment_detail(equipment_id: int, db: Session = Depends(get_db)):
    equipment = db.query(Equipment).filter(Equipment.id == equipment_id).first()
    if not equipment:
        raise HTTPException(status_code=404, detail="Equipment not found")
    return equipment


@app.get("/api/equipment/{equipment_id}/parts", response_model=List[PartWithInventory])
def get_equipment_parts(equipment_id: int, db: Session = Depends(get_db)):
    equipment_parts = db.query(EquipmentPart).filter(EquipmentPart.equipment_id == equipment_id).all()
    result = []
    for ep in equipment_parts:
        part = ep.part
        inventory_items = db.query(Inventory).filter(Inventory.part_id == part.id).all()
        inventory_list = [
            {
                "location": inv.location,
                "quantity": inv.quantity,
                "reserved_quantity": inv.reserved_quantity,
                "available": inv.quantity - inv.reserved_quantity
            }
            for inv in inventory_items
        ]
        
        related = db.query(RelatedPart).filter(RelatedPart.part_id == part.id).all()
        related_parts = []
        for r in related:
            related_part = db.query(Part).filter(Part.id == r.related_part_id).first()
            if related_part:
                related_parts.append({
                    "part_number": related_part.part_number,
                    "name": related_part.name,
                    "relationship_type": r.relationship_type
                })
        
        result.append({
            "id": part.id,
            "part_number": part.part_number,
            "name": part.name,
            "description": part.description,
            "category": part.category,
            "specifications": part.specifications,
            "image_url": part.image_url,
            "weight": part.weight,
            "dimensions": part.dimensions,
            "inventory": inventory_list,
            "compatible_equipment": [{"id": equipment_id, "name": ep.equipment.name}],
            "related_parts": related_parts
        })
    return result


@app.get("/api/parts", response_model=List[Part])
def get_parts(
    category: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    query = db.query(Part)
    if category:
        query = query.filter(Part.category == category)
    return query.offset(skip).limit(limit).all()


@app.get("/api/parts/{part_id}", response_model=PartWithInventory)
def get_part_detail(part_id: int, db: Session = Depends(get_db)):
    part = db.query(Part).filter(Part.id == part_id).first()
    if not part:
        raise HTTPException(status_code=404, detail="Part not found")
    
    inventory_items = db.query(Inventory).filter(Inventory.part_id == part_id).all()
    inventory_list = [
        {
            "location": inv.location,
            "quantity": inv.quantity,
            "reserved_quantity": inv.reserved_quantity,
            "available": inv.quantity - inv.reserved_quantity
        }
        for inv in inventory_items
    ]
    
    equipment_parts = db.query(EquipmentPart).filter(EquipmentPart.part_id == part_id).all()
    compatible_equipment = [
        {"id": ep.equipment_id, "name": ep.equipment.name, "model": ep.equipment.model}
        for ep in equipment_parts
    ]
    
    related = db.query(RelatedPart).filter(RelatedPart.part_id == part_id).all()
    related_parts = []
    for r in related:
        related_part = db.query(Part).filter(Part.id == r.related_part_id).first()
        if related_part:
            related_parts.append({
                "part_number": related_part.part_number,
                "name": related_part.name,
                "relationship_type": r.relationship_type
            })
    
    return {
        "id": part.id,
        "part_number": part.part_number,
        "name": part.name,
        "description": part.description,
        "category": part.category,
        "specifications": part.specifications,
        "image_url": part.image_url,
        "weight": part.weight,
        "dimensions": part.dimensions,
        "inventory": inventory_list,
        "compatible_equipment": compatible_equipment,
        "related_parts": related_parts
    }


@app.post("/api/search/parts", response_model=List[PartWithInventory])
def search_parts(request: SearchRequest, db: Session = Depends(get_db)):
    query = db.query(Part)
    
    if request.query:
        search_term = f"%{request.query}%"
        query = query.filter(
            (Part.name.ilike(search_term)) |
            (Part.part_number.ilike(search_term)) |
            (Part.description.ilike(search_term))
        )
    
    if request.category:
        query = query.filter(Part.category == request.category)
    
    parts = query.limit(50).all()
    result = []
    
    for part in parts:
        inventory_items = db.query(Inventory).filter(Inventory.part_id == part.id).all()
        inventory_list = [
            {
                "location": inv.location,
                "quantity": inv.quantity,
                "reserved_quantity": inv.reserved_quantity,
                "available": inv.quantity - inv.reserved_quantity
            }
            for inv in inventory_items
        ]
        
        equipment_parts = db.query(EquipmentPart).filter(EquipmentPart.part_id == part.id).all()
        compatible_equipment = [
            {"id": ep.equipment_id, "name": ep.equipment.name, "model": ep.equipment.model}
            for ep in equipment_parts
        ]
        
        related = db.query(RelatedPart).filter(RelatedPart.part_id == part.id).all()
        related_parts = []
        for r in related:
            related_part = db.query(Part).filter(Part.id == r.related_part_id).first()
            if related_part:
                related_parts.append({
                    "part_number": related_part.part_number,
                    "name": related_part.name,
                    "relationship_type": r.relationship_type
                })
        
        result.append({
            "id": part.id,
            "part_number": part.part_number,
            "name": part.name,
            "description": part.description,
            "category": part.category,
            "specifications": part.specifications,
            "image_url": part.image_url,
            "weight": part.weight,
            "dimensions": part.dimensions,
            "inventory": inventory_list,
            "compatible_equipment": compatible_equipment,
            "related_parts": related_parts
        })
    
    return result


@app.get("/api/inventory", response_model=List[InventorySchema])
def get_inventory(location: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Inventory)
    if location:
        query = query.filter(Inventory.location == location)
    return query.all()


@app.get("/api/categories", response_model=List[str])
def get_categories(db: Session = Depends(get_db)):
    categories = db.query(Part.category).distinct().all()
    return [c[0] for c in categories if c[0]]


@app.get("/api/brands", response_model=List[str])
def get_brands(db: Session = Depends(get_db)):
    brands = db.query(Equipment.brand).distinct().all()
    return [b[0] for b in brands if b[0]]


@app.post("/api/orders")
def create_order(order: OrderRequest, db: Session = Depends(get_db)):
    # Check inventory
    inventory = db.query(Inventory).filter(
        Inventory.part_id == order.part_id,
        Inventory.location == order.location
    ).first()
    
    if not inventory:
        raise HTTPException(status_code=404, detail="Part not found in this location")
    
    available = inventory.quantity - inventory.reserved_quantity
    if available < order.quantity:
        raise HTTPException(
            status_code=400,
            detail=f"Insufficient stock. Available: {available}, Requested: {order.quantity}"
        )
    
    # Update reserved quantity
    inventory.reserved_quantity += order.quantity
    inventory.last_updated = datetime.now().isoformat()
    db.commit()
    
    return {
        "message": "Order created successfully",
        "order_id": f"ORD-{datetime.now().strftime('%Y%m%d%H%M%S')}",
        "part_number": db.query(Part).filter(Part.id == order.part_id).first().part_number,
        "quantity": order.quantity,
        "location": order.location
    }


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
