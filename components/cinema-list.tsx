"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertTriangle,
  MapPin,
  Calendar,
  Upload,
  Eye,
  SquarePen,
  LayoutGrid,
  User,
  LogOut,
  FileText,
  LogIn,
} from "lucide-react"
import type { Cinema } from "../types/cinema"
import { ExcelUploader } from "./excel-uploader"
import { type ExcelCinemaData, convertExcelToRackComponents } from "../utils/excel-parser"
import { calculateBatteryRemainingLife, isBatteryDueForReplacement } from "@/utils/battery-utils"
import Link from "next/link"
import { calculateTotalKva, calculateTotalPowerConsumption, calculateUPSAutonomy } from "@/utils/power-calculations"
import { LoginPage } from "./login-page"

interface CinemaListProps {
  cinemas: Cinema[]
  loggedIn: () => boolean,
  onSelectCinema: (cinema: Cinema) => void
  onEditCinema: (cinema: Cinema) => void
  onUploadExcel: (file: File, cinemaId?: string) => void
  onCreateCinema: (cinemaData: Cinema) => void
  onNavigateToLogs: () => void,
  onLogin: () => void,
  onLogout: () => void,
  isLoading: () => void
}

export function CinemaList({
  isLoading,
  cinemas,
  onLogin,
  loggedIn,
  onSelectCinema,
  onEditCinema,
  onUploadExcel,
  onCreateCinema,
  onNavigateToLogs,
  onLogout,
}: CinemaListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [showUploader, setShowUploader] = useState(false)

  const normalizeText = (text: string) =>
    text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()

  const filteredCinemas = cinemas.filter(
    (cinema) =>
      normalizeText(cinema.name).includes(normalizeText(searchTerm)) ||
      normalizeText(cinema.location).includes(normalizeText(searchTerm)),
  )

  const handleExcelUploadSuccess = (data: ExcelCinemaData) => {
    const existingCinema = cinemas.find(
      (c) =>
        c.name.toLowerCase() === data.cinemaName.toLowerCase() ||
        c.location.toLowerCase() === data.location.toLowerCase(),
    )

    const rackComponents = convertExcelToRackComponents(data)

    if (existingCinema) {
      const updatedCinema: Cinema = {
        ...existingCinema,
        name: data.cinemaName,
        address: data.address,
        rackComponents,
        lastUpdated: new Date().toISOString().split("T")[0],
      }
      console.log("Updating existing cinema:", updatedCinema)
      alert(`¡Cine "${data.cinemaName}" actualizado exitosamente!`)
    } else {
      const newCinema: Cinema = {
        id: `cinema-${Date.now()}`,
        name: data.cinemaName,
        location: data.location,
        address: data.address,
        rackComponents,
        lastUpdated: new Date().toISOString().split("T")[0],
      }
      onCreateCinema(newCinema)
      alert(`¡Nuevo cine "${data.cinemaName}" creado exitosamente!`)
    }

    setShowUploader(false)
  }

  const getUPSWarnings = (cinema: Cinema) => {
    return cinema.rackComponents.filter((component) => {
      return component.type === "ups" && component.batteryInstallDate && isBatteryDueForReplacement(component.batteryInstallDate)
    }).length
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <img src="/cinemark-hoyts.png" />

        <div className="flex gap-2">
          {/* <Dialog open={showUploader} onOpenChange={setShowUploader}>
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
          </Dialog> */}

          {loggedIn ? <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="flex items-center gap-2 cursor-pointer">
                Menú
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex items-center gap-2 p-2">
                <User className="h-4 w-4" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Usuario Admin</span>
                  <span className="text-xs text-gray-500">admin@cinemark.com</span>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onNavigateToLogs} className="cursor-pointer">
                <FileText className="h-4 w-4 mr-2" />
                Logs
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout} className="cursor-pointer text-red-600">
                <LogOut className="h-4 w-4 mr-2" />
                Salir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> : 
            <Button onClick={onLogin} className="flex items-center gap-2 cursor-pointer">
              Iniciar Sesión
              <LogIn className="h-4 w-4" />
            </Button>}
        </div>
      </div>
      <div>
          <h1 className="text-3xl font-bold text-gray-900">Ubicaciones de Cines</h1>
          <p className="text-gray-600 mt-2">Gestiona los racks de servidores en todas las ubicaciones de cines</p>
        </div>

      {isLoading ? <><p>Cargando cines de la base de datos...</p><div></div></> :<>

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
            <div className="text-2xl font-bold text-red-600">
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
      <div className="max-w-md">
        <Input
          placeholder="Buscar cines por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      </>}

      {/* Tarjetas de Cines */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCinemas.map((cinema) => {
          const upsWarnings = getUPSWarnings(cinema)
          const upsComponents = cinema.rackComponents.filter((c) => c.type === "ups")
          const autonomy = calculateUPSAutonomy(cinema.rackComponents)

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
                    const remainingMonths = ups.batteryInstallDate
                      ? calculateBatteryRemainingLife(ups.batteryInstallDate)
                      : null
                    const isDue = ups.batteryInstallDate
                      ? isBatteryDueForReplacement(ups.batteryInstallDate)
                      : false

                    return (
                      <div key={ups.id} className="flex justify-between items-center text-xs">
                        <span>{ups.name}</span>
                        <div className="flex items-center gap-2">
                          {remainingMonths !== null && remainingMonths !== 0 && (
                            <span
                              className={`px-2 py-1 rounded ${
                                isDue ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                              }`}
                            >
                              {remainingMonths} meses restantes
                            </span>
                          )}
                          {remainingMonths == 0 && (
                            <span
                              className={`px-2 py-1 rounded bg-red-100 text-red-800`}
                            >
                              Cambiar baterias
                            </span>
                          )}
                          <div
                            className={`w-2 h-2 rounded-full ${
                              remainingMonths !== null && remainingMonths > 12
                                ? "bg-green-500"
                                : remainingMonths !== null && remainingMonths < 12 && remainingMonths > 6
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
                    <span className="font-medium text-blue-600">{calculateTotalPowerConsumption(cinema.rackComponents)}W</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span>Autonomía UPS:</span>
                    <span
                      className={`font-medium ${
                        autonomy < 2
                          ? "text-red-600"
                          : autonomy < 4
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {autonomy}h
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span>Capacidad Total UPS:</span>
                    <span className="font-medium text-purple-600">{calculateTotalKva(cinema.rackComponents)}VA</span>
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
                    <p>Actualizado {new Date(cinema.lastUpdated).toLocaleDateString('es-ES')}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-1">
                    {loggedIn && <Button
                      size="sm"
                      onClick={() => onEditCinema(cinema)}
                      className="flex items-center gap-1 cursor-pointer"
                    >
                      <SquarePen className="h-3 w-3" />
                      Editar
                    </Button>}
                    <Button asChild size="sm" className="flex items-center gap-1 cursor-pointer">
                      <Link href={`/racks/${cinema.id}`}>
                        <Eye className="h-3 w-3" />
                        Ver Rack
                      </Link>
                    </Button>

                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredCinemas.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No se encontraron cines que coincidan con tu búsqueda.</p>
        </div>
      )}
    </div>
  )
}
