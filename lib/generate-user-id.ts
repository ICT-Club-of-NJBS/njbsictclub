/**
 * Generates a unique user ID in the format NJBS-YYYYMMDDHHMMSS
 * NJBS = Club prefix
 * YYYYMMDDHHMMSS = Timestamp (year, month, day, hour, minute, second)
 */
export function generateUserID(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  
  return `NJBS-${year}${month}${day}${hours}${minutes}${seconds}`
}

/**
 * Validates if a user ID is in the correct format
 */
export function isValidUserID(id: string): boolean {
  return /^NJBS-\d{14}$/.test(id)
}
