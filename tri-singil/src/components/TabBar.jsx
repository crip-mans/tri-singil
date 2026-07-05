import { NavLink } from 'react-router-dom'
import { IconMap2, IconClockHour4, IconSettings } from '@tabler/icons-react'

const TABS = [
  { to: '/', label: 'Map', icon: IconMap2, end: true },
  { to: '/history', label: 'History', icon: IconClockHour4 },
  { to: '/settings', label: 'Settings', icon: IconSettings },
]

function TabBar() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex justify-around border-t border-transparent bg-white px-4 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 shadow-[0_-4px_16px_rgba(180,140,60,0.10)]"
      aria-label="Primary"
    >
      {TABS.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          aria-label={label}
          className="flex flex-col items-center gap-1 px-4 py-1"
        >
          {({ isActive }) => (
            <span
              className={
                'flex h-10 w-10 items-center justify-center rounded-[10px] transition-colors ' +
                (isActive ? 'bg-marigold/15 text-marigold' : 'text-slate')
              }
            >
              <Icon size={22} stroke={1.75} />
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

export default TabBar
