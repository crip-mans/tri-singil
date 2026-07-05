const HISTORY_KEY = 'tri-singil-history'
const MAX_ENTRIES = 20

export function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY)) ?? []
  } catch {
    return []
  }
}

// Skips writing a duplicate entry when the same route/passenger/fare was
// just recalculated (e.g. re-render after an unrelated state change).
export function addHistoryEntry(entry) {
  const existing = loadHistory()
  const last = existing[0]
  if (
    last &&
    last.originName === entry.originName &&
    last.destinationName === entry.destinationName &&
    last.passengerType === entry.passengerType &&
    last.fare === entry.fare
  ) {
    return
  }

  const next = [
    { ...entry, id: crypto.randomUUID(), timestamp: Date.now() },
    ...existing,
  ].slice(0, MAX_ENTRIES)

  localStorage.setItem(HISTORY_KEY, JSON.stringify(next))
}
