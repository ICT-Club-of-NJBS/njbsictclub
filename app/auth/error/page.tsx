export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
      <div className="text-center p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-red-500">
          Authentication Error
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Something went wrong during login. Please try again.
        </p>
      </div>
    </div>
  )
}