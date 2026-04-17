import { useState } from 'react'
import { FileText, ChevronDown, CheckCircle2 } from 'lucide-react'

interface SourceStats {
  relevance: string
  completeness: string
  freshness: string
  contradictions: string
}

interface Source {
  id: string
  name: string
  type: string
}

interface SourcesListProps {
  sources: Source[]
  getStats: (sourceId: string) => SourceStats
  getQuestions: (sourceId: string) => string[]
}

export function SourcesList({ sources, getStats, getQuestions }: SourcesListProps) {
  const [expandedSources, setExpandedSources] = useState<Set<string>>(new Set())

  const toggleExpanded = (sourceId: string) => {
    const newExpanded = new Set(expandedSources)
    if (newExpanded.has(sourceId)) {
      newExpanded.delete(sourceId)
    } else {
      newExpanded.add(sourceId)
    }
    setExpandedSources(newExpanded)
  }

  return (
    <div className="w-full bg-white border-t border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-gray-100">
        <p className="text-xs font-semibold text-gray-900">Sources used</p>
      </div>
      {/* Document list with collapsible details */}
      <div className="divide-y divide-gray-100">
        {sources.map((source, idx) => {
          const stats = getStats(source.id)
          const questions = getQuestions(source.id)
          const isExpanded = expandedSources.has(source.id)

          return (
            <div key={source.id}>
              {/* Source row with chevron */}
              <button
                onClick={() => toggleExpanded(source.id)}
                className="w-full px-3 py-2.5 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-xs w-4">{idx + 1}.</span>
                  <FileText className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-800 truncate">{source.name}</p>
                    <p className="text-[10px] text-gray-500">{source.type}</p>
                  </div>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-gray-400 flex-shrink-0 transition-transform ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </button>

              {/* Collapsed stats - only show if expanded */}
              {isExpanded && (
                <div className="px-3 pb-3 pt-1 bg-gray-50/50 space-y-2">
                  <div className="grid grid-cols-2 gap-1.5">
                    <div className="text-[10px]">
                      <span className="text-gray-500">Relevance:</span>{' '}
                      <span
                        className={stats.relevance === 'High' ? 'text-green-600 font-medium' : 'text-amber-600 font-medium'}
                      >
                        {stats.relevance}
                      </span>
                    </div>
                    <div className="text-[10px]">
                      <span className="text-gray-500">Completeness:</span>{' '}
                      <span
                        className={
                          stats.completeness === 'Complete' || stats.completeness === 'Good'
                            ? 'text-green-600 font-medium'
                            : 'text-amber-600 font-medium'
                        }
                      >
                        {stats.completeness}
                      </span>
                    </div>
                    <div className="text-[10px]">
                      <span className="text-gray-500">Freshness:</span>{' '}
                      <span className={stats.freshness === 'Current' ? 'text-green-600 font-medium' : 'text-amber-600 font-medium'}>
                        {stats.freshness}
                      </span>
                    </div>
                    <div className="text-[10px]">
                      <span className="text-gray-500">Contradictions:</span>{' '}
                      <span className="text-green-600 font-medium">{stats.contradictions}</span>
                    </div>
                  </div>
                  {/* Questions answered */}
                  {questions.length > 0 && (
                    <div className="pt-1.5 border-t border-gray-200">
                      <p className="text-[10px] text-gray-500 mb-1">Questions answered:</p>
                      <div className="space-y-0.5">
                        {questions.map((q, qIdx) => (
                          <div key={qIdx} className="flex items-center gap-1.5 text-[10px]">
                            <CheckCircle2 className="w-2.5 h-2.5 text-green-500 flex-shrink-0" />
                            <span className="text-gray-700 truncate">{q}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
