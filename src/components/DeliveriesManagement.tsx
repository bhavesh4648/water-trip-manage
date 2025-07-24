import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Truck,
  Calendar,
  Clock,
  User,
  Building
} from 'lucide-react'
import { format } from 'date-fns'

interface Delivery {
  id: string
  date: string
  time: string
  driverName: string
  clientName: string
  amount?: number
  notes?: string
  createdAt: string
}

const DeliveriesManagement = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newDelivery, setNewDelivery] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    time: format(new Date(), 'HH:mm'),
    driverName: '',
    clientName: '',
    amount: '',
    notes: ''
  })
  const { toast } = useToast()

  // Mock data - replace with Supabase calls
  useEffect(() => {
    const mockDeliveries: Delivery[] = [
      {
        id: '1',
        date: '2024-01-20',
        time: '09:30',
        driverName: 'Suresh Kumar',
        clientName: 'Hemantbhai',
        amount: 1500,
        notes: 'Regular delivery',
        createdAt: '2024-01-20T09:30:00Z'
      },
      {
        id: '2',
        date: '2024-01-20',
        time: '11:15',
        driverName: 'Ramesh Patel',
        clientName: 'Ravi Industries',
        amount: 2200,
        notes: 'Urgent delivery',
        createdAt: '2024-01-20T11:15:00Z'
      },
      {
        id: '3',
        date: '2024-01-20',
        time: '14:45',
        driverName: 'Mukesh Singh',
        clientName: 'Shiv Enterprises',
        amount: 1800,
        notes: '',
        createdAt: '2024-01-20T14:45:00Z'
      }
    ]
    setDeliveries(mockDeliveries)

    // Listen for OCR added deliveries
    const handleDeliveriesAdded = (event: CustomEvent) => {
      const newDeliveries = event.detail
      setDeliveries(prev => [...newDeliveries, ...prev])
      toast({
        title: "OCR Deliveries Added",
        description: `${newDeliveries.length} entries added from logbook`,
      })
    }

    window.addEventListener('deliveriesAdded', handleDeliveriesAdded as EventListener)
    return () => window.removeEventListener('deliveriesAdded', handleDeliveriesAdded as EventListener)
  }, [toast])

  const filteredDeliveries = deliveries.filter(delivery =>
    delivery.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delivery.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delivery.date.includes(searchTerm)
  )

  const handleAddDelivery = () => {
    if (!newDelivery.date || !newDelivery.time || !newDelivery.driverName || !newDelivery.clientName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    const delivery: Delivery = {
      id: Date.now().toString(),
      date: newDelivery.date,
      time: newDelivery.time,
      driverName: newDelivery.driverName,
      clientName: newDelivery.clientName,
      amount: newDelivery.amount ? parseFloat(newDelivery.amount) : undefined,
      notes: newDelivery.notes,
      createdAt: new Date().toISOString()
    }

    setDeliveries(prev => [delivery, ...prev])
    setNewDelivery({
      date: format(new Date(), 'yyyy-MM-dd'),
      time: format(new Date(), 'HH:mm'),
      driverName: '',
      clientName: '',
      amount: '',
      notes: ''
    })
    setIsAdding(false)
    
    toast({
      title: "Delivery Added",
      description: "New delivery entry has been created successfully",
    })
  }

  const handleDeleteDelivery = (id: string) => {
    setDeliveries(prev => prev.filter(d => d.id !== id))
    toast({
      title: "Delivery Deleted",
      description: "Delivery entry has been removed",
    })
  }

  const handleEditDelivery = (id: string, field: string, value: string) => {
    setDeliveries(prev => prev.map(d => 
      d.id === id ? { ...d, [field]: value } : d
    ))
  }

  return (
    <div className="space-y-6">
      <Card className="border-ocean/20">
        <CardHeader>
          <CardTitle className="text-ocean-deep flex items-center gap-2">
            <Truck className="h-5 w-5 text-ocean" />
            Deliveries Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by client, driver, or date..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button 
              variant="ocean" 
              onClick={() => setIsAdding(true)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Delivery
            </Button>
          </div>

          {isAdding && (
            <Card className="mb-6 border-ocean/30 bg-ocean-light/20">
              <CardHeader>
                <CardTitle className="text-sm">Add New Delivery</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <Label htmlFor="new-date">Date *</Label>
                    <Input
                      id="new-date"
                      type="date"
                      value={newDelivery.date}
                      onChange={(e) => setNewDelivery(prev => ({ ...prev, date: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-time">Time *</Label>
                    <Input
                      id="new-time"
                      type="time"
                      value={newDelivery.time}
                      onChange={(e) => setNewDelivery(prev => ({ ...prev, time: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-driver">Driver Name *</Label>
                    <Input
                      id="new-driver"
                      value={newDelivery.driverName}
                      onChange={(e) => setNewDelivery(prev => ({ ...prev, driverName: e.target.value }))}
                      placeholder="Enter driver name"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-client">Client Name *</Label>
                    <Input
                      id="new-client"
                      value={newDelivery.clientName}
                      onChange={(e) => setNewDelivery(prev => ({ ...prev, clientName: e.target.value }))}
                      placeholder="Enter client name"
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="new-amount">Amount (₹)</Label>
                    <Input
                      id="new-amount"
                      type="number"
                      value={newDelivery.amount}
                      onChange={(e) => setNewDelivery(prev => ({ ...prev, amount: e.target.value }))}
                      placeholder="Enter amount"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-notes">Notes</Label>
                    <Input
                      id="new-notes"
                      value={newDelivery.notes}
                      onChange={(e) => setNewDelivery(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Additional notes"
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ocean" onClick={handleAddDelivery}>
                    Add Delivery
                  </Button>
                  <Button variant="outline" onClick={() => setIsAdding(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-ocean-light/30">
                  <TableHead className="text-ocean-deep">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Date
                    </div>
                  </TableHead>
                  <TableHead className="text-ocean-deep">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Time
                    </div>
                  </TableHead>
                  <TableHead className="text-ocean-deep">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Driver
                    </div>
                  </TableHead>
                  <TableHead className="text-ocean-deep">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Client
                    </div>
                  </TableHead>
                  <TableHead className="text-ocean-deep">Amount</TableHead>
                  <TableHead className="text-ocean-deep">Notes</TableHead>
                  <TableHead className="text-ocean-deep">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDeliveries.map((delivery) => (
                  <TableRow key={delivery.id} className="hover:bg-ocean-light/10">
                    <TableCell>
                      {editingId === delivery.id ? (
                        <Input
                          type="date"
                          value={delivery.date}
                          onChange={(e) => handleEditDelivery(delivery.id, 'date', e.target.value)}
                        />
                      ) : (
                        format(new Date(delivery.date), 'dd/MM/yyyy')
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === delivery.id ? (
                        <Input
                          type="time"
                          value={delivery.time}
                          onChange={(e) => handleEditDelivery(delivery.id, 'time', e.target.value)}
                        />
                      ) : (
                        delivery.time
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === delivery.id ? (
                        <Input
                          value={delivery.driverName}
                          onChange={(e) => handleEditDelivery(delivery.id, 'driverName', e.target.value)}
                        />
                      ) : (
                        delivery.driverName
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === delivery.id ? (
                        <Input
                          value={delivery.clientName}
                          onChange={(e) => handleEditDelivery(delivery.id, 'clientName', e.target.value)}
                        />
                      ) : (
                        delivery.clientName
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === delivery.id ? (
                        <Input
                          type="number"
                          value={delivery.amount || ''}
                          onChange={(e) => handleEditDelivery(delivery.id, 'amount', e.target.value)}
                        />
                      ) : (
                        delivery.amount ? `₹${delivery.amount}` : '-'
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === delivery.id ? (
                        <Input
                          value={delivery.notes || ''}
                          onChange={(e) => handleEditDelivery(delivery.id, 'notes', e.target.value)}
                        />
                      ) : (
                        delivery.notes || '-'
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingId(editingId === delivery.id ? null : delivery.id)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteDelivery(delivery.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredDeliveries.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? 'No deliveries found matching your search.' : 'No deliveries found. Add your first delivery above.'}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default DeliveriesManagement