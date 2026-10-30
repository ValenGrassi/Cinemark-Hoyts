"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { LoaderSecond } from "./ui/loading copy";

interface CameraProps {
  ip: string;
}

export default function Camera({ ip }: CameraProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const pollingAbortRef = useRef<AbortController | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const cameraId = ip ? `cam-${ip.replace(/\./g, "-")}` : "cam-unknown";
  const streamUrl = `http://192.168.0.197:4000/stream/${cameraId}/index.m3u8`;

  useEffect(() => {
    if (!ip) {
      setError(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(false);

    // WebSocket
    const wsUrl = "ws://localhost:4000";
    let ws: WebSocket | null = null;
    try {
      ws = new WebSocket(wsUrl);
      wsRef.current = ws;
    } catch (e) {
      console.error("WS constructor error:", e);
      setError(true);
      setLoading(false);
      return;
    }

    ws.addEventListener("open", () => {
      console.log("WS open");
      try {
        ws!.send(
          JSON.stringify({
            action: "start",
            cameraId,
            rtsp: `rtsp://admin:rrrree12345678@${ip}:554/h264/ch1/main/av_stream`,
          })
        );
        console.log("WS sent start", cameraId);
      } catch (e) {
        console.error("WS send error:", e);
      }
    });
    ws.addEventListener("message", (ev) => console.log("WS message:", ev.data));
    ws.addEventListener("error", (ev) => console.error("WS error event:", ev));
    ws.addEventListener("close", (ev) =>
      console.warn("WS closed:", { code: ev.code, reason: ev.reason, wasClean: ev.wasClean })
    );

    let stopped = false;

    const startPlayer = async () => {
      const video = videoRef.current;
      if (!video || stopped) {
        console.warn("startPlayer: video no disponible o detenido");
        return;
      }

      try {
        video.crossOrigin = "anonymous";
      } catch {}

      // Native HLS (Safari)
      if (video.canPlayType("application/vnd.apple.mpegurl") && /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)) {
        // Solo Safari usa nativo
        video.src = streamUrl;
        video.onloadeddata = () => {
          video.play().catch(console.error);
          setLoading(false);
        };
      } else if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(console.error);
          setLoading(false);
        });
      } else {
        setError(true);
      }
       
      // hls.js
      if (Hls.isSupported()) {
        console.log("Usando hls.js para:", streamUrl);
        const hls = new Hls();
        hlsRef.current = hls;

        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error("hls.js error:", event, data);
          // Si es fatal, marcar error
          // @ts-ignore
          if (data && data.fatal) {
            setError(true);
            setLoading(false);
            try {
              hls.destroy();
            } catch {}
          }
        });

        try {
          hls.loadSource(streamUrl);
          hls.attachMedia(video);
        } catch (err) {
          console.error("hls load/attach error:", err);
          setError(true);
          setLoading(false);
          return;
        }

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch((e) => console.warn("play() hls.js rechazado:", e));
          setLoading(false);
        });

        return;
      }

      console.error("HLS no soportado en este navegador");
      setError(true);
      setLoading(false);
    };

    // Espera al playlist. Acepta 200 o 206 y content-type con mpegurl
    const waitForStream = async () => {
      pollingAbortRef.current = new AbortController();
      const signal = pollingAbortRef.current.signal;

      for (let i = 0; i < 20; i++) {
        if (stopped) return;
        console.log(`Comprobando stream (${i + 1}/20): ${streamUrl}`);
        try {
          const res = await fetch(streamUrl, { method: "GET", signal });
          console.log("Respuesta comprobación:", res.status, res.headers.get("content-type"));
          if (res.status === 200 || res.status === 206) {
            const ct = (res.headers.get("content-type") || "").toLowerCase();
            if (ct.includes("mpegurl") || ct.includes("x-mpegurl") || ct.includes("vnd.apple.mpegurl")) {
              // playlist disponible
              try {
                // cancelar lectura si hay body para liberar recursos
                if (res.body && typeof res.body.cancel === "function") {
                  await res.body.cancel();
                }
              } catch {}
              console.log("Playlist detectado, arrancando player");
              await startPlayer();
              return;
            } else {
              console.warn("Content-Type inesperado pero status OK:", ct);
              try {
                if (res.body && typeof res.body.cancel === "function") {
                  await res.body.cancel();
                }
              } catch {}
              // aún así intentamos arrancar
              await startPlayer();
              return;
            }
          }
        } catch (err) {
          console.debug("Intento stream fallido:", i, err);
        }

        await new Promise((r) => setTimeout(r, 800));
      }

      console.error("No se detectó el stream en el tiempo esperado");
      setError(true);
      setLoading(false);
    };

    waitForStream();

    return () => {
      stopped = true;
      setLoading(false);
      try {
        if (wsRef.current) wsRef.current.close();
        else if (ws) ws.close();
      } catch {}
      wsRef.current = null;

      try {
        pollingAbortRef.current?.abort();
      } catch {}

      try {
        if (hlsRef.current) {
          hlsRef.current.destroy();
          hlsRef.current = null;
        }
      } catch {}
    };
  }, [ip]);

  return (
    <div style={{ position: "relative", marginBottom: "10px" }}>
      {loading && !error && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#ffffff",
            zIndex: 20,
            borderRadius: 12,
          }}
        >
          <LoaderSecond />
        </div>
      )}

      {error ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#ffffff",
            color: "black",
            zIndex: 30,
            fontSize: "14px",
            borderRadius: 12,
            textAlign: "center",
            padding: 12,
          }}
        >
          ❌ No se puede acceder a la cámara. Revisar IP, CORS o el servidor de streaming.
        </div>
      ) : (
        <video
  ref={videoRef}
  autoPlay
  muted
  playsInline
  onError={(e) => console.error("Video error:", e)}
  style={{ width: "100%", borderRadius: "12px", background: "#000" }}
/>
      )}
    </div>
  );
}
