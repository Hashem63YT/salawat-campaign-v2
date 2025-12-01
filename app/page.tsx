'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { supabase, getCampaignStats, incrementSalawat, calculateOptimisticStats, type CampaignStats } from '@/lib/supabase'
import type { RealtimeChannel } from '@supabase/supabase-js'

export default function Home() {
  const [stats, setStats] = useState<CampaignStats | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [formName, setFormName] = useState<string>('')
  const [formAmount, setFormAmount] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [showSuccessAnimation, setShowSuccessAnimation] = useState<boolean>(false)

  const fetchInitialStats = async () => {
    setLoading(true)
    setError(null)
    const { data, error: fetchError } = await getCampaignStats()
    
    if (fetchError) {
      setError('حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى.')
      setLoading(false)
      return
    }
    
    if (data) {
      setStats(data)
      setError(null)
    }
    
    setLoading(false)
  }

  useEffect(() => {
    fetchInitialStats()

    // Set up real-time Supabase subscription with error handling
    const channel: RealtimeChannel = supabase
      .channel('salawat-updates', {
        config: {
          broadcast: { self: false },
        },
      })
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'salawat_counter',
        },
        (payload) => {
          const newRecord = payload.new as { total_count: number; contribution_count: number }
          setStats({
            totalCount: newRecord.total_count,
            contributionCount: newRecord.contribution_count,
          })
          setError(null)
        }
      )
      .subscribe((status) => {
        // Handle subscription status changes
        if (status === 'SUBSCRIBED') {
          // Successfully subscribed - real-time updates are active
          if (process.env.NODE_ENV === 'development') {
            console.log('✅ Real-time subscription active')
          }
        } else if (status === 'CHANNEL_ERROR') {
          // Channel error - real-time updates may not work, but app still functions
          // The app will continue to work with manual refreshes and form submissions
          if (process.env.NODE_ENV === 'development') {
            console.warn('⚠️ Real-time subscription error - app will continue to function normally')
          }
        } else if (status === 'TIMED_OUT') {
          // Connection timeout - real-time updates unavailable
          if (process.env.NODE_ENV === 'development') {
            console.warn('⏱️ Real-time subscription timeout - app will continue to function normally')
          }
        } else if (status === 'CLOSED') {
          // Channel closed - real-time updates unavailable
          if (process.env.NODE_ENV === 'development') {
            console.warn('🔌 Real-time subscription closed - app will continue to function normally')
          }
        }
      })

    // Cleanup function to unsubscribe on unmount
    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  // Form Validation Function
  const validateForm = (
    name: string,
    amount: string
  ): { valid: boolean; amount?: number; error?: string } => {
    const trimmedName = name.trim()
    const trimmedAmount = amount.trim()
    
    if (!trimmedName) {
      return { valid: false, error: 'يرجى إدخال الاسم' }
    }
    
    if (!trimmedAmount) {
      return { valid: false, error: 'يرجى إدخال عدد الصلوات' }
    }
    
    const parsed = parseInt(trimmedAmount, 10)
    
    if (isNaN(parsed) || parsed <= 0 || !Number.isInteger(parsed)) {
      return { valid: false, error: 'يرجى إدخال عدد صحيح موجب' }
    }
    
    return { valid: true, amount: parsed }
  }

  // Form Submit Handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    const validation = validateForm(formName, formAmount)
    
    if (!validation.valid) {
      setFormError(validation.error || 'خطأ في التحقق من البيانات')
      return
    }
    
    const amount = validation.amount!
    const contributorName = formName.trim()
    setIsSubmitting(true)
    setFormError(null)
    
    // Store previous stats for potential revert
    const previousStats = stats
    
    // Optional optimistic update
    if (stats) {
      const optimisticStats = calculateOptimisticStats(stats, amount)
      setStats(optimisticStats)
    }
    
    // Call incrementSalawat with name and amount
    const { data, error: incrementError } = await incrementSalawat(amount, contributorName)
    
    if (incrementError) {
      // Revert optimistic update on error
      if (previousStats) {
        setStats(previousStats)
      }
      setFormError('حدث خطأ أثناء إضافة الصلوات. يرجى المحاولة مرة أخرى.')
      setIsSubmitting(false)
      return
    }
    
    // On success
    if (data) {
      // Update with real data (or keep optimistic if using real-time subscription)
      setStats(data)
      setShowSuccessAnimation(true)
      setFormName('')
      setFormAmount('')
      
      // Auto-dismiss success animation after 3-4 seconds
      setTimeout(() => {
        setShowSuccessAnimation(false)
      }, 3500)
    }
    
    setIsSubmitting(false)
  }

  // Success Animation Component
  const SuccessAnimation = () => {
    const prefersReducedMotion = useReducedMotion()
    
    // Generate random positions for particles (memoized to prevent recreation on every render)
    const particles = useMemo(() => 
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 1 + Math.random() * 0.5,
      })), []
    )

    return (
      <AnimatePresence>
        {showSuccessAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0.1 : 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: prefersReducedMotion ? 1 : 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: prefersReducedMotion ? 1 : 0.8, opacity: 0 }}
              transition={prefersReducedMotion 
                ? { duration: 0.1 } 
                : { type: 'spring', stiffness: 200, damping: 20 }
              }
              className="relative bg-white rounded-3xl p-12 md:p-16 shadow-2xl max-w-md mx-4 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setShowSuccessAnimation(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-islamic-green-500 focus:ring-offset-2"
                aria-label="إغلاق"
                type="button"
              >
                <span className="text-gray-600 text-xl">×</span>
              </button>

              {/* Radial glow effect */}
              <motion.div
                className="absolute inset-0 rounded-3xl animate-pulse-glow"
                style={{
                  background: 'radial-gradient(circle, rgba(251, 191, 36, 0.3) 0%, transparent 70%)',
                }}
              />
              
              {/* Checkmark icon */}
              <motion.div
                initial={{ scale: prefersReducedMotion ? 1 : 0, rotate: prefersReducedMotion ? 0 : -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={prefersReducedMotion 
                  ? { duration: 0.1 } 
                  : { type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }
                }
                className="text-7xl md:text-8xl mb-6"
              >
                ✨
              </motion.div>
              
              {/* Success message */}
              <motion.h2
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: prefersReducedMotion ? 0 : 0.4, duration: prefersReducedMotion ? 0.1 : 0.3 }}
                className="font-arabic-display text-2xl md:text-3xl text-islamic-green-700 mb-4 arabic-text"
              >
                تم إضافة صلواتك بنجاح
              </motion.h2>
              
              {/* Golden particles */}
              {!prefersReducedMotion && (
                <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
                  {particles.map((particle) => (
                    <motion.div
                      key={particle.id}
                      initial={{
                        opacity: 0,
                        scale: 0,
                        x: `${particle.x}%`,
                        y: `${particle.y}%`,
                      }}
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1.5, 0],
                        x: `${particle.x + (Math.random() - 0.5) * 20}%`,
                        y: `${particle.y + (Math.random() - 0.5) * 20}%`,
                      }}
                      transition={{
                        duration: particle.duration,
                        delay: particle.delay,
                        repeat: 0,
                      }}
                      className="absolute w-2 h-2 rounded-full bg-islamic-gold-400"
                      style={{
                        boxShadow: '0 0 10px rgba(251, 191, 36, 0.8)',
                      }}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    )
  }

  // Animated Counter Component (Small size - 1/4 of original)
  const AnimatedCounter = ({ value, label, icon }: { value: number; label: string; icon?: string }) => {
    return (
      <motion.div
        className="islamic-card p-2 md:p-2.5 text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {icon && (
          <div className="text-lg md:text-xl mb-1">{icon}</div>
        )}
        <div
          key={value}
          className="font-arabic-display text-xl md:text-2xl text-islamic-green-700 mb-1 animate-counter-increment"
          aria-live="polite"
        >
          {value.toLocaleString('en-US')}
        </div>
        <p className="font-arabic-body text-xs md:text-sm text-gray-600 arabic-text">
          {label}
        </p>
      </motion.div>
    )
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 pb-2 md:px-8 md:pb-4 lg:px-12 lg:pb-6">
      <div className="max-w-6xl w-full mx-auto space-y-3 md:space-y-4">
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-arabic-display text-4xl md:text-5xl lg:text-6xl text-center text-islamic-green-700 mb-0 arabic-text">
            حملة الصلاة على النبي ﷺ
          </h1>
        </motion.div>

        {/* Loading State */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center min-h-[300px]"
            >
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="text-4xl text-islamic-green-600 mb-4"
                >
                  ⏳
                </motion.div>
                <p className="font-arabic-body text-lg text-gray-600">
                  جاري التحميل...
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error State */}
        <AnimatePresence>
          {error && !loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center max-w-md mx-auto"
            >
              <div className="text-3xl mb-2">⚠️</div>
              <p className="font-arabic-body text-red-700 mb-4">{error}</p>
              <button
                onClick={fetchInitialStats}
                className="font-arabic-body px-6 py-2 bg-islamic-green-600 text-white rounded-lg hover:bg-islamic-green-700 transition-colors"
              >
                إعادة المحاولة
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form and Statistics Section - Side by side on desktop, stacked on mobile */}
        <AnimatePresence>
          {stats && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6"
            >
              {/* Form Section - Takes 3/4 on desktop, full width on mobile */}
              <div className="md:col-span-3">
                <form
                  onSubmit={handleSubmit}
                  className="islamic-card p-6 md:p-8 lg:p-10"
                >
                  {/* Form Title */}
                  <h2 className="font-arabic-display text-2xl md:text-3xl text-islamic-green-700 mb-6 text-center arabic-text">
                    ساهم في الحملة
                  </h2>

                  {/* Name Input Field */}
                  <div className="mb-6">
                    <label
                      htmlFor="contributor-name"
                      className="block font-arabic-body text-lg text-gray-700 mb-2 arabic-text"
                    >
                      الاسم
                    </label>
                    <input
                      type="text"
                      id="contributor-name"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="أدخل اسمك"
                      dir="rtl"
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 text-lg border-2 border-islamic-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-islamic-green-500 focus:border-transparent transition-all font-arabic-body arabic-text disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Amount Input Field */}
                  <div className="mb-6">
                    <label
                      htmlFor="salawat-amount"
                      className="block font-arabic-body text-lg text-gray-700 mb-2 arabic-text"
                    >
                      عدد الصلوات
                    </label>
                    <input
                      type="number"
                      id="salawat-amount"
                      value={formAmount}
                      onChange={(e) => setFormAmount(e.target.value)}
                      min="1"
                      step="1"
                      placeholder="أدخل عدد الصلوات"
                      dir="rtl"
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 text-lg border-2 border-islamic-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-islamic-green-500 focus:border-transparent transition-all font-arabic-body arabic-text disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                    {formError && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 text-red-600 font-arabic-body text-sm arabic-text"
                      >
                        {formError}
                      </motion.p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !formName.trim() || !formAmount.trim()}
                    className="w-full md:w-auto md:px-12 py-4 bg-islamic-green-600 text-white rounded-xl font-arabic-body text-lg hover:bg-islamic-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400 shadow-lg hover:shadow-xl"
                  >
                    {isSubmitting ? 'جاري الإضافة...' : 'إضافة الصلوات'}
                  </button>

                  {/* Helper Text */}
                  <p className="mt-2 text-center font-arabic-body text-sm text-gray-600 arabic-text">
                    كل الأعمال تقبل وترد إلا الصلاة على أحمد ﷺ
                  </p>
                </form>
              </div>

              {/* Statistics Section - Takes 1/4 on desktop, full width on mobile (appears below form) */}
              <div className="md:col-span-1">
                <div className="grid grid-cols-2 md:grid-cols-1 gap-2 md:gap-3">
                  <AnimatedCounter
                    value={stats.totalCount}
                    label="إجمالي الصلوات"
                    icon="📿"
                  />
                  <AnimatedCounter
                    value={stats.contributionCount}
                    label="عدد المساهمات"
                    icon="👥"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Success Animation */}
      <SuccessAnimation />
    </main>
  )
}
