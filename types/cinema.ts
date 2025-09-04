export interface PortConnection {
  portNumber: number
  isConnected: boolean
  connectedTo?: string
  description?: string
}

export interface RackComponent {
  id: string
  type: "server" | "patch-panel" | "ups" | "switch" | "router" | "firewall" | "wireless-controller" | "converter"
  name: string
  model?: string
  status: "online" | "offline" | "warning" | "maintenance"
  position: number
  powerConsumption?: number
  specs?: {
    cpu?: string
    ram?: string
    storage?: string
    ports?: number
    connections?: number
    portDetails?: PortConnection[]
  }
  loadPercentage?: number
  description?: string
  batteryInstallDate?: string
  capacityVA?: number
}

export interface Cinema {
  id: string
  name: string
  location: string
  address: string
  rackComponents: RackComponent[]
  lastUpdated: string
  generator: boolean
}
