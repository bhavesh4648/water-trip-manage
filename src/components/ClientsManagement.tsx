import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Users,
  Building,
  Phone,
  Mail,
  MapPin,
  User,
  CreditCard
} from 'lucide-react'

interface Client {
  id: string
  name: string
  email?: string
  phone?: string
  address?: string
  driversCount: number
  createdAt: string
}

interface Driver {
  id: string
  name: string
  clientId: string
  clientName: string
  phone?: string
  licenseNumber?: string
  createdAt: string
}

const ClientsManagement = () => {
  const [clients, setClients] = useState<Client[]>([])
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddingClient, setIsAddingClient] = useState(false)
  const [isAddingDriver, setIsAddingDriver] = useState(false)
  const [editingClientId, setEditingClientId] = useState<string | null>(null)
  const [editingDriverId, setEditingDriverId] = useState<string | null>(null)
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  })
  const [newDriver, setNewDriver] = useState({
    name: '',
    clientId: '',
    phone: '',
    licenseNumber: ''
  })
  const { toast } = useToast()

  // Mock data - replace with Supabase calls
  useEffect(() => {
    const mockClients: Client[] = [
      {
        id: '1',
        name: 'Hemantbhai',
        email: 'hemant@example.com',
        phone: '+91 98765 43210',
        address: 'Sector 12, Gandhinagar',
        driversCount: 2,
        createdAt: '2024-01-15T00:00:00Z'
      },
      {
        id: '2',
        name: 'Ravi Industries',
        email: 'info@raviind.com',
        phone: '+91 97654 32109',
        address: 'Industrial Area, Ahmedabad',
        driversCount: 3,
        createdAt: '2024-01-10T00:00:00Z'
      },
      {
        id: '3',
        name: 'Shiv Enterprises',
        email: 'contact@shiventerprises.com',
        phone: '+91 96543 21098',
        address: 'Commercial Complex, Surat',
        driversCount: 1,
        createdAt: '2024-01-08T00:00:00Z'
      }
    ]

    const mockDrivers: Driver[] = [
      {
        id: '1',
        name: 'Suresh Kumar',
        clientId: '1',
        clientName: 'Hemantbhai',
        phone: '+91 87654 32109',
        licenseNumber: 'GJ01-2023-001234',
        createdAt: '2024-01-15T00:00:00Z'
      },
      {
        id: '2',
        name: 'Ramesh Patel',
        clientId: '1',
        clientName: 'Hemantbhai',
        phone: '+91 87654 32108',
        licenseNumber: 'GJ01-2023-001235',
        createdAt: '2024-01-15T00:00:00Z'
      },
      {
        id: '3',
        name: 'Mukesh Singh',
        clientId: '2',
        clientName: 'Ravi Industries',
        phone: '+91 87654 32107',
        licenseNumber: 'GJ01-2023-001236',
        createdAt: '2024-01-10T00:00:00Z'
      }
    ]

    setClients(mockClients)
    setDrivers(mockDrivers)
  }, [])

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone?.includes(searchTerm)
  )

  const filteredDrivers = drivers.filter(driver =>
    driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.phone?.includes(searchTerm) ||
    driver.licenseNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddClient = () => {
    if (!newClient.name) {
      toast({
        title: "Missing Information",
        description: "Client name is required",
        variant: "destructive"
      })
      return
    }

    const client: Client = {
      id: Date.now().toString(),
      name: newClient.name,
      email: newClient.email || undefined,
      phone: newClient.phone || undefined,
      address: newClient.address || undefined,
      driversCount: 0,
      createdAt: new Date().toISOString()
    }

    setClients(prev => [client, ...prev])
    setNewClient({ name: '', email: '', phone: '', address: '' })
    setIsAddingClient(false)
    
    toast({
      title: "Client Added",
      description: "New client has been created successfully",
    })
  }

  const handleAddDriver = () => {
    if (!newDriver.name || !newDriver.clientId) {
      toast({
        title: "Missing Information",
        description: "Driver name and client selection are required",
        variant: "destructive"
      })
      return
    }

    const selectedClient = clients.find(c => c.id === newDriver.clientId)
    const driver: Driver = {
      id: Date.now().toString(),
      name: newDriver.name,
      clientId: newDriver.clientId,
      clientName: selectedClient?.name || '',
      phone: newDriver.phone || undefined,
      licenseNumber: newDriver.licenseNumber || undefined,
      createdAt: new Date().toISOString()
    }

    setDrivers(prev => [driver, ...prev])
    setClients(prev => prev.map(c => 
      c.id === newDriver.clientId 
        ? { ...c, driversCount: c.driversCount + 1 }
        : c
    ))
    setNewDriver({ name: '', clientId: '', phone: '', licenseNumber: '' })
    setIsAddingDriver(false)
    
    toast({
      title: "Driver Added",
      description: "New driver has been created successfully",
    })
  }

  const handleDeleteClient = (id: string) => {
    // First check if client has drivers
    const clientDrivers = drivers.filter(d => d.clientId === id)
    if (clientDrivers.length > 0) {
      toast({
        title: "Cannot Delete Client",
        description: "Please remove all drivers for this client first",
        variant: "destructive"
      })
      return
    }

    setClients(prev => prev.filter(c => c.id !== id))
    toast({
      title: "Client Deleted",
      description: "Client has been removed successfully",
    })
  }

  const handleDeleteDriver = (id: string) => {
    const driver = drivers.find(d => d.id === id)
    if (driver) {
      setDrivers(prev => prev.filter(d => d.id !== id))
      setClients(prev => prev.map(c => 
        c.id === driver.clientId 
          ? { ...c, driversCount: Math.max(0, c.driversCount - 1) }
          : c
      ))
      toast({
        title: "Driver Deleted",
        description: "Driver has been removed successfully",
      })
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-ocean/20">
        <CardHeader>
          <CardTitle className="text-ocean-deep flex items-center gap-2">
            <Users className="h-5 w-5 text-ocean" />
            Clients & Drivers Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="clients" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="clients">Clients</TabsTrigger>
              <TabsTrigger value="drivers">Drivers</TabsTrigger>
            </TabsList>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search clients, drivers, phone, or license..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <TabsContent value="clients" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-ocean-deep">Clients ({filteredClients.length})</h3>
                <Button 
                  variant="ocean" 
                  onClick={() => setIsAddingClient(true)}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Client
                </Button>
              </div>

              {isAddingClient && (
                <Card className="border-ocean/30 bg-ocean-light/20">
                  <CardHeader>
                    <CardTitle className="text-sm">Add New Client</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label htmlFor="client-name">Client Name *</Label>
                        <Input
                          id="client-name"
                          value={newClient.name}
                          onChange={(e) => setNewClient(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter client name"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="client-email">Email</Label>
                        <Input
                          id="client-email"
                          type="email"
                          value={newClient.email}
                          onChange={(e) => setNewClient(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="Enter email address"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="client-phone">Phone</Label>
                        <Input
                          id="client-phone"
                          value={newClient.phone}
                          onChange={(e) => setNewClient(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="Enter phone number"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="client-address">Address</Label>
                        <Input
                          id="client-address"
                          value={newClient.address}
                          onChange={(e) => setNewClient(prev => ({ ...prev, address: e.target.value }))}
                          placeholder="Enter address"
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ocean" onClick={handleAddClient}>
                        Add Client
                      </Button>
                      <Button variant="outline" onClick={() => setIsAddingClient(false)}>
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid gap-4">
                {filteredClients.map((client) => (
                  <Card key={client.id} className="border-ocean/20 hover:shadow-wave transition-all duration-300">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <Building className="h-5 w-5 text-ocean" />
                            <h4 className="font-semibold text-ocean-deep">{client.name}</h4>
                          </div>
                          
                          {client.email && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Mail className="h-4 w-4" />
                              {client.email}
                            </div>
                          )}
                          
                          {client.phone && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Phone className="h-4 w-4" />
                              {client.phone}
                            </div>
                          )}
                          
                          {client.address && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              {client.address}
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2 text-sm text-ocean">
                            <User className="h-4 w-4" />
                            {client.driversCount} driver(s)
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingClientId(editingClientId === client.id ? null : client.id)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteClient(client.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {filteredClients.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  {searchTerm ? 'No clients found matching your search.' : 'No clients found. Add your first client above.'}
                </div>
              )}
            </TabsContent>

            <TabsContent value="drivers" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-ocean-deep">Drivers ({filteredDrivers.length})</h3>
                <Button 
                  variant="ocean" 
                  onClick={() => setIsAddingDriver(true)}
                  className="gap-2"
                  disabled={clients.length === 0}
                >
                  <Plus className="h-4 w-4" />
                  Add Driver
                </Button>
              </div>

              {clients.length === 0 && (
                <div className="text-center py-4 text-muted-foreground bg-yellow-50 border border-yellow-200 rounded-lg">
                  Please add at least one client before adding drivers.
                </div>
              )}

              {isAddingDriver && clients.length > 0 && (
                <Card className="border-ocean/30 bg-ocean-light/20">
                  <CardHeader>
                    <CardTitle className="text-sm">Add New Driver</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label htmlFor="driver-name">Driver Name *</Label>
                        <Input
                          id="driver-name"
                          value={newDriver.name}
                          onChange={(e) => setNewDriver(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter driver name"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="driver-client">Client *</Label>
                        <select
                          id="driver-client"
                          value={newDriver.clientId}
                          onChange={(e) => setNewDriver(prev => ({ ...prev, clientId: e.target.value }))}
                          className="mt-1 w-full px-3 py-2 border border-input rounded-md bg-background"
                        >
                          <option value="">Select a client</option>
                          {clients.map(client => (
                            <option key={client.id} value={client.id}>{client.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="driver-phone">Phone</Label>
                        <Input
                          id="driver-phone"
                          value={newDriver.phone}
                          onChange={(e) => setNewDriver(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="Enter phone number"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="driver-license">License Number</Label>
                        <Input
                          id="driver-license"
                          value={newDriver.licenseNumber}
                          onChange={(e) => setNewDriver(prev => ({ ...prev, licenseNumber: e.target.value }))}
                          placeholder="Enter license number"
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ocean" onClick={handleAddDriver}>
                        Add Driver
                      </Button>
                      <Button variant="outline" onClick={() => setIsAddingDriver(false)}>
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid gap-4">
                {filteredDrivers.map((driver) => (
                  <Card key={driver.id} className="border-ocean/20 hover:shadow-wave transition-all duration-300">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <User className="h-5 w-5 text-ocean" />
                            <h4 className="font-semibold text-ocean-deep">{driver.name}</h4>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Building className="h-4 w-4" />
                            {driver.clientName}
                          </div>
                          
                          {driver.phone && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Phone className="h-4 w-4" />
                              {driver.phone}
                            </div>
                          )}
                          
                          {driver.licenseNumber && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <CreditCard className="h-4 w-4" />
                              {driver.licenseNumber}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingDriverId(editingDriverId === driver.id ? null : driver.id)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteDriver(driver.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {filteredDrivers.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  {searchTerm ? 'No drivers found matching your search.' : 'No drivers found. Add your first driver above.'}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default ClientsManagement