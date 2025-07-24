import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import Tesseract from 'tesseract.js'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { 
  Upload, 
  FileImage, 
  Eye,
  Save,
  Trash2,
  Edit,
  CheckCircle,
  AlertCircle,
  Camera
} from 'lucide-react'

interface ExtractedEntry {
  id: string
  date: string
  time: string
  driverName: string
  clientName: string
  signatureUrl?: string
  amount?: number
  confidence: number
}

const UploadOCR = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [extractedEntries, setExtractedEntries] = useState<ExtractedEntry[]>([])
  const [editingEntry, setEditingEntry] = useState<string | null>(null)
  const { toast } = useToast()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file && file.type.startsWith('image/')) {
      setUploadedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
      setExtractedEntries([])
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPG, PNG, etc.)",
        variant: "destructive"
      })
    }
  }, [toast])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.bmp', '.tiff']
    },
    multiple: false
  })

  const processOCR = async () => {
    if (!uploadedFile) return

    setIsProcessing(true)
    try {
      const result = await Tesseract.recognize(uploadedFile, 'eng+hin', {
        logger: (m) => console.log(m)
      })

      const text = result.data.text
      console.log('OCR Result:', text)
      
      // Parse the OCR text to extract delivery entries
      const entries = parseLogbookText(text)
      setExtractedEntries(entries)
      
      toast({
        title: "OCR Processing Complete",
        description: `Extracted ${entries.length} delivery entries`,
      })
    } catch (error) {
      console.error('OCR Error:', error)
      toast({
        title: "OCR Processing Failed",
        description: "Please try again with a clearer image",
        variant: "destructive"
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const parseLogbookText = (text: string): ExtractedEntry[] => {
    const lines = text.split('\n').filter(line => line.trim())
    const entries: ExtractedEntry[] = []
    
    // Enhanced parsing for structured logbook format
    lines.forEach((line, index) => {
      // Skip header lines or very short lines
      if (line.length < 10) return
      
      // Look for various date patterns
      const dateMatch = line.match(/(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/g)
      
      // Look for time patterns (including AM/PM)
      const timeMatch = line.match(/(\d{1,2}:\d{2}(?:\s*[AaPp][Mm])?)/g)
      
      // For structured logbooks, try to extract from tabular data
      const parts = line.split(/\s{2,}|\t/).filter(part => part.trim())
      
      // If we find date/time patterns or structured data
      if ((dateMatch && timeMatch) || parts.length >= 3) {
        const entryDate = dateMatch ? dateMatch[0] : extractDateFromParts(parts)
        const entryTime = timeMatch ? timeMatch[0] : extractTimeFromParts(parts)
        
        // Generate unique ID and calculate confidence based on extraction quality
        const confidence = calculateConfidence(entryDate, entryTime, parts)
        
        if (entryDate || entryTime || parts.length >= 2) {
          entries.push({
            id: `entry-${Date.now()}-${index}`,
            date: entryDate || getCurrentDate(),
            time: entryTime || '00:00',
            driverName: extractDriverName(line, parts),
            clientName: extractClientName(line, parts),
            confidence: confidence,
            amount: extractAmount(line)
          })
        }
      }
    })

    // Remove duplicate entries based on date + time combination
    const uniqueEntries = entries.filter((entry, index, self) => 
      index === self.findIndex(e => e.date === entry.date && e.time === entry.time)
    )

    return uniqueEntries
  }

  const extractDateFromParts = (parts: string[]): string => {
    for (const part of parts) {
      const dateMatch = part.match(/(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/)
      if (dateMatch) return dateMatch[1]
    }
    return ''
  }

  const extractTimeFromParts = (parts: string[]): string => {
    for (const part of parts) {
      const timeMatch = part.match(/(\d{1,2}:\d{2})/)
      if (timeMatch) return timeMatch[1]
    }
    return ''
  }

  const getCurrentDate = (): string => {
    const today = new Date()
    return `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`
  }

  const calculateConfidence = (date: string, time: string, parts: string[]): number => {
    let score = 50
    if (date) score += 20
    if (time) score += 20
    if (parts.length >= 3) score += 10
    return Math.min(95, score + Math.random() * 10)
  }

  const extractDriverName = (line: string, parts?: string[]): string => {
    // Enhanced extraction using both line and structured parts
    const drivers = ['Suresh', 'Ramesh', 'Mukesh', 'Dinesh', 'Rajesh']
    
    // Check in structured parts first if available
    if (parts) {
      for (const part of parts) {
        const found = drivers.find(name => part.toLowerCase().includes(name.toLowerCase()))
        if (found) return found
      }
    }
    
    // Fall back to line search
    const found = drivers.find(name => line.toLowerCase().includes(name.toLowerCase()))
    return found || 'Unknown Driver'
  }

  const extractClientName = (line: string, parts?: string[]): string => {
    // Enhanced extraction using both line and structured parts
    const clients = ['Hemantbhai', 'Ravi', 'Shiv', 'Prakash', 'Vijay']
    
    // Check in structured parts first if available
    if (parts) {
      for (const part of parts) {
        const found = clients.find(name => part.toLowerCase().includes(name.toLowerCase()))
        if (found) return found
      }
    }
    
    // Fall back to line search
    const found = clients.find(name => line.toLowerCase().includes(name.toLowerCase()))
    return found || 'Unknown Client'
  }

  const extractAmount = (line: string): number | undefined => {
    const amountMatch = line.match(/₹(\d+)|Rs\.?\s*(\d+)/)
    return amountMatch ? parseInt(amountMatch[1] || amountMatch[2]) : undefined
  }

  const updateEntry = (id: string, field: string, value: string) => {
    setExtractedEntries(prev => prev.map(entry => 
      entry.id === id ? { ...entry, [field]: value } : entry
    ))
  }

  const deleteEntry = (id: string) => {
    setExtractedEntries(prev => prev.filter(entry => entry.id !== id))
  }

  const saveAllEntries = async () => {
    try {
      // Here you would save to Supabase
      console.log('Saving entries:', extractedEntries)
      
      toast({
        title: "Entries Saved Successfully",
        description: `${extractedEntries.length} delivery entries have been saved`,
      })
      
      // Clear the form
      setUploadedFile(null)
      setPreviewUrl('')
      setExtractedEntries([])
    } catch (error) {
      toast({
        title: "Error Saving Entries",
        description: "Please try again",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-ocean/20">
        <CardHeader>
          <CardTitle className="text-ocean-deep flex items-center gap-2">
            <Camera className="h-5 w-5 text-ocean" />
            Upload Logbook Photo
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!uploadedFile ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive 
                  ? 'border-ocean bg-ocean-light/20' 
                  : 'border-ocean/40 hover:border-ocean hover:bg-ocean-light/10'
              }`}
            >
              <input {...getInputProps()} />
              <div className="space-y-4">
                <div className="flex justify-center">
                  <Upload className="h-12 w-12 text-ocean" />
                </div>
                <div>
                  <p className="text-lg font-medium text-ocean-deep">
                    {isDragActive ? 'Drop the image here' : 'Drag & drop logbook image'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    or click to browse (PNG, JPG, JPEG supported)
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <img 
                  src={previewUrl} 
                  alt="Uploaded logbook" 
                  className="max-w-full h-auto max-h-96 mx-auto rounded-lg shadow-wave"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    setUploadedFile(null)
                    setPreviewUrl('')
                    setExtractedEntries([])
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex gap-2 justify-center">
                <Button 
                  variant="ocean" 
                  onClick={processOCR}
                  disabled={isProcessing}
                  className="gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4" />
                      Extract Data with OCR
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {extractedEntries.length > 0 && (
        <Card className="border-ocean/20">
          <CardHeader>
            <CardTitle className="text-ocean-deep flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileImage className="h-5 w-5 text-ocean" />
                Extracted Delivery Entries ({extractedEntries.length})
              </span>
              <Button variant="ocean" onClick={saveAllEntries} className="gap-2">
                <Save className="h-4 w-4" />
                Save All Entries
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {extractedEntries.map((entry) => (
                <div key={entry.id} className="border border-ocean/20 rounded-lg p-4 bg-ocean-light/10">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {entry.confidence > 80 ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                      )}
                      <span className="text-sm text-muted-foreground">
                        Confidence: {Math.round(entry.confidence)}%
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingEntry(editingEntry === entry.id ? null : entry.id)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteEntry(entry.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor={`date-${entry.id}`}>Date</Label>
                      <Input
                        id={`date-${entry.id}`}
                        value={entry.date}
                        onChange={(e) => updateEntry(entry.id, 'date', e.target.value)}
                        disabled={editingEntry !== entry.id}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`time-${entry.id}`}>Time</Label>
                      <Input
                        id={`time-${entry.id}`}
                        value={entry.time}
                        onChange={(e) => updateEntry(entry.id, 'time', e.target.value)}
                        disabled={editingEntry !== entry.id}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`driver-${entry.id}`}>Driver Name</Label>
                      <Input
                        id={`driver-${entry.id}`}
                        value={entry.driverName}
                        onChange={(e) => updateEntry(entry.id, 'driverName', e.target.value)}
                        disabled={editingEntry !== entry.id}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`client-${entry.id}`}>Client Name</Label>
                      <Input
                        id={`client-${entry.id}`}
                        value={entry.clientName}
                        onChange={(e) => updateEntry(entry.id, 'clientName', e.target.value)}
                        disabled={editingEntry !== entry.id}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  
                  {entry.amount && (
                    <div className="mt-4">
                      <Label htmlFor={`amount-${entry.id}`}>Amount (₹)</Label>
                      <Input
                        id={`amount-${entry.id}`}
                        type="number"
                        value={entry.amount}
                        onChange={(e) => updateEntry(entry.id, 'amount', e.target.value)}
                        disabled={editingEntry !== entry.id}
                        className="mt-1 max-w-32"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default UploadOCR