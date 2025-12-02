'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Home() {
  const [formAmount, setFormAmount] = useState<string>('')
  const [formError, setFormError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Static placeholder stats
  const stats = {
    totalCount: 0,
    contributionCount: 0,
  }

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
    
    // Display success message
    setFormError(null)
    setSuccessMessage('تم إضافة صلواتك بنجاح! ﷺ')
  }

  // Animated Counter Component (Small size - 1/4 of original)
  const AnimatedCounter = ({ value, label, icon }: { value: number; label: string; icon?: string }) => {
    return (
      <motion.div
        className="islamic-card p-1 md:p-2 text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {icon && (
          <div className="text-base md:text-lg mb-1">{icon}</div>
        )}
        <div
          key={value}
          className="font-arabic-display text-sm md:text-lg text-islamic-green-700 mb-1 animate-counter-increment"
          aria-live="polite"
        >
          {value.toLocaleString('en-US')}
        </div>
        <p className="font-arabic-body text-xs text-gray-600 arabic-text">
          {label}
        </p>
      </motion.div>
    )
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 pb-0 md:px-8 lg:px-12">
      <div className="max-w-6xl w-full mx-auto space-y-2">
        {/* Form and Statistics Section - Side by side on desktop, stacked on mobile */}
        <AnimatePresence>
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
                  className="islamic-card p-4 md:p-6"
                >
                  {/* Form Title */}
                  <h2 className="font-arabic-display text-2xl md:text-3xl text-islamic-green-700 mb-6 text-center arabic-text">
                    ساهم في الحملة
                  </h2>

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
                      onChange={(e) => {
                        setFormAmount(e.target.value)
                        setFormError(null)
                        setSuccessMessage(null)
                      }}
                      min="1"
                      step="1"
                      placeholder="أدخل عدد الصلوات"
                      dir="rtl"
                      className="w-full px-4 py-3 text-lg border-2 border-islamic-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-islamic-green-500 focus:border-transparent transition-all font-arabic-body arabic-text"
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
                    {successMessage && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 text-islamic-green-700 font-arabic-body text-sm arabic-text"
                      >
                        {successMessage}
                      </motion.p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={!formAmount.trim()}
                    className="w-full md:w-auto md:px-12 py-4 bg-islamic-green-600 text-white rounded-xl font-arabic-body text-lg hover:bg-islamic-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400 shadow-lg hover:shadow-xl"
                  >
                    إضافة الصلوات
                  </button>

                  {/* Helper Text */}
                  <p className="mt-2 text-center font-arabic-body text-sm text-gray-600 arabic-text">
                    كل الأعمال تقبل وترد إلا الصلاة على أحمد ﷺ
                  </p>
                </form>
              </div>

              {/* Statistics Section - Takes 1/4 on desktop, full width on mobile (appears below form) */}
              <div className="md:col-span-1">
                <div className="grid grid-cols-2 md:grid-cols-1 gap-1 md:gap-2">
                  <AnimatedCounter
                    value={stats?.totalCount || 0}
                    label="إجمالي الصلوات"
                    icon="📿"
                  />
                  <AnimatedCounter
                    value={stats?.contributionCount || 0}
                    label="عدد المساهمات"
                    icon="👥"
                  />
                </div>
              </div>
            </motion.div>
        </AnimatePresence>

        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-arabic-display text-3xl md:text-4xl lg:text-5xl text-center text-islamic-green-700 mb-0 arabic-text">
            حملة الصلاة على النبي ﷺ
          </h1>
        </motion.div>
      </div>
    </main>
  )
}
