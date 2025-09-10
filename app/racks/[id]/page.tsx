"use client"

import { useParams, useRouter, useSearchParams } from "next/navigation"
import { RackDashboard } from "@/components/rack-dashboard"
import { sampleCinemas } from "@/data/sample-cinemas"
import { RackNotFound } from "@/components/rack-not-found"
import { Cinema } from "@/types/cinema"
import { useCinema } from "@/hooks/useCinema"

export default function RackPage() {
  const searchParams = useSearchParams()
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  // Hook que trae los cines desde la API
  const { cinema, isLoading, error } = useCinema(id)


  if (isLoading) {
    return <div className="p-6 text-center">Cargando datos del cine...</div>
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">Error cargando cines</div>
  }

  if (!cinema) {
    return <RackNotFound searchParams={searchParams} onBack={() => router.push("/")} />
  }

  return <RackDashboard cinema={cinema} onBack={() => router.push("/")} />
}