import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Upload,
  Truck,
  Users,
  FileSpreadsheet,
  Mail,
  BarChart3,
  Menu,
  X,
  Droplets,
} from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Layout = ({ children, activeTab, onTabChange }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "upload", label: "Upload & OCR", icon: Upload },
    { id: "deliveries", label: "Deliveries", icon: Truck },
    { id: "clients", label: "Clients", icon: Users },
    { id: "reports", label: "Reports", icon: FileSpreadsheet },
    { id: "email", label: "Email", icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-gradient-wave">
      {/* Header */}
      <header className="bg-gradient-ocean shadow-ocean border-b border-ocean/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Droplets className="h-8 w-8 text-white" />
              <div>
                <h1 className="text-xl font-bold text-white">KeiYaShiv</h1>
                <p className="text-xs text-ocean-light">
                  Water Supply Management
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white hover:bg-white/20"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 fixed md:relative z-30 w-64 h-screen bg-card border-r border-border transition-transform duration-300 ease-in-out`}
        >
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "ocean" : "ghost"}
                  className="w-full justify-start gap-3"
                  onClick={() => {
                    onTabChange(item.id);
                    setSidebarOpen(false);
                  }}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Button>
              );
            })}
          </nav>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          <div className="max-w-7xl mx-auto p-6">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
