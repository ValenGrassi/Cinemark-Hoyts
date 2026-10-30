"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import * as Switch from "@radix-ui/react-switch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Server, Network, Zap, Plus, Trash2, Save, X, Settings, SquarePen } from "lucide-react"
import type { Cinema, RackComponent } from "../types/cinema"
import { usePatchCinema } from "@/hooks/patchCinema"

interface RackConfigProps {
  cinema: Cinema
  onBack: () => void
  onSave: (updatedCinema: Cinema) => void
}

export function RackConfig({ cinema, onBack, onSave }: RackConfigProps) {
  const [editedCinema, setEditedCinema] = useState<Cinema>({ ...cinema })
  const [isSaving, setIsSaving] = useState(false)
  const { patchCinema } = usePatchCinema()

  const handleSave = async () => {
    // Validaciones
    if (editedCinema.cameraEnabled && !editedCinema.cameraIp) {
      alert("Debes ingresar una IP para activar la cámara en tiempo real")
      return
    }
  
    if (editedCinema.upsEnabled && !editedCinema.upsIp) {
      alert("Debes ingresar una IP para activar el monitoreo en tiempo real")
      return
    }
  
    try {
      setIsSaving(true)
  
      // Si está desactivado, limpiamos la IP
      const payload = {
        ...editedCinema,
        cameraIp: editedCinema.cameraEnabled ? editedCinema.cameraIp : null,
        upsIp: editedCinema.upsEnabled ? editedCinema.upsIp : null,
      }
  
      const updatedCinema = await patchCinema(editedCinema.id, payload)
  
      onSave(updatedCinema)
      alert(`¡Cine ${updatedCinema.location} configurado correctamente!`)
    } catch (err) {
      console.error("Error guardando cambios:", err)
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
                Configuración Rack - {editedCinema.name}
              </h1>
              <p className="text-gray-600 mt-1">
                Modifica la configuración del rack y sus componentes
              </p>
            </div>
          </div>
          <div className="m-auto md:m-0 flex flex-col sm:flex-row items-center gap-2 self-end md:self-auto">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="w-[11rem] flex items-center gap-2 cursor-pointer self-end md:self-auto"
            >
              <Save className="h-4 w-4" />
              {isSaving ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Cine Info y Lista de Componentes */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Direcciones de Red</CardTitle>
              </CardHeader>
              <CardContent>
              {/* Cámara */}
                <div>
                  <Label>Cámara:</Label>

                  {/* Toggle cámara */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 items-center">
                    <p className="text-sm">Activar cámara en tiempo real</p>

                    <Switch.Root
                      checked={editedCinema.cameraEnabled || false}
                      onCheckedChange={(checked) =>
                        setEditedCinema(prev => ({ ...prev, cameraEnabled: checked }))
                      }
                      className="w-11 h-6 rounded-full bg-gray-300 data-[state=checked]:bg-green-600 relative transition-colors"
                    >
                      <Switch.Thumb
                        className="block w-5 h-5 bg-white rounded-full shadow transition-transform translate-x-1
                                    data-[state=checked]:translate-x-5"
                      />
                    </Switch.Root>
                  </div>

                  {/* IP cámara */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 items-center">
                    <p className="text-sm">Dirección IP</p>
                    <Input
                      value={editedCinema.cameraIp || ""}
                      onChange={(e) =>
                        setEditedCinema(prev => ({ ...prev, cameraIp: e.target.value }))
                      }
                      disabled={!editedCinema.cameraEnabled}
                      placeholder="Ej: 192.168.1.100"
                    />
                  </div>
                </div>

                {/* UPS */}
                <div className="mt-6">
                  <Label>UPS:</Label>

                  {/* Toggle UPS */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 items-center">
                    <p className="text-sm">Activar UPS en tiempo real</p>

                    <Switch.Root
                      checked={editedCinema.upsEnabled || false}
                      onCheckedChange={(checked) =>
                        setEditedCinema(prev => ({ ...prev, upsEnabled: checked }))
                      }
                      className="w-11 h-6 rounded-full bg-gray-300 data-[state=checked]:bg-green-600 relative transition-colors"
                    >
                      <Switch.Thumb
                        className="block w-5 h-5 bg-white rounded-full shadow transition-transform translate-x-1
                                    data-[state=checked]:translate-x-5"
                      />
                    </Switch.Root>
                  </div>

                  {/* IP UPS */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 items-center">
                    <p className="text-sm">Dirección IP</p>
                    <Input
                      value={editedCinema.upsIp || ""}
                      onChange={(e) =>
                        setEditedCinema(prev => ({ ...prev, upsIp: e.target.value }))
                      }
                      disabled={!editedCinema.upsEnabled}
                      placeholder="Ej: 192.168.1.120"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  )
}

