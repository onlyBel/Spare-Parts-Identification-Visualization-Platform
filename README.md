# Spare Parts Identification & Visualization Platform

A digital solution that simplifies how users identify, explore, and source spare parts for complex equipment. This platform reduces errors, improves efficiency, and minimizes downtime by making part identification faster, more intuitive, and data-driven.

## Features

- **Part Identification**: Search parts by name, part number, or description with category filtering
- **Equipment Browser**: Browse equipment by brand and explore component relationships
- **Visual Exploration**: Interactive equipment diagrams and component structure visualization
- **Inventory Visibility**: Real-time stock levels across multiple warehouse locations
- **Part Details**: Complete specifications, compatible equipment, and related parts
- **Ordering Workflow**: Place orders with stock validation and customer information
- **Low Stock Alerts**: Dashboard highlighting items requiring attention

## Tech Stack

### Backend
- **FastAPI**: Modern, fast web framework for building APIs
- **SQLAlchemy**: SQL toolkit and ORM
- **SQLite**: Lightweight database (easily upgradeable to PostgreSQL)
- **Pydantic**: Data validation using Python type annotations

### Frontend
- **React 18**: UI library
- **Vite**: Build tool and dev server
- **TailwindCSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icons
- **Axios**: HTTP client

## Quick Start

### Prerequisites
- Python 3.8+
- Node.js 18+
- npm or yarn

### Backend Setup

```bash
cd backend
python -m venv venv
# On Windows
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
python seed_data.py
python main.py
```

Backend runs at `http://localhost:8000`
API docs at `http://localhost:8000/docs`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

## Project Structure

```
Spare-Parts-Identification-Visualization-Platform/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── database.py          # Database configuration
│   ├── models.py            # SQLAlchemy models
│   ├── schemas.py           # Pydantic schemas
│   ├── seed_data.py         # Sample data seeding
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── ui/         # UI components (Button, Card, etc.)
│   │   │   ├── PartSearch.jsx
│   │   │   ├── EquipmentBrowser.jsx
│   │   │   └── InventoryDashboard.jsx
│   │   ├── services/        # API service
│   │   │   └── api.js
│   │   ├── lib/            # Utilities
│   │   │   └── utils.js
│   │   ├── App.jsx         # Main application
│   │   └── main.jsx        # Entry point
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── ARCHITECTURE.md          # System architecture documentation
├── SETUP.md                 # Setup and deployment guide
├── API.md                   # API endpoint documentation
└── README.md                # This file
```

## Usage

### Part Search
1. Navigate to the "Part Search" tab
2. Enter keywords (part name, number, or description)
3. Optionally filter by category
4. Click "Search" to view results
5. Click on a part card to view details and place orders

### Equipment Browser
1. Navigate to the "Equipment Browser" tab
2. Filter by brand if desired
3. Select equipment from the list
4. View component parts and their inventory status
5. Click parts for detailed information

### Inventory Dashboard
1. Navigate to the "Inventory Dashboard" tab
2. View overall inventory statistics
3. Check stock distribution by location
4. Review low stock alerts
5. Identify out-of-stock items

## API Endpoints

### Equipment
- `GET /api/equipment` - List all equipment
- `GET /api/equipment/{id}` - Get equipment details
- `GET /api/equipment/{id}/parts` - Get equipment parts

### Parts
- `GET /api/parts` - List all parts
- `GET /api/parts/{id}` - Get part details
- `POST /api/search/parts` - Search parts

### Inventory
- `GET /api/inventory` - Get inventory

### Orders
- `POST /api/orders` - Create order

For detailed API documentation, see [API.md](API.md) or visit `http://localhost:8000/docs`

## Sample Data

The platform includes sample data for:
- 4 equipment items (pumps, compressors, motors, hydraulics)
- 10 spare parts with specifications
- 14 inventory records across 3 locations
- Equipment-part relationships
- Related part mappings

Run `python backend/seed_data.py` to reset the database with sample data.

## Documentation

- [Architecture Documentation](ARCHITECTURE.md) - System design and data flow
- [Setup Guide](SETUP.md) - Installation and deployment instructions
- [API Documentation](API.md) - Complete API reference

## Future Enhancements

- Image-based part recognition using computer vision
- User authentication and authorization
- Order history and tracking
- Advanced 2D/3D equipment visualization
- Barcode/QR code scanning
- Mobile app
- Supplier management
- Price and lead time information

## License

See [LICENSE](LICENSE) file for details.

## Contributing

This is a prototype for demonstration purposes. For production use, consider:
- Migrating to PostgreSQL
- Implementing authentication
- Adding comprehensive error handling
- Implementing caching
- Adding monitoring and logging
- Writing unit and integration tests
