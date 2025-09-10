import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Cinema } from "@/types/cinema";

export function useCinemas() {
  const [data, setData] = useState<Cinema[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    api.getCinemas()
      .then((d) => mounted && setData(d))
      .catch((e) => mounted && setError(e))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; }
  }, []);

  return { cinemas: data, isLoading, error, refresh: async () => {
    setLoading(true);
    setError(null);
    try {
      const d = await api.getCinemas();
      setData(d);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  } };
}