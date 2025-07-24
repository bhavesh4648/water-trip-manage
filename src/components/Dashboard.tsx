import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Upload, 
  Truck, 
  Users, 
  FileSpreadsheet,
  TrendingUp,
  Calendar,
  Clock,
  DropletIcon
} from 'lucide-react'

interface DashboardProps {
  onNavigate: (tab: string) => void
}

const Dashboard = ({ onNavigate }: DashboardProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-ocean-deep mb-2">Welcome to KeiYaShiv</h1>
        <p className="text-lg text-ocean">Professional Water Supply Management System</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="border-ocean/20 hover:shadow-wave transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-ocean-deep">Today's Deliveries</CardTitle>
            <Truck className="h-4 w-4 text-ocean" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-ocean-deep">12</div>
            <p className="text-xs text-muted-foreground">+2 from yesterday</p>
          </CardContent>
        </Card>

        <Card className="border-ocean/20 hover:shadow-wave transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-ocean-deep">Active Clients</CardTitle>
            <Users className="h-4 w-4 text-ocean" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-ocean-deep">8</div>
            <p className="text-xs text-muted-foreground">3 new this month</p>
          </CardContent>
        </Card>

        <Card className="border-ocean/20 hover:shadow-wave transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-ocean-deep">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-ocean" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-ocean-deep">245</div>
            <p className="text-xs text-muted-foreground">deliveries completed</p>
          </CardContent>
        </Card>

        <Card className="border-ocean/20 hover:shadow-wave transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-ocean-deep">Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-ocean" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-ocean-deep">₹45,230</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-ocean/20">
        <CardHeader>
          <CardTitle className="text-ocean-deep flex items-center gap-2">
            <DropletIcon className="h-5 w-5 text-ocean" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              variant="ocean" 
              className="h-20 flex-col gap-2"
              onClick={() => onNavigate('upload')}
            >
              <Upload className="h-6 w-6" />
              Upload Logbook
            </Button>
            <Button 
              variant="wave" 
              className="h-20 flex-col gap-2"
              onClick={() => onNavigate('deliveries')}
            >
              <Truck className="h-6 w-6" />
              Manage Deliveries
            </Button>
            <Button 
              variant="mint" 
              className="h-20 flex-col gap-2"
              onClick={() => onNavigate('clients')}
            >
              <Users className="h-6 w-6" />
              Manage Clients
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2 border-ocean hover:bg-ocean-light"
              onClick={() => onNavigate('reports')}
            >
              <FileSpreadsheet className="h-6 w-6" />
              Generate Reports
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="border-ocean/20">
        <CardHeader>
          <CardTitle className="text-ocean-deep flex items-center gap-2">
            <Clock className="h-5 w-5 text-ocean" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-ocean-light/50 rounded-lg">
              <div className="w-2 h-2 bg-ocean rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-ocean-deep">New delivery logged for Hemantbhai</p>
                <p className="text-xs text-muted-foreground">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-ocean-light/30 rounded-lg">
              <div className="w-2 h-2 bg-ocean-wave rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-ocean-deep">Monthly report generated for Ravi Industries</p>
                <p className="text-xs text-muted-foreground">1 hour ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-ocean-light/30 rounded-lg">
              <div className="w-2 h-2 bg-ocean-mint/70 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-ocean-deep">New driver added: Suresh Kumar</p>
                <p className="text-xs text-muted-foreground">3 hours ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard