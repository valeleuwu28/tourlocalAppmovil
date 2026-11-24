import { useCallback, useEffect, useRef, useState } from "react";
import { getApiBaseUrl, API_URL } from "../config";

/**
 * Hook personalizado useApi (Módulo Esther Daza)
 * Permite consultar endpoints GET del backend TourLocal de forma centralizada.
 * Maneja estados de carga, error, datos y cancelación al desmontar.
 *
 * @param {string} endpoint - Ruta relativa (ej: '/api/destinos') o URL completa
 * @param {object} options - Opciones adicionales (headers, params, immediate)
 * @returns {{ data: any, loading: boolean, error: string|null, refetch: Function }}
 */
export default function useApi(endpoint, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(options.immediate !== false);
  const [error, setError] = useState(null);

  // Referencias para evitar fugas de memoria si el componente se desmonta
  const isMountedRef = useRef(true);
  const abortControllerRef = useRef(null);

  // Serializar opciones para evitar re-renders infinitos
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const fetchData = useCallback(async () => {
    if (!endpoint) return;

    // Abortar petición previa si todavía está pendiente
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      if (isMountedRef.current) {
        setLoading(true);
        setError(null);
      }

      // Construir la URL completa con la IP dinámica resuelta
      const baseUrl = getApiBaseUrl() || API_URL;
      let url = endpoint.startsWith("http")
        ? endpoint
        : `${baseUrl}${endpoint}`;

      // Si se envían params como objeto, concatenarlos como query string
      const currentOptions = optionsRef.current || {};
      if (currentOptions.params && typeof currentOptions.params === "object") {
        const queryParams = new URLSearchParams();
        Object.entries(currentOptions.params).forEach(([key, val]) => {
          if (val !== undefined && val !== null && val !== "") {
            queryParams.append(key, String(val));
          }
        });
        const queryString = queryParams.toString();
        if (queryString) {
          url += (url.includes("?") ? "&" : "?") + queryString;
        }
      }

      const response = await fetch(url, {
        method: "GET",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          ...currentOptions.headers,
        },
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        const errorMsg =
          (result && (result.error || result.message)) ||
          `Error ${response.status}: No se pudo obtener la información`;
        throw new Error(errorMsg);
      }

      if (isMountedRef.current) {
        setData(result);
        setError(null);
      }
    } catch (err) {
      // Ignorar errores provocados por la cancelación voluntaria
      if (err.name === "AbortError") return;

      if (isMountedRef.current) {
        setError(err.message || "Error de conexión con el servidor");
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [endpoint]);

  useEffect(() => {
    isMountedRef.current = true;

    if (options.immediate !== false) {
      fetchData();
    }

    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData, options.immediate]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}
