import { useState, useEffect } from 'react';
import { Warehouse, AlertTriangle, TrendingUp, Box } from 'lucide-react';
import { inventoryAPI, partsAPI } from '../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

export default function InventoryDashboard() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalParts: 0,
    totalQuantity: 0,
    lowStockItems: 0,
    locations: 0,
  });

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    setLoading(true);
    try {
      const [invResponse, partsResponse] = await Promise.all([
        inventoryAPI.getAll(),
        partsAPI.getAll(),
      ]);
      
      const inventoryData = invResponse.data;
      const partsData = partsResponse.data;
      
      setInventory(inventoryData);
      
      // Calculate stats
      const totalQuantity = inventoryData.reduce((sum, inv) => sum + inv.quantity, 0);
      const lowStockItems = inventoryData.filter(inv => (inv.quantity - inv.reserved_quantity) < 10).length;
      const locations = [...new Set(inventoryData.map(inv => inv.location))].length;
      
      setStats({
        totalParts: partsData.length,
        totalQuantity,
        lowStockItems,
        locations,
      });
    } catch (error) {
      console.error('Error loading inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInventoryByLocation = () => {
    const grouped = {};
    inventory.forEach((inv) => {
      if (!grouped[inv.location]) {
        grouped[inv.location] = [];
      }
      grouped[inv.location].push(inv);
    });
    return grouped;
  };

  const getLowStockItems = () => {
    return inventory
      .filter(inv => (inv.quantity - inv.reserved_quantity) < 10 && (inv.quantity - inv.reserved_quantity) > 0)
      .sort((a, b) => (a.quantity - a.reserved_quantity) - (b.quantity - b.reserved_quantity));
  };

  const getOutOfStockItems = () => {
    return inventory.filter(inv => (inv.quantity - inv.reserved_quantity) === 0);
  };

  const groupedInventory = getInventoryByLocation();
  const lowStockItems = getLowStockItems();
  const outOfStockItems = getOutOfStockItems();

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white p-8 rounded-lg">
        <h1 className="text-3xl font-bold mb-2">Inventory Dashboard</h1>
        <p className="text-green-100">Real-time visibility across all warehouse locations</p>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Parts</CardTitle>
            <Box className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalParts}</div>
            <p className="text-xs text-muted-foreground">Unique part numbers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Quantity</CardTitle>
            <Warehouse className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalQuantity.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Units across all locations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.lowStockItems}</div>
            <p className="text-xs text-muted-foreground">Items below threshold</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Locations</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.locations}</div>
            <p className="text-xs text-muted-foreground">Warehouse locations</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Inventory by Location</CardTitle>
            <CardDescription>Stock distribution across warehouses</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : (
              <div className="space-y-4">
                {Object.entries(groupedInventory).map(([location, items]) => {
                  const totalQty = items.reduce((sum, inv) => sum + inv.quantity, 0);
                  const totalReserved = items.reduce((sum, inv) => sum + inv.reserved_quantity, 0);
                  const available = totalQty - totalReserved;
                  
                  return (
                    <div key={location} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Warehouse className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">{location}</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {items.length} parts • {available} available
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${Math.min((available / totalQty) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Low Stock Alerts</CardTitle>
            <CardDescription>Items requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : lowStockItems.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No low stock items</div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {lowStockItems.map((inv) => (
                  <div key={inv.id} className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                    <div className="flex-1">
                      <div className="text-sm font-medium">Part ID: {inv.part_id}</div>
                      <div className="text-xs text-gray-500">{inv.location}</div>
                    </div>
                    <Badge variant="warning">{inv.quantity - inv.reserved_quantity} left</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {outOfStockItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Out of Stock Items</CardTitle>
            <CardDescription>Items with zero available quantity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {outOfStockItems.map((inv) => (
                <div key={inv.id} className="flex justify-between items-center p-2 bg-red-50 rounded">
                  <div className="flex-1">
                    <div className="text-sm font-medium">Part ID: {inv.part_id}</div>
                    <div className="text-xs text-gray-500">{inv.location}</div>
                  </div>
                  <Badge variant="destructive">Out of Stock</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
