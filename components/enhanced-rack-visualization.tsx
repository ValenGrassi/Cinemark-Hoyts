"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Cinema, RackComponent } from '../types/cinema'
import { calculateBatteryRemainingLife, getBatteryStatusColor, isBatteryDueForReplacement } from '../utils/battery-utils'
import { calculateTotalPowerConsumption, calculateUPSAutonomy } from "@/utils/power-calculations"

interface EnhancedRackVisualizationProps {
  cinema: Cinema
  onComponentClick: (component: RackComponent) => void
  selectedComponent: RackComponent | null
}

export function EnhancedRackVisualization({ cinema, onComponentClick, selectedComponent }: EnhancedRackVisualizationProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return '#22c55e'
      case 'offline': return '#ef4444'
      case 'warning': return '#f59e0b'
      case 'maintenance': return '#3b82f6'
      default: return '#6b7280'
    }
  }

  const getComponentColor = (type: string) => {
    switch (type) {
      case 'server': return '#1e293b'
      case 'switch': return '#0f172a'
      case 'router': return '#1e40af'
      case 'firewall': return '#dc2626'
      case 'wireless-controller': return '#7c3aed'
      case 'ups': return '#581c87'
      case 'patch-panel': return '#374151'
      case 'converter': return '#ea580c'
      default: return '#374151'
    }
  }

  const renderServerDetails = (component: RackComponent, yPos: number) => (
    <g>
      {/* Server front panel */}
      <rect x="52" y={yPos + 2} width="196" height="46" fill="#2d3748" rx="2" />
      
      {/* Power button */}
      <circle
        cx="70"
        cy={yPos + 15}
        r="5"
        fill={component.status === 'online' ? '#22c55e' : '#ef4444'}
        stroke="#ffffff"
        strokeWidth="1"
        className="cursor-pointer"
        onClick={() => onComponentClick(component)}
      />
      
      {/* Status LEDs */}
      <rect x="85" y={yPos + 12} width="3" height="6" fill="#22c55e" rx="1" />
      <rect x="90" y={yPos + 12} width="3" height="6" fill="#22c55e" rx="1" />
      <rect x="95" y={yPos + 12} width="3" height="6" fill={component.status === 'warning' ? '#f59e0b' : '#22c55e'} rx="1" />
      
      {/* Drive bays */}
      {Array.from({ length: 4 }).map((_, i) => (
        <rect
          key={i}
          x={110 + (i * 20)}
          y={yPos + 8}
          width="15"
          height="8"
          fill="#4a5568"
          stroke="#2d3748"
          strokeWidth="1"
          rx="1"
        />
      ))}
      
      {/* Network ports */}
      <rect x="200" y={yPos + 8} width="25" height="8" fill="#2d3748" stroke="#4a5568" strokeWidth="1" rx="1" />
      <rect x="202" y={yPos + 10} width="4" height="4" fill="#22c55e" rx="1" />
      <rect x="208" y={yPos + 10} width="4" height="4" fill="#22c55e" rx="1" />
      
      {/* Ventilation grilles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <line
          key={i}
          x1={60 + (i * 4)}
          y1={yPos + 25}
          x2={60 + (i * 4)}
          y2={yPos + 40}
          stroke="#4a5568"
          strokeWidth="1"
        />
      ))}
      
      {/* Temperature indicator */}
      {component.specs?.temperature && (
        <g>
          <rect x="230" y={yPos + 25} width="15" height="6" fill="#2d3748" rx="1" />
          <text x="237" y={yPos + 30} fill="#ffffff" fontSize="6" textAnchor="middle">
            {component.specs.temperature}°
          </text>
        </g>
      )}
    </g>
  )

  const renderSwitchDetails = (component: RackComponent, yPos: number) => {
    const portCount = component.specs?.ports || 24
    const connectedPorts = component.specs?.connections || 0
    const portsPerRow = Math.min(portCount, 24)
    const rows = Math.ceil(portCount / portsPerRow)
    
    return (
      <g>
        {/* Switch front panel */}
        <rect x="52" y={yPos + 2} width="196" height="46" fill="#0f172a" rx="2" />
        
        {/* Brand label area */}
        <rect x="55" y={yPos + 5} width="40" height="8" fill="#1e293b" rx="1" />
        <text x="75" y={yPos + 11} fill="#64748b" fontSize="6" textAnchor="middle">CISCO</text>
        
        {/* Status LEDs */}
        <circle cx="105" cy={yPos + 9} r="2" fill="#22c55e" />
        <circle cx="112" cy={yPos + 9} r="2" fill="#22c55e" />
        <circle cx="119" cy={yPos + 9} r="2" fill={component.status === 'warning' ? '#f59e0b' : '#22c55e'} />
        
        {/* Port visualization */}
        {Array.from({ length: Math.min(portCount, 24) }).map((_, i) => {
          const isConnected = i < connectedPorts
          const portX = 60 + (i * 7)
          const portY = yPos + 20
          
          return (
            <TooltipProvider key={i}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <g className="cursor-pointer" onClick={() => onComponentClick(component)}>
                    <rect
                      x={portX}
                      y={portY}
                      width="5"
                      height="8"
                      fill={isConnected ? '#22c55e' : '#374151'}
                      stroke="#1e293b"
                      strokeWidth="0.5"
                      rx="1"
                    />
                    {isConnected && (
                      <circle cx={portX + 2.5} cy={portY + 4} r="1" fill="#10b981" />
                    )}
                  </g>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Puerto {i + 1}: {isConnected ? 'Conectado' : 'Libre'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        })}
        
        {/* Uplink ports */}
        <rect x="220" y={yPos + 18} width="8" height="12" fill="#1e40af" stroke="#1e293b" strokeWidth="1" rx="1" />
        <rect x="230" y={yPos + 18} width="8" height="12" fill="#1e40af" stroke="#1e293b" strokeWidth="1" rx="1" />
        
        {/* Power consumption indicator */}
        <rect x="55" y={yPos + 35} width="30" height="4" fill="#1e293b" rx="1" />
        <rect 
          x="55" 
          y={yPos + 35} 
          width={component.powerConsumption} 
          height="4" 
          fill="#3b82f6" 
          rx="1" 
        />
      </g>
    )
  }

  const renderRouterDetails = (component: RackComponent, yPos: number) => (
    <g>
      {/* Router front panel */}
      <rect x="52" y={yPos + 2} width="196" height="46" fill="#1e40af" rx="2" />
      
      {/* Brand area */}
      <rect x="55" y={yPos + 5} width="50" height="10" fill="#1e3a8a" rx="1" />
      <text x="80" y={yPos + 12} fill="#93c5fd" fontSize="7" textAnchor="middle">ROUTER</text>
      
      {/* Status indicators */}
      <circle cx="115" cy={yPos + 10} r="3" fill="#22c55e" />
      <text x="125" y={yPos + 13} fill="#ffffff" fontSize="6">PWR</text>
      
      <circle cx="145" cy={yPos + 10} r="3" fill="#22c55e" />
      <text x="155" y={yPos + 13} fill="#ffffff" fontSize="6">SYS</text>
      
      {/* WAN/LAN ports */}
      <rect x="60" y={yPos + 20} width="12" height="10" fill="#dc2626" stroke="#1e3a8a" strokeWidth="1" rx="1" />
      <text x="66" y={yPos + 27} fill="#ffffff" fontSize="5" textAnchor="middle">WAN</text>
      
      {/* LAN ports */}
      {Array.from({ length: 4 }).map((_, i) => (
        <rect
          key={i}
          x={80 + (i * 15)}
          y={yPos + 20}
          width="12"
          height="10"
          fill={i < (component.specs?.connections || 0) ? '#22c55e' : '#374151'}
          stroke="#1e3a8a"
          strokeWidth="1"
          rx="1"
        />
      ))}
      
      {/* Console port */}
      <rect x="220" y={yPos + 20} width="15" height="8" fill="#6b7280" stroke="#1e3a8a" strokeWidth="1" rx="1" />
      <text x="227" y={yPos + 26} fill="#ffffff" fontSize="4" textAnchor="middle">CON</text>
      
      {/* Antenna indicators for wireless */}
      {component.name.toLowerCase().includes('wireless') && (
        <g>
          <path d={`M 200 ${yPos + 8} Q 205 ${yPos + 5} 210 ${yPos + 8}`} stroke="#22c55e" strokeWidth="2" fill="none" />
          <path d={`M 198 ${yPos + 10} Q 205 ${yPos + 5} 212 ${yPos + 10}`} stroke="#22c55e" strokeWidth="1" fill="none" />
        </g>
      )}
    </g>
  )

  const renderFirewallDetails = (component: RackComponent, yPos: number) => (
    <g>
      {/* Firewall front panel */}
      <rect x="52" y={yPos + 2} width="196" height="46" fill="#dc2626" rx="2" />
      
      {/* Brand area */}
      <rect x="55" y={yPos + 5} width="60" height="10" fill="#b91c1c" rx="1" />
      <text x="85" y={yPos + 12} fill="#fecaca" fontSize="7" textAnchor="middle">FIREWALL</text>
      
      {/* Security status LEDs */}
      <circle cx="125" cy={yPos + 10} r="3" fill="#22c55e" />
      <text x="135" y={yPos + 13} fill="#ffffff" fontSize="5">SEC</text>
      
      <circle cx="155" cy={yPos + 10} r="3" fill="#22c55e" />
      <text x="165" y={yPos + 13} fill="#ffffff" fontSize="5">VPN</text>
      
      {/* Interface ports */}
      <rect x="60" y={yPos + 20} width="15" height="10" fill="#7f1d1d" stroke="#b91c1c" strokeWidth="1" rx="1" />
      <text x="67" y={yPos + 27} fill="#ffffff" fontSize="5" textAnchor="middle">WAN</text>
      
      <rect x="80" y={yPos + 20} width="15" height="10" fill="#22c55e" stroke="#b91c1c" strokeWidth="1" rx="1" />
      <text x="87" y={yPos + 27} fill="#ffffff" fontSize="5" textAnchor="middle">LAN</text>
      
      <rect x="100" y={yPos + 20} width="15" height="10" fill="#f59e0b" stroke="#b91c1c" strokeWidth="1" rx="1" />
      <text x="107" y={yPos + 27} fill="#ffffff" fontSize="5" textAnchor="middle">DMZ</text>
      
      {/* Management port */}
      <rect x="220" y={yPos + 20} width="15" height="8" fill="#6b7280" stroke="#b91c1c" strokeWidth="1" rx="1" />
      <text x="227" y={yPos + 26} fill="#ffffff" fontSize="4" textAnchor="middle">MGT</text>
      
      {/* Threat indicator */}
      <rect x="180" y={yPos + 8} width="25" height="6" fill="#7f1d1d" rx="1" />
      <text x="192" y={yPos + 13} fill="#22c55e" fontSize="5" textAnchor="middle">SECURE</text>
    </g>
  )

  const renderUPSDetails = (component: RackComponent, yPos: number) => {
    const batteryHealth = component.specs?.batteryHealth || 0
    const loadPercentage = component.specs?.loadPercentage || 0
    
    return (
      <g>
        {/* UPS front panel */}
        <rect x="52" y={yPos + 2} width="196" height="46" fill="#581c87" rx="2" />
        
        {/* Brand area */}
        <rect x="55" y={yPos + 5} width="40" height="10" fill="#4c1d95" rx="1" />
        <text x="75" y={yPos + 12} fill="#c4b5fd" fontSize="7" textAnchor="middle">UPS</text>
        
        {/* Status display */}
        <rect x="105" y={yPos + 6} width="60" height="12" fill="#1f2937" stroke="#4c1d95" strokeWidth="1" rx="1" />
        <text x="135" y={yPos + 14} fill="#22c55e" fontSize="6" textAnchor="middle">
          {component.status === 'online' ? 'ONLINE' : 'OFFLINE'}
        </text>
        
        {/* Battery indicator */}
        <rect x="60" y={yPos + 22} width="30" height="8" fill="#4c1d95" stroke="#581c87" strokeWidth="1" rx="1" />
        <rect 
          x="62" 
          y={yPos + 24} 
          width={26 * (batteryHealth / 100)} 
          height="4" 
          fill={batteryHealth > 70 ? '#22c55e' : batteryHealth > 40 ? '#f59e0b' : '#ef4444'} 
          rx="1" 
        />
        <text x="75" y={yPos + 38} fill="#c4b5fd" fontSize="5" textAnchor="middle">{batteryHealth}%</text>
        
        {/* Load indicator */}
        <rect x="100" y={yPos + 22} width="30" height="8" fill="#4c1d95" stroke="#581c87" strokeWidth="1" rx="1" />
        <rect 
          x="102" 
          y={yPos + 24} 
          width={26 * (loadPercentage / 100)} 
          height="4" 
          fill={loadPercentage > 80 ? '#ef4444' : loadPercentage > 60 ? '#f59e0b' : '#22c55e'} 
          rx="1" 
        />
        <text x="115" y={yPos + 38} fill="#c4b5fd" fontSize="5" textAnchor="middle">{loadPercentage}%</text>
        
        {/* Output sockets */}
        {Array.from({ length: 4 }).map((_, i) => (
          <rect
            key={i}
            x={150 + (i * 12)}
            y={yPos + 22}
            width="8"
            height="8"
            fill="#1f2937"
            stroke="#4c1d95"
            strokeWidth="1"
            rx="1"
          />
        ))}
        
        {/* Runtime display */}
        <rect x="210" y={yPos + 22} width="25" height="8" fill="#1f2937" stroke="#4c1d95" strokeWidth="1" rx="1" />
        <text x="222" y={yPos + 28} fill="#22c55e" fontSize="5" textAnchor="middle">
          {component.specs?.estimatedRuntime || 0}m
        </text>
        
        {/* Battery warning */}
        {component.batteryInstallDate && component.batteryLifespan && 
         isBatteryDueForReplacement(component.batteryInstallDate, component.batteryLifespan) && (
          <g>
            <circle cx="240" cy={yPos + 15} r="6" fill="#f59e0b" className="animate-pulse" />
            <text x="240" y={yPos + 18} fill="#ffffff" fontSize="8" textAnchor="middle">!</text>
          </g>
        )}
      </g>
    )
  }

  const renderPatchPanelDetails = (component: RackComponent, yPos: number) => {
    const portCount = component.specs?.ports || 24
    const connectedPorts = component.specs?.connections || 0
    
    return (
      <g>
        {/* Patch panel front */}
        <rect x="52" y={yPos + 2} width="196" height="46" fill="#374151" rx="2" />
        
        {/* Label area */}
        <rect x="55" y={yPos + 5} width="50" height="8" fill="#4b5563" rx="1" />
        <text x="80" y={yPos + 11} fill="#d1d5db" fontSize="6" textAnchor="middle">PATCH PANEL</text>
        
        {/* Port grid */}
        {Array.from({ length: portCount }).map((_, i) => {
          const isConnected = i < connectedPorts
          const row = Math.floor(i / 12)
          const col = i % 12
          const portX = 60 + (col * 14)
          const portY = yPos + 18 + (row * 12)
          
          return (
            <TooltipProvider key={i}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <g className="cursor-pointer" onClick={() => onComponentClick(component)}>
                    <rect
                      x={portX}
                      y={portY}
                      width="10"
                      height="8"
                      fill={isConnected ? '#22c55e' : '#6b7280'}
                      stroke="#374151"
                      strokeWidth="1"
                      rx="1"
                    />
                    <rect
                      x={portX + 2}
                      y={portY + 2}
                      width="6"
                      height="4"
                      fill="#1f2937"
                      rx="1"
                    />
                    {isConnected && (
                      <circle cx={portX + 5} cy={portY + 4} r="1.5" fill="#10b981" />
                    )}
                    <text x={portX + 5} y={portY - 2} fill="#9ca3af" fontSize="4" textAnchor="middle">
                      {i + 1}
                    </text>
                  </g>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Puerto {i + 1}: {isConnected ? 'Conectado' : 'Libre'}</p>
                  {component.specs?.portDetails?.[i]?.connectedTo && (
                    <p>→ {component.specs.portDetails[i].connectedTo}</p>
                  )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        })}
      </g>
    )
  }

  const renderComponent = (component: RackComponent, index: number) => {
    const yPosition = 50 + (index * 55) // Reduced spacing for better fit
    const isSelected = selectedComponent?.id === component.id
    
    return (
      <g key={component.id}>
        {/* Selection highlight */}
        {isSelected && (
          <rect
            x="48"
            y={yPosition - 2}
            width="204"
            height="54"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            rx="4"
            className="animate-pulse"
          />
        )}
        
        {/* Component background */}
        <rect
          x="50"
          y={yPosition}
          width="200"
          height="50"
          fill={getComponentColor(component.type)}
          stroke={getStatusColor(component.status)}
          strokeWidth="2"
          rx="4"
          className="cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => onComponentClick(component)}
        />
        
        {/* Component-specific details */}
        {component.type === 'server' && renderServerDetails(component, yPosition)}
        {(component.type === 'switch') && renderSwitchDetails(component, yPosition)}
        {component.type === 'router' && renderRouterDetails(component, yPosition)}
        {component.type === 'firewall' && renderFirewallDetails(component, yPosition)}
        {component.type === 'ups' && renderUPSDetails(component, yPosition)}
        {component.type === 'patch-panel' && renderPatchPanelDetails(component, yPosition)}
        {component.type === 'wireless-controller' && renderRouterDetails(component, yPosition)}
        {component.type === 'converter' && renderSwitchDetails(component, yPosition)}
        
        {/* Component label */}
        <text
          x="150"
          y={yPosition - 5}
          fill="#ffffff"
          fontSize="8"
          fontWeight="bold"
          textAnchor="middle"
          className="pointer-events-none"
        >
          {component.name}
        </text>
        
        {/* Position marker */}
        <text
          x="35"
          y={yPosition + 28}
          fill="#6b7280"
          fontSize="10"
          fontWeight="bold"
          textAnchor="middle"
        >
          U{component.position}
        </text>
        
        {/* Power consumption */}
        {component.powerConsumption && component.type !== 'ups' && (
          <text
            x="270"
            y={yPosition + 15}
            fill="#3b82f6"
            fontSize="7"
            textAnchor="middle"
          >
            {component.powerConsumption}W
          </text>
        )}
      </g>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center flex items-center justify-center gap-2">
          <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded" />
          Rack de Servidores - {cinema.location}
          <div className="w-4 h-4 bg-gradient-to-r from-purple-600 to-blue-500 rounded" />
        </CardTitle>
        <div className="flex justify-center gap-4 text-xs">
          <Badge variant="outline">Total: {calculateTotalPowerConsumption(cinema.rackComponents)}W</Badge>
          <Badge variant="outline">Autonomía: {calculateUPSAutonomy(cinema.rackComponents)}h</Badge>
          <Badge variant="outline">Componentes: {cinema.rackComponents.length}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center">
          <svg
            width="320"
            height={Math.max(600, 100 + (cinema.rackComponents.length * 55))}
            viewBox={`0 0 320 ${Math.max(600, 100 + (cinema.rackComponents.length * 55))}`}
            className="border-2 border-gray-400 rounded-lg bg-gradient-to-b from-gray-200 to-gray-300 shadow-lg"
          >
            {/* Rack frame with 3D effect */}
            <defs>
              <linearGradient id="rackGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4b5563" />
                <stop offset="50%" stopColor="#6b7280" />
                <stop offset="100%" stopColor="#4b5563" />
              </linearGradient>
              <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.3"/>
              </filter>
            </defs>
            
            {/* Outer rack frame */}
            <rect
              x="10"
              y="10"
              width="300"
              height={Math.max(580, 80 + (cinema.rackComponents.length * 55))}
              fill="url(#rackGradient)"
              stroke="#374151"
              strokeWidth="4"
              rx="8"
              filter="url(#shadow)"
            />
            
            {/* Inner rack space */}
            <rect
              x="20"
              y="20"
              width="280"
              height={Math.max(560, 60 + (cinema.rackComponents.length * 55))}
              fill="#f3f4f6"
              stroke="#d1d5db"
              strokeWidth="2"
              rx="4"
            />
            
            {/* Rack rails with 3D effect */}
            <rect x="25" y="25" width="15" height={Math.max(550, 50 + (cinema.rackComponents.length * 55))} fill="url(#rackGradient)" rx="2" />
            <rect x="280" y="25" width="15" height={Math.max(550, 50 + (cinema.rackComponents.length * 55))} fill="url(#rackGradient)" rx="2" />
            
            {/* Rack unit markings */}
            {Array.from({ length: Math.ceil(cinema.rackComponents.length * 1.2) }).map((_, index) => (
              <g key={index}>
                <line
                  x1="25"
                  y1={45 + (index * 55)}
                  x2="40"
                  y2={45 + (index * 55)}
                  stroke="#9ca3af"
                  strokeWidth="1"
                />
                <line
                  x1="280"
                  y1={45 + (index * 55)}
                  x2="295"
                  y2={45 + (index * 55)}
                  stroke="#9ca3af"
                  strokeWidth="1"
                />
              </g>
            ))}
            
            {/* Components */}
            {cinema.rackComponents.map((component, index) => renderComponent(component, index))}
            
            {/* Rack ventilation */}
            <g opacity="0.3">
              {Array.from({ length: 20 }).map((_, i) => (
                <circle
                  key={i}
                  cx={30 + (i % 5) * 4}
                  cy={30 + Math.floor(i / 5) * 4}
                  r="1"
                  fill="#6b7280"
                />
              ))}
            </g>
          </svg>
        </div>
        
        {/* Legend */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span>En Línea</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full" />
            <span>Advertencia</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <span>Desconectado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full" />
            <span>Mantenimiento</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
