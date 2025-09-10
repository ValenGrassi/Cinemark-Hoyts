"use client"

import { useState } from "react"
import { Card, CardPorts, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Network, Wifi, Router, Shield, Server, Zap } from 'lucide-react'
import { RackComponent, PortConnection } from '../types/cinema'

interface PortDetailsModalProps {
  component: RackComponent
  children: React.ReactNode
}

export function PortDetailsModal({ component, children }: PortDetailsModalProps) {
  const getComponentIcon = (type: string) => {
    switch (type) {
      case 'switch': return <Network className="h-5 w-5 text-green-600" />
      case 'router': return <Router className="h-5 w-5 text-blue-600" />
      case 'firewall': return <Shield className="h-5 w-5 text-red-600" />
      case 'wireless-controller': return <Wifi className="h-5 w-5 text-purple-600" />
      case 'patch-panel': return <Network className="h-5 w-5 text-gray-600" />
      case 'converter': return <Zap className="h-5 w-5 text-orange-600" />
      default: return <Server className="h-5 w-5 text-gray-600" />
    }
  }

  if (!component.specs?.portDetails) {
    return <>{children}</>
  }

  console.log(component.specs)

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getComponentIcon(component.type)}
            Detalles de Puertos - {component.name}
          </DialogTitle>
          <DialogDescription>
            {component.model && `Modelo: ${component.model} • `}
            {component.specs.ports} puertos totales • {component.specs.connections} conexiones activas
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {component.specs.portDetails.map((port) => (
              <CardPorts key={port.portNumber} className={`border-l-4 ${
                port.isConnected ? 'border-l-green-500' : 'border-l-gray-300'
              }`}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">Puerto {port.portNumber}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {port.connectedTo ? (
                      <div>
                        <p className="text-sm font-medium text-green-700">Conectado a:</p>
                        <p className="text-sm text-gray-600">{port.connectedTo}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">Puerto libre</p>
                    )}
                    
                    {port.description && (
                      <div>
                        <p className="text-xs text-gray-500">Descripción:</p>
                        <p className="text-xs text-gray-600">{port.description}</p>
                      </div>
                    )}
                    
                    {port.vlan && (
                      <div>
                        <p className="text-xs text-gray-500">VLAN:</p>
                        <Badge variant="outline" className="text-xs">{port.vlan}</Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </CardPorts>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
