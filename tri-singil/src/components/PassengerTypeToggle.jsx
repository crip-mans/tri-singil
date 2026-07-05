const PASSENGER_TYPES = [
  { value: 'regular', label: 'Regular' },
  { value: 'student', label: 'Student' },
  { value: 'senior', label: 'Senior' },
  { value: 'pwd', label: 'PWD' },
]

function PassengerTypeToggle({ value, onChange }) {
  return (
    <div
      role="radiogroup"
      aria-label="Passenger type"
      className="grid grid-cols-4 gap-1 rounded-full bg-gray-100 p-1"
    >
      {PASSENGER_TYPES.map((type) => (
        <button
          key={type.value}
          type="button"
          role="radio"
          aria-checked={value === type.value}
          onClick={() => onChange(type.value)}
          className={
            value === type.value
              ? 'rounded-full bg-orange-600 py-2 text-xs font-semibold text-white shadow-sm transition'
              : 'rounded-full py-2 text-xs font-medium text-gray-500 transition hover:text-gray-700'
          }
        >
          {type.label}
        </button>
      ))}
    </div>
  )
}

export default PassengerTypeToggle
