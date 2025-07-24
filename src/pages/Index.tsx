import { useState } from 'react'
import Layout from '@/components/Layout'
import Dashboard from '@/components/Dashboard'
import UploadOCR from '@/components/UploadOCR'
import DeliveriesManagement from '@/components/DeliveriesManagement'
import ClientsManagement from '@/components/ClientsManagement'
import ReportsGenerator from '@/components/ReportsGenerator'
import EmailManager from '@/components/EmailManager'

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard')

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigate={setActiveTab} />
      case 'upload':
        return <UploadOCR />
      case 'deliveries':
        return <DeliveriesManagement />
      case 'clients':
        return <ClientsManagement />
      case 'reports':
        return <ReportsGenerator />
      case 'email':
        return <EmailManager />
      default:
        return <Dashboard onNavigate={setActiveTab} />
    }
  }

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </Layout>
  )
}

export default Index
