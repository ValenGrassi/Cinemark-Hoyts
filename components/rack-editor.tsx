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
import { ArrowLeft, Server, Network, Zap, Plus, Trash2, Save, X } from "lucide-react"
import type { Cinema, RackComponent } from "../types/cinema"
import { calculateTotalKva, calculateTotalPowerConsumption, calculateUPSAutonomy } from "@/utils/power-calculations"
import { usePatchCinema } from "@/hooks/patchCinema"

interface RackEditorProps {
  cinema: Cinema
  onBack: () => void
  onSave: (updatedCinema: Cinema) => void
}

export function RackEditor({ cinema, onBack, onSave }: RackEditorProps) {
  const [editedCinema, setEditedCinema] = useState<Cinema>({ ...cinema })
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const { patchCinema } = usePatchCinema()

  const selectedComponent =
    editedCinema.rackComponents.find(c => c.id === selectedComponentId) || null

  const handleComponentChange = (componentId: string, field: keyof RackComponent, value: any) => {
    setEditedCinema(prev => ({
      ...prev,
      rackComponents: prev.rackComponents.map(component =>
        component.id === componentId ? { ...component, [field]: value } : component
      ),
    }))
  }

  const handleSpecChange = (componentId: string, specField: string, value: any) => {
    setEditedCinema(prev => ({
      ...prev,
      rackComponents: prev.rackComponents.map(component =>
        component.id === componentId
          ? { ...component, specs: { ...component.specs, [specField]: value } }
          : component
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
      specs: {},
    }
    setEditedCinema(prev => ({
      ...prev,
      rackComponents: [...prev.rackComponents, newComponent],
    }))
    setSelectedComponentId(newComponent.id)
  }

  const removeComponent = (componentId: string) => {
    setEditedCinema(prev => ({
      ...prev,
      rackComponents: prev.rackComponents.filter(c => c.id !== componentId),
    }))
    if (selectedComponentId === componentId) setSelectedComponentId(null)
  }

  const getComponentIcon = (type: string) => {
    switch (type) {
      case "server":
        return <Server className="h-5 w-5 text-blue-600" />
      case "patch-panel":
      case "switch":
      case "router":
      case "firewall":
      case "wireless-controller":
      case "converter":
        return <Network className="h-5 w-5 text-green-600" />
      case "ups":
        return <Zap className="h-5 w-5 text-purple-600" />
      default:
        return <Server className="h-5 w-5 text-gray-600" />
    }
  }

  const handleSaveRack = async () => {
    try {
      setIsSaving(true)

      editedCinema.rackComponents.map(c =>
        c.type === "ups"
          ? {
              ...c,
              batteryInstallDate:
                c.batteryInstallDate || new Date().toISOString().split("T")[0],
            }
          : c
      )

      const payload = { rackComponents: editedCinema.rackComponents }

      const updatedCinema = await patchCinema(editedCinema.id, payload)

      // Update parent state
      onSave(updatedCinema)

      // Log local (demo MVP)
      const logEntry = {
        id: `log-${Date.now()}`,
        action: "Editar Rack",
        cinema: editedCinema.name,
        user: "Usuario Admin",
        timestamp: new Date().toISOString(),
        details: "Rack editado y guardado",
      }
      const existingLogs = JSON.parse(localStorage.getItem("rackLogs") || "[]")
      localStorage.setItem("rackLogs", JSON.stringify([logEntry, ...existingLogs]))

      // Feedback
      alert(`"¡Cine ${updatedCinema.location} editado correctamente!"`)
    } catch (err) {
      console.error("Error guardando rack:", err)
      alert("Error al guardar los cambios")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <Button
              variant="outline"
              onClick={onBack}
              className="flex self-start items-center gap-2 bg-transparent cursor-pointer md:self-auto"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Editar Rack - {editedCinema.name}
              </h1>
              <p className="text-gray-600 mt-1">
                Modifica la configuración del rack y sus componentes
              </p>
            </div>
          </div>
          <Button
            onClick={handleSaveRack}
            disabled={isSaving}
            className="flex items-center gap-2 cursor-pointer self-end md:self-auto"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Cine Info y Lista de Componentes */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información del Cine</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Nombre</Label>
                    <p className="text-sm">{editedCinema.name}</p>
                  </div>
                  <div>
                    <Label>Ubicación</Label>
                    <p className="text-sm">{editedCinema.location}</p>
                  </div>
                </div>
                <div>
                  <Label>Dirección</Label>
                  <p className="text-sm">{editedCinema.address}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Consumo Total (W)</Label>
                    <p className="text-sm">{calculateTotalPowerConsumption(editedCinema.rackComponents)}</p>
                  </div>
                  <div>
                    <Label>Autonomía UPS (h)</Label>
                    <p className="text-sm">{calculateUPSAutonomy(editedCinema.rackComponents)}</p>
                  </div>
                  <div>
                    <Label>Capacidad Total UPS (VA)</Label>
                    <p className="text-sm">{calculateTotalKva(editedCinema.rackComponents)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Componentes */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Componentes del Rack</CardTitle>
                  <Button onClick={addComponent} size="sm" className="flex items-center gap-2 cursor-pointer">
                    <Plus className="h-4 w-4" /> Agregar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                {[...editedCinema.rackComponents]
                  .sort((a, b) => a.position - b.position)
                  .map(component => (
                    <div
                      key={component.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedComponentId === component.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedComponentId(component.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getComponentIcon(component.type)}
                          <div>
                            <div className="font-medium">{component.name}</div>
                            <div className="text-sm text-gray-500">U{component.position} • {component.type.toUpperCase()}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={component.status === "online" ? "default" : "destructive"}>
                            {component.status}
                          </Badge>
                          <Button size="sm" variant="outline" onClick={e => { e.stopPropagation(); removeComponent(component.id) }}>
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

          {/* Editor de componente seleccionado */}
          <div>
            {selectedComponent ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getComponentIcon(selectedComponent.type)} Editar Componente
                  </CardTitle>
                  <CardDescription>Modifica las propiedades del componente seleccionado</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Nombre</Label>
                      <Input
                        value={selectedComponent.name}
                        onChange={e => handleComponentChange(selectedComponent.id, "name", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Tipo</Label>
                      <Select
                        value={selectedComponent.type}
                        onValueChange={value => handleComponentChange(selectedComponent.id, "type", value)}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="server">Servidor</SelectItem>
                          <SelectItem value="patch-panel">Patch Panel</SelectItem>
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
                      <Label>Estado</Label>
                      <Select
                        value={selectedComponent.status}
                        onValueChange={value => handleComponentChange(selectedComponent.id, "status", value)}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="online">En Línea</SelectItem>
                          <SelectItem value="offline">Desconectado</SelectItem>
                          <SelectItem value="warning">Advertencia</SelectItem>
                          <SelectItem value="maintenance">Mantenimiento</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Posición (U)</Label>
                      <Input
                        type="number"
                        value={selectedComponent.position}
                        onChange={e => handleComponentChange(selectedComponent.id, "position", Number(e.target.value))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Descripción</Label>
                    <Textarea
                      value={selectedComponent.description || ""}
                      onChange={e => handleComponentChange(selectedComponent.id, "description", e.target.value)}
                    />
                  </div>

                  {selectedComponent.type != "ups" && selectedComponent.type != "patch-panel" && <div>
                    <Label>Consumo de Energía (W)</Label>
                    <Input
                      type="number"
                      value={selectedComponent.powerConsumption || 1}
                      onChange={e => handleComponentChange(selectedComponent.id, "powerConsumption", Number(e.target.value))}
                    />
                  </div>}

                  <Separator />

                  {/* Especificaciones según tipo */}
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
                          <Label>Puertos Totales</Label>
                          <Input
                            type="number"
                            value={selectedComponent.specs?.ports || 1}
                            onChange={e => handleSpecChange(selectedComponent.id, "ports", Number(e.target.value))}
                          />
                        </div>
                        <div>
                          <Label>Conexiones Activas</Label>
                          <Input
                            type="number"
                            value={selectedComponent.specs?.connections || 1}
                            onChange={e => handleSpecChange(selectedComponent.id, "connections", Number(e.target.value))}
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
                          <Label>Capacidad (VA)</Label>
                          <Input
                            type="number"
                            value={selectedComponent.capacityVA || 1}
                            onChange={e => handleComponentChange(selectedComponent.id, "capacityVA", Number(e.target.value))}
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Fecha Instalación Batería</Label>
                        <Input
                          type="date"
                          value={
                            selectedComponent.batteryInstallDate
                              ? new Date(selectedComponent.batteryInstallDate).toISOString().split("T")[0]
                              : new Date().toISOString().split("T")[0] // 👈 hoy por defecto
                          }
                          onChange={e =>
                            handleComponentChange(
                              selectedComponent.id,
                              "batteryInstallDate",
                              e.target.value || new Date().toISOString().split("T")[0] // 👈 si borran, vuelve a hoy
                            )
                          }
                        />
                      </div>
                    </div>
                  )}

                  {selectedComponent.type === "server" && (
                    <div className="space-y-4">
                      <h4 className="font-medium">Especificaciones del Servidor</h4>
                      <div>
                        <Label>CPU</Label>
                        <Input
                          value={selectedComponent.specs?.cpu || ""}
                          onChange={e => handleSpecChange(selectedComponent.id, "cpu", e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>RAM</Label>
                          <Input
                            value={selectedComponent.specs?.ram || ""}
                            onChange={e => handleSpecChange(selectedComponent.id, "ram", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Almacenamiento</Label>
                          <Input
                            value={selectedComponent.specs?.storage || ""}
                            onChange={e => handleSpecChange(selectedComponent.id, "storage", e.target.value)}
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

  // return (
  //   <div className="min-h-screen bg-gray-50 p-6">
  //     <div className="max-w-7xl mx-auto">
  //       {/* Header */}
  //       <div className="mb-8 flex items-center justify-between">
  //         <div className="flex items-center gap-4">
  //           <Button variant="outline" onClick={onBack} className="flex items-center gap-2 bg-transparent cursor-pointer">
  //             <ArrowLeft className="h-4 w-4" />
  //             Volver
  //           </Button>
  //           <div>
  //             <h1 className="text-3xl font-bold text-gray-900">Editar Rack - {editedCinema.name}</h1>
  //             <p className="text-gray-600 mt-1">Modifica la configuración del rack y sus componentes</p>
  //           </div>
  //         </div>
  //         <Button onClick={handleSaveRack} className="flex items-center gap-2 cursor-pointer">
  //           <Save className="h-4 w-4" /> Guardar Cambios
  //         </Button>
  //       </div>

  //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
  //         {/* Cine Info y Lista de Componentes */}
  //         <div className="space-y-6">
  //           <Card>
  //             <CardHeader>
  //               <CardTitle>Información del Cine</CardTitle>
  //             </CardHeader>
  //             <CardContent className="space-y-4">
  //               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  //                 <div>
  //                   <Label>Nombre</Label>
  //                   <p className="text-sm">{editedCinema.name}</p>
  //                 </div>
  //                 <div>
  //                   <Label>Ubicación</Label>
  //                   <p className="text-sm">{editedCinema.location}</p>
  //                 </div>
  //               </div>
  //               <div>
  //                 <Label>Dirección</Label>
  //                 <p className="text-sm">{editedCinema.address}</p>
  //               </div>
  //               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  //                 <div>
  //                   <Label>Consumo Total (W)</Label>
  //                   <p className="text-sm">{calculateTotalPowerConsumption(editedCinema.rackComponents)}</p>
  //                 </div>
  //                 <div>
  //                   <Label>Autonomía UPS (h)</Label>
  //                   <p className="text-sm">{calculateUPSAutonomy(editedCinema.rackComponents)}</p>
  //                 </div>
  //                 <div>
  //                   <Label>Capacidad Total UPS (VA)</Label>
  //                   <p className="text-sm">{calculateTotalKva(editedCinema.rackComponents)}</p>
  //                 </div>
  //               </div>
  //             </CardContent>
  //           </Card>

  //           {/* Componentes */}
  //           <Card>
  //             <CardHeader>
  //               <div className="flex items-center justify-between">
  //                 <CardTitle>Componentes del Rack</CardTitle>
  //                 <Button onClick={addComponent} size="sm" className="flex items-center gap-2 cursor-pointer">
  //                   <Plus className="h-4 w-4" /> Agregar
  //                 </Button>
  //               </div>
  //             </CardHeader>
  //             <CardContent>
  //               <div className="space-y-3">
  //               {[...editedCinema.rackComponents]
  //                 .sort((a, b) => a.position - b.position)
  //                 .map(component => (
  //                   <div
  //                     key={component.id}
  //                     className={`p-3 border rounded-lg cursor-pointer transition-colors ${
  //                       selectedComponentId === component.id
  //                         ? "border-blue-500 bg-blue-50"
  //                         : "border-gray-200 hover:border-gray-300"
  //                     }`}
  //                     onClick={() => setSelectedComponentId(component.id)}
  //                   >
  //                     <div className="flex items-center justify-between">
  //                       <div className="flex items-center gap-3">
  //                         {getComponentIcon(component.type)}
  //                         <div>
  //                           <div className="font-medium">{component.name}</div>
  //                           <div className="text-sm text-gray-500">U{component.position} • {component.type.toUpperCase()}</div>
  //                         </div>
  //                       </div>
  //                       <div className="flex items-center gap-2">
  //                         <Badge variant={component.status === "online" ? "default" : "destructive"}>
  //                           {component.status}
  //                         </Badge>
  //                         <Button size="sm" variant="outline" onClick={e => { e.stopPropagation(); removeComponent(component.id) }}>
  //                           <Trash2 className="h-4 w-4" />
  //                         </Button>
  //                       </div>
  //                     </div>
  //                   </div>
  //                 ))}
  //               </div>
  //             </CardContent>
  //           </Card>
  //         </div>

  //         {/* Editor de componente seleccionado */}
  //         <div>
  //           {selectedComponent ? (
  //             <Card>
  //               <CardHeader>
  //                 <CardTitle className="flex items-center gap-2">
  //                   {getComponentIcon(selectedComponent.type)} Editar Componente
  //                 </CardTitle>
  //                 <CardDescription>Modifica las propiedades del componente seleccionado</CardDescription>
  //               </CardHeader>
  //               <CardContent className="space-y-4">
  //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  //                   <div>
  //                     <Label>Nombre</Label>
  //                     <Input
  //                       value={selectedComponent.name}
  //                       onChange={e => handleComponentChange(selectedComponent.id, "name", e.target.value)}
  //                     />
  //                   </div>
  //                   <div>
  //                     <Label>Tipo</Label>
  //                     <Select
  //                       value={selectedComponent.type}
  //                       onValueChange={value => handleComponentChange(selectedComponent.id, "type", value)}
  //                     >
  //                       <SelectTrigger><SelectValue /></SelectTrigger>
  //                       <SelectContent>
  //                         <SelectItem value="server">Servidor</SelectItem>
  //                         <SelectItem value="patch-panel">Patch Panel</SelectItem>
  //                         <SelectItem value="switch">Switch</SelectItem>
  //                         <SelectItem value="router">Router</SelectItem>
  //                         <SelectItem value="firewall">Firewall</SelectItem>
  //                         <SelectItem value="wireless-controller">Controlador WiFi</SelectItem>
  //                         <SelectItem value="converter">Conversor</SelectItem>
  //                         <SelectItem value="ups">UPS</SelectItem>
  //                       </SelectContent>
  //                     </Select>
  //                   </div>
  //                 </div>

  //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  //                   <div>
  //                     <Label>Estado</Label>
  //                     <Select
  //                       value={selectedComponent.status}
  //                       onValueChange={value => handleComponentChange(selectedComponent.id, "status", value)}
  //                     >
  //                       <SelectTrigger><SelectValue /></SelectTrigger>
  //                       <SelectContent>
  //                         <SelectItem value="online">En Línea</SelectItem>
  //                         <SelectItem value="offline">Desconectado</SelectItem>
  //                         <SelectItem value="warning">Advertencia</SelectItem>
  //                         <SelectItem value="maintenance">Mantenimiento</SelectItem>
  //                       </SelectContent>
  //                     </Select>
  //                   </div>
  //                   <div>
  //                     <Label>Posición (U)</Label>
  //                     <Input
  //                       type="number"
  //                       value={selectedComponent.position}
  //                       onChange={e => handleComponentChange(selectedComponent.id, "position", Number(e.target.value))}
  //                     />
  //                   </div>
  //                 </div>

  //                 <div>
  //                   <Label>Descripción</Label>
  //                   <Textarea
  //                     value={selectedComponent.description || ""}
  //                     onChange={e => handleComponentChange(selectedComponent.id, "description", e.target.value)}
  //                   />
  //                 </div>

  //                 {selectedComponent.type != "ups" && selectedComponent.type != "patch-panel" && <div>
  //                   <Label>Consumo de Energía (W)</Label>
  //                   <Input
  //                     type="number"
  //                     value={selectedComponent.powerConsumption || 0}
  //                     onChange={e => handleComponentChange(selectedComponent.id, "powerConsumption", Number(e.target.value))}
  //                   />
  //                 </div>}

  //                 <Separator />

  //                 {/* Especificaciones según tipo */}
  //                 {(selectedComponent.type === "switch" ||
  //                   selectedComponent.type === "patch-panel" ||
  //                   selectedComponent.type === "router" ||
  //                   selectedComponent.type === "firewall" ||
  //                   selectedComponent.type === "wireless-controller" ||
  //                   selectedComponent.type === "converter") && (
  //                   <div className="space-y-4">
  //                     <h4 className="font-medium">Configuración de Red</h4>
  //                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  //                       <div>
  //                         <Label>Puertos Totales</Label>
  //                         <Input
  //                           type="number"
  //                           value={selectedComponent.specs?.ports || 0}
  //                           onChange={e => handleSpecChange(selectedComponent.id, "ports", Number(e.target.value))}
  //                         />
  //                       </div>
  //                       <div>
  //                         <Label>Conexiones Activas</Label>
  //                         <Input
  //                           type="number"
  //                           value={selectedComponent.specs?.connections || 0}
  //                           onChange={e => handleSpecChange(selectedComponent.id, "connections", Number(e.target.value))}
  //                         />
  //                       </div>
  //                     </div>
  //                   </div>
  //                 )}

  //                 {selectedComponent.type === "ups" && (
  //                   <div className="space-y-4">
  //                     <h4 className="font-medium">Configuración UPS</h4>
  //                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  //                       <div>
  //                         <Label>Capacidad (VA)</Label>
  //                         <Input
  //                           type="number"
  //                           value={selectedComponent.capacityVA || 0}
  //                           onChange={e => handleComponentChange(selectedComponent.id, "capacityVA", Number(e.target.value))}
  //                         />
  //                       </div>
  //                     </div>
  //                     <div>
  //                       <Label>Fecha Instalación Batería</Label>
  //                       <Input
  //                         type="date"
  //                         value={
  //                           selectedComponent.batteryInstallDate
  //                             ? new Date(selectedComponent.batteryInstallDate).toISOString().split('T')[0]
  //                             : ""
  //                         }
  //                         onChange={e => handleComponentChange(selectedComponent.id, "batteryInstallDate", e.target.value)}
  //                       />
  //                     </div>
  //                   </div>
  //                 )}

  //                 {selectedComponent.type === "server" && (
  //                   <div className="space-y-4">
  //                     <h4 className="font-medium">Especificaciones del Servidor</h4>
  //                     <div>
  //                       <Label>CPU</Label>
  //                       <Input
  //                         value={selectedComponent.specs?.cpu || ""}
  //                         onChange={e => handleSpecChange(selectedComponent.id, "cpu", e.target.value)}
  //                       />
  //                     </div>
  //                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  //                       <div>
  //                         <Label>RAM</Label>
  //                         <Input
  //                           value={selectedComponent.specs?.ram || ""}
  //                           onChange={e => handleSpecChange(selectedComponent.id, "ram", e.target.value)}
  //                         />
  //                       </div>
  //                       <div>
  //                         <Label>Almacenamiento</Label>
  //                         <Input
  //                           value={selectedComponent.specs?.storage || ""}
  //                           onChange={e => handleSpecChange(selectedComponent.id, "storage", e.target.value)}
  //                         />
  //                       </div>
  //                     </div>
  //                   </div>
  //                 )}
  //               </CardContent>
  //             </Card>
  //           ) : (
  //             <Card>
  //               <CardHeader>
  //                 <CardTitle>Seleccionar Componente</CardTitle>
  //                 <CardDescription>Selecciona un componente de la lista para editarlo</CardDescription>
  //               </CardHeader>
  //               <CardContent>
  //                 <div className="text-center py-8">
  //                   <Server className="h-12 w-12 text-gray-400 mx-auto mb-4" />
  //                   <p className="text-gray-500">Ningún componente seleccionado</p>
  //                 </div>
  //               </CardContent>
  //             </Card>
  //           )}
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // )
// }
