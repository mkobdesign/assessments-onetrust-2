import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { Button } from '@/components/ui/button'
import { ArrowUp, Plus, CheckCircle2, ExternalLink, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

const quickActions = [
  'Learn about CCPA changes',
  'Analyze an incident',
  'Assess a processing activity',
]

const alerts = [
  {
    id: 1,
    severity: 'amber',
    title: 'CCPA update for automated decision-making technology, notice drafted',
    description:
      'Flagged 2 use cases and drafted the notice plus a risk assessment with mitigations.',
  },
  {
    id: 2,
    severity: 'red',
    title: 'High-risk processing update, 2 recommended controls',
    description:
      'A processing activity change now appears higher risk. I drafted a new risk register entry and suggested 2 controls plus evidence tasks based on your policies and regulations.',
  },
  {
    id: 3,
    severity: 'amber',
    title: 'Vendor SOC 2 update, 1 recommended control',
    description:
      'A vendor posted an updated SOC 2 report. I flagged 2 new risks and proposed 1 mitigating control, including an updated vendor risk score.',
  },
]

const severityColors: Record<string, string> = {
  red: 'bg-red-500',
  amber: 'bg-amber-400',
  green: 'bg-green-500',
}

export default function HomePage() {
  const [prompt, setPrompt] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const navigate = useNavigate()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = () => {
    if (!prompt.trim()) return
    navigate('/canvas', { state: { initialPrompt: prompt } })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleQuickAction = (action: string) => {
    if (action === 'Assess a processing activity') {
      setPrompt('We want to deploy ChatGPT Enterprise for support agents to summarize tickets, suggest customer replies, and search Confluence articles. It may use ticket data, customer names, account metadata, and escalation notes.')
      textareaRef.current?.focus()
    } else {
      setPrompt(action)
      textareaRef.current?.focus()
    }
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar title="Home" />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-6 pt-20 pb-16">
            {/* Hero prompt */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              <h2 className="text-2xl font-bold text-center text-gray-900 mb-8 tracking-tight">
                Have Copilot do it for you.
              </h2>

              {/* Prompt input */}
              <div
                className={`relative bg-white rounded-xl border transition-all duration-200 ${
                  isFocused
                    ? 'border-primary shadow-md shadow-primary/5'
                    : 'border-gray-200 shadow-sm'
                }`}
              >
                <textarea
                  ref={textareaRef}
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Copilot"
                  aria-label="Ask Copilot"
                  rows={3}
                  className="w-full resize-none bg-transparent px-4 pt-4 pb-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none leading-relaxed"
                />

                <div className="flex items-center justify-between px-3 pb-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 hover:text-gray-700"
                    aria-label="Attach files"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>

                  <Button
                    onClick={handleSubmit}
                    disabled={!prompt.trim()}
                    size="icon"
                    className="h-8 w-8 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    aria-label="Send message"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Disclaimer */}
              <p className="text-xs text-gray-400 mt-2 text-center">
                AI can make mistakes. Verify info.{' '}
                <button className="text-primary hover:underline inline-flex items-center gap-0.5">
                  Learn more <ExternalLink className="w-3 h-3" />
                </button>
              </p>

              {/* Quick actions */}
              <div className="flex flex-wrap gap-2 mt-6 justify-center">
                {quickActions.map(action => (
                  <button
                    key={action}
                    onClick={() => handleQuickAction(action)}
                    className="px-3 py-1.5 text-sm text-gray-600 bg-white border border-gray-200 rounded-full hover:border-gray-300 hover:text-gray-900 transition-all duration-150 hover:shadow-sm"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Alerts section */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 }}
              className="mt-12"
            >
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-sm font-semibold text-gray-900">
                  Alerts ({alerts.length})
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-purple-50 text-purple-700 rounded-full border border-purple-100">
                  <Sparkles className="w-3 h-3" />
                  AI
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {alerts.map((alert, i) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.05, duration: 0.3 }}
                    className="relative bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 hover:shadow-sm transition-all duration-150 cursor-pointer group"
                  >
                    <div
                      className={`absolute left-0 top-4 w-2 h-2 rounded-full -translate-x-1 ${severityColors[alert.severity]}`}
                    />

                    <div className="flex items-start gap-3 pl-2">
                      <CheckCircle2 className="w-4 h-4 text-gray-300 mt-0.5 flex-shrink-0 group-hover:text-gray-400 transition-colors" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900 leading-snug">
                          {alert.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                          {alert.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}
