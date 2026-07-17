import { useState } from "react"
import { collection, addDoc } from "firebase/firestore"
import { db } from "../firebase"
import { useNavigate } from "react-router-dom"

const kategorije = ["Sve", "Kafa", "Sokovi", "Alkohol", "Hrana"]

const stavke = [
  { id: 1, naziv: "Espresso", cena: 150, kategorija: "Kafa" },
  { id: 2, naziv: "Cappuccino", cena: 200, kategorija: "Kafa" },
  { id: 3, naziv: "Coca Cola", cena: 180, kategorija: "Sokovi" },
  { id: 4, naziv: "Sok od narandže", cena: 200, kategorija: "Sokovi" },
  { id: 5, naziv: "Pivo", cena: 250, kategorija: "Alkohol" },
  { id: 6, naziv: "Vino", cena: 300, kategorija: "Alkohol" },
]

function Takeaway() {
  const [aktivnaKategorija, setAktivnaKategorija] = useState("Sve")
  const [korpa, setKorpa] = useState([])
  const [poslato, setPoslato] = useState(false)
  const [ime, setIme] = useState("")
  const [korakIme, setKorakIme] = useState(true)
  const navigate = useNavigate()

  const filtrirane = aktivnaKategorija === "Sve"
    ? stavke
    : stavke.filter(s => s.kategorija === aktivnaKategorija)

  const dodajUKorpu = (stavka) => {
    setKorpa(prev => {
      const postoji = prev.find(s => s.id === stavka.id)
      if (postoji) {
        return prev.map(s => s.id === stavka.id ? { ...s, kolicina: s.kolicina + 1 } : s)
      }
      return [...prev, { ...stavka, kolicina: 1 }]
    })
  }

  const ukupno = korpa.reduce((acc, s) => acc + s.cena * s.kolicina, 0)

  const posaljiNarudzbinu = async () => {
    try {
      await addDoc(collection(db, "narudzbine"), {
        sto: "Za poneti",
        stolBroj: 0,
        ime: ime,
        stavke: korpa,
        ukupno: ukupno,
        status: "nova",
        tip: "takeaway",
        vreme: new Date()
      })
      setPoslato(true)
      setKorpa([])
    } catch (e) {
      console.error("Greška: ", e)
    }
  }

  if (poslato) {
    return (
      <div className="min-h-screen bg-zinc-900 flex flex-col items-center justify-center text-white px-6">
        <div className="bg-zinc-800 border border-amber-800 rounded-xl p-8 text-center max-w-sm">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-2xl font-bold mb-2 text-amber-400">Narudžbina poslata!</h2>
          <p className="text-gray-400 mb-1">Ime: <span className="text-white font-semibold">{ime}</span></p>
          <p className="text-gray-400">Vaša narudžbina se priprema.</p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 bg-amber-600 text-white px-6 py-2 rounded-xl"
          >
            Nazad na početnu
          </button>
        </div>
      </div>
    )
  }

  if (korakIme) {
    return (
      <div className="min-h-screen bg-zinc-900 flex flex-col items-center justify-center text-white px-6">
        <div className="bg-zinc-800 border border-amber-800 rounded-xl p-8 text-center max-w-sm w-full">
          <h2 className="text-2xl font-bold mb-2 text-amber-400">Za poneti</h2>
          <p className="text-gray-400 mb-6">Unesite vaše ime da bismo znali ko preuzima narudžbinu</p>
          <input
            type="text"
            placeholder="Vaše ime..."
            value={ime}
            onChange={e => setIme(e.target.value)}
            className="w-full bg-zinc-700 text-white px-4 py-3 rounded-xl mb-4 outline-none border border-zinc-600 focus:border-amber-500"
          />
          <button
            onClick={() => ime.trim() && setKorakIme(false)}
            className="w-full bg-amber-600 hover:bg-amber-500 text-white py-3 rounded-xl font-semibold transition"
          >
            Nastavi →
          </button>
          <button
            onClick={() => navigate("/")}
            className="mt-3 w-full text-gray-400 text-sm underline"
          >
            ← Nazad
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white">

      {/* Header */}
      <div className="bg-zinc-800 border-b border-amber-900 p-4 text-center">
        <h1 className="text-xl font-bold text-amber-400">Za poneti</h1>
        <p className="text-gray-400 text-sm">Zdravo, {ime}!</p>
      </div>

      {/* Kategorije */}
      <div className="flex gap-2 p-4 overflow-x-auto">
        {kategorije.map(k => (
          <button
            key={k}
            onClick={() => setAktivnaKategorija(k)}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition ${
              aktivnaKategorija === k
                ? "bg-amber-600 text-white"
                : "bg-zinc-800 text-gray-300 border border-zinc-700"
            }`}
          >
            {k}
          </button>
        ))}
      </div>

      {/* Stavke */}
      <div className="p-4 grid grid-cols-2 gap-4 pb-32">
        {filtrirane.map(s => (
          <div key={s.id} className="bg-zinc-800 border border-zinc-700 rounded-xl p-4">
            <div className="bg-zinc-700 rounded-lg h-24 mb-3 flex items-center justify-center text-3xl">
              {s.kategorija === "Kafa" ? "☕" : s.kategorija === "Sokovi" ? "🥤" : s.kategorija === "Alkohol" ? "🍺" : "🍽️"}
            </div>
            <h3 className="font-semibold text-white">{s.naziv}</h3>
            <p className="text-amber-400 text-sm">{s.cena} RSD</p>
            <button
              onClick={() => dodajUKorpu(s)}
              className="mt-2 w-full bg-amber-600 hover:bg-amber-500 text-white rounded-lg py-1 text-sm transition"
            >
              Dodaj
            </button>
          </div>
        ))}
      </div>

      {/* Korpa */}
      {korpa.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-zinc-800 border-t border-amber-900 p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-white">Korpa ({korpa.reduce((a, s) => a + s.kolicina, 0)})</span>
            <span className="font-bold text-amber-400">{ukupno} RSD</span>
          </div>
          <button
            onClick={posaljiNarudzbinu}
            className="w-full bg-amber-600 hover:bg-amber-500 text-white rounded-xl py-3 font-semibold transition"
          >
            Pošalji narudžbinu
          </button>
        </div>
      )}

    </div>
  )
}

export default Takeaway