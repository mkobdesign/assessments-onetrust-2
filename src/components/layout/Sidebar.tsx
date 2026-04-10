import { cn } from '@/lib/utils'
import {
  Home,
  Clock,
  BarChart2,
  LayoutGrid,
  FileText,
  Flag,
  Layers,
  Shield,
  BookOpen,
  AlertTriangle,
  Settings,
  FlaskConical,
} from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'

const topNavItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Clock, label: 'Recent', path: '/recent' },
  { icon: BarChart2, label: 'Analytics', path: '/analytics' },
]

const mainNavItems = [
  { icon: LayoutGrid, label: 'Dashboard', path: '/dashboard' },
  { icon: FileText, label: 'Assessments', path: '/assessments' },
  { icon: Flag, label: 'Risk Register', path: '/risks' },
  { icon: Layers, label: 'Processing Activities', path: '/activities' },
  { icon: Shield, label: 'Vendors', path: '/vendors' },
  { icon: BookOpen, label: 'Policies', path: '/policies' },
]

const bottomNavItems = [
  { icon: AlertTriangle, label: 'Incidents', path: '/incidents' },
  { icon: Shield, label: 'Controls', path: '/controls' },
  { icon: Layers, label: 'Frameworks', path: '/frameworks' },
  { icon: Flag, label: 'Flags', path: '/flags' },
]

interface NavItemProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  path: string
  active?: boolean
  onClick: () => void
  badge?: boolean
}

function NavItem({ icon: Icon, label, active, onClick, badge }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        'relative flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-150',
        active
          ? 'bg-primary/10 text-primary'
          : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
      )}
    >
      <Icon className="w-4.5 h-4.5" />
      {badge && (
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
      )}
    </button>
  )
}

export function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <aside
      className="flex flex-col items-center w-[56px] min-h-screen bg-white border-r border-gray-100 py-4 gap-1 flex-shrink-0"
      aria-label="Main navigation"
    >
      {/* Logo */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center justify-center w-9 h-9 mb-4 text-primary font-bold text-base hover:opacity-80 transition-opacity"
        aria-label="Go to home"
      >
        <span className="font-bold text-[15px] tracking-tight">ot</span>
      </button>

      {/* Top nav */}
      <div className="flex flex-col items-center gap-1 w-full px-2">
        {topNavItems.map(item => (
          <NavItem
            key={item.path}
            {...item}
            active={location.pathname === item.path}
            onClick={() => navigate(item.path)}
            badge={item.path === '/recent'}
          />
        ))}
      </div>

      <div className="w-6 h-px bg-gray-100 my-3" />

      {/* Main nav */}
      <div className="flex flex-col items-center gap-1 w-full px-2">
        {mainNavItems.map(item => (
          <NavItem
            key={item.path}
            {...item}
            active={location.pathname === item.path}
            onClick={() => navigate(item.path)}
          />
        ))}
      </div>

      <div className="flex-1" />

      {/* Bottom nav */}
      <div className="flex flex-col items-center gap-1 w-full px-2">
        {bottomNavItems.map(item => (
          <NavItem
            key={item.path}
            {...item}
            active={false}
            onClick={() => navigate(item.path)}
          />
        ))}
        <div className="w-6 h-px bg-gray-100 my-1" />
        <NavItem icon={FlaskConical} label="Labs" path="/labs" active={false} onClick={() => {}} />
        <NavItem icon={Settings} label="Settings" path="/settings" active={false} onClick={() => {}} />
      </div>
    </aside>
  )
}
