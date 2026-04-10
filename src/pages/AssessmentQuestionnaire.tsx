import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import {
  CheckCircle2,
  Circle,
  Sparkles,
  Paperclip,
  ArrowUp,
  Database,
  Search,
  MessageCircle,
  X,
  ChevronRight,
  Bot,
  CheckCheck,
  Minus,
  Pencil,
} from 'lucide-react'
import { privacyAssessmentSections, type Question } from '@/data/assessmentQuestions'

const aiMessages = [
  {
    id: 'ai1',
    content:
      "Good progress, 6 of 10 questions are complete. It's 62% ready for privacy approval thanks to the documents and assessments you selected.",
    delay: 0,
  },
  {
    id: 'ai2',
    content:
      'You can use these tools to generate answers, or have me guide you through the experience.',
    delay: 0,
  },
]

const aiPrefilledMessages = [
  'Based on your uploaded DPA, OpenAI disables training on customer prompts. I pre-completed the vendor data usage section.',
  'I detected Zendesk RBAC groups in the architecture diagram. Should access be limited to support managers and agents only?',
  'Because responses are customer-facing, I marked human review as required before sending.',
]

const readinessSummary = {
  records: 8,
  assessments: 4,
  complete: 72,
  followUps: 2,
  recommendation: 'Low risk with human-in-the-loop controls',
}

function QuestionNav({
  sections,
  currentQuestionId,
  onSelect,
}: {
  sections: typeof privacyAssessmentSections
  currentQuestionId: string
  onSelect: (id: string) => void
}) {
  return (
    <nav className="overflow-y-auto scrollbar-thin py-4" aria-label="Question navigation">
      {sections.map(section => (
        <div key={section.id} className="mb-4">
          <div className="px-4 py-1.5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {section.title} ({section.count})
            </p>
          </div>
          {section.questions.map(q => {
            const isCurrent = q.id === currentQuestionId
            const isAnswered = q.answered

            return (
              <button
                key={q.id}
                onClick={() => onSelect(q.id)}
                className={`w-full flex items-center gap-2.5 px-4 py-2 text-left transition-all duration-150 ${
                  isCurrent ? 'bg-primary/5 border-l-2 border-primary' : 'hover:bg-gray-50 border-l-2 border-transparent'
                }`}
                aria-current={isCurrent ? 'step' : undefined}
              >
                <div className="flex-shrink-0">
                  {isAnswered ? (
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  ) : isCurrent ? (
                    <div className="w-4 h-4 rounded-full border-2 border-primary bg-primary/10 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    </div>
                  ) : (
                    <Circle className="w-4 h-4 text-gray-300" />
                  )}
                </div>
                <div className="min-w-0">
                  <span className="text-xs text-gray-400 font-mono">{q.number}</span>
                  <p className={`text-xs leading-snug truncate mt-0.5 ${isCurrent ? 'font-semibold text-gray-900' : isAnswered ? 'text-gray-500' : 'text-gray-700'}`}>
                    {q.title}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      ))}
    </nav>
  )
}

function QuestionCard({
  question,
  onAnswer,
  onClarify,
  isActive,
}: {
  question: Question
  onAnswer: (questionId: string, answerId: string) => void
  onClarify: (question: Question) => void
  isActive: boolean
}) {
  const [selected, setSelected] = useState(question.aiPrefilled ?? '')

  const handleSelect = (value: string) => {
    setSelected(value)
    onAnswer(question.id, value)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`bg-white border rounded-xl p-6 mb-4 transition-all duration-200 ${
        isActive ? 'border-primary/30 shadow-sm shadow-primary/5' : 'border-gray-200'
      }`}
      id={`question-${question.id}`}
    >
      {/* Question header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
              {question.number}
            </span>
            {question.answered && (
              <span className="inline-flex items-center gap-1 text-xs text-primary bg-primary/8 px-2 py-0.5 rounded-full font-medium">
                <Sparkles className="w-3 h-3" />
                AI pre-filled
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors">
            <Minus className="w-3 h-3" />
            Not applicable
          </button>
          <button
            onClick={() => onClarify(question)}
            className="flex items-center gap-1.5 text-xs font-semibold text-primary border border-primary/30 bg-primary/5 hover:bg-primary/10 px-2.5 py-1 rounded-md transition-colors"
          >
            <Sparkles className="w-3 h-3" />
            Ask Copilot
          </button>
        </div>
      </div>

      <h3 className="text-base font-semibold text-gray-900 mb-2 leading-snug">
        {question.title}
      </h3>
      <p className="text-sm text-gray-600 mb-5 leading-relaxed whitespace-pre-line">
        {question.description}
      </p>

      {/* Options */}
      <RadioGroup value={selected} onValueChange={handleSelect} className="space-y-2.5">
        {question.options.map(option => (
          <label
            key={option.id}
            className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-all duration-150 ${
              selected === option.id
                ? 'border-primary bg-primary/5'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <RadioGroupItem value={option.id} id={`${question.id}-${option.id}`} className="mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-gray-900">{option.label}</p>
              {option.description && (
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed whitespace-pre-line">
                  {option.description}
                </p>
              )}
            </div>
          </label>
        ))}
      </RadioGroup>

      {/* Additional notes / rewrite area */}
      <div className="mt-5 pt-4 border-t border-gray-100">
        <label className="text-xs font-medium text-gray-700 mb-2 block">
          Additional notes
        </label>
        <div className="relative">
          <textarea
            placeholder="Add context or clarifications for this answer..."
            className="w-full resize-none bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary focus:bg-white transition-all duration-150 min-h-[80px]"
            rows={3}
          />
          <div className="flex items-center justify-between mt-2">
            <Button variant="outline" size="sm" className="text-xs h-8">
              <Paperclip className="w-3.5 h-3.5 mr-1.5" />
              Add attachment
            </Button>
            <button
              className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-primary px-2.5 py-1.5 rounded-md hover:bg-primary/5 transition-colors"
            >
              <Pencil className="w-3 h-3" />
              <Sparkles className="w-3 h-3" />
              Rewrite with Copilot
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function AssessmentQuestionnaire() {
  const navigate = useNavigate()
  const [currentQuestionId, setCurrentQuestionId] = useState('q2-1')
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [activeGuide, setActiveGuide] = useState<Question | null>(null)
  const [chatInput, setChatInput] = useState('')
  const [chatMessages, setChatMessages] = useState(aiPrefilledMessages)
  const [guideConversation, setGuideConversation] = useState<Array<{ role: 'user' | 'assistant'; content: string; options?: Array<{ id: string; label: string }> }>>([])
  const [isGuideTyping, setIsGuideTyping] = useState(false)
  const [showReadiness, setShowReadiness] = useState(false)
  const chatBottomRef = useRef<HTMLDivElement>(null)

  const allQuestions = privacyAssessmentSections.flatMap(s => s.questions)
  const unansweredQuestions = allQuestions.filter(q => !q.answered && !answers[q.id]).slice(0, 3)
  const displayQuestions = [...allQuestions.filter(q => q.answered), ...unansweredQuestions]
    .filter((q, i, arr) => arr.indexOf(q) === i)
    .slice(-3)

  const answeredCount = allQuestions.filter(q => q.answered || answers[q.id]).length
  const totalCount = allQuestions.length + 4 // simulate more questions
  const progress = Math.round((answeredCount / totalCount) * 100) + 40

  useEffect(() => {
    const timer = setTimeout(() => setShowReadiness(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  const handleAnswer = (questionId: string, answerId: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerId }))
  }

  const handleClarify = (question: Question) => {
    setActiveGuide(question)
    setCurrentQuestionId(question.id)
    // Initialize guide conversation with AI intro message
    setGuideConversation([
      {
        role: 'assistant',
        content: `Let me help you understand "${question.title}". ${question.clarifyExplanation || 'This question helps us assess compliance requirements for your project.'}`,
      },
      {
        role: 'assistant',
        content: 'Here are the available options for this question:',
        options: question.options.map(opt => ({ id: opt.id, label: opt.label })),
      },
    ])
  }

  const handleGuideChatSend = () => {
    if (!chatInput.trim() || !activeGuide) return
    const userMessage = chatInput.trim()
    setGuideConversation(prev => [...prev, { role: 'user', content: userMessage }])
    setChatInput('')
    setIsGuideTyping(true)

    // Simulate AI response
    setTimeout(() => {
      setIsGuideTyping(false)
      const responses = [
        `Based on your question about "${userMessage.slice(0, 30)}...", I'd recommend considering the compliance implications. The best approach depends on how personal data is being processed.`,
        `Great question! For this assessment, you'll want to document the specific data flows involved. Would you like me to suggest an answer based on the context you've provided?`,
        `I understand your concern. Looking at similar assessments, the most common approach is to select the option that best reflects your current data handling practices. Would you like me to pre-fill a suggested answer?`,
      ]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      setGuideConversation(prev => [...prev, { role: 'assistant', content: randomResponse }])
    }, 1200)
  }

  const handleChatSend = () => {
    if (!chatInput.trim()) return
    setChatMessages(prev => [...prev, chatInput])
    setChatInput('')
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar
          title="Privacy Review Request for Magellan Mobile App"
          actions={
            <Button size="sm" className="mr-2 text-xs" onClick={() => navigate('/success')}>
              Submit for review
            </Button>
          }
        />

        <div className="flex flex-1 overflow-hidden">
          {/* Left: Question nav */}
          <aside className="w-[220px] bg-white border-r border-gray-100 flex-shrink-0 overflow-hidden flex flex-col">
            {/* Status row */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-xs font-semibold text-gray-700">In progress</span>
              </div>
              <Progress value={progress} className="mb-1" />
              <p className="text-xs text-gray-500">{progress}% complete</p>
            </div>

            {/* Participants */}
            <div className="px-4 py-2.5 border-b border-gray-100">
              <p className="text-xs text-gray-400 mb-2">Participants</p>
              <div className="flex items-center gap-1">
                {['RS', 'MR', 'KP'].map(initials => (
                  <div
                    key={initials}
                    className="w-6 h-6 rounded-full bg-primary/10 text-primary text-[9px] font-bold flex items-center justify-center border-2 border-white -ml-1 first:ml-0"
                  >
                    {initials}
                  </div>
                ))}
                <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-[9px] font-bold flex items-center justify-center border-2 border-white -ml-1">
                  +2
                </div>
              </div>
            </div>

            <QuestionNav
              sections={privacyAssessmentSections}
              currentQuestionId={currentQuestionId}
              onSelect={setCurrentQuestionId}
            />
          </aside>

          {/* Main: Questions */}
          <main className="flex-1 overflow-y-auto scrollbar-thin px-8 py-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-6">
                <h2 className="text-base font-semibold text-gray-900">Systems</h2>
                <span className="text-xs text-gray-400">— 7 questions</span>
              </div>

              {allQuestions.slice(0, 3).map((question, i) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  onAnswer={handleAnswer}
                  onClarify={handleClarify}
                  isActive={question.id === currentQuestionId}
                />
              ))}

              {/* Load more hint */}
              <button
                className="w-full text-center text-xs text-gray-400 py-4 hover:text-gray-600 transition-colors"
                onClick={() => {}}
              >
                Scroll for more questions ↓
              </button>
            </div>
          </main>

          {/* Right: Copilot drawer */}
          <aside className="w-[300px] flex flex-col bg-white border-l border-gray-100 flex-shrink-0">
            <Tabs defaultValue="chat" className="flex flex-col h-full">
              {/* Tabs header */}
              <div className="border-b border-gray-100 px-2 pt-2 flex-shrink-0">
                <TabsList className="w-full bg-transparent p-0 gap-0 h-auto">
                  <TabsTrigger
                    value="chat"
                    className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-xs py-2.5 font-semibold"
                  >
                    Copilot chat
                  </TabsTrigger>
                  <TabsTrigger
                    value="tools"
                    className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-xs py-2.5 font-semibold"
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    Answer Generation
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="chat" className="flex flex-col flex-1 overflow-hidden mt-0">
                {/* Context badge */}
                <div className="px-4 py-2 border-b border-gray-100 bg-gray-50/50">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-gray-500">Assessment,</span>
                    <span className="text-xs font-semibold text-gray-700">Magellan Mobile</span>
                    <Button variant="ghost" size="icon" className="h-4 w-4 ml-auto">
                      <X className="w-3 h-3 text-gray-400" />
                    </Button>
                  </div>
                </div>

                {/* AI messages */}
                <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-4 space-y-3">
                  {/* Static progress message */}
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-[8px] font-bold">AI</span>
                    </div>
                    <div className="text-xs text-gray-700 leading-relaxed">
                      <strong className="text-gray-900">Good progress</strong>, 6 of 10 questions are complete. It's 62% ready for privacy approval thanks to the documents and assessments you selected.
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-[8px] font-bold">AI</span>
                    </div>
                    <div className="text-xs text-gray-700 leading-relaxed">
                      You can use these tools to generate answers, or have me guide you through the experience.
                    </div>
                  </div>

                  {/* Tool buttons */}
                  <div className="space-y-2 pl-7">
                    {[
                      { icon: Database, label: 'Edit data sources' },
                      { icon: Search, label: 'Kick off deep research' },
                      { icon: MessageCircle, label: 'Guide me through answering questions' },
                    ].map(({ icon: Icon, label }) => (
                      <button
                        key={label}
                        className="w-full flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-all duration-150 text-left"
                        onClick={label === 'Guide me through answering questions' ? () => setActiveGuide(allQuestions[0]) : undefined}
                      >
                        <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                        {label}
                      </button>
                    ))}
                  </div>

                  {/* AI prefilled messages */}
                  {chatMessages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.2, duration: 0.3 }}
                      className="flex items-start gap-2"
                    >
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-[8px] font-bold">AI</span>
                      </div>
                      <p className="text-xs text-gray-700 leading-relaxed">{msg}</p>
                    </motion.div>
                  ))}

                  {/* Guide tool — appears when Ask Copilot is clicked */}
                  <AnimatePresence>
                    {activeGuide && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.97 }}
                        transition={{ duration: 0.25 }}
                        className="bg-primary/5 border border-primary/20 rounded-xl p-3"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-1.5">
                            <Bot className="w-3.5 h-3.5 text-primary" />
                            <span className="text-xs font-semibold text-primary">Ask Copilot</span>
                          </div>
                          <button
                            onClick={() => {
                              setActiveGuide(null)
                              setGuideConversation([])
                            }}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Question context */}
                        <div className="bg-white/60 rounded-lg px-2.5 py-2 mb-3">
                          <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold mb-0.5">Question {activeGuide.number}</p>
                          <p className="text-xs font-semibold text-gray-800">{activeGuide.title}</p>
                        </div>

                        {/* Conversation */}
                        <div className="space-y-3 max-h-[200px] overflow-y-auto">
                          {guideConversation.map((msg, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, y: 4 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2 }}
                              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                              {msg.role === 'user' ? (
                                <div className="bg-gray-100 rounded-xl rounded-tr-sm px-3 py-2 max-w-[85%]">
                                  <p className="text-xs text-gray-800">{msg.content}</p>
                                </div>
                              ) : (
                                <div className="flex items-start gap-2 max-w-[90%]">
                                  <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-white text-[6px] font-bold">AI</span>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-700 leading-relaxed">{msg.content}</p>
                                    {msg.options && (
                                      <div className="mt-2 space-y-1.5">
                                        {msg.options.map((opt, i) => (
                                          <button
                                            key={opt.id}
                                            className="w-full text-left text-xs px-2.5 py-1.5 bg-white border border-gray-200 rounded-md hover:border-primary/40 hover:bg-primary/5 transition-colors"
                                          >
                                            <span className="text-gray-400 mr-1.5">{i + 1}.</span>
                                            <span className="text-gray-700">{opt.label}</span>
                                          </button>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </motion.div>
                          ))}

                          {/* Typing indicator */}
                          {isGuideTyping && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="flex items-start gap-2"
                            >
                              <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-white text-[6px] font-bold">AI</span>
                              </div>
                              <div className="flex items-center gap-1 px-2 py-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Readiness summary */}
                  <AnimatePresence>
                    {showReadiness && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        className="bg-white border border-gray-200 rounded-xl p-4 mt-2"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCheck className="w-4 h-4 text-primary" />
                          <p className="text-xs font-semibold text-gray-900">Governance readiness</p>
                        </div>
                        <div className="space-y-1.5 mb-4">
                          {[
                            `${readinessSummary.records} linked records created`,
                            `${readinessSummary.assessments} assessments launched`,
                            `${readinessSummary.complete}% complete automatically`,
                            `${readinessSummary.followUps} follow-ups remaining`,
                          ].map(line => (
                            <div key={line} className="flex items-center gap-2">
                              <div className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                              <p className="text-xs text-gray-700">{line}</p>
                            </div>
                          ))}
                          <div className="pt-1">
                            <p className="text-xs font-semibold text-primary">
                              Recommendation: {readinessSummary.recommendation}
                            </p>
                          </div>
                        </div>
                        <Button
                          className="w-full text-xs h-8"
                          size="sm"
                          onClick={() => navigate('/success')}
                        >
                          Submit for governance approval
                          <ChevronRight className="w-3.5 h-3.5 ml-1" />
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div ref={chatBottomRef} />
                </div>

                {/* Input */}
                <div className="px-4 py-3 border-t border-gray-100 flex-shrink-0">
                  {/* Guide tool mini card above input */}
                  <AnimatePresence>
                    {activeGuide && (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        className="mb-2 bg-primary/5 border border-primary/20 rounded-lg px-3 py-2 flex items-center gap-2"
                      >
                        <Bot className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                        <p className="text-xs text-primary font-medium truncate">
                          Chatting about: {activeGuide.title}
                        </p>
                        <button onClick={() => {
                          setActiveGuide(null)
                          setGuideConversation([])
                        }} className="ml-auto">
                          <X className="w-3 h-3 text-primary/60" />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="relative bg-gray-50 border border-gray-200 rounded-xl focus-within:border-primary transition-colors duration-150">
                    <textarea
                      value={chatInput}
                      onChange={e => setChatInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          activeGuide ? handleGuideChatSend() : handleChatSend()
                        }
                      }}
                      placeholder="Ask Copilot"
                      rows={2}
                      className="w-full resize-none bg-transparent px-3 pt-2.5 pb-1 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none leading-relaxed"
                    />
                    <div className="flex items-center justify-between px-2 pb-2">
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400">
                        <Paperclip className="w-3 h-3" />
                      </Button>
                      <Button
                        onClick={activeGuide ? handleGuideChatSend : handleChatSend}
                        size="icon"
                        className="h-6 w-6 rounded-md bg-primary hover:bg-primary/90 disabled:opacity-30"
                        disabled={!chatInput.trim()}
                      >
                        <ArrowUp className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1.5 text-center">
                    AI can make mistakes. Verify info.{' '}
                    <button className="text-primary hover:underline">Learn more</button>
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="tools" className="flex-1 overflow-y-auto mt-0 px-4 py-4">
                <div className="space-y-3">
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Use these tools to automatically generate or research answers for this assessment.
                  </p>
                  {[
                    { icon: Database, label: 'Edit data sources', desc: 'Manage the files and data Copilot uses' },
                    { icon: Search, label: 'Deep research', desc: 'Scan connected systems for relevant information' },
                    { icon: MessageCircle, label: 'Guided walkthrough', desc: 'Let Copilot explain each question in plain language' },
                  ].map(({ icon: Icon, label, desc }) => (
                    <button
                      key={label}
                      className="w-full flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-xl text-left hover:border-primary/40 hover:bg-primary/5 transition-all duration-150"
                    >
                      <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-900">{label}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </aside>
        </div>
      </div>
    </div>
  )
}
