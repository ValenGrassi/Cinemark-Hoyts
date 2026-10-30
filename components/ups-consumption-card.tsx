"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Zap, Battery, Clock, AlertTriangle, Thermometer, ServerCrash, Cable, TestTube2, CheckCircle } from 'lucide-react'
import { Cinema } from '../types/cinema'
import { calculateTotalKva, calculateTotalPowerConsumption, calculateUPSAutonomy, getUPSLoadPercentage } from '../utils/power-calculations'

interface UpsConsumptionCardProps {
  cinema: Cinema
  upsData: any
}


export function UpsConsumptionCard({ cinema, upsData }: UpsConsumptionCardProps) {
  const upsComponents = cinema.rackComponents.filter(c => c.type === 'ups')
  const upsCapacity = calculateTotalKva(cinema.rackComponents)
  const loadPercentage = getUPSLoadPercentage(calculateTotalPowerConsumption(cinema.rackComponents), upsCapacity)
  const autonomyHours = calculateUPSAutonomy(cinema.rackComponents)
  console.log(upsData)

  function msToTime(ms: number) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const hours = Math.floor(totalSeconds / 3600);
    return `${hours}.${minutes}`;
  }
  
  const getLoadColor = (percentage: number) => {
    if (percentage > 80) return 'text-red-600'
    if (percentage > 60) return 'text-yellow-600'
    return 'text-green-600'
  }

  const getAutonomyColor = (hours: number) => {
    if (hours < 1) return 'text-red-600'
    if (hours < 2) return 'text-yellow-600'
    return 'text-green-600'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-600" />
          <p>Nombre: {upsData.name}</p>
        </CardTitle>
        <CardDescription>Descripción: {upsData.model}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">

        {/* Capacidad UPS */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Capacidad UPS</span>
            <span className="text-lg font-bold text-purple-600">1500VA</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Carga Actual</span>
              <span className={`font-medium ${getLoadColor(upsData.loadPercentage)}`}>{upsData.loadPercentage}%</span>
            </div>
            <Progress value={upsData.loadPercentage} className="h-2" />
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
              {msToTime(upsData.runtimeFull)}h
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Clock className="h-3 w-3" />
            <span>Con carga actual de {upsData.loadPercentage}W</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium flex items-center gap-1">
              <div className="flex items-center justify-center"><Thermometer className="h-4 w-4" /></div>
              Temperatura del Rack
            </span>
            <span className={`text-lg font-bold text-green-600`}>
              25ºC // configurable
            </span>
          </div>          
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium flex items-center gap-1">
              <div className="flex items-center justify-center"><Cable className="h-4 w-4" /></div>
              Voltaje de salida
            </span>
            <span className={`text-lg font-bold text-yellow-600`}>
              {upsData.outputVoltage}V
            </span>
          </div>          
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium flex items-center gap-1">
              <div className="flex items-center justify-center"><TestTube2 className="h-4 w-4" /></div>
              Última Autoprueba Correcta
            </span>
            <span className={`text-lg font-bold text-red-600`}>
              {upsData.ultimaAutoprueba}
            </span>
            
          </div>          
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Clock className="h-3 w-3" />
            <span>Último test semanal dió: <span className="text-black">{upsData.selfTestResult}</span><br></br> (1= pasó, 2= error, 3= no se pudo hacer)</span>
          </div>
        </div>

        {/* Alertas */}
        {(upsData.ultimaAutoprueba != 1) && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
            <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-red-800">Advertencias de Energía:</p>
              <ul className="text-red-700 mt-1 space-y-1">
                  <li>• Última autoprueba fallida - revisar baterías.</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
