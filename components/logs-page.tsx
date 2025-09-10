"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, FileText, User, Calendar, Search } from "lucide-react"

interface LogEntry {
  id: string
  action: string
  cinema: string
  user: string
  timestamp: string
  details: string
}

interface LogsPageProps {
  onBack: () => void
}

export function LogsPage({ onBack }: LogsPageProps) {
  const [logs, setLogs] = useState<LogEntry[]>([])

  useEffect(() => {
    // Load logs from localStorage
    const storedLogs = JSON.parse(localStorage.getItem("rackLogs") || "[]")
    setLogs(storedLogs)
  }, [])

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case "editar rack":
        return "bg-blue-100 text-blue-800"
      case "crear rack":
        return "bg-green-100 text-green-800"
      case "eliminar componente":
        return "bg-red-100 text-red-800"
      case "cargar excel":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2 bg-transparent cursor-pointer">
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Registro de Actividades</h1>
            <p className="text-gray-600 mt-1">Historial de todas las modificaciones realizadas en el sistema</p>
          </div>
        </div>

        {/* Search and Stats */}
        {/* <div className="mb-6 space-y-4">
          

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600">{logs.length}</div>
                <div className="text-sm text-gray-600">Total de Registros</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">
                  {logs.filter((log) => log.action.includes("Editar")).length}
                </div>
                <div className="text-sm text-gray-600">Ediciones</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-purple-600">
                  {logs.filter((log) => log.action.includes("Excel")).length}
                </div>
                <div className="text-sm text-gray-600">Cargas de Excel</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-orange-600">{new Set(logs.map((log) => log.user)).size}</div>
                <div className="text-sm text-gray-600">Usuarios Activos</div>
              </CardContent>
            </Card>
          </div>
        </div> */}

        {/* Logs List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Registro de Actividades
            </CardTitle>
            <CardDescription>
              Últimos 10 de un total de {logs.length} registros
            </CardDescription>
          </CardHeader>
          <CardContent>
            {logs.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  {logs.length === 0
                    ? "No hay registros de actividad disponibles"
                    : "No se encontraron registros que coincidan con tu búsqueda"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()) // orden descendente (más nuevos primero)
                    .slice(0, 10) // solo los primeros 10
                    .map((log) => (
                  <div key={log.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className={getActionColor(log.action)}>{log.action}</Badge>
                          <span className="font-medium text-gray-900">{log.cinema}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{log.details}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {log.user}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(log.timestamp)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
