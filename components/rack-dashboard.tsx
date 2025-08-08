"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Server, Network, Zap, Cpu, HardDrive, Thermometer, Battery, Clock, AlertTriangle } from 'lucide-react'
import { Cinema, RackComponent } from '../types/cinema'
import { calculateBatteryRemainingLife, getBatteryStatusColor, isBatteryDueForReplacement } from '../utils/battery-utils'

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

export function RackDashboard({ cinema, onBack }: RackDashboardProps) {
  const [selectedComponent, setSelectedComponent] = useState<RackComponent | null>(null)

  const handleComponentClick = (component: RackComponent) => {
    setSelectedComponent(component)
  }

  const getComponentIcon = (type: string) => {
    switch (type) {
      case 'server': return <Server className="h-6 w-6 text-blue-600" />
      case 'patch-panel': return <Network className="h-6 w-6 text-green-600" />
      case 'ups': return <Zap className="h-6 w-6 text-purple-600" />
      default: return <Server className="h-6 w-6 text-gray-600" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Locations
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{cinema.name}</h1>
            <p className="text-gray-600 mt-1">{cinema.address}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Information Panel */}
          <div className="space-y-6">
            {selectedComponent ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getComponentIcon(selectedComponent.type)}
                      <div>
                        <CardTitle>{selectedComponent.name}</CardTitle>
                        <CardDescription>Position: U{selectedComponent.position}</CardDescription>
                      </div>
                    </div>
                    <Badge variant={getStatusBadgeVariant(selectedComponent.status)}>
                      {selectedComponent.status.toUpperCase()}
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
                              <p className="text-sm font-medium">Storage</p>
                              <p className="text-xs text-gray-600">{selectedComponent.specs.storage}</p>
                            </div>
                          </div>
                        )}
                        
                        {selectedComponent.specs.temperature !== undefined && (
                          <div className="flex items-center space-x-2">
                            <Thermometer className="h-4 w-4 text-gray-500" />
                            <div>
                              <p className="text-sm font-medium">Temperature</p>
                              <p className="text-xs text-gray-600">{selectedComponent.specs.temperature}°C</p>
                            </div>
                          </div>
                        )}
                        
                        {selectedComponent.specs.powerUsage !== undefined && (
                          <div className="flex items-center space-x-2">
                            <Zap className="h-4 w-4 text-gray-500" />
                            <div>
                              <p className="text-sm font-medium">Power Usage</p>
                              <p className="text-xs text-gray-600">{selectedComponent.specs.powerUsage}W</p>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                    
                    {selectedComponent.type === 'patch-panel' && selectedComponent.specs && (
                      <>
                        {selectedComponent.specs.ports && (
                          <div className="flex items-center space-x-2">
                            <Network className="h-4 w-4 text-gray-500" />
                            <div>
                              <p className="text-sm font-medium">Total Ports</p>
                              <p className="text-xs text-gray-600">{selectedComponent.specs.ports}</p>
                            </div>
                          </div>
                        )}
                        
                        {selectedComponent.specs.connections !== undefined && (
                          <div className="flex items-center space-x-2">
                            <div className="h-4 w-4 bg-green-500 rounded-full" />
                            <div>
                              <p className="text-sm font-medium">Active Connections</p>
                              <p className="text-xs text-gray-600">{selectedComponent.specs.connections}</p>
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {selectedComponent.type === 'ups' && selectedComponent.specs && (
                      <>
                        {selectedComponent.specs.capacity && (
                          <div className="flex items-center space-x-2">
                            <Zap className="h-4 w-4 text-gray-500" />
                            <div>
                              <p className="text-sm font-medium">Capacity</p>
                              <p className="text-xs text-gray-600">{selectedComponent.specs.capacity}</p>
                            </div>
                          </div>
                        )}
                        
                        {selectedComponent.specs.batteryHealth !== undefined && (
                          <div className="flex items-center space-x-2">
                            <Battery className="h-4 w-4 text-gray-500" />
                            <div>
                              <p className="text-sm font-medium">Battery Health</p>
                              <p className="text-xs text-gray-600">{selectedComponent.specs.batteryHealth}%</p>
                            </div>
                          </div>
                        )}

                        {selectedComponent.specs.loadPercentage !== undefined && (
                          <div className="flex items-center space-x-2">
                            <div className="h-4 w-4 bg-blue-500 rounded-sm" />
                            <div>
                              <p className="text-sm font-medium">Load</p>
                              <p className="text-xs text-gray-600">{selectedComponent.specs.loadPercentage}%</p>
                            </div>
                          </div>
                        )}

                        {selectedComponent.specs.estimatedRuntime !== undefined && (
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <div>
                              <p className="text-sm font-medium">Runtime</p>
                              <p className="text-xs text-gray-600">{selectedComponent.specs.estimatedRuntime} min</p>
                            </div>
                          </div>
                        )}

                        {selectedComponent.batteryInstallDate && selectedComponent.batteryLifespan && (
                          <div className="col-span-2">
                            <Separator className="mb-3" />
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium">Battery Information</h4>
                              <div className="grid grid-cols-2 gap-4 text-xs">
                                <div>
                                  <p className="text-gray-500">Install Date</p>
                                  <p>{new Date(selectedComponent.batteryInstallDate).toLocaleDateString()}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">Remaining Life</p>
                                  <p className={`font-medium ${
                                    isBatteryDueForReplacement(selectedComponent.batteryInstallDate, selectedComponent.batteryLifespan)
                                      ? 'text-red-600' : 'text-green-600'
                                  }`}>
                                    {calculateBatteryRemainingLife(selectedComponent.batteryInstallDate, selectedComponent.batteryLifespan)} months
                                  </p>
                                </div>
                              </div>
                              {isBatteryDueForReplacement(selectedComponent.batteryInstallDate, selectedComponent.batteryLifespan) && (
                                <div className="flex items-center gap-2 p-2 bg-red-50 rounded-md">
                                  <AlertTriangle className="h-4 w-4 text-red-600" />
                                  <p className="text-sm text-red-800">Battery replacement recommended</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Select a Component</CardTitle>
                  <CardDescription>Click on any server, patch panel, or UPS in the rack to view its details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Server className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No component selected</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Status Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Rack Status Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {cinema.rackComponents.filter(c => c.status === 'online').length}
                    </div>
                    <div className="text-sm text-gray-600">Online</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {cinema.rackComponents.filter(c => c.status === 'offline').length}
                    </div>
                    <div className="text-sm text-gray-600">Offline</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {cinema.rackComponents.filter(c => c.status === 'warning').length}
                    </div>
                    <div className="text-sm text-gray-600">Warning</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {cinema.rackComponents.filter(c => c.type === 'ups').length}
                    </div>
                    <div className="text-sm text-gray-600">UPS Units</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Server Rack Visualization */}
          <div className="flex justify-center">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="text-center">Server Rack - {cinema.location}</CardTitle>
              </CardHeader>
              <CardContent>
                <svg
                  width="100%"
                  height="600"
                  viewBox="0 0 300 600"
                  className="border border-gray-300 rounded-lg bg-gray-100"
                >
                  {/* Rack Frame */}
                  <rect
                    x="20"
                    y="20"
                    width="260"
                    height="560"
                    fill="none"
                    stroke="#374151"
                    strokeWidth="3"
                  />
                  
                  {/* Rack Rails */}
                  <rect x="30" y="30" width="10" height="540" fill="#6b7280" />
                  <rect x="260" y="30" width="10" height="540" fill="#6b7280" />
                  
                  {/* Components */}
                  {cinema.rackComponents.map((component, index) => {
                    const yPosition = 50 + (index * 70)
                    const isServer = component.type === 'server'
                    const isUPS = component.type === 'ups'
                    
                    return (
                      <g key={component.id}>
                        {/* Component Body */}
                        <rect
                          x="50"
                          y={yPosition}
                          width="200"
                          height="50"
                          fill={isServer ? '#1f2937' : isUPS ? '#581c87' : '#374151'}
                          stroke={getStatusColor(component.status)}
                          strokeWidth="2"
                          rx="4"
                          className="cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => handleComponentClick(component)}
                        />
                        
                        {/* Status LED */}
                        <circle
                          cx="70"
                          cy={yPosition + 15}
                          r="4"
                          fill={getStatusColor(component.status)}
                          className="cursor-pointer"
                          onClick={() => handleComponentClick(component)}
                        />
                        
                        {/* Component Label */}
                        <text
                          x="85"
                          y={yPosition + 20}
                          fill="white"
                          fontSize="10"
                          fontWeight="bold"
                          className="cursor-pointer pointer-events-none"
                        >
                          {component.name}
                        </text>
                        
                        {/* Position Label */}
                        <text
                          x="85"
                          y={yPosition + 35}
                          fill="#9ca3af"
                          fontSize="8"
                          className="pointer-events-none"
                        >
                          U{component.position} • {component.type.replace('-', ' ').toUpperCase()}
                        </text>
                        
                        {/* UPS Battery Warning */}
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
                        
                        {/* Server specific details */}
                        {isServer && (
                          <>
                            {/* Power Button */}
                            <rect
                              x="220"
                              y={yPosition + 10}
                              width="15"
                              height="8"
                              fill={component.status === 'online' ? '#22c55e' : '#ef4444'}
                              rx="2"
                              className="cursor-pointer"
                              onClick={() => handleComponentClick(component)}
                            />
                            
                            {/* Drive Bays */}
                            <rect x="200" y={yPosition + 25} width="8" height="4" fill="#4b5563" rx="1" />
                            <rect x="210" y={yPosition + 25} width="8" height="4" fill="#4b5563" rx="1" />
                          </>
                        )}
                        
                        {/* UPS specific details */}
                        {isUPS && (
                          <>
                            {/* Battery indicator */}
                            <rect
                              x="220"
                              y={yPosition + 25}
                              width="15"
                              height="8"
                              fill={component.batteryInstallDate && component.batteryLifespan 
                                ? getBatteryStatusColor(component.batteryInstallDate, component.batteryLifespan)
                                : '#6b7280'}
                              rx="2"
                              className="cursor-pointer"
                              onClick={() => handleComponentClick(component)}
                            />
                            
                            {/* Load indicator */}
                            <rect
                              x="200"
                              y={yPosition + 25}
                              width={Math.max(2, (component.specs?.loadPercentage || 0) * 0.15)}
                              height="4"
                              fill="#3b82f6"
                              rx="1"
                            />
                          </>
                        )}
                        
                        {/* Patch Panel specific details */}
                        {!isServer && !isUPS && (
                          <>
                            {/* Port indicators */}
                            {Array.from({ length: 8 }).map((_, portIndex) => (
                              <circle
                                key={portIndex}
                                cx={90 + (portIndex * 15)}
                                cy={yPosition + 35}
                                r="2"
                                fill={portIndex < (component.specs?.connections || 0) / 6 ? '#22c55e' : '#6b7280'}
                              />
                            ))}
                          </>
                        )}
                      </g>
                    )
                  })}
                  
                  {/* Rack Unit Markers */}
                  {Array.from({ length: 8 }).map((_, index) => (
                    <text
                      key={index}
                      x="35"
                      y={65 + (index * 70)}
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
