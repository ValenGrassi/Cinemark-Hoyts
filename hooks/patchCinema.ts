import { api } from "@/lib/api"
import type { Cinema } from "@/types/cinema"

export function usePatchComponents() {
  const patchCinema = async (id: string, payload: { rackComponents: any[] }) => {
    const response = await api.updateCinema(id, payload) // esto internamente hace el fetch con PATCH
    return response
  }

  return { patchCinema }
}

export function usePatchCinema() {
  const patchCinema = async (id: string, payload: Partial<Cinema>) => {
    const response =  await api.updateCinema(id, payload) // esto internamente hace el fetch con PATCH
    return response
  }

  return { patchCinema }
}

