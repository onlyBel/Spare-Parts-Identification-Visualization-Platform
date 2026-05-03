import { useState } from 'react';
import { Search, Cpu, Warehouse, Menu, X } from 'lucide-react';
import PartSearch from './components/PartSearch';
import EquipmentBrowser from './components/EquipmentBrowser';
import InventoryDashboard from './components/InventoryDashboard';
import { Button } from './components/ui/button';

function App() {
  const [activeTab, setActiveTab] = useState('search');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = [
    { id: 'search', label: 'Part Search', icon: Search },
    { id: 'equipment', label: 'Equipment Browser', icon: Cpu },
    { id: 'inventory', label: 'Inventory Dashboard', icon: Warehouse },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="bg-blue-600 text-white p-2 rounded-lg mr-3">
                  <Cpu className="h-6 w-6" />
                </div>
                <span className="text-xl font-bold text-gray-900">
                  Spare Parts Platform
                </span>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? 'default' : 'ghost'}
                    onClick={() => setActiveTab(tab.id)}
                    className="flex items-center gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </Button>
                );
              })}
            </div>

            <div className="md:hidden flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? 'default' : 'ghost'}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full justify-start"
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.label}
                  </Button>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'search' && <PartSearch />}
        {activeTab === 'equipment' && <EquipmentBrowser />}
        {activeTab === 'inventory' && <InventoryDashboard />}
      </main>

      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            Spare Parts Identification & Visualization Platform © 2024
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
