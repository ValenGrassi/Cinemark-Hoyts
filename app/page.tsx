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
    name: 'Servidor Web 01',
    status: 'online',
    position: 1,
    specs: {
      cpu: 'Intel Xeon E5-2680 v4',
      ram: '64GB DDR4',
      storage: '2TB NVMe SSD',
      temperature: 42,
      powerUsage: 180
    },
    description: 'Servidor principal de aplicaciones web que maneja solicitudes frontend'
  },
  {
    id: 'server-2',
    type: 'server',
    name: 'Servidor de Base de Datos',
    status: 'online',
    position: 2,
    specs: {
      cpu: 'AMD EPYC 7542',
      ram: '128GB DDR4',
      storage: '4TB NVMe SSD',
      temperature: 38,
      powerUsage: 220
    },
    description: 'Servidor de base de datos PostgreSQL con configuración de alta disponibilidad'
  },
  {
    id: 'patch-1',
    type: 'patch-panel',
    name: 'Panel de Conexiones de Red A',
    status: 'online',
    position: 3,
    specs: {
      ports: 48,
      connections: 42
    },
    description: 'Panel de conexiones Cat6A de 48 puertos para conectividad de red'
  },
  {
    id: 'server-3',
    type: 'server',
    name: 'Servidor de Respaldo',
    status: 'warning',
    position: 4,
    specs: {
      cpu: 'Intel Xeon Silver 4214',
      ram: '32GB DDR4',
      storage: '8TB HDD RAID',
      temperature: 55,
      powerUsage: 150
    },
    description: 'Servidor de respaldo y recuperación ante desastres - advertencia de temperatura'
  },
  {
    id: 'server-4',
    type: 'server',
    name: 'Balanceador de Carga',
    status: 'online',
    position: 5,
    specs: {
      cpu: 'Intel Core i7-10700K',
      ram: '16GB DDR4',
      storage: '512GB NVMe SSD',
      temperature: 35,
      powerUsage: 95
    },
    description: 'Balanceador de carga HAProxy que distribuye tráfico entre servidores web'
  },
  {
    id: 'patch-2',
    type: 'patch-panel',
    name: 'Panel de Conexiones de Red B',
    status: 'maintenance',
    position: 6,
    specs: {
      ports: 24,
      connections: 18
    },
    description: 'Panel de conexiones de fibra óptica de 24 puertos - mantenimiento programado'
  },
  {
    id: 'server-5',
    type: 'server',
    name: 'Servidor de Monitoreo',
    status: 'offline',
    position: 7,
    specs: {
      cpu: 'AMD Ryzen 7 3700X',
      ram: '32GB DDR4',
      storage: '1TB NVMe SSD',
      temperature: 0,
      powerUsage: 0
    },
    description: 'Servidor de monitoreo y alertas del sistema - actualmente desconectado'
  },
  {
    id: 'ups-1',
    type: 'ups',
    name: 'UPS Principal',
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
    description: 'UPS principal para respaldo de energía'
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
      // En una aplicación real, aquí analizarías el archivo Excel
      // Por ahora, simularemos el proceso
      console.log('Cargando archivo Excel:', file.name)
      
      // Simular análisis de Excel
      const mockExcelData = [
        {
          cinemaName: 'Nueva Ubicación de Cine',
          location: 'Villa Ballester',
          address: 'Av. San Martín 1234, Villa Ballester',
          type: 'server',
          name: 'Servidor de Proyección',
          status: 'online',
          position: 1,
          cpu: 'Intel Xeon E5-2680',
          ram: '32GB DDR4',
          storage: '2TB SSD'
        },
        {
          type: 'ups',
          name: 'UPS Principal',
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
        // Actualizar cine existente
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
        // Crear nuevo cine
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

      alert('¡Datos de Excel importados exitosamente!')
    } catch (error) {
      console.error('Error al cargar archivo Excel:', error)
      alert('Error al importar datos de Excel. Por favor, inténtalo de nuevo.')
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
