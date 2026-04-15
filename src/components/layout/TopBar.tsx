import { Search, FileOutput, Bell, HelpCircle, PanelRightClose, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface TopBarProps {
  title?: string
  actions?: React.ReactNode
  isCopilotOpen?: boolean
  onToggleCopilot?: () => void
}

export function TopBar({ title = 'Home', actions, isCopilotOpen = true, onToggleCopilot }: TopBarProps) {
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
        {onToggleCopilot && (
          isCopilotOpen ? (
            <Button
              variant="ghost"
              size="icon"
              aria-label="Close Copilot"
              className="text-gray-500 hover:text-gray-800"
              onClick={onToggleCopilot}
            >
              <PanelRightClose className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="text-primary border-primary/30 hover:bg-primary/5 ml-1"
              onClick={onToggleCopilot}
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Open Copilot
            </Button>
          )
        )}
      </div>
    </header>
  )
}
