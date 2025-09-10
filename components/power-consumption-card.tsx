"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Zap, Battery, Clock, AlertTriangle } from 'lucide-react'
import { Cinema } from '../types/cinema'
import { calculateTotalKva, calculateTotalPowerConsumption, calculateUPSAutonomy, getUPSLoadPercentage } from '../utils/power-calculations'

interface PowerConsumptionCardProps {
  cinema: Cinema
}

export function PowerConsumptionCard({ cinema }: PowerConsumptionCardProps) {
  const upsComponents = cinema.rackComponents.filter(c => c.type === 'ups')
  
  const upsCapacity = calculateTotalKva(cinema.rackComponents)
  const loadPercentage = getUPSLoadPercentage(calculateTotalPowerConsumption(cinema.rackComponents), upsCapacity)
  const autonomyHours = calculateUPSAutonomy(cinema.rackComponents)

  const getLoadColor = (percentage: number) => {
    if (percentage > 80) return 'text-red-600'
    if (percentage > 60) return 'text-yellow-600'
    return 'text-green-600'
  }

  const getAutonomyColor = (hours: number) => {
    if (hours < 2) return 'text-red-600'
    if (hours < 4) return 'text-yellow-600'
    return 'text-green-600'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-600" />
          Consumo y Autonomía Energética
        </CardTitle>
        <CardDescription>Análisis de consumo eléctrico y autonomía UPS</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Consumo Total */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Consumo Total del Rack</span>
            <span className="text-lg font-bold text-blue-600">{calculateTotalPowerConsumption(cinema.rackComponents)}W</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
            <div className="text-center">
              <div className="font-medium">Servidores</div>
              <div>{cinema.rackComponents.filter(c => c.type === 'server').reduce((sum, c) => sum + c.powerConsumption, 0)}W</div>
            </div>
            <div className="text-center">
              <div className="font-medium">Red</div>
              <div>{cinema.rackComponents.filter(c => ['switch', 'router', 'firewall'].includes(c.type)).reduce((sum, c) => sum + c.powerConsumption, 0)}W</div>
            </div>
            <div className="text-center">
              <div className="font-medium">Otros</div>
              <div>{cinema.rackComponents.filter(c => !['server', 'switch', 'router', 'firewall', 'ups'].includes(c.type)).reduce((sum, c) => sum + c.powerConsumption, 0)}W</div>
            </div>
          </div>
        </div>

        {/* Capacidad UPS */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Capacidad UPS</span>
            <span className="text-lg font-bold text-purple-600">{upsCapacity}VA</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Carga Actual</span>
              <span className={`font-medium ${getLoadColor(loadPercentage)}`}>{loadPercentage}%</span>
            </div>
            <Progress value={loadPercentage} className="h-2" />
          </div>
        </div>

        {/* Autonomía Estimada */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium flex items-center gap-1">
              <Battery className="h-4 w-4" />
              Autonomía Estimada
            </span>
            <span className={`text-lg font-bold ${getAutonomyColor(autonomyHours)}`}>
              {autonomyHours}h
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Clock className="h-3 w-3" />
            <span>Con carga actual de {calculateTotalPowerConsumption(cinema.rackComponents)}W</span>
          </div>
        </div>

        {/* Estado de UPS */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Estado de UPS</h4>
          {upsComponents.map((ups) => (
            <div key={ups.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  ups.status === 'online' ? 'bg-green-500' : 
                  ups.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
                <span className="text-sm font-medium">{ups.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={ups.status === 'online' ? 'default' : 'destructive'} className="text-xs">
                  {ups.status === 'online' ? 'En Línea' : 
                   ups.status === 'warning' ? 'Advertencia' : 'Desconectado'}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {/* Alertas */}
        {(loadPercentage > 90 || autonomyHours < 2) && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
            <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-red-800">Advertencias de Energía:</p>
              <ul className="text-red-700 mt-1 space-y-1">
                {loadPercentage > 90 && (
                  <li>• Carga UPS alta ({loadPercentage}%) - considerar reducir consumo.</li>
                )}
                {autonomyHours < 2 && (
                  <li>• Autonomía baja ({autonomyHours}h) - considerar agregar baterías.</li>
                )}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
