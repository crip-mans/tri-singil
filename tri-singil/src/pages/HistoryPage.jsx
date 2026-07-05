import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { IconRoute } from '@tabler/icons-react'
import { loadHistory } from '../lib/history'

function relativeTime(timestamp) {
  const minutes = Math.round((Date.now() - timestamp) / 60000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  return `${days}d ago`
}

function peso(amount) {
  return `₱${Number(amount).toFixed(2)}`
}

function HistoryPage() {
  const [entries, setEntries] = useState([])

  useEffect(() => {
    setEntries(loadHistory())
  }, [])

  return (
    <div className="mx-auto max-w-md space-y-4 px-4 pt-6">
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="font-display text-2xl font-bold text-charcoal"
      >
        Recent estimates
      </motion.h1>

      {entries.length === 0 ? (
        <div className="card p-5">
          <p className="text-sm text-slate">No estimates yet — fares you check will show up here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.04, ease: 'easeOut' }}
              className="card flex items-center gap-3 p-4"
            >
              <span
                className={
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] ' +
                  (index % 2 === 0 ? 'bg-marigold/15 text-marigold' : 'bg-teal/15 text-teal')
                }
              >
                <IconRoute size={18} stroke={1.75} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-charcoal">
                  {entry.originName} → {entry.destinationName}
                </p>
                <p className="text-xs text-slate">{relativeTime(entry.timestamp)}</p>
              </div>
              <span className="font-mono text-sm font-semibold tabular-nums text-charcoal">
                {peso(entry.fare)}
              </span>
            </motion.div>
          ))}
        </div>
      )}

      <p className="pb-2 text-center text-xs text-slate">Estimates are saved on this device only</p>
    </div>
  )
}

export default HistoryPage
