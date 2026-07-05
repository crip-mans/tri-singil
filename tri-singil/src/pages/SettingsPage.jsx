import { motion } from 'framer-motion'

function SettingsPage() {
  return (
    <div className="mx-auto max-w-md space-y-4 px-4 pt-6">
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="font-display text-2xl font-bold text-charcoal"
      >
        Settings
      </motion.h1>
      <div className="card p-5">
        <p className="text-sm text-slate">More settings are coming soon.</p>
      </div>
    </div>
  )
}

export default SettingsPage
