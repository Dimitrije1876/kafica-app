import { useEffect, useState } from "react"
import { collection, onSnapshot, doc, updateDoc, addDoc } from "firebase/firestore"
import { db } from "../../firebase"

const SVE_STAVKE = [
  { id: 1, naziv: "Espresso", cena: 150, kategorija: "Kafa" },
  { id: 2, naziv: "Cappuccino", cena: 200, kategorija: "Kafa" },
  { id: 3, naziv: "Coca Cola", cena: 180, kategorija: "Sokovi" },
  { id: 4, naziv: "Sok od narandže", cena: 200, kategorija: "Sokovi" },
  { id: 5, naziv: "Pivo", cena: 250, kategorija: "Alkohol" },
  { id: 6, naziv: "Vino", cena: 300, kategorija: "Alkohol" },
]

const STOLOVI = [1, 2, 3, 4, 5]

function BarView() {
  const [narudzbine, setNarudzbine] = useState([])
  const [aktivniSto, setAktivniSto] = useState(null)
  const [dodajeStavku, setDodajeStavku] = useState(false)
  const [prikazRacuna, setPrikazRacuna] = useState(false)

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "narudzbine"), (snapshot) => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
      setNarudzbine(data)
    })
    return () => unsub()
  }, [])

  const narudzbineZaSto = (broj) =>
    narudzbine.filter(n => n.stolBroj === broj && n.status !== "placeno")

  const statusSto = (broj) => {
    const nz = narudzbineZaSto(broj)
    if (nz.length === 0) return "slobodan"
    if (nz.some(n => n.status === "racun")) return "racun"
    return "aktivan"
  }

  const bojaSto = (status) => {
    if (status === "slobodan") return "bg-green-100 border-green-400"
    if (status === "racun") return "bg-red-100 border-red-400"
    return "bg-yellow-100 border-yellow-400"
  }

  const ukupnoZaSto = (broj) => {
    return narudzbineZaSto(broj)
      .flatMap(n => n.stavke || [])
      .reduce((acc, s) => acc + s.cena * s.kolicina, 0)
  }

  const dodajStavkuKonobar = async (stavka) => {
    await addDoc(collection(db, "narudzbine"), {
      sto: `Sto ${aktivniSto}`,
      stolBroj: aktivniSto,
      stavke: [{ ...stavka, kolicina: 1 }],
      ukupno: stavka.cena,
      status: "nova",
      vreme: new Date()
    })
    setDodajeStavku(false)
  }

  const zatrazRacun = async () => {
    const nz = narudzbineZaSto(aktivniSto)
    for (const n of nz) {
      await updateDoc(doc(db, "narudzbine", n.id), { status: "racun" })
    }
    setPrikazRacuna(true)
  }

  const naplati = async () => {
    const nz = narudzbineZaSto(aktivniSto)
    for (const n of nz) {
      await updateDoc(doc(db, "narudzbine", n.id), { status: "placeno" })
    }
    setPrikazRacuna(false)
    setAktivniSto(null)
  }

  const sveStvakeStola = (broj) =>
    narudzbineZaSto(broj).flatMap(n => n.stavke || [])

  const subtotal = ukupnoZaSto(aktivniSto)
  const pdv = Math.round(subtotal * 0.2)
  const ukupnoSaPdv = subtotal + pdv

  // Prikaz računa
  if (prikazRacuna && aktivniSto) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="bg-white rounded-xl shadow p-6 max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-center mb-1">Račun</h2>
          <p className="text-center text-gray-500 mb-4">Sto {aktivniSto}</p>
          <hr className="mb-4" />
          {sveStvakeStola(aktivniSto).map((s, i) => (
            <div key={i} className="flex justify-between text-sm mb-2">
              <span>{s.kolicina}x {s.naziv}</span>
              <span>{s.cena * s.kolicina} RSD</span>
            </div>
          ))}
          <hr className="my-4" />
          <div className="flex justify-between mb-1">
            <span className="text-gray-500">Subtotal</span>
            <span>{subtotal} RSD</span>
          </div>
          <div className="flex justify-between mb-1">
            <span className="text-gray-500">PDV 20%</span>
            <span>{pdv} RSD</span>
          </div>
          <div className="flex justify-between font-bold text-lg mt-2">
            <span>Ukupno</span>
            <span>{ukupnoSaPdv} RSD</span>
          </div>
          <button
            onClick={naplati}
            className="mt-6 w-full bg-green-500 text-white rounded-xl py-3 font-semibold"
          >
            Naplati i zatvori sto
          </button>
          <button
            onClick={() => setPrikazRacuna(false)}
            className="mt-2 w-full bg-gray-200 text-gray-700 rounded-xl py-3"
          >
            Nazad
          </button>
        </div>
      </div>
    )
  }

  // Detalji stola
  if (aktivniSto) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="bg-white p-4 shadow flex items-center gap-3">
          <button onClick={() => setAktivniSto(null)} className="text-gray-500">← Nazad</button>
          <h1 className="text-xl font-bold">Sto {aktivniSto}</h1>
        </div>

        <div className="p-4">
          {narudzbineZaSto(aktivniSto).length === 0 ? (
            <p className="text-center text-gray-400 mt-10">Nema narudžbina za ovaj sto.</p>
          ) : (
            narudzbineZaSto(aktivniSto).map(n => (
              <div key={n.id} className="bg-white rounded-xl shadow p-4 mb-3">
                {n.stavke?.map((s, i) => (
                  <div key={i} className="flex justify-between text-sm mb-1">
                    <span>{s.kolicina}x {s.naziv}</span>
                    <span>{s.cena * s.kolicina} RSD</span>
                  </div>
                ))}
              </div>
            ))
          )}

          <div className="bg-white rounded-xl shadow p-4 mb-3 flex justify-between font-bold">
            <span>Ukupno</span>
            <span>{ukupnoZaSto(aktivniSto)} RSD</span>
          </div>

          {/* Dodaj stavku */}
          {dodajeStavku ? (
            <div className="bg-white rounded-xl shadow p-4 mb-3">
              <h3 className="font-semibold mb-3">Izaberi stavku:</h3>
              {SVE_STAVKE.map(s => (
                <button
                  key={s.id}
                  onClick={() => dodajStavkuKonobar(s)}
                  className="w-full text-left px-3 py-2 mb-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  {s.naziv} — {s.cena} RSD
                </button>
              ))}
              <button
                onClick={() => setDodajeStavku(false)}
                className="w-full bg-gray-200 text-gray-700 rounded-xl py-2 mt-2"
              >
                Otkaži
              </button>
            </div>
          ) : (
            <button
              onClick={() => setDodajeStavku(true)}
              className="w-full bg-black text-white rounded-xl py-3 font-semibold mb-3"
            >
              + Dodaj narudžbinu
            </button>
          )}

          <button
            onClick={zatrazRacun}
            className="w-full bg-red-500 text-white rounded-xl py-3 font-semibold"
          >
            Zatraži račun
          </button>
        </div>
      </div>
    )
  }

  // Prikaz stolova
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white p-4 shadow text-center">
        <h1 className="text-2xl font-bold">Šank — Pregled stolova</h1>
      </div>

      <div className="p-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {STOLOVI.map(broj => {
          const status = statusSto(broj)
          return (
            <button
              key={broj}
              onClick={() => setAktivniSto(broj)}
              className={`border-2 rounded-xl p-6 text-center shadow ${bojaSto(status)}`}
            >
              <div className="text-3xl mb-2">🪑</div>
              <div className="font-bold text-lg">Sto {broj}</div>
              <div className="text-sm text-gray-600 mt-1">{status}</div>
              {status !== "slobodan" && (
                <div className="text-sm font-semibold mt-1">{ukupnoZaSto(broj)} RSD</div>
              )}
            </button>
          )
        })}
      </div>

      <div className="p-4 flex gap-3 text-sm">
        <span className="bg-green-100 px-3 py-1 rounded-full">🟢 Slobodan</span>
        <span className="bg-yellow-100 px-3 py-1 rounded-full">🟡 Aktivan</span>
        <span className="bg-red-100 px-3 py-1 rounded-full">🔴 Račun</span>
      </div>
    </div>
  )
}

export default BarView