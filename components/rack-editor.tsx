"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Server, Network, Zap, Plus, Trash2, Save } from "lucide-react"
import type { Cinema, RackComponent } from "../types/cinema"

interface RackEditorProps {
  cinema: Cinema
  onBack: () => void
  onSave: (updatedCinema: Cinema) => void
}

export function RackEditor({ cinema, onBack, onSave }: RackEditorProps) {
  const [editedCinema, setEditedCinema] = useState<Cinema>({ ...cinema })
  const [selectedComponent, setSelectedComponent] = useState<RackComponent | null>(null)

  const handleCinemaChange = (field: keyof Cinema, value: any) => {
    setEditedCinema((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleComponentChange = (componentId: string, field: keyof RackComponent, value: any) => {
    setEditedCinema((prev) => ({
      ...prev,
      rackComponents: prev.rackComponents.map((component) =>
        component.id === componentId ? { ...component, [field]: value } : component,
      ),
    }))
  }

  const handleSpecChange = (componentId: string, specField: string, value: any) => {
    setEditedCinema((prev) => ({
      ...prev,
      rackComponents: prev.rackComponents.map((component) =>
        component.id === componentId
          ? {
              ...component,
              specs: {
                ...component.specs,
                [specField]: value,
              },
            }
          : component,
      ),
    }))
  }

  const addComponent = () => {
    const newComponent: RackComponent = {
      id: `component-${Date.now()}`,
      type: "server",
      name: "Nuevo Componente",
      status: "online",
      position: editedCinema.rackComponents.length + 1,
      powerConsumption: 0,
      description: "Componente nuevo",
    }

    setEditedCinema((prev) => ({
      ...prev,
      rackComponents: [...prev.rackComponents, newComponent],
    }))
  }

  const removeComponent = (componentId: string) => {
    setEditedCinema((prev) => ({
      ...prev,
      rackComponents: prev.rackComponents.filter((c) => c.id !== componentId),
    }))
    if (selectedComponent?.id === componentId) {
      setSelectedComponent(null)
    }
  }

  const handleSave = () => {
    const updatedCinema = {
      ...editedCinema,
      lastUpdated: new Date().toISOString().split("T")[0],
    }
    onSave(updatedCinema)

    // Log the edit action
    const logEntry = {
      id: `log-${Date.now()}`,
      action: "Editar Rack",
      cinema: editedCinema.name,
      user: "Usuario Admin",
      timestamp: new Date().toISOString(),
      details: "Rack editado y guardado",
    }

    // Store in localStorage for now
    const existingLogs = JSON.parse(localStorage.getItem("rackLogs") || "[]")
    localStorage.setItem("rackLogs", JSON.stringify([logEntry, ...existingLogs]))

    alert("¡Cambios guardados exitosamente!")
  }

  const getComponentIcon = (type: string) => {
    switch (type) {
      case "server":
        return <Server className="h-5 w-5 text-blue-600" />
      case "patch-panel":
        return <Network className="h-5 w-5 text-green-600" />
      case "switch":
        return <Network className="h-5 w-5 text-green-600" />
      case "router":
        return <Network className="h-5 w-5 text-blue-600" />
      case "firewall":
        return <Network className="h-5 w-5 text-red-600" />
      case "wireless-controller":
        return <Network className="h-5 w-5 text-purple-600" />
      case "converter":
        return <Network className="h-5 w-5 text-orange-600" />
      case "ups":
        return <Zap className="h-5 w-5 text-purple-600" />
      default:
        return <Server className="h-5 w-5 text-gray-600" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onBack} className="flex items-center gap-2 bg-transparent">
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Editar Rack - {editedCinema.name}</h1>
              <p className="text-gray-600 mt-1">Modifica la configuración del rack y sus componentes</p>
            </div>
          </div>
          <Button onClick={handleSave} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Guardar Cambios
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Cinema Info & Component List */}
          <div className="space-y-6">
            {/* Cinema Information */}
            <Card>
              <CardHeader>
                <CardTitle>Información del Cine</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nombre</Label>
                    <Input
                      id="name"
                      value={editedCinema.name}
                      onChange={(e) => handleCinemaChange("name", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Ubicación</Label>
                    <Input
                      id="location"
                      value={editedCinema.location}
                      onChange={(e) => handleCinemaChange("location", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Dirección</Label>
                  <Textarea
                    id="address"
                    value={editedCinema.address}
                    onChange={(e) => handleCinemaChange("address", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="power">Consumo Total (W)</Label>
                    <Input
                      id="power"
                      type="number"
                      value={editedCinema.totalPowerConsumption}
                      onChange={(e) => handleCinemaChange("totalPowerConsumption", Number.parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="autonomy">Autonomía UPS (h)</Label>
                    <Input
                      id="autonomy"
                      type="number"
                      step="0.1"
                      value={editedCinema.upsAutonomyHours}
                      onChange={(e) => handleCinemaChange("upsAutonomyHours", Number.parseFloat(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="capacity">Capacidad UPS (VA)</Label>
                    <Input
                      id="capacity"
                      type="number"
                      value={editedCinema.upsCapacityVA}
                      onChange={(e) => handleCinemaChange("upsCapacityVA", Number.parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Components List */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Componentes del Rack</CardTitle>
                  <Button onClick={addComponent} size="sm" className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Agregar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {editedCinema.rackComponents.map((component) => (
                    <div
                      key={component.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedComponent?.id === component.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedComponent(component)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getComponentIcon(component.type)}
                          <div>
                            <div className="font-medium">{component.name}</div>
                            <div className="text-sm text-gray-500">
                              U{component.position} • {component.type.toUpperCase()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={component.status === "online" ? "default" : "destructive"}>
                            {component.status}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeComponent(component.id)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Component Editor */}
          <div>
            {selectedComponent ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getComponentIcon(selectedComponent.type)}
                    Editar Componente
                  </CardTitle>
                  <CardDescription>Modifica las propiedades del componente seleccionado</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="comp-name">Nombre</Label>
                      <Input
                        id="comp-name"
                        value={selectedComponent.name}
                        onChange={(e) => handleComponentChange(selectedComponent.id, "name", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="comp-type">Tipo</Label>
                      <Select
                        value={selectedComponent.type}
                        onValueChange={(value) => handleComponentChange(selectedComponent.id, "type", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="server">Servidor</SelectItem>
                          <SelectItem value="patch-panel">Panel de Conexiones</SelectItem>
                          <SelectItem value="switch">Switch</SelectItem>
                          <SelectItem value="router">Router</SelectItem>
                          <SelectItem value="firewall">Firewall</SelectItem>
                          <SelectItem value="wireless-controller">Controlador WiFi</SelectItem>
                          <SelectItem value="converter">Conversor</SelectItem>
                          <SelectItem value="ups">UPS</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="comp-status">Estado</Label>
                      <Select
                        value={selectedComponent.status}
                        onValueChange={(value) => handleComponentChange(selectedComponent.id, "status", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="online">En Línea</SelectItem>
                          <SelectItem value="offline">Desconectado</SelectItem>
                          <SelectItem value="warning">Advertencia</SelectItem>
                          <SelectItem value="maintenance">Mantenimiento</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="comp-position">Posición (U)</Label>
                      <Input
                        id="comp-position"
                        type="number"
                        value={selectedComponent.position}
                        onChange={(e) =>
                          handleComponentChange(selectedComponent.id, "position", Number.parseInt(e.target.value))
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="comp-model">Modelo</Label>
                    <Input
                      id="comp-model"
                      value={selectedComponent.model || ""}
                      onChange={(e) => handleComponentChange(selectedComponent.id, "model", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="comp-description">Descripción</Label>
                    <Textarea
                      id="comp-description"
                      value={selectedComponent.description || ""}
                      onChange={(e) => handleComponentChange(selectedComponent.id, "description", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="comp-power">Consumo de Energía (W)</Label>
                    <Input
                      id="comp-power"
                      type="number"
                      value={selectedComponent.powerConsumption || 0}
                      onChange={(e) =>
                        handleComponentChange(selectedComponent.id, "powerConsumption", Number.parseInt(e.target.value))
                      }
                    />
                  </div>

                  <Separator />

                  {/* Type-specific fields */}
                  {(selectedComponent.type === "switch" ||
                    selectedComponent.type === "patch-panel" ||
                    selectedComponent.type === "router" ||
                    selectedComponent.type === "firewall" ||
                    selectedComponent.type === "wireless-controller" ||
                    selectedComponent.type === "converter") && (
                    <div className="space-y-4">
                      <h4 className="font-medium">Configuración de Red</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="ports">Puertos Totales</Label>
                          <Input
                            id="ports"
                            type="number"
                            value={selectedComponent.specs?.ports || 0}
                            onChange={(e) =>
                              handleSpecChange(selectedComponent.id, "ports", Number.parseInt(e.target.value))
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="connections">Conexiones Activas</Label>
                          <Input
                            id="connections"
                            type="number"
                            value={selectedComponent.specs?.connections || 0}
                            onChange={(e) =>
                              handleSpecChange(selectedComponent.id, "connections", Number.parseInt(e.target.value))
                            }
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedComponent.type === "ups" && (
                    <div className="space-y-4">
                      <h4 className="font-medium">Configuración UPS</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="capacity-va">Capacidad (VA)</Label>
                          <Input
                            id="capacity-va"
                            type="number"
                            value={selectedComponent.capacityVA || 0}
                            onChange={(e) =>
                              handleComponentChange(selectedComponent.id, "capacityVA", Number.parseInt(e.target.value))
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="load">Carga (%)</Label>
                          <Input
                            id="load"
                            type="number"
                            value={selectedComponent.loadPercentage || 0}
                            onChange={(e) =>
                              handleComponentChange(
                                selectedComponent.id,
                                "loadPercentage",
                                Number.parseInt(e.target.value),
                              )
                            }
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="battery-date">Fecha Instalación Batería</Label>
                        <Input
                          id="battery-date"
                          type="date"
                          value={selectedComponent.batteryInstallDate || ""}
                          onChange={(e) =>
                            handleComponentChange(selectedComponent.id, "batteryInstallDate", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  )}

                  {selectedComponent.type === "server" && (
                    <div className="space-y-4">
                      <h4 className="font-medium">Especificaciones del Servidor</h4>
                      <div>
                        <Label htmlFor="cpu">CPU</Label>
                        <Input
                          id="cpu"
                          value={selectedComponent.specs?.cpu || ""}
                          onChange={(e) => handleSpecChange(selectedComponent.id, "cpu", e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="ram">RAM</Label>
                          <Input
                            id="ram"
                            value={selectedComponent.specs?.ram || ""}
                            onChange={(e) => handleSpecChange(selectedComponent.id, "ram", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="storage">Almacenamiento</Label>
                          <Input
                            id="storage"
                            value={selectedComponent.specs?.storage || ""}
                            onChange={(e) => handleSpecChange(selectedComponent.id, "storage", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Seleccionar Componente</CardTitle>
                  <CardDescription>Selecciona un componente de la lista para editarlo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Server className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Ningún componente seleccionado</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
