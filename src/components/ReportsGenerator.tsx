import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import * as XLSX from 'xlsx'
import { 
  FileSpreadsheet, 
  Download, 
  Calendar,
  Filter,
  BarChart3,
  TrendingUp,
  DollarSign,
  Users
} from 'lucide-react'
import { format, startOfMonth, endOfMonth } from 'date-fns'

interface ReportData {
  srNo: number
  date: string
  time: string
  driverName: string
  client: string
  signature: string
  amount: number | string
}

const ReportsGenerator = () => {
  const [startDate, setStartDate] = useState(format(startOfMonth(new Date()), 'yyyy-MM-dd'))
  const [endDate, setEndDate] = useState(format(endOfMonth(new Date()), 'yyyy-MM-dd'))
  const [selectedClient, setSelectedClient] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  // Mock data - replace with actual data from Supabase
  const mockReportData: ReportData[] = [
    {
      srNo: 1,
      date: '20/01/2024',
      time: '09:30',
      driverName: 'Suresh Kumar',
      client: 'Hemantbhai',
      signature: 'Signed',
      amount: 1500
    },
    {
      srNo: 2,
      date: '20/01/2024',
      time: '11:15',
      driverName: 'Ramesh Patel',
      client: 'Ravi Industries',
      signature: 'Signed',
      amount: 2200
    },
    {
      srNo: 3,
      date: '20/01/2024',
      time: '14:45',
      driverName: 'Mukesh Singh',
      client: 'Shiv Enterprises',
      signature: 'Signed',
      amount: 1800
    },
    {
      srNo: 4,
      date: '21/01/2024',
      time: '10:00',
      driverName: 'Dinesh Sharma',
      client: 'Hemantbhai',
      signature: 'Signed',
      amount: 1600
    },
    {
      srNo: 5,
      date: '21/01/2024',
      time: '15:30',
      driverName: 'Rajesh Kumar',
      client: 'Prakash Industries',
      signature: 'Signed',
      amount: 2000
    }
  ]

  const clients = ['All Clients', 'Hemantbhai', 'Ravi Industries', 'Shiv Enterprises', 'Prakash Industries']

  const generateExcelReport = () => {
    setIsGenerating(true)
    
    try {
      // Filter data based on selected criteria
      let filteredData = mockReportData
      
      if (selectedClient && selectedClient !== 'All Clients') {
        filteredData = filteredData.filter(item => item.client === selectedClient)
      }

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new()
      
      // Prepare data for Excel
      const excelData: any[] = filteredData.map(item => ({
        'Sr. No': item.srNo,
        'Date': item.date,
        'Time': item.time,
        'Driver Name': item.driverName,
        'Client': item.client,
        'Signature': item.signature,
        'Amount (₹)': item.amount
      }))

      // Add summary row
      const totalAmount = filteredData.reduce((sum, item) => 
        sum + (typeof item.amount === 'number' ? item.amount : 0), 0
      )
      
      excelData.push({
        'Sr. No': '',
        'Date': '',
        'Time': '',
        'Driver Name': '',
        'Client': 'TOTAL',
        'Signature': '',
        'Amount (₹)': totalAmount
      })

      const ws = XLSX.utils.json_to_sheet(excelData)
      
      // Set column widths
      const colWidths = [
        { wch: 8 },  // Sr. No
        { wch: 12 }, // Date
        { wch: 8 },  // Time
        { wch: 15 }, // Driver Name
        { wch: 18 }, // Client
        { wch: 10 }, // Signature
        { wch: 12 }  // Amount
      ]
      ws['!cols'] = colWidths

      // Style the header row
      const headerRange = XLSX.utils.decode_range(ws['!ref'] || 'A1')
      for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col })
        if (!ws[cellAddress]) continue
        ws[cellAddress].s = {
          font: { bold: true, color: { rgb: "FFFFFF" } },
          fill: { fgColor: { rgb: "0066CC" } },
          alignment: { horizontal: "center" }
        }
      }

      XLSX.utils.book_append_sheet(wb, ws, "Delivery Report")
      
      // Generate filename
      const clientName = selectedClient && selectedClient !== 'All Clients' ? selectedClient : 'All_Clients'
      const filename = `Water_Delivery_Report_${clientName}_${format(new Date(startDate), 'dd-MM-yyyy')}_to_${format(new Date(endDate), 'dd-MM-yyyy')}.xlsx`
      
      // Download file
      XLSX.writeFile(wb, filename)
      
      toast({
        title: "Report Generated Successfully",
        description: `Excel report has been downloaded: ${filename}`,
      })
    } catch (error) {
      console.error('Error generating report:', error)
      toast({
        title: "Error Generating Report",
        description: "Please try again",
        variant: "destructive"
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const generateQuickStats = () => {
    let filteredData = mockReportData
    
    if (selectedClient && selectedClient !== 'All Clients') {
      filteredData = filteredData.filter(item => item.client === selectedClient)
    }

    const totalDeliveries = filteredData.length
    const totalAmount = filteredData.reduce((sum, item) => 
      sum + (typeof item.amount === 'number' ? item.amount : 0), 0
    )
    const uniqueClients = new Set(filteredData.map(item => item.client)).size
    const uniqueDrivers = new Set(filteredData.map(item => item.driverName)).size

    return { totalDeliveries, totalAmount, uniqueClients, uniqueDrivers }
  }

  const stats = generateQuickStats()

  return (
    <div className="space-y-6">
      <Card className="border-ocean/20">
        <CardHeader>
          <CardTitle className="text-ocean-deep flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-ocean" />
            Excel Report Generator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="client-filter">Client Filter</Label>
              <select
                id="client-filter"
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-input rounded-md bg-background"
              >
                {clients.map(client => (
                  <option key={client} value={client}>{client}</option>
                ))}
              </select>
            </div>
          </div>

          <Button 
            variant="ocean" 
            onClick={generateExcelReport}
            disabled={isGenerating}
            className="gap-2 mb-6"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Generate Excel Report
              </>
            )}
          </Button>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-ocean/20 bg-ocean-light/10">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Deliveries</p>
                    <p className="text-2xl font-bold text-ocean-deep">{stats.totalDeliveries}</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-ocean" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-ocean/20 bg-ocean-light/10">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <p className="text-2xl font-bold text-ocean-deep">₹{stats.totalAmount.toLocaleString()}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-ocean" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-ocean/20 bg-ocean-light/10">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Unique Clients</p>
                    <p className="text-2xl font-bold text-ocean-deep">{stats.uniqueClients}</p>
                  </div>
                  <Users className="h-8 w-8 text-ocean" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-ocean/20 bg-ocean-light/10">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Drivers</p>
                    <p className="text-2xl font-bold text-ocean-deep">{stats.uniqueDrivers}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-ocean" />
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Report Preview */}
      <Card className="border-ocean/20">
        <CardHeader>
          <CardTitle className="text-ocean-deep flex items-center gap-2">
            <Filter className="h-5 w-5 text-ocean" />
            Report Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-ocean/20">
              <thead>
                <tr className="bg-ocean-light/30">
                  <th className="border border-ocean/20 px-4 py-2 text-left text-ocean-deep">Sr. No</th>
                  <th className="border border-ocean/20 px-4 py-2 text-left text-ocean-deep">Date</th>
                  <th className="border border-ocean/20 px-4 py-2 text-left text-ocean-deep">Time</th>
                  <th className="border border-ocean/20 px-4 py-2 text-left text-ocean-deep">Driver Name</th>
                  <th className="border border-ocean/20 px-4 py-2 text-left text-ocean-deep">Client</th>
                  <th className="border border-ocean/20 px-4 py-2 text-left text-ocean-deep">Signature</th>
                  <th className="border border-ocean/20 px-4 py-2 text-left text-ocean-deep">Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                {mockReportData
                  .filter(item => !selectedClient || selectedClient === 'All Clients' || item.client === selectedClient)
                  .slice(0, 5)
                  .map((item) => (
                  <tr key={item.srNo} className="hover:bg-ocean-light/10">
                    <td className="border border-ocean/20 px-4 py-2">{item.srNo}</td>
                    <td className="border border-ocean/20 px-4 py-2">{item.date}</td>
                    <td className="border border-ocean/20 px-4 py-2">{item.time}</td>
                    <td className="border border-ocean/20 px-4 py-2">{item.driverName}</td>
                    <td className="border border-ocean/20 px-4 py-2">{item.client}</td>
                    <td className="border border-ocean/20 px-4 py-2">{item.signature}</td>
                    <td className="border border-ocean/20 px-4 py-2">{item.amount}</td>
                  </tr>
                ))}
                <tr className="bg-ocean/10 font-semibold">
                  <td className="border border-ocean/20 px-4 py-2" colSpan={5}>TOTAL</td>
                  <td className="border border-ocean/20 px-4 py-2"></td>
                  <td className="border border-ocean/20 px-4 py-2">₹{stats.totalAmount.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Showing preview of first 5 entries. Full report will include all filtered data.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default ReportsGenerator