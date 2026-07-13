import { useState } from "react"
import { useNavigate } from "react-router-dom"

const recenzije = [
  { ime: "Marko P.", tekst: "Odlična kafa i prijatna atmosfera. Preporučujem svima!", ocena: 5 },
  { ime: "Ana S.", tekst: "Brza usluga i ljubazno osoblje. Definitivno se vraćam!", ocena: 5 },
  { ime: "Nikola J.", tekst: "Najbolji espresso u Zemunu. Omiljeno mesto za jutarnju kafu.", ocena: 5 },
]

function Home() {
  const [meniOtvoren, setMeniOtvoren] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* Navigacija */}
      <nav className="fixed top-0 left-0 right-0 bg-white shadow z-50 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-wide">☕ Zemun Kafe</h1>
        <div className="relative">
          <button
            onClick={() => setMeniOtvoren(!meniOtvoren)}
            className="bg-black text-white px-5 py-2 rounded-full text-sm font-semibold"
          >
            Naruči ▾
          </button>
          {meniOtvoren && (
            <div className="absolute right-0 mt-2 bg-white shadow-xl rounded-xl overflow-hidden w-48 z-50">
              <button
                onClick={() => navigate("/order/takeaway")}
                className="w-full text-left px-5 py-3 hover:bg-gray-100 text-sm font-medium"
              >
                🥡 Za poneti
              </button>
              <button
                onClick={() => navigate("/order/scan")}
                className="w-full text-left px-5 py-3 hover:bg-gray-100 text-sm font-medium border-t"
              >
                ☕ U kafiću
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero */}
      <div className="pt-20 bg-gradient-to-b from-amber-50 to-white min-h-screen flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-5xl font-bold mb-4 leading-tight">Dobrodošli u<br />Zemun Kafe</h2>
        <p className="text-gray-500 text-lg max-w-md mb-8">
          Vaše omiljeno mesto za jutarnju kafu, prijatne razgovore i odlična pića u srcu Zemuna.
        </p>
        <button
          onClick={() => setMeniOtvoren(true)}
          className="bg-black text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-800 transition"
        >
          Naruči odmah
        </button>
      </div>

      {/* O nama */}
      <div className="py-20 px-6 max-w-2xl mx-auto text-center">
        <h3 className="text-3xl font-bold mb-4">O nama</h3>
        <p className="text-gray-500 text-lg leading-relaxed">
          Zemun Kafe je mesto gde svaka šolja kafe priča priču. Od 2015. godine nudimo pažljivo birane kafe iz celog sveta, 
          pripremljene sa strašću i znanjem. Naš tim je tu da svaki vaš poseti učini posebnim.
        </p>
      </div>

      {/* Galerija */}
      <div className="py-10 bg-gray-50">
        <h3 className="text-3xl font-bold text-center mb-8">Galerija</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 px-6 max-w-4xl mx-auto">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="bg-amber-100 rounded-xl h-48 flex items-center justify-center text-4xl">
              ☕
            </div>
          ))}
        </div>
      </div>

      {/* Recenzije */}
      <div className="py-20 px-6 max-w-4xl mx-auto">
        <h3 className="text-3xl font-bold text-center mb-10">Recenzije</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recenzije.map((r, i) => (
            <div key={i} className="bg-white border rounded-xl p-6 shadow-sm">
              <div className="text-yellow-400 text-xl mb-2">{"★".repeat(r.ocena)}</div>
              <p className="text-gray-600 text-sm mb-4">"{r.tekst}"</p>
              <p className="font-semibold text-sm">— {r.ime}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Lokacija */}
      <div className="py-20 bg-gray-50 px-6">
        <h3 className="text-3xl font-bold text-center mb-8">Pronađi nas</h3>
        <div className="max-w-2xl mx-auto">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2829.5!2d20.4012!3d44.8403!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sKarađorđev+trg+9%2C+Zemun!5e0!3m2!1ssr!2srs!4v1"
            width="100%"
            height="350"
            className="rounded-xl shadow"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
          <p className="text-center text-gray-500 mt-4 text-lg">📍 Karađorđev trg 9, Zemun</p>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-black text-white py-10 px-6 text-center">
        <h4 className="text-xl font-bold mb-2">☕ Zemun Kafe</h4>
        <p className="text-gray-400 text-sm">Karađorđev trg 9, Zemun</p>
        <p className="text-gray-400 text-sm">Pon–Ned: 07:00 – 23:00</p>
        <p className="text-gray-400 text-sm mt-2">© 2026 Zemun Kafe</p>
      </div>

    </div>
  )
}

export default Home