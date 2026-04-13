import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { Button } from '@/components/ui/button'
import { ArrowUp, Plus, FileText, Shield, FolderOpen, Users } from 'lucide-react'
import { motion } from 'framer-motion'

const quickActions = [
  'Learn about CCPA changes',
  'Analyze an incident',
  'Assess a processing activity',
]





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
        <TopBar title="Self Service Portal" />

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
                className={`relative bg-white rounded-xl border transition-all duration-200 ${isFocused
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
              {/* <p className="text-xs text-gray-400 mt-2 text-center">
                AI can make mistakes. Verify info.{' '}
                <button className="text-primary hover:underline inline-flex items-center gap-0.5">
                  Learn more <ExternalLink className="w-3 h-3" />
                </button>
              </p> */}

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


            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut', delay: 0.2 }}
              className="mt-8"
            >
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                Your stuff
              </h3>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { icon: FileText, label: 'Assessments', path: '/assessments' },
                  { icon: Shield, label: 'Vendors', path: '/vendors' },
                  { icon: FolderOpen, label: 'Documents', path: '/documents' },
                  { icon: Users, label: 'Engagements', path: '/engagements' },
                ].map((link) => (
                  <button
                    key={link.label}
                    onClick={() => navigate(link.path)}
                    className="flex flex-col items-center gap-2 p-4 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all duration-150 group"
                  >
                    <link.icon className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                      {link.label}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>

          </div>
        </main>
      </div>
    </div>
  )
}
