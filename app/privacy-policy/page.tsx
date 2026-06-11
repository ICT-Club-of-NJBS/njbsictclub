export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-800 dark:text-gray-200">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Last Updated: April 22, 2026
      </p>

      {/* Intro */}
      <p className="mt-4">
        Welcome to <strong>NJBS ICT Club</strong>. Your privacy is important to us.
        This Privacy Policy explains how we collect, use, and protect your information.
      </p>

      {/* Section 1 */}
      <h2 className="text-xl font-semibold mt-6">1. Information We Collect</h2>
      <ul className="list-disc ml-6 mt-2 space-y-1">
        <li>Name and email (if submitted through forms)</li>
        <li>Usage data (pages visited, time spent)</li>
        <li>Device and browser information</li>
      </ul>

      {/* Section 2 */}
      <h2 className="text-xl font-semibold mt-6">2. How We Use Information</h2>
      <p className="mt-2">
        We use the collected data to:
      </p>
      <ul className="list-disc ml-6 mt-2 space-y-1">
        <li>Improve website functionality</li>
        <li>Enhance user experience</li>
        <li>Respond to inquiries</li>
      </ul>

      {/* Section 3 */}
      <h2 className="text-xl font-semibold mt-6">3. Google AdSense</h2>
      <p className="mt-2">
        We use Google AdSense to display advertisements. Google may use cookies
        to serve ads based on your visits to this and other websites.
      </p>
      <p className="mt-2">
        Learn more here:{' '}
        <a
          href="https://policies.google.com/technologies/ads"
          target="_blank"
          className="text-blue-500 underline"
        >
          Google Ads Policy
        </a>
      </p>

      {/* Section 4 */}
      <h2 className="text-xl font-semibold mt-6">4. Cookies</h2>
      <p className="mt-2">
        Cookies are used to store user preferences and improve content and ads.
        You can disable cookies in your browser settings.
      </p>

      {/* Section 5 */}
      <h2 className="text-xl font-semibold mt-6">5. Third-Party Services</h2>
      <p className="mt-2">
        We may use third-party services like hosting providers, analytics tools,
        or advertising services that may collect user data.
      </p>

      {/* Section 6 */}
      <h2 className="text-xl font-semibold mt-6">6. Data Security</h2>
      <p className="mt-2">
        We take reasonable measures to protect your data. However, no system is
        100% secure.
      </p>

      {/* Section 7 */}
      <h2 className="text-xl font-semibold mt-6">7. Children’s Information</h2>
      <p className="mt-2">
        We do not knowingly collect personal data from children under 13.
      </p>

      {/* Section 8 */}
      <h2 className="text-xl font-semibold mt-6">8. Changes to This Policy</h2>
      <p className="mt-2">
        We may update this policy at any time. Changes will be posted on this page.
      </p>

      {/* Section 9 */}
      <h2 className="text-xl font-semibold mt-6">9. Contact Us</h2>
      <p className="mt-2">
        If you have any questions, contact us:
      </p>
      <p className="mt-1 font-medium">
        Email: your-email@example.com
      </p>
    </div>
  )
}