const CHIP_TYPES = [
  { value: 'student', label: 'Student' },
  { value: 'senior', label: 'Senior' },
  { value: 'pwd', label: 'PWD' },
]

function PassengerTypeToggle({ value, onChange }) {
  return (
    <div className="flex gap-2" role="group" aria-label="Passenger type">
      {CHIP_TYPES.map((type) => {
        const active = value === type.value
        return (
          <button
            key={type.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(active ? 'regular' : type.value)}
            className={
              'rounded-[10px] px-4 py-2 text-xs font-semibold transition-colors ' +
              (active
                ? 'bg-marigold text-white'
                : 'bg-white text-slate shadow-[0_4px_12px_rgba(180,140,60,0.10)]')
            }
          >
            {type.label}
          </button>
        )
      })}
    </div>
  )
}

export default PassengerTypeToggle
