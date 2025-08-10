export interface PortConnection {
  portNumber: number
  isConnected: boolean
  connectedTo?: string
  description?: string
  vlan?: string
  status: 'active' | 'inactive' | 'error'
}

export interface UPSComponent {
  id: string
  name: string
  model: string
  capacity: string
  capacityVA: number
  batteryInstallDate: string
  batteryLifespan: number // en meses
  status: 'online' | 'offline' | 'warning' | 'maintenance'
  batteryHealth: number // porcentaje
  loadPercentage: number
  estimatedRuntime: number // en minutos
  estimatedAutonomyHours: number // horas de autonomía estimada
}

export interface RackComponent {
  id: string
  type: 'server' | 'patch-panel' | 'ups' | 'switch' | 'router' | 'firewall' | 'wireless-controller' | 'converter'
  name: string
  model?: string
  status: 'online' | 'offline' | 'warning' | 'maintenance'
  position: number
  powerConsumption: {
    min: number
    max: number
    current: number
  }
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
    portDetails?: PortConnection[]
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
  totalPowerConsumption: number
  upsAutonomyHours: number
  upsCapacityVA: number
}
