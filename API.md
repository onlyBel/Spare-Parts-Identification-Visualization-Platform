# API Documentation

## Base URL
```
http://localhost:8000
```

## Authentication
Currently, no authentication is required. For production, implement JWT or OAuth.

---

## Equipment Endpoints

### Get All Equipment
```http
GET /api/equipment
```

**Query Parameters:**
- `brand` (optional): Filter by equipment brand
- `category` (optional): Filter by equipment category

**Response:**
```json
[
  {
    "id": 1,
    "name": "Industrial Pump X200",
    "model": "X200-PRO",
    "brand": "HydroTech",
    "category": "Pumps",
    "description": "High-performance industrial pump...",
    "diagram_data": {
      "components": ["motor", "impeller", "seal"],
      "layout": "centrifugal"
    }
  }
]
```

### Get Equipment Details
```http
GET /api/equipment/{equipment_id}
```

**Response:**
```json
{
  "id": 1,
  "name": "Industrial Pump X200",
  "model": "X200-PRO",
  "brand": "HydroTech",
  "category": "Pumps",
  "description": "High-performance industrial pump...",
  "diagram_data": {...}
}
```

### Get Equipment Parts
```http
GET /api/equipment/{equipment_id}/parts
```

**Response:**
```json
[
  {
    "id": 1,
    "part_number": "HT-X200-001",
    "name": "Pump Impeller",
    "description": "Stainless steel impeller...",
    "category": "Rotating Components",
    "specifications": {...},
    "image_url": null,
    "weight": 2.5,
    "dimensions": "150x150x80mm",
    "inventory": [
      {
        "location": "Warehouse A",
        "quantity": 25,
        "reserved_quantity": 5,
        "available": 20
      }
    ],
    "compatible_equipment": [...],
    "related_parts": [...]
  }
]
```

---

## Parts Endpoints

### Get All Parts
```http
GET /api/parts
```

**Query Parameters:**
- `category` (optional): Filter by part category
- `skip` (optional): Number of records to skip (default: 0)
- `limit` (optional): Maximum number of records (default: 100)

**Response:**
```json
[
  {
    "id": 1,
    "part_number": "HT-X200-001",
    "name": "Pump Impeller",
    "description": "Stainless steel impeller...",
    "category": "Rotating Components",
    "specifications": {...},
    "image_url": null,
    "weight": 2.5,
    "dimensions": "150x150x80mm"
  }
]
```

### Get Part Details
```http
GET /api/parts/{part_id}
```

**Response:**
```json
{
  "id": 1,
  "part_number": "HT-X200-001",
  "name": "Pump Impeller",
  "description": "Stainless steel impeller...",
  "category": "Rotating Components",
  "specifications": {
    "material": "Stainless Steel 316",
    "diameter": "150mm",
    "blades": 5
  },
  "image_url": null,
  "weight": 2.5,
  "dimensions": "150x150x80mm",
  "inventory": [
    {
      "location": "Warehouse A",
      "quantity": 25,
      "reserved_quantity": 5,
      "available": 20
    }
  ],
  "compatible_equipment": [
    {
      "id": 1,
      "name": "Industrial Pump X200",
      "model": "X200-PRO"
    }
  ],
  "related_parts": [
    {
      "part_number": "HT-X200-002",
      "name": "Mechanical Seal",
      "relationship_type": "service_kit"
    }
  ]
}
```

### Search Parts
```http
POST /api/search/parts
```

**Request Body:**
```json
{
  "query": "bearing",
  "category": "Bearings",
  "brand": "HydroTech"
}
```

**Response:**
```json
[
  {
    "id": 3,
    "part_number": "HT-X200-003",
    "name": "Pump Bearing",
    "description": "Deep groove ball bearing...",
    "category": "Bearings",
    "specifications": {...},
    "inventory": [...],
    "compatible_equipment": [...],
    "related_parts": [...]
  }
]
```

---

## Inventory Endpoints

### Get Inventory
```http
GET /api/inventory
```

**Query Parameters:**
- `location` (optional): Filter by warehouse location

**Response:**
```json
[
  {
    "id": 1,
    "part_id": 1,
    "location": "Warehouse A",
    "quantity": 25,
    "reserved_quantity": 5,
    "last_updated": "2024-01-15T10:30:00"
  }
]
```

---

## Metadata Endpoints

### Get Categories
```http
GET /api/categories
```

**Response:**
```json
[
  "Rotating Components",
  "Seals",
  "Bearings",
  "Compressor Components"
]
```

### Get Brands
```http
GET /api/brands
```

**Response:**
```json
[
  "HydroTech",
  "AirMaster",
  "DriveTech"
]
```

---

## Orders Endpoints

### Create Order
```http
POST /api/orders
```

**Request Body:**
```json
{
  "part_id": 1,
  "quantity": 5,
  "location": "Warehouse A",
  "customer_name": "John Doe",
  "customer_email": "john@example.com"
}
```

**Response (Success):**
```json
{
  "message": "Order created successfully",
  "order_id": "ORD-20240115103000",
  "part_number": "HT-X200-001",
  "quantity": 5,
  "location": "Warehouse A"
}
```

**Response (Error - Insufficient Stock):**
```json
{
  "detail": "Insufficient stock. Available: 15, Requested: 20"
}
```

---

## Error Responses

All endpoints may return error responses:

**404 Not Found:**
```json
{
  "detail": "Equipment not found"
}
```

**400 Bad Request:**
```json
{
  "detail": "Insufficient stock. Available: 15, Requested: 20"
}
```

**422 Validation Error:**
```json
{
  "detail": [
    {
      "loc": ["body", "quantity"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

---

## Interactive API Documentation

Once the backend is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

These provide interactive documentation where you can test endpoints directly from your browser.
