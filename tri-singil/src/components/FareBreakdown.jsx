function FareBreakdown({ result }) {
  if (!result) return null

  if (result.error) {
    return (
      <p className="rounded-2xl bg-amber-50 px-4 py-3 text-center text-sm text-amber-700">
        {result.error}
      </p>
    )
  }

  const { breakdown, fare } = result

  return (
    <div className="rounded-2xl bg-gray-50 p-4">
      <div className="flex justify-between text-sm text-gray-600">
        <span>Base fare</span>
        <span>₱{breakdown.baseFare}</span>
      </div>

      {breakdown.surcharge > 0 && (
        <div className="mt-1 flex justify-between text-sm text-orange-600">
          <span>Night surcharge</span>
          <span>+₱{breakdown.surcharge}</span>
        </div>
      )}

      {breakdown.discount > 0 && (
        <div className="mt-1 flex justify-between text-sm text-green-600">
          <span>Discount</span>
          <span>-₱{breakdown.discount}</span>
        </div>
      )}

      <div className="mt-3 flex items-center justify-between border-t border-gray-200 pt-3">
        <span className="text-sm font-medium text-gray-600">Total fare</span>
        <span className="text-2xl font-bold text-gray-900">₱{fare}</span>
      </div>
    </div>
  )
}

export default FareBreakdown
