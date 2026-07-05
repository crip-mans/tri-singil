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
        className="w-full border-b border-gray-200 py-1 text-sm text-gray-800 focus:border-orange-500 focus:outline-none"
      />

      {open && (
        <ul className="absolute inset-x-0 top-full z-10 mt-1 max-h-40 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg">
          {filtered.length === 0 ? (
            <li className="px-3 py-2 text-sm text-gray-400">No matches</li>
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
                  className="block w-full px-3 py-2 text-left text-sm hover:bg-orange-50"
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
