'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      setSuccess(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
      setTimeout(() => setSuccess(false), 5000)
    } catch (err: any) {
      console.error('Error sending message:', err)
      setError('Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-24">
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">Get in Touch</h1>
              <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
                Have a question? Want to join ICT Club? We&apos;d love to hear from you!
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
              {/* Contact Info Cards */}
              <div className="bg-card/50 border border-border/50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Mail className="text-primary" size={24} />
                  <h3 className="font-semibold">Email</h3>
                </div>
                <p className="text-foreground/60 text-sm">
                  <a href="mailto:njbsictclub@gmail.com" className="text-primary hover:underline">
                    njbsictclub@gmail.com
                  </a>
                </p>
              </div>

              <div className="bg-card/50 border border-border/50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <MapPin className="text-accent" size={24} />
                  <h3 className="font-semibold">Location</h3>
                </div>
                <p className="text-foreground/60 text-sm">
                 Tilottama-8, Charnumber
                </p>
              </div>

              <div className="bg-card/50 border border-border/50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Phone className="text-primary/70" size={24} />
                  <h3 className="font-semibold">Response Time</h3>
                </div>
                <p className="text-foreground/60 text-sm">
                  Usually within 24 hours
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-card/50 border border-border/50 rounded-xl p-8">
              {success && (
                <div className="mb-6 p-4 rounded-lg bg-green-500/20 border border-green-500/50 text-green-500">
                  Thanks for your message! We&apos;ll get back to you soon.
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 rounded-lg bg-destructive/20 border border-destructive/50 text-destructive">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    placeholder="What is this about?"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    placeholder="Tell us what's on your mind..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="w-full px-3 py-2 rounded-lg bg-input border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </Button>
              </form>

            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
