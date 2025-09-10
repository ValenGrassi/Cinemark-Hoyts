import { api } from "@/lib/api"
import type { Cinema } from "@/types/cinema"

export function usePatchCinema() {
  const patchCinema = async (id: string, payload: { rackComponents: any[] }) => {
    const response =  api.updateCinema(id, payload) // esto internamente hace el fetch con PATCH
    return response
  }

  return { patchCinema }
}