"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertTriangle, MapPin, Calendar, Upload, Eye, SquarePen, LayoutGrid } from "lucide-react"
import type { Cinema } from "../types/cinema"
import { calculateBatteryRemainingLife, isBatteryDueForReplacement } from "../utils/battery-utils"
import { ExcelUploader } from "./excel-uploader"
import { type ExcelCinemaData, convertExcelToRackComponents } from "../utils/excel-parser"

interface CinemaListProps {
  cinemas: Cinema[]
  onSelectCinema: (cinema: Cinema) => void
  onUploadExcel: (file: File, cinemaId?: string) => void
  onCreateCinema: (cinemaData: Cinema) => void
}

export function CinemaList({ cinemas, onSelectCinema, onUploadExcel, onCreateCinema }: CinemaListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [showUploader, setShowUploader] = useState(false)

  const normalizeText = (text: string) =>
  text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()

  const filteredCinemas = cinemas.filter(
    (cinema) =>
      normalizeText(cinema.name).includes(normalizeText(searchTerm)) ||
      normalizeText(cinema.location).includes(normalizeText(searchTerm)),
  )

  const handleExcelUploadSuccess = (data: ExcelCinemaData) => {
    // Check if cinema already exists
    const existingCinema = cinemas.find(
      (c) =>
        c.name.toLowerCase() === data.cinemaName.toLowerCase() ||
        c.location.toLowerCase() === data.location.toLowerCase(),
    )

    const rackComponents = convertExcelToRackComponents(data)

    if (existingCinema) {
      // Update existing cinema
      const updatedCinema: Cinema = {
        ...existingCinema,
        name: data.cinemaName,
        address: data.address,
        rackComponents,
        lastUpdated: new Date().toISOString().split("T")[0],
        totalPowerConsumption: data.totalConsumption,
        upsAutonomyHours: data.estimatedAutonomy,
        upsCapacityVA: data.totalKVA * 1000,
        upsWarnings: rackComponents.filter(
          (c) =>
            c.type === "ups" &&
            c.batteryInstallDate &&
            c.batteryLifespan &&
            isBatteryDueForReplacement(c.batteryInstallDate, c.batteryLifespan),
        ).length,
      }

      // This would typically update the existing cinema
      console.log("Updating existing cinema:", updatedCinema)
      alert(`¡Cine "${data.cinemaName}" actualizado exitosamente!`)
    } else {
      // Create new cinema
      const newCinema: Cinema = {
        id: `cinema-${Date.now()}`,
        name: data.cinemaName,
        location: data.location,
        address: data.address,
        rackComponents,
        lastUpdated: new Date().toISOString().split("T")[0],
        totalPowerConsumption: data.totalConsumption,
        upsAutonomyHours: data.estimatedAutonomy,
        upsCapacityVA: data.totalKVA * 1000,
        upsWarnings: rackComponents.filter(
          (c) =>
            c.type === "ups" &&
            c.batteryInstallDate &&
            c.batteryLifespan &&
            isBatteryDueForReplacement(c.batteryInstallDate, c.batteryLifespan),
        ).length,
      }

      onCreateCinema(newCinema)
      alert(`¡Nuevo cine "${data.cinemaName}" creado exitosamente!`)
    }

    setShowUploader(false)
  }

  const getUPSWarnings = (cinema: Cinema) => {
    return cinema.rackComponents.filter((component) => {
      if (component.type === "ups" && component.batteryInstallDate && component.batteryLifespan) {
        return isBatteryDueForReplacement(component.batteryInstallDate, component.batteryLifespan)
      }
      return false
    }).length
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ubicaciones de Cines</h1>
          <p className="text-gray-600 mt-2">Gestiona los racks de servidores en todas las ubicaciones de cines</p>
        </div>

        <div className="flex gap-2">

        {/* Botón de Carga de Excel */}
        <Dialog open={showUploader} onOpenChange={setShowUploader}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 cursor-pointer">
              <Upload className="h-4 w-4" />
              Cargar Excel
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Importar Datos desde Excel</DialogTitle>
            </DialogHeader>
            <ExcelUploader onUploadSuccess={handleExcelUploadSuccess} onClose={() => setShowUploader(false)} />
          </DialogContent>
        </Dialog>


        <Button className="flex items-center gap-2 cursor-pointer">
          Menú
          <LayoutGrid className="h-7 w-7" />
        </Button>
      </div>

      </div>

      {/* Búsqueda */}
      <div className="max-w-md">
        <Input
          placeholder="Buscar cines por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Tarjetas de Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{cinemas.length}</div>
            <div className="text-sm text-gray-600">Total de Cines Cargados</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {cinemas.reduce(
                (acc, cinema) => acc + cinema.rackComponents.filter((c) => c.status === "online").length,
                0,
              )}
            </div>
            <div className="text-sm text-gray-600">Componentes En Línea</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {cinemas.reduce((acc, cinema) => acc + getUPSWarnings(cinema), 0)}
            </div>
            <div className="text-sm text-gray-600">Alertas UPS</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {cinemas.reduce((acc, cinema) => acc + cinema.rackComponents.filter((c) => c.type === "ups").length, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Unidades UPS</div>
          </CardContent>
        </Card>
      </div>

      {/* Tarjetas de Cines */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCinemas.map((cinema) => {
          const upsWarnings = getUPSWarnings(cinema)
          const upsComponents = cinema.rackComponents.filter((c) => c.type === "ups")

          return (
            <Card key={cinema.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-gray-500" />
                      {cinema.name}
                    </CardTitle>
                    <CardDescription>{cinema.location}</CardDescription>
                  </div>
                  {upsWarnings > 0 && (
                    <Badge variant="destructive" className="flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      {upsWarnings} Alerta{upsWarnings > 1 ? "s" : ""} UPS
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-gray-600">
                  <p>{cinema.address}</p>
                </div>

                {/* Estado UPS */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Estado UPS</h4>
                  {upsComponents.map((ups) => {
                    const remainingMonths =
                      ups.batteryInstallDate && ups.batteryLifespan
                        ? calculateBatteryRemainingLife(ups.batteryInstallDate, ups.batteryLifespan)
                        : null
                    const isDue =
                      ups.batteryInstallDate && ups.batteryLifespan
                        ? isBatteryDueForReplacement(ups.batteryInstallDate, ups.batteryLifespan)
                        : false

                    return (
                      <div key={ups.id} className="flex justify-between items-center text-xs">
                        <span>{ups.name}</span>
                        <div className="flex items-center gap-2">
                          {remainingMonths !== null && (
                            <span
                              className={`px-2 py-1 rounded ${isDue ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}
                            >
                              {remainingMonths} meses restantes
                            </span>
                          )}
                          <div
                            className={`w-2 h-2 rounded-full ${
                              ups.status === "online"
                                ? "bg-green-500"
                                : ups.status === "warning"
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }`}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Consumo de Energía */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Consumo de Energía</h4>
                  <div className="flex justify-between items-center text-xs">
                    <span>Consumo Total:</span>
                    <span className="font-medium text-blue-600">{cinema.totalPowerConsumption}W</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span>Autonomía UPS:</span>
                    <span
                      className={`font-medium ${cinema.upsAutonomyHours < 2 ? "text-red-600" : cinema.upsAutonomyHours < 4 ? "text-yellow-600" : "text-green-600"}`}
                    >
                      {cinema.upsAutonomyHours}h
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span>Capacidad UPS:</span>
                    <span className="font-medium text-purple-600">{cinema.upsCapacityVA}VA</span>
                  </div>
                </div>

                {/* Estadísticas */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div>
                    <div className="font-medium">{cinema.rackComponents.length}</div>
                    <div className="text-gray-500">Componentes</div>
                  </div>
                  <div>
                    <div className="font-medium">
                      {cinema.rackComponents.filter((c) => c.status === "online").length}
                    </div>
                    <div className="text-gray-500">En Línea</div>
                  </div>
                  <div>
                    <div className="font-medium">{upsComponents.length}</div>
                    <div className="text-gray-500">Unidades UPS</div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    Actualizado {cinema.lastUpdated}
                  </div>
                  <div className="flex gap-1"><Button
                    size="sm"
                    // onClick={}
                    className="flex items-center gap-1 cursor-pointer"
                  >
                    <SquarePen className="h-3 w-3" />
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onSelectCinema(cinema)}
                    className="flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="h-3 w-3" />
                    Ver Rack
                  </Button></div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredCinemas.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No se encontraron cines que coincidan con tu búsqueda.</p>
        </div>
      )}
    </div>
  )
}
