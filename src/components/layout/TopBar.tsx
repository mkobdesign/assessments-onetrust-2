import { Search, FileOutput, Bell, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface TopBarProps {
  title?: string
  actions?: React.ReactNode
}

export function TopBar({ title = 'Home', actions }: TopBarProps) {
  return (
    <header className="flex items-center justify-between h-14 px-6 bg-white border-b border-gray-100 flex-shrink-0">
      <h1 className="text-[15px] font-semibold text-gray-900">{title}</h1>

      <div className="flex items-center gap-1">
        {actions}
        <Button
          variant="ghost"
          size="icon"
          aria-label="Search"
          className="text-gray-500 hover:text-gray-800"
        >
          <Search className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Export"
          className="text-gray-500 hover:text-gray-800"
        >
          <FileOutput className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          className="text-gray-500 hover:text-gray-800"
        >
          <Bell className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Help"
          className="text-gray-500 hover:text-gray-800"
        >
          <HelpCircle className="w-4 h-4" />
        </Button>
      </div>
    </header>
  )
}
