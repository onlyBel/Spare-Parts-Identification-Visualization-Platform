# Architecture Documentation

## System Overview

The Spare Parts Identification & Visualization Platform is a full-stack web application designed to simplify how users identify, explore, and source spare parts for complex equipment.

## Technology Stack

### Backend
- **Framework**: FastAPI (Python 3.8+)
- **Database**: SQLite (with SQLAlchemy ORM)
- **API Documentation**: Auto-generated via FastAPI's Swagger UI at `/docs`

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: TailwindCSS
- **UI Components**: Custom shadcn/ui-inspired components
- **State Management**: React hooks
- **HTTP Client**: Axios
- **Icons**: Lucide React

## System Architecture

```
┌─────────────────┐         ┌─────────────────┐
│   Frontend      │         │    Backend      │
│   (React)       │◄────────┤   (FastAPI)      │
│   Port: 5173    │ HTTP    │   Port: 8000    │
└─────────────────┘         └────────┬────────┘
                                     │
                              ┌──────▼──────┐
                              │  SQLite DB  │
                              │  (spare_    │
                              │  parts.db)  │
                              └─────────────┘
```

## Database Schema

### Equipment
- Stores equipment/machinery information
- Contains diagram data for visualization
- One-to-many relationship with parts

### Part
- Core part catalog with specifications
- Links to inventory and equipment
- Supports related parts (alternatives, service kits)

### EquipmentPart
- Junction table linking equipment to parts
- Stores position and quantity information

### Inventory
- Real-time stock levels per location
- Tracks reserved quantities
- Supports multiple warehouse locations

### RelatedPart
- Defines relationships between parts
- Types: compatible, alternative, service_kit

## API Endpoints

### Equipment
- `GET /api/equipment` - List all equipment (optional brand/category filters)
- `GET /api/equipment/{id}` - Get equipment details
- `GET /api/equipment/{id}/parts` - Get parts for specific equipment

### Parts
- `GET /api/parts` - List all parts (optional category filter)
- `GET /api/parts/{id}` - Get part details with inventory
- `POST /api/search/parts` - Search parts by query

### Inventory
- `GET /api/inventory` - Get inventory (optional location filter)

### Metadata
- `GET /api/categories` - Get all part categories
- `GET /api/brands` - Get all equipment brands

### Orders
- `POST /api/orders` - Create a new order

## Data Flow

### Part Search Flow
1. User enters search query in frontend
2. Frontend sends POST request to `/api/search/parts`
3. Backend queries database with ILIKE filters
4. Results include inventory, compatible equipment, and related parts
5. Frontend displays results in card grid
6. User can click part for detailed view and ordering

### Equipment Browser Flow
1. User selects equipment from list
2. Frontend fetches equipment details and associated parts
3. Displays equipment diagram data and component list
4. Shows inventory status for each component
5. User can drill down to part details

### Inventory Dashboard Flow
1. Frontend fetches all inventory data
2. Calculates statistics (total parts, low stock, etc.)
3. Groups inventory by location
4. Displays visual indicators for stock levels
5. Highlights low stock and out of stock items

## Key Features Implementation

### 1. Part Identification
- **Search**: Full-text search across name, part number, description
- **Category Filtering**: Filter by part categories
- **Equipment-Based**: Browse by equipment and view components

### 2. Visual Exploration
- Equipment diagram data stored as JSON
- Component structure displayed in UI
- Position information for each part

### 3. Inventory Visibility
- Real-time stock levels across locations
- Reserved quantity tracking
- Low stock alerts (< 10 units)
- Out of stock indicators

### 4. Part Details & Compatibility
- Complete specifications stored as JSON
- Compatible equipment listing
- Related parts (alternatives, service kits)

### 5. Ordering Workflow
- Order creation with customer information
- Stock validation before order
- Location-based fulfillment
- Order confirmation with order ID

## Scalability Considerations

### Database
- SQLite is suitable for prototype and small-scale deployments
- For production, migrate to PostgreSQL for:
  - Better concurrency
  - Advanced query optimization
  - Replication and backup capabilities

### API
- FastAPI supports async operations for better performance
- Can add pagination for large datasets
- Implement caching for frequently accessed data

### Frontend
- React virtualization for large lists
- Lazy loading for images
- API response debouncing

## Security Considerations

### Current Implementation
- CORS configured for development
- Input validation via Pydantic schemas
- SQL injection protection via SQLAlchemy ORM

### Production Recommendations
- Add authentication (JWT/OAuth)
- Implement rate limiting
- Add HTTPS/TLS
- Input sanitization
- SQL injection prevention
- XSS protection

## Future Enhancements

### Image-Based Recognition
- Integrate computer vision model
- Add image upload endpoint
- Implement similarity search
- Use TensorFlow/PyTorch for ML model

### Advanced Visualization
- Interactive 2D/3D diagrams using D3.js or Three.js
- Exploded views for equipment
- Real-time inventory heatmaps

### Additional Features
- User authentication and authorization
- Order history and tracking
- Supplier management
- Price and lead time information
- Barcode/QR code scanning
- Mobile-responsive design improvements
