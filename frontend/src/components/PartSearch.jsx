import { useState } from 'react';
import { Search, Package, MapPin, AlertCircle } from 'lucide-react';
import { partsAPI, metadataAPI } from '../services/api';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

export default function PartSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPart, setSelectedPart] = useState(null);

  const loadCategories = async () => {
    try {
      const response = await metadataAPI.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleSearch = async () => {
    if (!query.trim() && !selectedCategory) return;
    
    setLoading(true);
    try {
      const response = await partsAPI.search({ query, category: selectedCategory });
      setResults(response.data);
    } catch (error) {
      console.error('Error searching parts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const getTotalAvailable = (inventory) => {
    return inventory.reduce((sum, inv) => sum + inv.available, 0);
  };

  const getStockStatus = (inventory) => {
    const total = getTotalAvailable(inventory);
    if (total === 0) return { label: 'Out of Stock', variant: 'destructive' };
    if (total < 10) return { label: 'Low Stock', variant: 'warning' };
    return { label: 'In Stock', variant: 'success' };
  };

  useState(() => {
    loadCategories();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-lg">
        <h1 className="text-3xl font-bold mb-2">Spare Parts Identification</h1>
        <p className="text-blue-100">Search for parts by name, part number, or description</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Parts</CardTitle>
          <CardDescription>Enter keywords to find spare parts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by part name, number, or description..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </div>

          {categories.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedCategory === '' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('')}
              >
                All Categories
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {results.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {results.map((part) => {
            const stockStatus = getStockStatus(part.inventory);
            const totalAvailable = getTotalAvailable(part.inventory);
            
            return (
              <Card key={part.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedPart(part)}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{part.name}</CardTitle>
                      <CardDescription className="font-mono text-xs mt-1">{part.part_number}</CardDescription>
                    </div>
                    <Badge variant={stockStatus.variant}>{stockStatus.label}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600 line-clamp-2">{part.description}</p>
                  
                  {part.category && (
                    <Badge variant="secondary">{part.category}</Badge>
                  )}
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Package className="h-4 w-4" />
                    <span>Total Available: {totalAvailable}</span>
                  </div>
                  
                  {part.inventory.length > 0 && (
                    <div className="space-y-1">
                      <div className="text-xs font-semibold text-gray-500">Locations:</div>
                      {part.inventory.slice(0, 2).map((inv, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs">
                          <MapPin className="h-3 w-3" />
                          <span>{inv.location}: {inv.available} available</span>
                        </div>
                      ))}
                      {part.inventory.length > 2 && (
                        <div className="text-xs text-gray-500">+{part.inventory.length - 2} more locations</div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {selectedPart && (
        <PartDetailModal part={selectedPart} onClose={() => setSelectedPart(null)} />
      )}

      {results.length === 0 && query && !loading && (
        <div className="text-center py-12 text-gray-500">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No parts found matching your search</p>
        </div>
      )}
    </div>
  );
}

function PartDetailModal({ part, onClose }) {
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [ordering, setOrdering] = useState(false);
  const [orderMessage, setOrderMessage] = useState('');

  const handleOrder = async () => {
    if (!selectedLocation || !customerName || !customerEmail) {
      setOrderMessage('Please fill in all fields');
      return;
    }

    setOrdering(true);
    try {
      const response = await ordersAPI.create({
        part_id: part.id,
        quantity: orderQuantity,
        location: selectedLocation,
        customer_name: customerName,
        customer_email: customerEmail,
      });
      setOrderMessage(`Order created successfully! Order ID: ${response.data.order_id}`);
    } catch (error) {
      setOrderMessage(error.response?.data?.detail || 'Error creating order');
    } finally {
      setOrdering(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">{part.name}</h2>
              <p className="text-gray-500 font-mono">{part.part_number}</p>
            </div>
            <Button variant="ghost" onClick={onClose}>✕</Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-sm text-gray-600">{part.description}</p>
              </div>

              {part.specifications && (
                <div>
                  <h3 className="font-semibold mb-2">Specifications</h3>
                  <div className="bg-gray-50 rounded p-3 text-sm">
                    {Object.entries(part.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-1">
                        <span className="text-gray-500 capitalize">{key.replace(/_/g, ' ')}:</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {part.weight && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Weight:</span>
                  <span className="font-medium">{part.weight} kg</span>
                </div>
              )}

              {part.dimensions && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Dimensions:</span>
                  <span className="font-medium">{part.dimensions}</span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Inventory</h3>
                <div className="space-y-2">
                  {part.inventory.map((inv, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-gray-50 rounded p-3">
                      <div>
                        <div className="font-medium">{inv.location}</div>
                        <div className="text-xs text-gray-500">Reserved: {inv.reserved_quantity}</div>
                      </div>
                      <Badge variant={inv.available > 0 ? 'success' : 'destructive'}>
                        {inv.available} available
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {part.compatible_equipment.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Compatible Equipment</h3>
                  <div className="space-y-1">
                    {part.compatible_equipment.map((eq, idx) => (
                      <div key={idx} className="text-sm text-gray-600">
                        {eq.name} {eq.model && `(${eq.model})`}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {part.related_parts.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Related Parts</h3>
              <div className="flex flex-wrap gap-2">
                {part.related_parts.map((rp, idx) => (
                  <Badge key={idx} variant="outline">
                    {rp.name} ({rp.relationship_type})
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Place Order</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">Quantity</label>
                  <Input
                    type="number"
                    min="1"
                    value={orderQuantity}
                    onChange={(e) => setOrderQuantity(parseInt(e.target.value) || 1)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Location</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                  >
                    <option value="">Select location...</option>
                    {part.inventory.filter(i => i.available > 0).map((inv, idx) => (
                      <option key={idx} value={inv.location}>
                        {inv.location} ({inv.available} available)
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Customer Name</label>
                <Input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Customer Email</label>
                <Input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>
              <Button onClick={handleOrder} disabled={ordering} className="w-full">
                {ordering ? 'Processing...' : 'Place Order'}
              </Button>
              {orderMessage && (
                <div className={`text-sm ${orderMessage.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                  {orderMessage}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
