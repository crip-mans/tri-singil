import { useState } from 'react'

function LocationSearch({ label, value, zones, onSelectZone }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)

  const filtered = zones.filter((zone) =>
    zone.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="relative flex-1">
      <input
        value={open ? query : value}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => {
          setQuery('')
          setOpen(true)
        }}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder={label}
        className="w-full border-b border-slate/25 bg-transparent py-1 font-body text-sm text-charcoal placeholder:text-slate focus:border-marigold focus:outline-none"
      />

      {open && (
        <ul className="absolute inset-x-0 top-full z-10 mt-1 max-h-40 overflow-y-auto rounded-[10px] bg-white shadow-[0_8px_24px_rgba(180,140,60,0.16)]">
          {filtered.length === 0 ? (
            <li className="px-3 py-2 text-sm text-slate">No matches</li>
          ) : (
            filtered.map((zone) => (
              <li key={zone.id}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    onSelectZone(zone)
                    setQuery('')
                    setOpen(false)
                  }}
                  className="block w-full px-3 py-2 text-left text-sm text-charcoal hover:bg-marigold/10"
                >
                  {zone.name}
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}

export default LocationSearch
