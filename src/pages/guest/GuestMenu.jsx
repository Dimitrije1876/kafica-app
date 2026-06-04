import { useState } from "react"
import { collection, addDoc } from "firebase/firestore"
import { db } from "../../firebase"
import { useParams } from "react-router-dom"

const kategorije = ["Sve", "Kafa", "Sokovi", "Alkohol", "Hrana"]

const stavke = [
  { id: 1, naziv: "Espresso", cena: 150, kategorija: "Kafa" },
  { id: 2, naziv: "Cappuccino", cena: 200, kategorija: "Kafa" },
  { id: 3, naziv: "Coca Cola", cena: 180, kategorija: "Sokovi" },
  { id: 4, naziv: "Sok od narandže", cena: 200, kategorija: "Sokovi" },
  { id: 5, naziv: "Pivo", cena: 250, kategorija: "Alkohol" },
  { id: 6, naziv: "Vino", cena: 300, kategorija: "Alkohol" },
]

function GuestMenu() {
  const { stolBroj } = useParams()
  const [aktivnaKategorija, setAktivnaKategorija] = useState("Sve")
  const [korpa, setKorpa] = useState([])
  const [poslato, setPoslato] = useState(false)

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
        sto: `Sto ${stolBroj}`,
        stolBroj: parseInt(stolBroj),
        stavke: korpa,
        ukupno: ukupno,
        status: "nova",
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
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-2xl font-bold mb-2">Narudžbina poslata!</h2>
          <p className="text-gray-500">Konobar će Vam doneti narudžbinu uskoro.</p>
          <button
            onClick={() => setPoslato(false)}
            className="mt-6 bg-black text-white px-6 py-2 rounded-xl"
          >
            Nova narudžbina
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <div className="bg-white p-4 shadow text-center">
        <h1 className="text-2xl font-bold">Kafić App</h1>
        <p className="text-gray-500 text-sm">Sto broj {stolBroj}</p>
      </div>

      {/* Kategorije */}
      <div className="flex gap-2 p-4 overflow-x-auto">
        {kategorije.map(k => (
          <button
            key={k}
            onClick={() => setAktivnaKategorija(k)}
            className={`px-4 py-2 rounded-full shadow text-sm whitespace-nowrap ${
              aktivnaKategorija === k ? "bg-black text-white" : "bg-white"
            }`}
          >
            {k}
          </button>
        ))}
      </div>

      {/* Stavke */}
      <div className="p-4 grid grid-cols-2 gap-4 pb-32">
        {filtrirane.map(s => (
          <div key={s.id} className="bg-white rounded-xl shadow p-4">
            <div className="bg-gray-200 rounded-lg h-24 mb-3"></div>
            <h3 className="font-semibold">{s.naziv}</h3>
            <p className="text-gray-500 text-sm">{s.cena} RSD</p>
            <button
              onClick={() => dodajUKorpu(s)}
              className="mt-2 w-full bg-black text-white rounded-lg py-1 text-sm"
            >
              Dodaj
            </button>
          </div>
        ))}
      </div>

      {/* Korpa */}
      {korpa.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">Korpa ({korpa.reduce((a, s) => a + s.kolicina, 0)})</span>
            <span className="font-bold">{ukupno} RSD</span>
          </div>
          <button
            onClick={posaljiNarudzbinu}
            className="w-full bg-black text-white rounded-xl py-3 font-semibold"
          >
            Pošalji narudžbinu
          </button>
        </div>
      )}

    </div>
  )
}

export default GuestMenu