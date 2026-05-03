from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
from models import Equipment, Part, EquipmentPart, Inventory, RelatedPart

# Create tables
Base.metadata.create_all(bind=engine)

db = SessionLocal()

# Clear existing data
db.query(RelatedPart).delete()
db.query(Inventory).delete()
db.query(EquipmentPart).delete()
db.query(Part).delete()
db.query(Equipment).delete()
db.commit()

# Equipment data
equipment_data = [
    {
        "name": "Industrial Pump X200",
        "model": "X200-PRO",
        "brand": "HydroTech",
        "category": "Pumps",
        "description": "High-performance industrial pump for heavy-duty applications",
        "diagram_data": {
            "components": ["motor", "impeller", "seal", "bearing", "casing"],
            "layout": "centrifugal"
        }
    },
    {
        "name": "Compressor C500",
        "model": "C500-AIR",
        "brand": "AirMaster",
        "category": "Compressors",
        "description": "Rotary screw compressor for industrial air systems",
        "diagram_data": {
            "components": ["motor", "air_end", "separator", "cooler", "controller"],
            "layout": "rotary_screw"
        }
    },
    {
        "name": "Conveyor Motor M300",
        "model": "M300-DRIVE",
        "brand": "DriveTech",
        "category": "Motors",
        "description": "Three-phase induction motor for conveyor systems",
        "diagram_data": {
            "components": ["stator", "rotor", "bearings", "fan", "housing"],
            "layout": "induction"
        }
    },
    {
        "name": "Hydraulic Cylinder H100",
        "model": "H100-HYD",
        "brand": "HydroTech",
        "category": "Hydraulics",
        "description": "Double-acting hydraulic cylinder for heavy machinery",
        "diagram_data": {
            "components": ["barrel", "piston", "rod", "seals", "end_caps"],
            "layout": "cylinder"
        }
    }
]

equipment = []
for eq_data in equipment_data:
    eq = Equipment(**eq_data)
    db.add(eq)
    db.flush()
    equipment.append(eq)

db.commit()

# Parts data
parts_data = [
    {
        "part_number": "HT-X200-001",
        "name": "Pump Impeller",
        "description": "Stainless steel impeller for X200 pump",
        "category": "Rotating Components",
        "specifications": {"material": "Stainless Steel 316", "diameter": "150mm", "blades": 5},
        "image_url": None,
        "weight": 2.5,
        "dimensions": "150x150x80mm"
    },
    {
        "part_number": "HT-X200-002",
        "name": "Mechanical Seal",
        "description": "Cartridge mechanical seal for pump shaft",
        "category": "Seals",
        "specifications": {"type": "Cartridge", "material": "Carbon/SiC", "size": "1.5 inch"},
        "image_url": None,
        "weight": 0.8,
        "dimensions": "80x80x40mm"
    },
    {
        "part_number": "HT-X200-003",
        "name": "Pump Bearing",
        "description": "Deep groove ball bearing for pump shaft",
        "category": "Bearings",
        "specifications": {"type": "6208", "inner_diameter": "40mm", "outer_diameter": "80mm"},
        "image_url": None,
        "weight": 0.4,
        "dimensions": "80x80x23mm"
    },
    {
        "part_number": "AM-C500-001",
        "name": "Air End Assembly",
        "description": "Rotary screw air end for C500 compressor",
        "category": "Compressor Components",
        "specifications": {"type": "Rotary Screw", "capacity": "50 CFM", "pressure": "125 PSI"},
        "image_url": None,
        "weight": 45.0,
        "dimensions": "400x300x300mm"
    },
    {
        "part_number": "AM-C500-002",
        "name": "Oil Separator Element",
        "description": "Coalescing filter element for oil separation",
        "category": "Filters",
        "specifications": {"efficiency": "99.9%", "micron_rating": "0.5 micron"},
        "image_url": None,
        "weight": 3.2,
        "dimensions": "200x200x400mm"
    },
    {
        "part_number": "DT-M300-001",
        "name": "Stator Winding",
        "description": "Copper stator winding for M300 motor",
        "category": "Motor Components",
        "specifications": {"voltage": "480V", "phases": 3, "hp": 30},
        "image_url": None,
        "weight": 35.0,
        "dimensions": "300x300x250mm"
    },
    {
        "part_number": "DT-M300-002",
        "name": "Motor Bearing Set",
        "description": "Pair of bearings for motor shaft",
        "category": "Bearings",
        "specifications": {"type": "6312", "quantity": 2, "seal_type": "2RS"},
        "image_url": None,
        "weight": 1.2,
        "dimensions": "130x130x62mm"
    },
    {
        "part_number": "HT-H100-001",
        "name": "Hydraulic Seal Kit",
        "description": "Complete seal kit for H100 cylinder",
        "category": "Seals",
        "specifications": {"includes": "Rod seal, piston seal, wipers, o-rings", "bore": "100mm"},
        "image_url": None,
        "weight": 0.5,
        "dimensions": "150x100x50mm"
    },
    {
        "part_number": "HT-H100-002",
        "name": "Cylinder Rod",
        "description": "Chrome plated rod for hydraulic cylinder",
        "category": "Hydraulic Components",
        "specifications": {"material": "Chrome Steel", "diameter": "50mm", "length": "500mm"},
        "image_url": None,
        "weight": 8.5,
        "dimensions": "500x50x50mm"
    },
    {
        "part_number": "GEN-BRG-001",
        "name": "Universal Bearing 6208",
        "description": "Standard deep groove ball bearing",
        "category": "Bearings",
        "specifications": {"type": "6208", "inner": "40mm", "outer": "80mm", "width": "18mm"},
        "image_url": None,
        "weight": 0.4,
        "dimensions": "80x80x18mm"
    }
]

parts = []
for part_data in parts_data:
    part = Part(**part_data)
    db.add(part)
    db.flush()
    parts.append(part)

db.commit()

# Equipment-Part relationships
equipment_parts_data = [
    {"equipment_id": equipment[0].id, "part_id": parts[0].id, "position": "center", "quantity": 1},
    {"equipment_id": equipment[0].id, "part_id": parts[1].id, "position": "shaft", "quantity": 1},
    {"equipment_id": equipment[0].id, "part_id": parts[2].id, "position": "front", "quantity": 2},
    {"equipment_id": equipment[1].id, "part_id": parts[3].id, "position": "main", "quantity": 1},
    {"equipment_id": equipment[1].id, "part_id": parts[4].id, "position": "separator", "quantity": 2},
    {"equipment_id": equipment[2].id, "part_id": parts[5].id, "position": "core", "quantity": 1},
    {"equipment_id": equipment[2].id, "part_id": parts[6].id, "position": "ends", "quantity": 1},
    {"equipment_id": equipment[3].id, "part_id": parts[7].id, "position": "internal", "quantity": 2},
    {"equipment_id": equipment[3].id, "part_id": parts[8].id, "position": "rod", "quantity": 1},
]

for ep_data in equipment_parts_data:
    ep = EquipmentPart(**ep_data)
    db.add(ep)

db.commit()

# Inventory data
inventory_data = [
    {"part_id": parts[0].id, "location": "Warehouse A", "quantity": 25, "reserved_quantity": 5},
    {"part_id": parts[0].id, "location": "Warehouse B", "quantity": 15, "reserved_quantity": 2},
    {"part_id": parts[1].id, "location": "Warehouse A", "quantity": 50, "reserved_quantity": 10},
    {"part_id": parts[2].id, "location": "Warehouse A", "quantity": 100, "reserved_quantity": 20},
    {"part_id": parts[2].id, "location": "Warehouse B", "quantity": 75, "reserved_quantity": 15},
    {"part_id": parts[3].id, "location": "Warehouse A", "quantity": 8, "reserved_quantity": 2},
    {"part_id": parts[4].id, "location": "Warehouse A", "quantity": 30, "reserved_quantity": 5},
    {"part_id": parts[4].id, "location": "Warehouse C", "quantity": 20, "reserved_quantity": 3},
    {"part_id": parts[5].id, "location": "Warehouse B", "quantity": 12, "reserved_quantity": 4},
    {"part_id": parts[6].id, "location": "Warehouse A", "quantity": 40, "reserved_quantity": 8},
    {"part_id": parts[7].id, "location": "Warehouse B", "quantity": 60, "reserved_quantity": 12},
    {"part_id": parts[8].id, "location": "Warehouse A", "quantity": 20, "reserved_quantity": 5},
    {"part_id": parts[9].id, "location": "Warehouse A", "quantity": 200, "reserved_quantity": 40},
    {"part_id": parts[9].id, "location": "Warehouse B", "quantity": 150, "reserved_quantity": 30},
]

for inv_data in inventory_data:
    inv = Inventory(**inv_data)
    db.add(inv)

db.commit()

# Related parts
related_parts_data = [
    {"part_id": parts[0].id, "related_part_id": parts[1].id, "relationship_type": "service_kit"},
    {"part_id": parts[0].id, "related_part_id": parts[2].id, "relationship_type": "compatible"},
    {"part_id": parts[1].id, "related_part_id": parts[0].id, "relationship_type": "service_kit"},
    {"part_id": parts[2].id, "related_part_id": parts[9].id, "relationship_type": "alternative"},
    {"part_id": parts[3].id, "related_part_id": parts[4].id, "relationship_type": "service_kit"},
    {"part_id": parts[5].id, "related_part_id": parts[6].id, "relationship_type": "service_kit"},
    {"part_id": parts[7].id, "related_part_id": parts[8].id, "relationship_type": "compatible"},
]

for rp_data in related_parts_data:
    rp = RelatedPart(**rp_data)
    db.add(rp)

db.commit()

print("Database seeded successfully!")
print(f"Created {len(equipment)} equipment items")
print(f"Created {len(parts)} parts")
print(f"Created {len(equipment_parts_data)} equipment-part relationships")
print(f"Created {len(inventory_data)} inventory records")
print(f"Created {len(related_parts_data)} related part relationships")

db.close()
