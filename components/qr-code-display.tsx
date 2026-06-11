'use client'

import { useRef } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { Button } from '@/components/ui/button'

type Props = {
  value: string
  memberId: string
}

export function QRCodeDisplay({ value, memberId }: Props) {
  const qrRef = useRef<HTMLDivElement>(null)

  const handleDownload = () => {
    const canvas = qrRef.current?.querySelector('canvas') as HTMLCanvasElement | null

    if (!canvas) {
      alert('QR not ready yet!')
      return
    }

    const url = canvas.toDataURL('image/png')

    const link = document.createElement('a')
    link.href = url
    link.download = `${memberId || 'qr-code'}.png`

    // ✅ IMPORTANT FIX (append to DOM)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div ref={qrRef} className="p-3 bg-white rounded-lg">
        <QRCodeCanvas value={value || 'empty'} size={180} />
      </div>

      <Button onClick={handleDownload}>
        Download QR
      </Button>
    </div>
  )
}