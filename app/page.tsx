"use client"

import { useEffect, useState } from "react"
import { CinemaList } from "../components/cinema-list"
import { RackDashboard } from "../components/rack-dashboard"
import { RackEditor } from "../components/rack-editor"
import { LogsPage } from "../components/logs-page"
import type { Cinema } from "../types/cinema"
import { sampleCinemas } from "../data/sample-cinemas"
import { useCinemas } from "@/hooks/useCinemas"
import { LoginPage } from "@/components/login-page"
import { useRouter } from "next/navigation"

type ViewMode = "list" | "view" | "edit" | "logs" | "login"

export default function CinemaManagementApp() {
  const router = useRouter()
  const [user, setUser] = useState()
  const [password, setPassword] = useState()
  const [loadCinemas, setCinemas] = useState<Cinema[]>(sampleCinemas)
  const [selectedCinema, setSelectedCinema] = useState<Cinema | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [loggedIn, setLoggedIn] = useState(false) // inicializamos en true para ver dashboard

  const { cinemas, isLoading, error, refresh } = useCinemas();

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

  const handleNavigateToLogin = () => {
    setViewMode("login")
  }

  const handleLogin = (email: string, password: string) => {
    setUser(email)
    setPassword(password)

    setLoggedIn(true)
    setViewMode("list")
  }

  const handleLogout = () => {
    alert("Cerrando sesión...")
    setLoggedIn(false) // esto muestra el login
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
    setCinemas((prev) =>
    prev.map((c) => (c.id === updatedCinema.id ? updatedCinema : c))
  )
  
    // Redirigir después de que la acción ocurra (click)
    router.push(`/racks/${updatedCinema.id}`)
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

  if (viewMode === "login") {
    return <LoginPage onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <CinemaList
          user={user}
          password={password}
          cinemas={cinemas}
          loggedIn={loggedIn}
          onLogin={handleNavigateToLogin}
          onSelectCinema={handleSelectCinema}
          onEditCinema={handleEditCinema}
          onUploadExcel={handleUploadExcel}
          onCreateCinema={handleCreateCinema}
          onNavigateToLogs={handleNavigateToLogs}
          onLogout={handleLogout}
          isLoading={isLoading}
        />
      </div>
    </div>
  ) }
