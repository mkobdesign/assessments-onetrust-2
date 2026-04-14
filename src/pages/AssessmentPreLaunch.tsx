import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { motion, AnimatePresence } from 'framer-motion'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  GripVertical,
  FileText,
  Shield,
  Layout,
  MessageSquare,
  BookOpen,
  Plus,
  ChevronRight,
  Folder,
  File,
  Trash2,
  ArrowUp,
  Paperclip,
  Menu,
  X,
  Bookmark,
  ChevronDown,
} from 'lucide-react'
import { dataSources } from '@/data/mockFlow'

// SharePoint icon component
function SharePointIcon({ className }: { className?: string }) {
  return (
    <img
      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-uXSQaUB6d8aavaRrBwD8LVJFkVUnVa.png"
      alt="SharePoint"
      className={className}
    />
  )
}

// Audit icon component (outlined document with checkmark)
function AuditIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <polyline points="9 15 11 17 15 13" />
    </svg>
  )
}

const fileIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'file-text': FileText,
  shield: Shield,
  layout: Layout,
  'message-square': MessageSquare,
  'book-open': BookOpen,
  'sharepoint': SharePointIcon,
  'audit': AuditIcon,
}

const confidenceColor = (confidence: number) => {
  if (confidence >= 95) return 'text-green-600'
  if (confidence >= 85) return 'text-amber-600'
  return 'text-red-500'
}

interface SortableSourceCardProps {
  source: (typeof dataSources)[0]
  rank: number
  onDelete: (id: string) => void
}

function SortableSourceCard({ source, rank, onDelete }: SortableSourceCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: source.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
  }

  const Icon = fileIconMap[source.icon] || FileText

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-start gap-3"
    >
      {/* Rank indicator - outside card */}
      <span className="text-sm font-medium text-gray-400 w-4 flex-shrink-0 pt-4 text-right">
        {rank}
      </span>

      {/* Card */}
      <div className={`flex-1 flex items-start gap-3 bg-white border rounded-xl p-4 transition-all duration-150 group ${isDragging
        ? 'border-primary shadow-lg shadow-primary/10 scale-[1.01]'
        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
        }`}
      >
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="flex-shrink-0 mt-2 text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing transition-colors"
          aria-label="Drag to reorder"
        >
          <GripVertical className="w-4 h-4" />
        </button>

        {/* Icon */}
        <div className="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center flex-shrink-0 border border-primary/10">
          <Icon className="w-4 h-4 text-primary" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-gray-900">{source.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">{source.type}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className={`text-xs font-semibold ${confidenceColor(source.confidence)}`}>
                {source.confidence}% match
              </span>
              <button
                onClick={() => onDelete(source.id)}
                className="p-1 text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                aria-label="Remove source"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-2 leading-relaxed">{source.note}</p>
        </div>
      </div>
    </div>
  )
}

// Dummy file browser data
const fileBrowserItems = [
  { id: 'f1', name: 'Legal', type: 'folder', children: ['OpenAI_DPA_2024.pdf', 'MSA_Template.docx'] },
  { id: 'f2', name: 'Security', type: 'folder', children: ['Security_Assessment_Q4.pdf', 'Pen_Test_Results.pdf'] },
  { id: 'f3', name: 'Architecture', type: 'folder', children: ['System_Architecture_v3.png', 'Data_Flow_Diagram.pdf'] },
  { id: 'f4', name: 'Policies', type: 'folder', children: ['Data_Retention_Policy.pdf', 'Acceptable_Use_Policy.pdf'] },
  { id: 'f5', name: 'Support_SOP.pdf', type: 'file' },
  { id: 'f6', name: 'Privacy_Notice_Draft.docx', type: 'file' },
]

function FileBrowser({ onClose }: { onClose: () => void }) {
  const [expanded, setExpanded] = useState<string[]>(['f1'])
  const [selected, setSelected] = useState<string[]>([])

  return (
    <div>
      <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
        <div className="bg-gray-50 px-3 py-2 border-b border-gray-200">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Files</p>
        </div>
        <div className="max-h-64 overflow-y-auto">
          {fileBrowserItems.map(item => (
            <div key={item.id}>
              <button
                onClick={() => {
                  if (item.type === 'folder') {
                    setExpanded(prev =>
                      prev.includes(item.id) ? prev.filter(i => i !== item.id) : [...prev, item.id]
                    )
                  } else {
                    setSelected(prev =>
                      prev.includes(item.name) ? prev.filter(n => n !== item.name) : [...prev, item.name]
                    )
                  }
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${item.type === 'file' && selected.includes(item.name)
                  ? 'bg-primary/5 text-primary'
                  : 'text-gray-700'
                  }`}
              >
                {item.type === 'folder' ? (
                  <>
                    <ChevronRight
                      className={`w-3.5 h-3.5 text-gray-400 transition-transform ${expanded.includes(item.id) ? 'rotate-90' : ''}`}
                    />
                    <Folder className="w-4 h-4 text-amber-500" />
                  </>
                ) : (
                  <>
                    <span className="w-3.5" />
                    <File className="w-4 h-4 text-gray-400" />
                  </>
                )}
                {item.name}
              </button>
              {item.type === 'folder' && expanded.includes(item.id) && (item as { children?: string[] }).children?.map(child => (
                <button
                  key={child}
                  onClick={() => setSelected(prev => prev.includes(child) ? prev.filter(n => n !== child) : [...prev, child])}
                  className={`w-full flex items-center gap-2 pl-8 pr-3 py-2 text-sm hover:bg-gray-50 transition-colors ${selected.includes(child) ? 'bg-primary/5 text-primary' : 'text-gray-700'
                    }`}
                >
                  <File className="w-4 h-4 text-gray-400" />
                  {child}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {selected.length > 0 && (
        <p className="text-xs text-gray-500 mb-3">
          {selected.length} file{selected.length > 1 ? 's' : ''} selected
        </p>
      )}

      <div className="flex gap-2 justify-end">
        <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
        <Button size="sm" onClick={onClose} disabled={selected.length === 0}>
          Add {selected.length > 0 ? `${selected.length} file${selected.length > 1 ? 's' : ''}` : 'files'}
        </Button>
      </div>
    </div>
  )
}

// Previous work items (bookmarks)
const previousWorkItems = [
  { id: 'pw1', title: 'Privacy Review - Support Bot v1', date: '2 weeks ago' },
  { id: 'pw2', title: 'DPIA - Customer Analytics', date: '1 month ago' },
  { id: 'pw3', title: 'Vendor Assessment - Slack', date: '2 months ago' },
]

// Chat messages for the copilot
const initialCopilotMessages = [
  {
    id: 'm1',
    role: 'assistant' as const,
    content: "I've identified 5 relevant sources for this assessment based on your organization's documents and previous reviews. You can reorder or remove sources before starting.",
  },
]

export default function AssessmentPreLaunch() {
  const navigate = useNavigate()
  const [sources, setSources] = useState(dataSources)
  const [fileBrowserOpen, setFileBrowserOpen] = useState(false)
  const [copilotMessages, setCopilotMessages] = useState(initialCopilotMessages)
  const [inputValue, setInputValue] = useState('')
  const [previousWorkExpanded, setPreviousWorkExpanded] = useState(false)
  const chatBottomRef = useRef<HTMLDivElement>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setSources(items => {
        const oldIndex = items.findIndex(i => i.id === active.id)
        const newIndex = items.findIndex(i => i.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const handleDeleteSource = (id: string) => {
    setSources(items => items.filter(item => item.id !== id))
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return
    const userMsg = { id: `u${Date.now()}`, role: 'user' as const, content: inputValue }
    setCopilotMessages(prev => [...prev, userMsg])
    setInputValue('')

    // Simulate AI response
    setTimeout(() => {
      const aiMsg = {
        id: `a${Date.now()}`,
        role: 'assistant' as const,
        content: "I can help you with that. Let me know if you'd like me to add more sources or adjust the priority of existing ones.",
      }
      setCopilotMessages(prev => [...prev, aiMsg])
    }, 1000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [copilotMessages])

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar
          title="Privacy Review Request for Magellan Mobile App"
          actions={
            <Button variant="outline" size="sm" className="mr-2 text-xs">
              Submit for review
            </Button>
          }
        />

        <main className="flex-1 overflow-hidden">
          <div className="flex h-full">
            {/* Main content area */}
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-2xl mx-auto px-6 py-10">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    Review sources used to generate answers
                  </h2>
                  <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                    Drag to reorder. Items at the top are given maximum priority.
                  </p>

                  {/* Source count header */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-900">
                      Sources <span className="text-gray-400 font-normal">({sources.length})</span>
                    </h3>
                  </div>

                  {/* Source list */}
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext items={sources.map(s => s.id)} strategy={verticalListSortingStrategy}>
                      <div className="space-y-3 mb-6">
                        {sources.map((source, index) => (
                          <SortableSourceCard
                            key={source.id}
                            source={source}
                            rank={index + 1}
                            onDelete={handleDeleteSource}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>

                  {/* Add files button */}
                  <Button
                    variant="outline"
                    onClick={() => setFileBrowserOpen(true)}
                    className="w-full border-dashed text-gray-500 hover:text-gray-800 hover:border-gray-400 mb-10"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Files
                  </Button>

                  {/* Assessment Progress Audit - compact timeline */}
                  <div className="mb-8">
                    <p className="text-[12px] text-gray-700 uppercase tracking-wide mb-2">Progress audit</p>
                    <div className="relative pl-4">
                      {/* Timeline line */}
                      <div className="absolute left-[9px] top-1 bottom-1 w-px bg-gray-200" />

                      <div className="space-y-2">
                        {/* Agent 1 */}
                        <div className="flex items-center gap-2 relative">
                          <div className="absolute left-[-12px] w-3 h-3 rounded-full bg-gray-300 flex items-center justify-center">
                            <FileText className="w-1.5 h-1.5 text-white" />
                          </div>
                          <span className="text-[11px] text-gray-500 ml-2">Document Agent pre-filled <span className="text-gray-700 font-medium">12 questions</span></span>
                          <span className="text-[10px] text-gray-400">2m ago</span>
                        </div>

                        {/* Agent 2 */}
                        <div className="flex items-center gap-2 relative">
                          <div className="absolute left-[-12px] w-3 h-3 rounded-full bg-gray-300 flex items-center justify-center">
                            <Shield className="w-1.5 h-1.5 text-white" />
                          </div>
                          <span className="text-[11px] text-gray-500 ml-2">Reuse Agent added <span className="text-gray-700 font-medium">6 questions</span> from past work</span>
                          <span className="text-[10px] text-gray-400">1m ago</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">Ready to start?</h3>
                    <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                      Copilot will use these sources to pre-fill answers across the assessment. You&apos;ll be able to review and confirm each one.
                    </p>
                    <Button
                      onClick={() => navigate('/questionnaire')}
                      className="w-full"
                      size="lg"
                    >
                      Start Assessment
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Copilot panel */}
            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="w-[440px] border-l border-gray-200 bg-white flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Menu className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-semibold text-gray-900">Copilot</span>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <X className="w-3.5 h-3.5" />
                </Button>
              </div>

              {/* Previous Work Bookmark */}
              <div className="border-b border-gray-100">
                <button
                  onClick={() => setPreviousWorkExpanded(!previousWorkExpanded)}
                  className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Bookmark className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-medium text-gray-600">Previous work</span>
                    <span className="text-xs text-gray-400">({previousWorkItems.length})</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${previousWorkExpanded ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {previousWorkExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-3 space-y-2">
                        {previousWorkItems.map(item => (
                          <button
                            key={item.id}
                            className="w-full flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left"
                          >
                            <div>
                              <p className="text-xs font-medium text-gray-700">{item.title}</p>
                              <p className="text-[10px] text-gray-400">{item.date}</p>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                {copilotMessages.map(msg => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'user' ? (
                      <div className="max-w-[80%]">
                        <div className="bg-gray-100 rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm text-gray-800 leading-relaxed">
                          {msg.content}
                        </div>
                      </div>
                    ) : (
                      <div className="max-w-[85%] flex items-start gap-2.5">
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-[9px] font-bold">AI</span>
                        </div>
                        <div className="text-sm text-gray-700 leading-relaxed">
                          {msg.content}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
                <div ref={chatBottomRef} />
              </div>

              {/* Input area */}
              <div className="px-5 py-4 border-t border-gray-100">
                <div className="relative bg-gray-50 border border-gray-200 rounded-xl focus-within:border-primary focus-within:bg-white transition-all duration-150">
                  <textarea
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask Copilot about sources..."
                    aria-label="Chat input"
                    rows={2}
                    className="w-full resize-none bg-transparent px-4 pt-3 pb-1 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none leading-relaxed"
                  />
                  <div className="flex items-center justify-between px-3 pb-2">
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400" aria-label="Attach">
                      <Paperclip className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim()}
                      size="icon"
                      className="h-7 w-7 rounded-lg bg-primary hover:bg-primary/90 disabled:opacity-30"
                      aria-label="Send"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.aside>
          </div>
        </main>
      </div>

      {/* File browser modal */}
      <Dialog open={fileBrowserOpen} onOpenChange={setFileBrowserOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Files</DialogTitle>
          </DialogHeader>
          <FileBrowser onClose={() => setFileBrowserOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
