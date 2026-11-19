import { useEffect, useState } from "react";
import { API_URL } from "../config";

export default function useApi(endpoint) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch(`${API_URL}${endpoint}`);
        const result = await response.json();
        if (response.ok) setData(result);
        else setError(result.error || "Error en la petición");
      } catch {
        setError("No se pudo conectar con la API");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [endpoint]);

  return { data, loading, error };
}
