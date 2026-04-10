import { useState } from 'react'
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
} from 'lucide-react'
import { dataSources } from '@/data/mockFlow'

const fileIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'file-text': FileText,
  shield: Shield,
  layout: Layout,
  'message-square': MessageSquare,
  'book-open': BookOpen,
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

  // Rank badge color based on priority
  const getRankColor = (r: number) => {
    if (r === 1) return 'bg-primary text-white'
    if (r === 2) return 'bg-primary/20 text-primary'
    if (r === 3) return 'bg-primary/10 text-primary/80'
    return 'bg-gray-100 text-gray-500'
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-start gap-3 bg-white border rounded-xl p-4 transition-all duration-150 group ${isDragging
          ? 'border-primary shadow-lg shadow-primary/10 scale-[1.01]'
          : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
        }`}
    >
      {/* Rank indicator */}
      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${getRankColor(rank)}`}>
        {rank}
      </div>

      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="flex-shrink-0 mt-0.5 text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing transition-colors"
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
              className="p-1 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
              aria-label="Remove source"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-2 leading-relaxed">{source.note}</p>
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

export default function AssessmentPreLaunch() {
  const navigate = useNavigate()
  const [sources, setSources] = useState(dataSources)
  const [fileBrowserOpen, setFileBrowserOpen] = useState(false)

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

        <main className="flex-1 overflow-y-auto">
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

              {/* CTA */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Ready to start?</h3>
                <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                  Copilot will use these sources to pre-fill answers across the assessment. You'll be able to review and confirm each one.
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
