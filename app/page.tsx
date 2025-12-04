'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'

interface CampaignStats {
  totalCount: number
  contributionCount: number
}

/**
 * Shared error handling helper that normalizes error messages from API responses.
 * Handles both JSON and text responses, with fallback to default Arabic messages.
 * 
 * @param response - The Response object from fetch
 * @param defaultMessage - Default Arabic error message to use if parsing fails
 * @returns Promise resolving to a normalized error message string
 */
async function getErrorMessage(response: Response, defaultMessage: string): Promise<string> {
  try {
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      const errorData = await response.json()
      return errorData.error || errorData.message || defaultMessage
    } else {
      // If not JSON, try to get text response
      const text = await response.text()
      return text || defaultMessage
    }
  } catch {
    // If parsing fails, use status text or default message
    return response.statusText || defaultMessage
  }
}

export default function Home() {
  const [formAmount, setFormAmount] = useState<string>('')
  const [formName, setFormName] = useState<string>('')
  const [formError, setFormError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [stats, setStats] = useState<CampaignStats>({
    totalCount: 0,
    contributionCount: 0,
  })
  const [loading, setLoading] = useState<boolean>(true)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [realtimeStatus, setRealtimeStatus] = useState<'connecting' | 'connected' | 'error'>('connecting')
  const successTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastRefreshRef = useRef<number>(0)

  // Helper function to load stats from API
  const loadStats = async (isBackground = false) => {
    // Throttle background refreshes to prevent redundant network calls
    if (isBackground) {
      const now = Date.now()
      const timeSinceLastRefresh = now - lastRefreshRef.current
      // Early return if last refresh was within the past 1.5 seconds
      if (timeSinceLastRefresh < 1500) {
        return
      }
      lastRefreshRef.current = now
    }
    
    setFetchError(null)
    if (!isBackground) {
      setLoading(true)
    }
    try {
      const response = await fetch('/api/salawat')
      if (!response.ok) {
        const errorMessage = await getErrorMessage(response, 'حدث خطأ أثناء تحميل البيانات')
        setFetchError(errorMessage)
        if (!isBackground) {
          setLoading(false)
        }
        return
      }
      
      const data = await response.json()
      setStats(data)
      setFetchError(null)
    } catch {
      setFetchError('حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى.')
    } finally {
      if (!isBackground) {
        setLoading(false)
      }
    }
  }

  // Load initial stats from API
  useEffect(() => {
    loadStats()
  }, [])

  // Real-time subscription to salawat_campaign table changes
  // Real-time sync: listens to salawat_campaign updates from RPC function (triggered by any user's submission)
  useEffect(() => {
    setRealtimeStatus('connecting')
    
    const channel = supabase
      .channel('campaign-stats')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'salawat_campaign',
        },
        () => {
          loadStats(true)
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'contributions',
        },
        () => {
          loadStats(true)
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setRealtimeStatus('connected')
          // Clear any polling fallback if subscription succeeds
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current)
            pollingIntervalRef.current = null
          }
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          setRealtimeStatus('error')
          // Start fallback polling if it is not already running
          if (!pollingIntervalRef.current) {
            pollingIntervalRef.current = setInterval(() => {
              loadStats(true)
            }, 5000)
          }
        }
      })

    return () => {
      supabase.removeChannel(channel)
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
        pollingIntervalRef.current = null
      }
    }
  }, [])

  // Cleanup timeout and polling on unmount
  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current)
      }
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
      }
    }
  }, [])

  // Form Validation Function
  const validateAmount = (
    amount: string
  ): { valid: boolean; amount?: number; error?: string } => {
    const trimmedAmount = amount.trim()
    
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
    
    const validation = validateAmount(formAmount)
    
    if (!validation.valid) {
      setFormError(validation.error || 'خطأ في التحقق من البيانات')
      setSuccessMessage(null)
      return
    }
    
    setIsSubmitting(true)
    setFormError(null)
    setSuccessMessage(null)
    
    try {
      const response = await fetch('/api/salawat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: validation.amount, name: formName.trim() }),
      })
      
      if (!response.ok) {
        const errorMessage = await getErrorMessage(response, 'فشل إرسال الصلوات. يرجى التحقق من الاتصال والمحاولة مرة أخرى.')
        throw new Error(errorMessage)
      }
      
      const data = await response.json()
      setStats(data)
      setFormAmount('')
      setFormName('')
      setSuccessMessage('تم إضافة صلواتك بنجاح! ﷺ')
      
      // Clear any existing timeout before setting a new one
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current)
      }
      
      // Clear success message after 3 seconds
      successTimeoutRef.current = setTimeout(() => {
        setSuccessMessage(null)
        successTimeoutRef.current = null
      }, 3000)
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'حدث خطأ أثناء إضافة الصلوات. يرجى المحاولة مرة أخرى.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Success Animation Modal Component
  const SuccessAnimation = ({ message, onDismiss }: { message: string; onDismiss: () => void }) => {
    const modalRef = useRef<HTMLDivElement>(null)
    const closeButtonRef = useRef<HTMLButtonElement>(null)
    const previousFocusRef = useRef<HTMLElement | null>(null)

    // Generate stable random positions for particles
    const particles = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      x: (i - 2) * 30 + (i % 2 === 0 ? -15 : 15), // Staggered positions around center
      y: -50,
      rotate: (i + 1) * 72, // Distribute rotation evenly
    }))

    // Focus management: store previous focus and move focus to modal on mount
    useEffect(() => {
      // Store the currently focused element
      previousFocusRef.current = document.activeElement as HTMLElement

      // Move focus to the close button or modal container
      if (closeButtonRef.current) {
        closeButtonRef.current.focus()
      } else if (modalRef.current) {
        modalRef.current.focus()
      }

      // Focus trap: intercept Tab key presses to keep focus within modal
      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return

        if (!modalRef.current) return

        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        const firstElement = focusableElements[0] as HTMLElement
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement || document.activeElement === modalRef.current) {
            e.preventDefault()
            lastElement?.focus()
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement?.focus()
          }
        }
      }

      document.addEventListener('keydown', handleTabKey)

      return () => {
        document.removeEventListener('keydown', handleTabKey)
        // Restore focus to previously focused element
        if (previousFocusRef.current) {
          previousFocusRef.current.focus()
        }
      }
    }, [])

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onDismiss}
          role="dialog"
          aria-live="polite"
          aria-modal="true"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative islamic-card max-w-sm mx-4 p-6 sm:p-8 text-center shadow-islamic-lg animate-pulse-glow"
            onClick={(e) => e.stopPropagation()}
            tabIndex={-1}
          >
            {/* Close Button */}
            <button
              ref={closeButtonRef}
              onClick={onDismiss}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-islamic-green-500 rounded-full p-1 transition-colors"
              aria-label="إغلاق"
            >
              ✕
            </button>

            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
              className="text-5xl mb-4"
            >
              ✨
            </motion.div>

            {/* Golden Particles */}
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                initial={{ opacity: 0, y: 0, x: 0, rotate: 0 }}
                animate={{
                  opacity: [1, 0],
                  y: particle.y,
                  x: particle.x,
                  rotate: particle.rotate + 360,
                }}
                transition={{
                  duration: 2,
                  delay: particle.id * 0.1,
                  ease: 'easeOut',
                }}
                className="absolute top-1/2 left-1/2 w-2 h-2 bg-islamic-gold-400 rounded-full"
                style={{
                  transform: 'translate(-50%, -50%)',
                }}
              />
            ))}

            {/* Success Message */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-arabic-body text-lg text-islamic-green-700 arabic-text"
            >
              {message}
            </motion.p>

            {/* Dismiss hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 text-xs text-gray-500 font-arabic-body"
            >
              اضغط ESC أو انقر/اضغط خارج النافذة للإغلاق
            </motion.p>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    )
  }

  // Animated Counter Component (Small size - 1/4 of original)
  const AnimatedCounter = ({ value, label, icon }: { value: number; label: string; icon?: string }) => {
    return (
      <motion.div
        className="islamic-card p-2 sm:p-2.5 md:p-3 text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {icon && (
          <div className="text-lg sm:text-xl md:text-2xl mb-0.5 sm:mb-1">{icon}</div>
        )}
        <div
          key={value}
          className="font-arabic-display text-base sm:text-lg md:text-xl lg:text-2xl text-islamic-green-700 mb-0.5 sm:mb-1 animate-counter-increment"
          aria-live="polite"
        >
          {value.toLocaleString('en-US')}
        </div>
        <p className="font-arabic-body text-sm sm:text-base text-gray-600 arabic-text">
          {label}
        </p>
      </motion.div>
    )
  }

  // Handle ESC key to dismiss success animation
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && successMessage) {
        setSuccessMessage(null)
        if (successTimeoutRef.current) {
          clearTimeout(successTimeoutRef.current)
          successTimeoutRef.current = null
        }
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [successMessage])

  return (
    <main className="min-h-screen flex flex-col items-center justify-center md:justify-start pt-2 sm:pt-4 md:pt-2 px-2 py-2 pb-0 sm:px-4 md:px-8 md:py-4 lg:px-12">
      <div className="max-w-6xl w-full mx-auto space-y-1 sm:space-y-2">
        {/* Error State for Initial Load */}
        <AnimatePresence>
          {fetchError && !loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-red-50 border border-red-200 rounded-2xl p-3 sm:p-4 md:p-6 text-center max-w-md mx-auto mb-2 sm:mb-4"
            >
              <div className="text-3xl mb-2">⚠️</div>
              <p className="font-arabic-body text-red-700 mb-4">{fetchError}</p>
              <button
                onClick={() => loadStats()}
                className="font-arabic-body px-6 py-2 bg-islamic-green-600 text-white rounded-lg hover:bg-islamic-green-700 transition-colors"
              >
                إعادة المحاولة
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center min-h-[200px] sm:min-h-[250px] md:min-h-[300px]"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="text-3xl sm:text-4xl text-islamic-green-600 mb-2 sm:mb-4"
              >
                ⏳
              </motion.div>
              <p className="font-arabic-body text-base sm:text-lg text-gray-600">
                جاري التحميل...
              </p>
            </div>
          </motion.div>
        )}

        {/* Real-time Connection Status Indicator */}
        {!loading && !fetchError && realtimeStatus !== 'connected' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 mb-2"
          >
            <div className={`w-2 h-2 rounded-full ${
              realtimeStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'
            }`} />
            <span className="text-xs font-arabic-body text-gray-600">
              {realtimeStatus === 'connecting' ? 'جاري الاتصال...' : 'الاتصال المباشر غير متاح - سيتم التحديث تلقائياً'}
            </span>
          </motion.div>
        )}

        {/* Title Section, Form and Statistics Section - Side by side on desktop, stacked on mobile */}
        <AnimatePresence>
          {!loading && !fetchError && (
            <>
              {/* Title Section */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="font-bold font-arabic-display text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-center text-islamic-green-700 mb-1 sm:mb-2 arabic-text">
                  الموقع تحت التجربة - نرجوا عدم إضافة أعداد جديدة
                </h1>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6"
              >
              {/* Form Section - Takes 3/4 on desktop, full width on mobile */}
              <div className="md:col-span-3">
                <form
                  onSubmit={handleSubmit}
                  className="islamic-card p-3 sm:p-4 md:p-6"
                >
                  {/* Form Title */}
                  <h2 className="font-arabic-display text-lg sm:text-xl md:text-2xl text-islamic-green-700 mb-3 sm:mb-4 md:mb-6 text-center arabic-text">
                  ﴿إِنَّ اللَّهَ وَمَلٰئِكَتَهُ يُصَلّونَ عَلَى النَّبِىِّ يٰأَيُّهَا الَّذينَ ءامَنوا صَلّوا عَلَيهِ وَسَلِّموا تَسليمًا﴾
                  </h2>

                  {/* Name Input Field */}
                  <div className="mb-3 sm:mb-4 md:mb-6">
                    <label
                      htmlFor="contributor-name"
                      className="block font-arabic-body text-base sm:text-lg text-gray-700 mb-1 sm:mb-2 arabic-text"
                    >
                      اسمك (اختياري)
                    </label>
                    <input
                      type="text"
                      id="contributor-name"
                      value={formName}
                      onChange={(e) => {
                        setFormName(e.target.value)
                        setFormError(null)
                        setSuccessMessage(null)
                      }}
                      placeholder="اكتب اسمك إن أردت"
                      dir="rtl"
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 text-base sm:text-lg border-2 border-islamic-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-islamic-green-500 focus:border-transparent transition-all font-arabic-body arabic-text"
                    />
                  </div>

                  {/* Amount Input Field */}
                  <div className="mb-3 sm:mb-4 md:mb-6">
                    <label
                      htmlFor="salawat-amount"
                      className="block font-arabic-body text-base sm:text-lg text-gray-700 mb-1 sm:mb-2 arabic-text"
                    >
                      عدد الصلوات
                    </label>
                    <input
                      type="number"
                      id="salawat-amount"
                      value={formAmount}
                      onChange={(e) => {
                        setFormAmount(e.target.value)
                        setFormError(null)
                        setSuccessMessage(null)
                      }}
                      min="1"
                      step="1"
                      placeholder="أدخل عدد الصلوات"
                      dir="rtl"
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 text-base sm:text-lg border-2 border-islamic-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-islamic-green-500 focus:border-transparent transition-all font-arabic-body arabic-text"
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
                    disabled={!formAmount.trim() || isSubmitting || loading}
                    className="w-full md:w-auto md:px-12 py-2 sm:py-3 md:py-4 bg-islamic-green-600 text-white rounded-xl font-arabic-body text-base sm:text-lg hover:bg-islamic-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400 shadow-lg hover:shadow-xl"
                  >
                    {isSubmitting ? 'جاري الإضافة...' : 'إضافة الصلوات'}
                  </button>

                  {/* Helper Text */}
                  <p className="mt-1 sm:mt-2 text-center font-arabic-body text-xs sm:text-sm text-gray-600 arabic-text">
                    كل الأعمال تقبل وترد إلا الصلاة على أحمد ﷺ
                  </p>
                </form>
              </div>

              {/* Statistics Section - Takes 1/4 on desktop, full width on mobile (appears below form) */}
              <div className="md:col-span-1">
                <div className="grid grid-cols-2 md:grid-cols-1 gap-1 md:gap-2">
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
            </>
          )}
        </AnimatePresence>

        {/* Success Animation Modal */}
        {successMessage && (
          <SuccessAnimation
            message={successMessage}
            onDismiss={() => {
              setSuccessMessage(null)
              if (successTimeoutRef.current) {
                clearTimeout(successTimeoutRef.current)
                successTimeoutRef.current = null
              }
            }}
          />
        )}
      </div>
    </main>
  )
}
