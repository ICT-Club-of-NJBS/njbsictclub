'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) setVisible(true)
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setVisible(false)
  }

  const handleReject = () => {
    localStorage.setItem('cookie-consent', 'rejected')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[95%] md:w-auto max-w-2xl bg-white dark:bg-zinc-900 shadow-2xl rounded-2xl p-4 border border-gray-200 dark:border-zinc-700 z-50">
      
      <p className="text-sm text-gray-700 dark:text-gray-300">
        We use cookies to improve your experience and display personalized ads
        (Google AdSense). By clicking "Accept", you agree to our use of cookies.
        Read our{' '}
        <Link href="/privacy-policy" className="text-blue-500 underline">
          Privacy Policy
        </Link>.
      </p>

      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={handleReject}
          className="px-4 py-2 text-sm rounded-lg bg-gray-200 dark:bg-zinc-700 hover:opacity-80"
        >
          Reject
        </button>

        <button
          onClick={handleAccept}
          className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          Accept All
        </button>
      </div>
    </div>
  )
}