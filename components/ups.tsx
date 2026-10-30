"use client"

import { useEffect, useState } from "react"

export function useUps(upsIp: string) {
  const [upsData, setUpsData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const ws = new WebSocket("ws://192.168.0.197:4000")

    let interval: any = null;
    let started = false; // ✅ NUEVO
  
    const tryStart = () => {
      if (!started && ws.readyState === WebSocket.OPEN) {
        console.log("📡 Forzando UPS start");
        ws.send(
          JSON.stringify({
            action: "start",
            upsIp,
          })
        );
        started = true;          // ✅ NUEVO
        clearInterval(interval); // ✅ mantenemos lo que ya tenías
      }
    };
  

    ws.onopen = () => {
      tryStart()
    }

    // 🔁 Reintenta hasta que el socket esté realmente listo
    interval = setInterval(tryStart, 500)

    ws.onmessage = (message) => {
      try {
        const data = JSON.parse(message.data)
        setUpsData(data)
        setLoading(false)
      } catch {
        console.log("📥 Mensaje UPS:", message.data)
      }
    }

    ws.onerror = (error) => {
      console.error("❌ Error WS UPS:", error)
    }

    return () => {
      clearInterval(interval)
      try {
        ws.send(JSON.stringify({ action: "stop", upsIp }))
      } catch {}
      ws.close()
    }
  }, [upsIp])

  return { upsData, loading }
}
