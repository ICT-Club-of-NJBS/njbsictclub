import QRCode from 'qrcode'

export async function generateQRCode(userId: string): Promise<string> {
  try {
    // Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(userId, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    })
    return qrCodeDataUrl
  } catch (error) {
    console.error('Error generating QR code:', error)
    throw error
  }
}
