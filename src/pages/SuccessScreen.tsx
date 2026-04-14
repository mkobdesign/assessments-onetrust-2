import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { CheckCircle2 } from 'lucide-react'

// Subtle rising particles for professional celebration
function CelebrationParticles() {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: Math.random() * 100 - 50, // -50 to 50
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 1.5,
    size: 4 + Math.random() * 4,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{ opacity: 0, y: 60, x: particle.x }}
          animate={{ 
            opacity: [0, 0.6, 0.6, 0],
            y: -120,
            x: particle.x + (Math.random() * 30 - 15)
          }}
          transition={{
            delay: 0.3 + particle.delay,
            duration: particle.duration,
            ease: 'easeOut',
          }}
          className="absolute left-1/2 top-1/2"
          style={{ 
            width: particle.size, 
            height: particle.size,
            borderRadius: '50%',
            backgroundColor: particle.id % 3 === 0 ? '#22c55e' : particle.id % 3 === 1 ? '#86efac' : '#dcfce7',
          }}
        />
      ))}
    </div>
  )
}

// Subtle ring pulse animation
function RingPulse() {
  return (
    <>
      <motion.div
        initial={{ scale: 1, opacity: 0.4 }}
        animate={{ scale: 2.5, opacity: 0 }}
        transition={{ delay: 0.4, duration: 1.2, ease: 'easeOut' }}
        className="absolute inset-0 rounded-full border-2 border-primary/30"
      />
      <motion.div
        initial={{ scale: 1, opacity: 0.3 }}
        animate={{ scale: 2, opacity: 0 }}
        transition={{ delay: 0.6, duration: 1, ease: 'easeOut' }}
        className="absolute inset-0 rounded-full border border-primary/20"
      />
    </>
  )
}

export default function SuccessScreen() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      {/* Subtle background glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-radial from-primary/5 via-transparent to-transparent rounded-full pointer-events-none"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="text-center max-w-lg relative"
      >
        {/* Celebration particles */}
        <CelebrationParticles />

        {/* Checkmark with ring pulse */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4, type: 'spring', stiffness: 200 }}
          className="flex justify-center mb-8"
        >
          <div className="relative w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <RingPulse />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, duration: 0.3, type: 'spring', stiffness: 300 }}
            >
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </motion.div>
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
          className="text-base text-gray-600 leading-relaxed mb-10"
        >
          You just helped your organization move an important project forward the right way. By reviewing these assessments and confirming the governance steps, you've played a key role in keeping your company safe — and your customers' information protected.
        </motion.p>

        {/* <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="text-sm text-gray-500 leading-relaxed mb-10"
        >
          This kind of thoughtful oversight is exactly what builds trust — with customers, partners, and regulators. Your contribution has been submitted for governance approval.
        </motion.p> */}

        {/* Gamification - Better than others */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.4 }}
          className="bg-gradient-to-r from-primary/5 to-green-50 border border-primary/20 rounded-2xl p-6 mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="text-4xl font-bold text-primary">23%</span>
            <span className="text-sm text-gray-600 text-left leading-tight">faster than<br />average</span>
          </div>
          <p className="text-xs text-gray-500">
            You completed this assessment faster than 77% of users in your organization
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
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

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.4 }}
          className="flex flex-col gap-3"
        >
          <Button
            onClick={() => navigate('/prelaunch')}
            size="lg"
            className="w-full"
          >
            Complete your next assessment
          </Button>
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            size="lg"
            className="w-full"
          >
            Return to the self service portal
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}
