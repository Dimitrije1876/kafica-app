import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import jsQR from "jsqr"

function ScanQR() {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [greska, setGreska] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    let animFrame

    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
      .then(stream => {
        videoRef.current.srcObject = stream
        videoRef.current.play()
        videoRef.current.onloadedmetadata = () => {
          scan()
        }
      })
      .catch(() => setGreska(true))

    const scan = () => {
      const video = videoRef.current
      const canvas = canvasRef.current
      if (!video || !canvas) return

      const ctx = canvas.getContext("2d")
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const code = jsQR(imageData.data, imageData.width, imageData.height)

      if (code) {
        const url = code.data
        // Izvuci broj stola iz URL-a
        const match = url.match(/\/guest\/(\d+)/)
        if (match) {
          const stolBroj = match[1]
          // Zaustavi kameru
          video.srcObject.getTracks().forEach(t => t.stop())
          navigate(`/guest/${stolBroj}`)
          return
        }
      }

      animFrame = requestAnimationFrame(scan)
    }

    return () => {
      cancelAnimationFrame(animFrame)
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(t => t.stop())
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white px-6">
      <h2 className="text-2xl font-bold mb-2">Skeniraj QR kod</h2>
      <p className="text-gray-400 text-sm mb-6 text-center">Usmeri kameru prema QR kodu na stolu</p>

      {greska ? (
        <div className="text-center">
          <p className="text-red-400 mb-4">Kamera nije dostupna.</p>
          <button onClick={() => navigate("/")} className="bg-white text-black px-6 py-2 rounded-full">
            Nazad
          </button>
        </div>
      ) : (
        <div className="w-full max-w-sm relative">
          <video ref={videoRef} className="w-full rounded-xl" playsInline muted />
          <canvas ref={canvasRef} className="hidden" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="border-4 border-white w-48 h-48 rounded-xl opacity-50"></div>
          </div>
          <p className="text-center text-gray-400 text-sm mt-4">Postavi QR kod unutar okvira</p>
        </div>
      )}

      <button onClick={() => navigate("/")} className="mt-8 text-gray-400 text-sm underline">
        ← Nazad na početnu
      </button>
    </div>
  )
}

export default ScanQR