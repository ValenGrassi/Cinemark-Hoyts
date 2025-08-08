"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Server, Network, Cpu, HardDrive, Thermometer, Zap } from 'lucide-react'
import { CinemaList } from "../components/cinema-list"
import { RackDashboard } from "../components/rack-dashboard"
import { Cinema } from "../types/cinema"
import { sampleCinemas } from "../data/sample-cinemas"
import { parseExcelData, convertExcelToRackComponents } from "../utils/excel-parser"

interface RackComponent {
  id: string
  type: 'server' | 'patch-panel' | 'ups'
  name: string
  status: 'online' | 'offline' | 'warning' | 'maintenance'
  position: number
  specs?: {
    cpu?: string
    ram?: string
    storage?: string
    temperature?: number
    powerUsage?: number
    ports?: number
    connections?: number
    capacity?: string
    batteryHealth?: number
    loadPercentage?: number
    estimatedRuntime?: number
    batteryInstallDate?: string
    batteryLifespan?: number
  }
  description?: string
}

const rackData: RackComponent[] = [
  {
    id: 'server-1',
    type: 'server',
    name: 'Web Server 01',
    status: 'online',
    position: 1,
    specs: {
      cpu: 'Intel Xeon E5-2680 v4',
      ram: '64GB DDR4',
      storage: '2TB NVMe SSD',
      temperature: 42,
      powerUsage: 180
    },
    description: 'Primary web application server handling frontend requests'
  },
  {
    id: 'server-2',
    type: 'server',
    name: 'Database Server',
    status: 'online',
    position: 2,
    specs: {
      cpu: 'AMD EPYC 7542',
      ram: '128GB DDR4',
      storage: '4TB NVMe SSD',
      temperature: 38,
      powerUsage: 220
    },
    description: 'PostgreSQL database server with high availability setup'
  },
  {
    id: 'patch-1',
    type: 'patch-panel',
    name: 'Network Patch Panel A',
    status: 'online',
    position: 3,
    specs: {
      ports: 48,
      connections: 42
    },
    description: '48-port Cat6A patch panel for network connectivity'
  },
  {
    id: 'server-3',
    type: 'server',
    name: 'Backup Server',
    status: 'warning',
    position: 4,
    specs: {
      cpu: 'Intel Xeon Silver 4214',
      ram: '32GB DDR4',
      storage: '8TB HDD RAID',
      temperature: 55,
      powerUsage: 150
    },
    description: 'Backup and disaster recovery server - temperature warning'
  },
  {
    id: 'server-4',
    type: 'server',
    name: 'Load Balancer',
    status: 'online',
    position: 5,
    specs: {
      cpu: 'Intel Core i7-10700K',
      ram: '16GB DDR4',
      storage: '512GB NVMe SSD',
      temperature: 35,
      powerUsage: 95
    },
    description: 'HAProxy load balancer distributing traffic across web servers'
  },
  {
    id: 'patch-2',
    type: 'patch-panel',
    name: 'Network Patch Panel B',
    status: 'maintenance',
    position: 6,
    specs: {
      ports: 24,
      connections: 18
    },
    description: '24-port fiber optic patch panel - scheduled maintenance'
  },
  {
    id: 'server-5',
    type: 'server',
    name: 'Monitoring Server',
    status: 'offline',
    position: 7,
    specs: {
      cpu: 'AMD Ryzen 7 3700X',
      ram: '32GB DDR4',
      storage: '1TB NVMe SSD',
      temperature: 0,
      powerUsage: 0
    },
    description: 'System monitoring and alerting server - currently offline'
  },
  {
    id: 'ups-1',
    type: 'ups',
    name: 'Main UPS',
    status: 'online',
    position: 8,
    specs: {
      capacity: '2000VA / 1800W',
      batteryHealth: 90,
      loadPercentage: 40,
      estimatedRuntime: 30,
      batteryInstallDate: '2023-01-15',
      batteryLifespan: 36
    },
    description: 'Main UPS for power backup'
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'online': return '#22c55e'
    case 'offline': return '#ef4444'
    case 'warning': return '#f59e0b'
    case 'maintenance': return '#3b82f6'
    default: return '#6b7280'
  }
}

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'online': return 'default'
    case 'offline': return 'destructive'
    case 'warning': return 'secondary'
    case 'maintenance': return 'outline'
    default: return 'secondary'
  }
}

export default function CinemaManagementApp() {
  const [cinemas, setCinemas] = useState<Cinema[]>(sampleCinemas)
  const [selectedCinema, setSelectedCinema] = useState<Cinema | null>(null)

  const handleSelectCinema = (cinema: Cinema) => {
    setSelectedCinema(cinema)
  }

  const handleBackToList = () => {
    setSelectedCinema(null)
  }

  const handleUploadExcel = async (file: File, cinemaId?: string) => {
    try {
      // In a real application, you would parse the Excel file here
      // For now, we'll simulate the process
      console.log('Uploading Excel file:', file.name)
      
      // Simulate Excel parsing
      const mockExcelData = [
        {
          cinemaName: 'New Cinema Location',
          location: 'Villa Ballester',
          address: 'Av. San Martín 1234, Villa Ballester',
          type: 'server',
          name: 'Projection Server',
          status: 'online',
          position: 1,
          cpu: 'Intel Xeon E5-2680',
          ram: '32GB DDR4',
          storage: '2TB SSD'
        },
        {
          type: 'ups',
          name: 'Main UPS',
          status: 'online',
          position: 2,
          capacity: '2000VA / 1800W',
          batteryHealth: 90,
          loadPercentage: 40,
          estimatedRuntime: 30,
          batteryInstallDate: '2023-01-15',
          batteryLifespan: 36
        }
      ]

      if (cinemaId) {
        // Update existing cinema
        const updatedCinemas = cinemas.map(cinema => {
          if (cinema.id === cinemaId) {
            const newComponents = convertExcelToRackComponents(mockExcelData)
            return {
              ...cinema,
              rackComponents: [...cinema.rackComponents, ...newComponents],
              lastUpdated: new Date().toISOString().split('T')[0]
            }
          }
          return cinema
        })
        setCinemas(updatedCinemas)
      } else {
        // Create new cinema
        const excelData = parseExcelData(mockExcelData)
        const newCinema: Cinema = {
          id: `cinema-${Date.now()}`,
          name: excelData.cinemaName,
          location: excelData.location,
          address: excelData.address,
          rackComponents: convertExcelToRackComponents(mockExcelData),
          lastUpdated: new Date().toISOString().split('T')[0],
          upsWarnings: 0
        }
        setCinemas([...cinemas, newCinema])
      }

      alert('Excel data imported successfully!')
    } catch (error) {
      console.error('Error uploading Excel file:', error)
      alert('Error importing Excel data. Please try again.')
    }
  }

  if (selectedCinema) {
    return (
      <RackDashboard 
        cinema={selectedCinema} 
        onBack={handleBackToList}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <CinemaList 
          cinemas={cinemas}
          onSelectCinema={handleSelectCinema}
          onUploadExcel={handleUploadExcel}
        />
      </div>
    </div>
  )
}
