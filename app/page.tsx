"use client"

import { useState } from "react"
import { CinemaList } from "../components/cinema-list"
import { RackDashboard } from "../components/rack-dashboard"
import type { Cinema } from "../types/cinema"
import { sampleCinemas } from "../data/sample-cinemas"

export default function CinemaManagementApp() {
  const [cinemas, setCinemas] = useState<Cinema[]>(sampleCinemas)
  const [selectedCinema, setSelectedCinema] = useState<Cinema | null>(null)

  const handleSelectCinema = (cinema: Cinema) => {
    setSelectedCinema(cinema)
  }

  const handleBackToList = () => {
    setSelectedCinema(null)
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

  if (selectedCinema) {
    return <RackDashboard cinema={selectedCinema} onBack={handleBackToList} />
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <CinemaList
          cinemas={cinemas}
          onSelectCinema={handleSelectCinema}
          onUploadExcel={handleUploadExcel}
          onCreateCinema={handleCreateCinema}
        />
      </div>
    </div>
  )
}
