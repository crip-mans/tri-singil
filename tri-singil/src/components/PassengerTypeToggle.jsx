const PASSENGER_TYPES = [
  { value: 'regular', label: 'Regular' },
  { value: 'student', label: 'Student' },
  { value: 'senior', label: 'Senior' },
  { value: 'pwd', label: 'PWD' },
]

function PassengerTypeToggle({ value, onChange }) {
  return (
    <div role="radiogroup" aria-label="Passenger type" className="flex justify-center gap-2">
      {PASSENGER_TYPES.map((type) => (
        <button
          key={type.value}
          type="button"
          role="radio"
          aria-checked={value === type.value}
          onClick={() => onChange(type.value)}
          className={
            value === type.value
              ? 'rounded border border-blue-600 bg-blue-600 px-3 py-1.5 text-sm text-white'
              : 'rounded border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700'
          }
        >
          {type.label}
        </button>
      ))}
    </div>
  )
}

export default PassengerTypeToggle
