import { QRCodeSVG } from 'qrcode.react'

const BASE_URL = "https://kafica-app.vercel.app"
const STOLOVI = [1, 2, 3, 4, 5]

function QRCodes() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-2">QR Kodovi</h1>
      <p className="text-center text-gray-500 mb-8">Odštampaj i postavi na stolove</p>

      <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto">
        {STOLOVI.map(broj => (
          <div key={broj} className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4">Sto {broj}</h2>
            <QRCodeSVG
              value={`${BASE_URL}/guest/${broj}`}
              size={180}
            />
            <p className="text-xs text-gray-400 mt-4 text-center">
              {BASE_URL}/guest/{broj}
            </p>
          </div>
        ))}
      </div>

      <p className="text-center text-gray-400 mt-8 text-sm">
        Otvori ovu stranicu u browseru i pritisni Ctrl+P da odštampaš
      </p>
    </div>
  )
}

export default QRCodes