"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, X } from "lucide-react"
import { parseExcelFile, type ExcelCinemaData } from "../utils/excel-parser"

interface ExcelUploaderProps {
  onUploadSuccess: (data: ExcelCinemaData) => void
  onClose?: () => void
}

export function ExcelUploader({ onUploadSuccess, onClose }: ExcelUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [previewData, setPreviewData] = useState<ExcelCinemaData | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      if (
        selectedFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        selectedFile.name.endsWith(".xlsx")
      ) {
        setFile(selectedFile)
        setError(null)
        setSuccess(false)
        setPreviewData(null)
      } else {
        setError("Por favor selecciona un archivo Excel (.xlsx)")
        setFile(null)
      }
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)
    setError(null)

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 100)

      const parsedData = await parseExcelFile(file)

      clearInterval(progressInterval)
      setUploadProgress(100)

      setPreviewData(parsedData)
      setSuccess(true)

      // Auto-confirm after showing preview
      setTimeout(() => {
        onUploadSuccess(parsedData)
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al procesar el archivo Excel")
      setUploadProgress(0)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (
      droppedFile &&
      (droppedFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        droppedFile.name.endsWith(".xlsx"))
    ) {
      setFile(droppedFile)
      setError(null)
      setSuccess(false)
      setPreviewData(null)
    } else {
      setError("Por favor arrastra un archivo Excel (.xlsx)")
    }
  }

  const resetUploader = () => {
    setFile(null)
    setError(null)
    setSuccess(false)
    setPreviewData(null)
    setUploadProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-green-600" />
              Cargar Archivo Excel
            </CardTitle>
            <CardDescription>Sube un archivo Excel (.xlsx) con la información del rack de servidores</CardDescription>
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose} className="cursor-pointer">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {!success && (
          <>
            {/* File Upload Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                file ? "border-green-300 bg-green-50" : "border-gray-300 hover:border-gray-400"
              }`}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <Input ref={fileInputRef} type="file" accept=".xlsx" onChange={handleFileSelect} className="hidden" />

              {file ? (
                <div className="space-y-2">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
                  <p className="text-lg font-medium text-green-800">{file.name}</p>
                  <p className="text-sm text-green-600">Archivo seleccionado ({(file.size / 1024).toFixed(1)} KB)</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                  <p className="text-lg font-medium text-gray-700">Arrastra tu archivo Excel aquí</p>
                  <p className="text-sm text-gray-500">o haz clic para seleccionar un archivo .xlsx</p>
                </div>
              )}
            </div>

            {/* Upload Progress */}
            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Procesando archivo...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="w-full" />
              </div>
            )}

            {/* Error Message */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button onClick={handleUpload} disabled={!file || isUploading} className="flex-1 cursor-pointer">
                {isUploading ? "Procesando..." : "Procesar Archivo Excel"}
              </Button>
              {file && (
                <Button variant="outline" onClick={resetUploader} className="cursor-pointer bg-transparent">
                  Limpiar
                </Button>
              )}
            </div>
          </>
        )}

        {/* Success and Preview */}
        {success && previewData && (
          <div className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                ¡Archivo procesado exitosamente! Los datos se importarán automáticamente.
              </AlertDescription>
            </Alert>

            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <h4 className="font-medium text-gray-900">Vista Previa de Datos:</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Nombre del Cine:</span>
                  <p className="font-medium">{previewData.cinemaName}</p>
                </div>
                <div>
                  <span className="text-gray-500">Dirección:</span>
                  <p className="font-medium">{previewData.address}</p>
                </div>
                <div>
                  <span className="text-gray-500">KVA Total:</span>
                  <p className="font-medium">{previewData.totalKVA} KVA</p>
                </div>
                <div>
                  <span className="text-gray-500">Consumo Total:</span>
                  <p className="font-medium">{previewData.totalConsumption}W</p>
                </div>
                <div>
                  <span className="text-gray-500">Componentes:</span>
                  <p className="font-medium">{previewData.components.length} equipos</p>
                </div>
                <div>
                  <span className="text-gray-500">UPS:</span>
                  <p className="font-medium">{previewData.upsComponents.length} unidades</p>
                </div>
              </div>
            </div>

            <Button onClick={resetUploader} variant="outline" className="w-full cursor-pointer bg-transparent">
              Cargar Otro Archivo
            </Button>
          </div>
        )}

        {/* Format Instructions */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Formato del Archivo Excel:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>
              • <strong>Información básica:</strong> Nombre del cine, dirección, KVA, consumo
            </li>
            <li>
              • <strong>Componentes UPS:</strong> ID, marca, modelo, capacidad VA
            </li>
            <li>
              • <strong>Equipos:</strong> Tipo, marca, modelo, consumo en watts
            </li>
            <li>
              • <strong>Detalles de puertos:</strong> JSON con mapeo de conexiones
            </li>
            <li>
              • <strong>Patch panels:</strong> ID, puertos totales, estado por puerto
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
