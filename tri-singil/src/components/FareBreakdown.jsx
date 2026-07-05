function FareBreakdown({ result }) {
  if (!result) return null

  if (result.error) {
    return <p className="text-center text-amber-600">{result.error}</p>
  }

  const { breakdown, fare } = result

  return (
    <div className="mx-auto max-w-xs rounded border border-gray-200 p-4">
      <div className="flex justify-between">
        <span>Base fare</span>
        <span>₱{breakdown.baseFare}</span>
      </div>

      {breakdown.surcharge > 0 && (
        <div className="flex justify-between text-orange-600">
          <span>Night surcharge</span>
          <span>+₱{breakdown.surcharge}</span>
        </div>
      )}

      {breakdown.discount > 0 && (
        <div className="flex justify-between text-green-600">
          <span>Discount</span>
          <span>-₱{breakdown.discount}</span>
        </div>
      )}

      <div className="mt-2 flex justify-between border-t border-gray-200 pt-2 font-semibold">
        <span>Total</span>
        <span>₱{fare}</span>
      </div>
    </div>
  )
}

export default FareBreakdown
