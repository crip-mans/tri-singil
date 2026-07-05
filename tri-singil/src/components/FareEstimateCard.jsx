import { useCountUp } from '../hooks/useCountUp'

const PASSENGER_LABELS = {
  regular: 'Regular',
  student: 'Student',
  senior: 'Senior',
  pwd: 'PWD',
}

function peso(amount) {
  return `₱${Number(amount).toFixed(2)}`
}

function FareEstimateCard({ result, passengerType }) {
  const total = result && !result.error ? result.fare : null
  const displayTotal = useCountUp(total)

  return (
    <div className="card p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate">Fare estimate</h2>
        <span className="rounded-[10px] bg-marigold/15 px-2.5 py-1 text-xs font-medium text-marigold">
          {PASSENGER_LABELS[passengerType]}
        </span>
      </div>

      {!result ? (
        <p className="text-sm text-slate">Set your origin and destination to see a fare.</p>
      ) : result.error ? (
        <p className="rounded-[10px] bg-coral/10 px-3 py-2 text-sm font-medium text-coral">
          {result.error}
        </p>
      ) : (
        <>
          <p className="font-display text-4xl font-bold text-charcoal">{peso(displayTotal)}</p>
          <p className="mt-1 font-mono text-xs tabular-nums text-slate">
            {peso(result.breakdown.baseFare)}
            {result.breakdown.surcharge > 0 && ` + ${peso(result.breakdown.surcharge)}`}
            {result.breakdown.discount > 0 && ` - ${peso(result.breakdown.discount)}`}
          </p>
        </>
      )}
    </div>
  )
}

export default FareEstimateCard
