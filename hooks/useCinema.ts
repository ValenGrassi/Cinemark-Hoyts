import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Cinema } from "@/types/cinema";

export function useCinema(id: string) {
  const [data, setData] = useState<Cinema | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const d = await api.getCinema(id);
      setData(d);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  return { cinema: data, isLoading, error, refresh: fetchData };
}
