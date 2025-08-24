"use client"

import { useState } from "react"
import { CinemaList } from "../components/cinema-list"
import { RackDashboard } from "../components/rack-dashboard"
import { RackEditor } from "../components/rack-editor"
import { LogsPage } from "../components/logs-page"
import type { Cinema } from "../types/cinema"
import { sampleCinemas } from "../data/sample-cinemas"

type ViewMode = "list" | "view" | "edit" | "logs"

export default function CinemaManagementApp() {
  const [cinemas, setCinemas] = useState<Cinema[]>(sampleCinemas)
  const [selectedCinema, setSelectedCinema] = useState<Cinema | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>("list")

  const handleSelectCinema = (cinema: Cinema) => {
    setSelectedCinema(cinema)
    setViewMode("view")
  }

  const handleEditCinema = (cinema: Cinema) => {
    setSelectedCinema(cinema)
    setViewMode("edit")
  }

  const handleBackToList = () => {
    setSelectedCinema(null)
    setViewMode("list")
  }

  const handleNavigateToLogs = () => {
    setViewMode("logs")
  }

  const handleLogout = () => {
    alert("Cerrando sesión...")
    // Here you would implement actual logout logic
  }

  const handleUploadExcel = async (file: File, cinemaId?: string) => {
    // This is kept for backward compatibility but not used with new uploader
    console.log("Legacy upload method called")
  }

  const handleCreateCinema = (newCinema: Cinema) => {
    setCinemas((prevCinemas) => {
      // Check if cinema already exists and update it
      const existingIndex = prevCinemas.findIndex(
        (c) =>
          c.name.toLowerCase() === newCinema.name.toLowerCase() ||
          c.location.toLowerCase() === newCinema.location.toLowerCase(),
      )

      if (existingIndex >= 0) {
        // Update existing cinema
        const updatedCinemas = [...prevCinemas]
        updatedCinemas[existingIndex] = newCinema
        return updatedCinemas
      } else {
        // Add new cinema
        return [...prevCinemas, newCinema]
      }
    })
  }

  const handleSaveCinema = (updatedCinema: Cinema) => {
    setCinemas((prevCinemas) => prevCinemas.map((cinema) => (cinema.id === updatedCinema.id ? updatedCinema : cinema)))
    setViewMode("view")
  }

  if (viewMode === "view" && selectedCinema) {
    return <RackDashboard cinema={selectedCinema} onBack={handleBackToList} />
  }

  if (viewMode === "edit" && selectedCinema) {
    return <RackEditor cinema={selectedCinema} onBack={handleBackToList} onSave={handleSaveCinema} />
  }

  if (viewMode === "logs") {
    return <LogsPage onBack={handleBackToList} />
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <CinemaList
          cinemas={cinemas}
          onSelectCinema={handleSelectCinema}
          onEditCinema={handleEditCinema}
          onUploadExcel={handleUploadExcel}
          onCreateCinema={handleCreateCinema}
          onNavigateToLogs={handleNavigateToLogs}
          onLogout={handleLogout}
        />
      </div>
    </div>
  )
}
