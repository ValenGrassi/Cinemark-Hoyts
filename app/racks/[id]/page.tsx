"use client"

import { useParams, useRouter } from "next/navigation"
import { RackDashboard } from "@/components/rack-dashboard"
import { sampleCinemas } from "@/data/sample-cinemas"

export default function RackPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  // Buscar cine en el array estático
  const cinema = sampleCinemas.find((c) => c.id === id)

  if (!cinema) {
    return (
      <div className="p-6">
        <p className="text-sm text-gray-500">Rack no encontrado.</p>
        <button
          onClick={() => router.push("/")}
          className="mt-3 rounded px-3 py-1 border"
        >
          Volver
        </button>
      </div>
    )
  }

  return <RackDashboard cinema={cinema} onBack={() => router.push("/")} />
}
