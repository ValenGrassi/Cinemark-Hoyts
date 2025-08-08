export interface UPSComponent {
  id: string
  name: string
  model: string
  capacity: string
  batteryInstallDate: string
  batteryLifespan: number // in months
  status: 'online' | 'offline' | 'warning' | 'maintenance'
  batteryHealth: number // percentage
  loadPercentage: number
  estimatedRuntime: number // in minutes
}

export interface RackComponent {
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
  }
  description?: string
  batteryInstallDate?: string
  batteryLifespan?: number
}

export interface Cinema {
  id: string
  name: string
  location: string
  address: string
  rackComponents: RackComponent[]
  lastUpdated: string
  upsWarnings: number
}
