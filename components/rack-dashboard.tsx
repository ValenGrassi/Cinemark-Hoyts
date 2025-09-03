"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Server, Network, Zap, Cpu, HardDrive, Thermometer, Battery, Clock, AlertTriangle } from 'lucide-react'
import { Cinema, RackComponent } from '../types/cinema'
import { calculateBatteryRemainingLife, getBatteryStatusColor, isBatteryDueForReplacement } from '../utils/battery-utils'
import { PortDetailsModal } from './port-details-modal'
import { PowerConsumptionCard } from './power-consumption-card'

interface RackDashboardProps {
  cinema: Cinema
  onBack: () => void
}

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

const getStatusText = (status: string) => {
  switch (status) {
    case 'online': return 'EN LÍNEA'
    case 'offline': return 'DESCONECTADO'
    case 'warning': return 'ADVERTENCIA'
    case 'maintenance': return 'MANTENIMIENTO'
    default: return status.toUpperCase()
  }
}

export function RackDashboard({ cinema, onBack }: RackDashboardProps) {
  const [selectedComponent, setSelectedComponent] = useState<RackComponent | null>(null)

  const handleComponentClick = (component: RackComponent) => {
    setSelectedComponent(component)
  }

  const getComponentIcon = (type: string) => {
    switch (type) {
      case 'server': return <Server className="h-6 w-6 text-blue-600" />
      case 'patch-panel': return <Network className="h-6 w-6 text-green-600" />
      case 'switch': return <Network className="h-6 w-6 text-green-600" />
      case 'router': return <Network className="h-6 w-6 text-blue-600" />
      case 'firewall': return <Network className="h-6 w-6 text-red-600" />
      case 'wireless-controller': return <Network className="h-6 w-6 text-purple-600" />
      case 'converter': return <Network className="h-6 w-6 text-orange-600" />
      case 'ups': return <Zap className="h-6 w-6 text-purple-600" />
      default: return <Server className="h-6 w-6 text-gray-600" />
    }
  }

  const getComponentTypeText = (type: string) => {
    switch (type) {
      case 'server': return 'SERVIDOR'
      case 'patch-panel': return 'PANEL DE CONEXIONES'
      case 'switch': return 'SWITCH'
      case 'router': return 'ROUTER'
      case 'firewall': return 'FIREWALL'
      case 'wireless-controller': return 'CONTROLADOR WIFI'
      case 'converter': return 'CONVERSOR'
      case 'ups': return 'UPS'
      default: return type.toUpperCase()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Encabezado */}
        <div className="mb-8 flex items-center gap-4">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2 cursor-pointer">
            <ArrowLeft className="h-4 w-4" />
            Volver a Ubicaciones
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{cinema.name}</h1>
            <p className="text-gray-600 mt-1">{cinema.address}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Panel de Información */}
          <div className="space-y-6">
            {selectedComponent ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getComponentIcon(selectedComponent.type)}
                      <div>
                        <CardTitle>{selectedComponent.name}</CardTitle>
                        <CardDescription>
                          Posición: U{selectedComponent.position}
                          {selectedComponent.model && ` • Modelo: ${selectedComponent.model}`}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant={getStatusBadgeVariant(selectedComponent.status)}>
                      {getStatusText(selectedComponent.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">{selectedComponent.description}</p>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedComponent.type === 'server' && selectedComponent.specs && (
                      <>
                        {selectedComponent.specs.cpu && (
                          <div className="flex items-center space-x-2">
                            <Cpu className="h-4 w-4 text-gray-500" />
                            <div>
                              <p className="text-sm font-medium">CPU</p>
                              <p className="text-xs text-gray-600">{selectedComponent.specs.cpu}</p>
                            </div>
                          </div>
                        )}
                        
                        {selectedComponent.specs.ram && (
                          <div className="flex items-center space-x-2">
                            <div className="h-4 w-4 bg-gray-500 rounded-sm" />
                            <div>
                              <p className="text-sm font-medium">RAM</p>
                              <p className="text-xs text-gray-600">{selectedComponent.specs.ram}</p>
                            </div>
                          </div>
                        )}
                        
                        {selectedComponent.specs.storage && (
                          <div className="flex items-center space-x-2">
                            <HardDrive className="h-4 w-4 text-gray-500" />
                            <div>
                              <p className="text-sm font-medium">Almacenamiento</p>
                              <p className="text-xs text-gray-600">{selectedComponent.specs.storage}</p>
                            </div>
                          </div>
                        )}
                        
                        {selectedComponent.specs.temperature !== undefined && (
                          <div className="flex items-center space-x-2">
                            <Thermometer className="h-4 w-4 text-gray-500" />
                            <div>
                              <p className="text-sm font-medium">Temperatura</p>
                              <p className="text-xs text-gray-600">{selectedComponent.specs.temperature}°C</p>
                            </div>
                          </div>
                        )}
                        
                        {selectedComponent.specs.powerUsage !== undefined && (
                          <div className="flex items-center space-x-2">
                            <Zap className="h-4 w-4 text-gray-500" />
                            <div>
                              <p className="text-sm font-medium">Consumo de Energía</p>
                              <p className="text-xs text-gray-600">{selectedComponent.specs.powerUsage}W</p>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                    
                    {(selectedComponent.type === 'patch-panel' || selectedComponent.type === 'switch' || 
                      selectedComponent.type === 'router' || selectedComponent.type === 'firewall' ||
                      selectedComponent.type === 'wireless-controller' || selectedComponent.type === 'converter') && 
                     selectedComponent.specs && (
                      <>
                        {selectedComponent.specs.ports && (
                          <div className="flex items-center space-x-2">
                            <Network className="h-4 w-4 text-gray-500" />
                            <div>
                              <p className="text-sm font-medium">Total de Puertos</p>
                              <p className="text-xs text-gray-600">{selectedComponent.specs.ports}</p>
                            </div>
                          </div>
                        )}
                        
                        {selectedComponent.specs.connections !== undefined && (
                          <div className="flex items-center space-x-2">
                            <div className="h-4 w-4 bg-green-500 rounded-full" />
                            <div>
                              <p className="text-sm font-medium">Conexiones Activas</p>
                              <p className="text-xs text-gray-600">{selectedComponent.specs.connections}</p>
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {selectedComponent.type === 'ups' && selectedComponent.specs && (
                      <>
                        {selectedComponent.capacityVA && (
                          <div className="flex items-center space-x-2">
                            <Zap className="h-4 w-4 text-gray-500" />
                            <div>
                              <p className="text-sm font-medium">Capacidad</p>
                              <p className="text-xs text-gray-600">{selectedComponent.capacityVA}VA</p>
                            </div>
                          </div>
                        )}
                        

                        {selectedComponent.loadPercentage !== undefined && (
                          <div className="flex items-center space-x-2">
                            <div className="h-4 w-4 bg-blue-500 rounded-sm" />
                            <div>
                              <p className="text-sm font-medium">Carga</p>
                              <p className="text-xs text-gray-600">{selectedComponent.loadPercentage}%</p>
                            </div>
                          </div>
                        )}

                        {selectedComponent.batteryInstallDate && (
                          <div className="col-span-2">
                            <Separator className="mb-3" />
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium">Información de Batería</h4>
                              <div className="grid grid-cols-2 gap-4 text-xs">
                                <div>
                                  <p className="text-gray-500">Fecha de Instalación</p>
                                  <p>{new Date(selectedComponent.batteryInstallDate).toLocaleDateString('es-ES')}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">Vida Útil Restante</p>
                                  <p className={`font-medium ${
                                    isBatteryDueForReplacement(selectedComponent.batteryInstallDate)
                                      ? 'text-red-600' : 'text-green-600'
                                  }`}>
                                    {calculateBatteryRemainingLife(selectedComponent.batteryInstallDate)} meses
                                  </p>
                                </div>
                              </div>
                              {isBatteryDueForReplacement(selectedComponent.batteryInstallDate) && (
                                <div className="flex items-center gap-2 p-2 bg-red-50 rounded-md">
                                  <AlertTriangle className="h-4 w-4 text-red-600" />
                                  <p className="text-sm text-red-800">Se recomienda reemplazar la batería</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {(selectedComponent.type === 'switch' || selectedComponent.type === 'patch-panel' || 
                      selectedComponent.type === 'router' || selectedComponent.type === 'firewall' ||
                      selectedComponent.type === 'wireless-controller' || selectedComponent.type === 'converter') && 
                     selectedComponent.specs?.portDetails && (
                      <div className="col-span-2">
                        <Separator className="mb-3" />
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium">Información de Puertos</h4>
                          <PortDetailsModal component={selectedComponent}>
                            <Button variant="outline" size="sm" className="cursor-pointer">
                              Ver Todos los Puertos
                            </Button>
                          </PortDetailsModal>
                        </div>
                        <div className="mt-2 text-xs text-gray-600">
                          <p>{selectedComponent.specs.ports} puertos totales</p>
                          <p>{selectedComponent.specs.connections} conexiones activas</p>
                          <p>{selectedComponent.specs.ports - selectedComponent.specs.connections} puertos libres</p>
                        </div>
                      </div>
                    )}

                    {selectedComponent.powerConsumption && (
                      <div className="col-span-2">
                        <Separator className="mb-3" />
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Consumo de Energía</h4>
                          <div className="grid grid-cols-3 gap-4 text-xs">
                            <div className="flex items-center space-x-2">
                              <Zap className="h-4 w-4 text-gray-600" />
                              <div>
                                <p className="text-gray-500">Total</p>
                                <p className="font-semibold text-blue-600">{selectedComponent.powerConsumption}W</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Seleccionar un Componente:</CardTitle>
                  <CardDescription>Haz clic en cualquier router, switch, patchera o UPS en el rack para ver sus detalles.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Server className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Ningún componente seleccionado</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Consumo y Autonomía Energética */}
            <PowerConsumptionCard cinema={cinema} />

            {/* Resumen de Estado */}
            <Card>
              <CardHeader>
                <CardTitle>Resumen de Estado del Rack</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {cinema.rackComponents.filter(c => c.status === 'online').length}
                    </div>
                    <div className="text-sm text-gray-600">En Línea</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {cinema.rackComponents.filter(c => c.status === 'offline').length}
                    </div>
                    <div className="text-sm text-gray-600">Desconectado</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {cinema.rackComponents.filter(c => c.status === 'warning').length}
                    </div>
                    <div className="text-sm text-gray-600">Advertencia</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {cinema.rackComponents.filter(c => c.type === 'ups').length}
                    </div>
                    <div className="text-sm text-gray-600">Unidades UPS</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Visualización del Rack de Servidores */}
          <div className="flex justify-center">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="text-center">Rack de Servidores - {cinema.location}</CardTitle>
              </CardHeader>
              <CardContent>
                <svg
                  width="100%"
                  height={Math.max(400, 120 + (cinema.rackComponents.length * 60))}
                  viewBox={`0 0 300 ${Math.max(400, 120 + (cinema.rackComponents.length * 55))}`}
                  className="border border-gray-300 rounded-lg bg-gray-100"
                >
                  {/* Marco del Rack */}
                  <rect
                    x="20"
                    y="20"
                    width="260"
                    height={Math.max(360, 80 + (cinema.rackComponents.length * 60))}
                    fill="none"
                    stroke="#374151"
                    strokeWidth="3"
                  />
                  
                  {/* Rieles del Rack */}
                  <rect x="30" y="30" width="10" height={Math.max(340, 60 + (cinema.rackComponents.length * 60))} fill="#6b7280" />
                  <rect x="260" y="30" width="10" height={Math.max(340, 60 + (cinema.rackComponents.length * 60))} fill="#6b7280" />
                  
                  {/* Componentes */}
                  {cinema.rackComponents.map((component, index) => {
                    const ports = component.specs?.ports || 0

                    // Calcular filas necesarias
                    const rows = Math.ceil(ports / 12)

                    // Altura dinámica según filas
                    const baseHeight = 50
                    const componentHeight = baseHeight + (rows - 1) * 10 // +10 por cada fila extra

                    // yPosition dinámico sumando alturas de componentes anteriores
                    const yPosition = 50 + cinema.rackComponents
                      .slice(0, index)
                      .reduce((acc, c) => {
                        const cRows = Math.ceil((c.specs?.ports || 0) / 12)
                        const cHeight = baseHeight + (cRows - 1) * 10
                        return acc + cHeight + 5 // +5 margen entre componentes
                      }, 0)

                    const isServer = component.type === 'server'
                    const isUPS = component.type === 'ups'
                    const isNetworkDevice = ['switch', 'router', 'firewall', 'wireless-controller', 'converter'].includes(component.type)
                    const isPatchPanel = component.type === 'patch-panel'

                    return (
                      <g key={component.id}>
                        {/* Cuerpo del Componente */}
                        <rect
                          x="50"
                          y={yPosition}
                          width="200"
                          height={componentHeight}
                          fill={
                            isServer ? '#1f2937' : 
                            isUPS ? '#581c87' : 
                            isNetworkDevice ? '#0f172a' :
                            '#374151'
                          }
                          stroke={getStatusColor(component.status)}
                          strokeWidth="2"
                          rx="4"
                          className="cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => handleComponentClick(component)}
                        />

                        
                        {/* LED de Estado */}
                        <circle
                          cx="70"
                          cy={yPosition + 15}
                          r="4"
                          fill={getStatusColor(component.status)}
                          className="cursor-pointer"
                          onClick={() => handleComponentClick(component)}
                        />
                        
                        {/* Etiqueta del Componente */}
                        <text
                          x="85"
                          y={yPosition + 20}
                          fill="white"
                          fontSize="9"
                          fontWeight="bold"
                          className="cursor-pointer pointer-events-none"
                        >
                          {component.name}
                        </text>
                        
                        {/* Etiqueta de Posición */}
                        <text
                          x="85"
                          y={yPosition + 35}
                          fill="#9ca3af"
                          fontSize="7"
                          className="pointer-events-none"
                        >
                          U{component.position} • {getComponentTypeText(component.type)}
                        </text>
                        
                        {/* Advertencia de Batería UPS */}
                        {isUPS && component.batteryInstallDate && component.batteryLifespan && 
                         isBatteryDueForReplacement(component.batteryInstallDate, component.batteryLifespan) && (
                          <circle
                            cx="230"
                            cy={yPosition + 15}
                            r="6"
                            fill="#f59e0b"
                            className="cursor-pointer animate-pulse"
                            onClick={() => handleComponentClick(component)}
                          />
                        )}
                                                
                        {/* Detalles de dispositivos de red (switches, routers, etc.) */}
                          {isNetworkDevice && (
                            <>
                              {Array.from({ length: component.specs?.ports || 0 }).map((_, portIndex) => {
                                const isConnected = portIndex < (component.specs?.connections || 0)

                                const maxPerRow = 12
                                const spacingX = 12
                                const spacingY = 10

                                const row = Math.floor(portIndex / maxPerRow)
                                const col = portIndex % maxPerRow

                                const cx = 87 + col * spacingX
                                const cy = yPosition + 42 + row * spacingY

                                return (
                                  <circle
                                    key={portIndex}
                                    cx={cx}
                                    cy={cy}
                                    r="2"
                                    fill={isConnected ? '#22c55e' : '#6b7280'}
                                    className="cursor-pointer"
                                    onClick={() => handleComponentClick(component)}
                                  />
                                )
                              })}
                            </>
                          )}
                        
                        {/* Detalles específicos del Panel de Conexiones */}
                        {isPatchPanel && (
                      <>
                        {/* Indicadores de puerto pequeños debajo del texto */}
                        {Array.from({ length: component.specs?.ports || 24 }).map((_, portIndex) => {
                          const isConnected = portIndex < (component.specs?.connections || 0)

                          const maxPerRow = 12
                          const spacingX = 12
                          const spacingY = 8

                          const row = Math.floor(portIndex / maxPerRow)
                          const col = portIndex % maxPerRow

                          const x = 85 + col * spacingX
                          const y = yPosition + 40 + row * spacingY // ajusta vertical por fila

                          return (
                            <rect
                              key={portIndex}
                              x={x}
                              y={y}
                              width="4"
                              height="4"
                              fill={isConnected ? '#22c55e' : '#6b7280'}
                              rx="1"
                              className="cursor-pointer"
                              onClick={() => handleComponentClick(component)}
                            />
                          )
                        })}
                      </>
                    )}
                      </g>
                    )
                  })}
                  
                  {/* Marcadores de Unidad de Rack */}
                  {Array.from({ length: cinema.rackComponents.length }).map((_, index) => (
                    <text
                      key={index}
                      x="35"
                      y={65 + (index * 55)}
                      fill="#6b7280"
                      fontSize="8"
                      textAnchor="middle"
                    >
                      {index + 1}
                    </text>
                  ))}
                </svg>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
