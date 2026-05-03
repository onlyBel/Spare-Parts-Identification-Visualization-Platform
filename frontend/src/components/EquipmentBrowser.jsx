import { useState, useEffect } from 'react';
import { Cpu, Settings, ChevronRight, Package } from 'lucide-react';
import { equipmentAPI } from '../services/api';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

export default function EquipmentBrowser() {
  const [equipment, setEquipment] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');

  useEffect(() => {
    loadEquipment();
    loadBrands();
  }, []);

  useEffect(() => {
    if (selectedBrand) {
      loadEquipment(selectedBrand);
    }
  }, [selectedBrand]);

  const loadEquipment = async (brand = '') => {
    setLoading(true);
    try {
      const response = await equipmentAPI.getAll(brand ? { brand } : {});
      setEquipment(response.data);
    } catch (error) {
      console.error('Error loading equipment:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBrands = async () => {
    try {
      const response = await fetch('/api/brands');
      const data = await response.json();
      setBrands(data);
    } catch (error) {
      console.error('Error loading brands:', error);
    }
  };

  const handleSelectEquipment = async (eq) => {
    setSelectedEquipment(eq);
    setLoading(true);
    try {
      const response = await equipmentAPI.getParts(eq.id);
      setParts(response.data);
    } catch (error) {
      console.error('Error loading parts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUniqueCategories = () => {
    const categories = [...new Set(equipment.map(eq => eq.category))];
    return categories;
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-8 rounded-lg">
        <h1 className="text-3xl font-bold mb-2">Equipment Browser</h1>
        <p className="text-purple-100">Browse equipment and explore their component parts</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button
          variant={selectedBrand === '' ? 'default' : 'outline'}
          onClick={() => { setSelectedBrand(''); loadEquipment(); }}
        >
          All Brands
        </Button>
        {brands.map((brand) => (
          <Button
            key={brand}
            variant={selectedBrand === brand ? 'default' : 'outline'}
            onClick={() => setSelectedBrand(brand)}
          >
            {brand}
          </Button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Equipment List</CardTitle>
              <CardDescription>{equipment.length} items found</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {equipment.map((eq) => (
                <div
                  key={eq.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedEquipment?.id === eq.id
                      ? 'bg-purple-50 border-purple-500'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleSelectEquipment(eq)}
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 p-2 rounded">
                      <Cpu className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{eq.name}</div>
                      <div className="text-xs text-gray-500">{eq.model}</div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="mt-2 flex gap-2">
                    <Badge variant="secondary" className="text-xs">{eq.brand}</Badge>
                    <Badge variant="outline" className="text-xs">{eq.category}</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-4">
          {selectedEquipment ? (
            <>
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{selectedEquipment.name}</CardTitle>
                      <CardDescription>{selectedEquipment.model} - {selectedEquipment.brand}</CardDescription>
                    </div>
                    <Badge variant="secondary">{selectedEquipment.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{selectedEquipment.description}</p>
                  
                  {selectedEquipment.diagram_data && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold mb-2">Component Structure</h4>
                      <div className="text-sm text-gray-600">
                        <div><strong>Layout:</strong> {selectedEquipment.diagram_data.layout}</div>
                        <div className="mt-2">
                          <strong>Components:</strong>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {selectedEquipment.diagram_data.components.map((comp, idx) => (
                              <Badge key={idx} variant="outline">{comp}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Component Parts</CardTitle>
                  <CardDescription>{parts.length} parts found</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {parts.map((part) => {
                      const totalAvailable = part.inventory.reduce((sum, inv) => sum + inv.available, 0);
                      const stockStatus = totalAvailable === 0 ? 'destructive' : totalAvailable < 10 ? 'warning' : 'success';
                      
                      return (
                        <div key={part.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <Package className="h-4 w-4 text-gray-400" />
                                <span className="font-medium">{part.name}</span>
                              </div>
                              <div className="text-xs text-gray-500 font-mono mt-1">{part.part_number}</div>
                              <p className="text-sm text-gray-600 mt-1 line-clamp-1">{part.description}</p>
                            </div>
                            <div className="text-right">
                              <Badge variant={stockStatus}>{totalAvailable} available</Badge>
                            </div>
                          </div>
                          
                          {part.specifications && (
                            <div className="mt-2 text-xs text-gray-500">
                              {Object.entries(part.specifications).slice(0, 2).map(([key, value]) => (
                                <span key={key} className="mr-3">
                                  <strong>{key}:</strong> {value}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="p-12 text-center text-gray-500">
                <Settings className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Select an equipment to view its component parts</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
