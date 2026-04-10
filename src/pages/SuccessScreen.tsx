import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Home } from 'lucide-react'

export default function SuccessScreen() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="text-center max-w-lg"
      >
        {/* Checkmark */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4, type: 'spring', stiffness: 200 }}
          className="flex justify-center mb-8"
        >
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="text-3xl font-bold text-gray-900 mb-4 leading-tight"
        >
          Well done. You made a real difference.
        </motion.h1>

        {/* Body */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.4 }}
          className="text-base text-gray-600 leading-relaxed mb-3"
        >
          You just helped your organization move an important project forward the right way. By reviewing these assessments and confirming the governance steps, you've played a key role in keeping your company safe — and your customers' information protected.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="text-sm text-gray-500 leading-relaxed mb-10"
        >
          This kind of thoughtful oversight is exactly what builds trust — with customers, partners, and regulators. Your contribution has been submitted for governance approval.
        </motion.p>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.4 }}
          className="grid grid-cols-3 gap-4 mb-10"
        >
          {[
            { value: '8', label: 'Linked records created' },
            { value: '4', label: 'Assessments launched' },
            { value: '72%', label: 'Auto-completed by AI' },
          ].map(stat => (
            <div key={stat.label} className="bg-gray-50 rounded-xl p-4">
              <p className="text-2xl font-bold text-primary mb-1">{stat.value}</p>
              <p className="text-xs text-gray-500 leading-snug">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          <Button
            onClick={() => navigate('/')}
            size="lg"
            className="px-8"
          >
            <Home className="w-4 h-4 mr-2" />
            Return to home
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}
