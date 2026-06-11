'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Github, Twitter, Globe } from 'lucide-react'

interface TeamMember {
  _id?: string
  id?: string
  name: string
  role: string
  bio?: string
  avatar?: string
  github?: string
  twitter?: string
  website?: string
}

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch('/api/admin/team')
        
        if (!response.ok) {
          throw new Error('Failed to fetch team members')
        }

        const data = await response.json()
        setMembers(data || [])
      } catch (error) {
        console.error('Error fetching team members:', error)
        setMembers([])
      } finally {
        setLoading(false)
      }
    }

    fetchMembers()
  }, [])

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background pt-24 px-4 sm:px-6 lg:px-8">

        <div className="max-w-7xl mx-auto">

          {/* HEADER */}
          <div className="text-center mb-14">
            <h1 className="text-5xl font-bold mb-4 tracking-tight">
              Our Team
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Meet the talented people building the future of our project
            </p>
          </div>

          {/* LOADING */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : members.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

              {members.map((member) => (
                <div
                  key={member.id}
                  className="
                    group relative rounded-2xl p-6
                    bg-card/40 backdrop-blur-xl
                    border border-border/40
                    hover:border-primary/40
                    transition-all duration-300
                    hover:-translate-y-2 hover:shadow-2xl
                  "
                >

                  {/* glowing border effect */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition bg-gradient-to-r from-primary/10 via-transparent to-primary/10 blur-xl" />

                  {/* CONTENT */}
                  <div className="relative z-10">

                    {/* AVATAR */}
                    <div className="flex justify-center mb-4">
                      <div className="relative">
                        <img
                          src={member.avatar || '/default-avatar.png'}
                          alt={member.name || 'Team member'}
                          className="
                            w-24 h-24 rounded-full object-cover
                            border-2 border-primary/40
                            shadow-lg
                            group-hover:scale-105 transition
                          "
                        />
                        <span className="absolute inset-0 rounded-full ring-2 ring-primary/20 animate-pulse" />
                      </div>
                    </div>

                    {/* NAME */}
                    <h3 className="text-xl font-semibold text-center">
                      {member.name}
                    </h3>

                    {/* ROLE BADGE */}
                    <div className="flex justify-center mt-2 mb-4">
                      <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                        {member.role}
                      </span>
                    </div>

                    {/* BIO */}
                    {member.bio && (
                      <p className="text-sm text-muted-foreground text-center mb-6 leading-relaxed">
                        {member.bio}
                      </p>
                    )}

                    {/* SOCIALS */}
                    <div className="flex justify-center gap-3">

                      {member.github && (
                        <a
                          href={member.github}
                          target="_blank"
                          className="
                            p-2 rounded-lg
                            bg-white/5 hover:bg-white/10
                            border border-border/40
                            transition
                          "
                        >
                          <Github size={18} />
                        </a>
                      )}

                      {member.twitter && (
                        <a
                          href={member.twitter}
                          target="_blank"
                          className="
                            p-2 rounded-lg
                            bg-white/5 hover:bg-white/10
                            border border-border/40
                            transition
                          "
                        >
                          <Twitter size={18} />
                        </a>
                      )}

                      {member.website && (
                        <a
                          href={member.website}
                          target="_blank"
                          className="
                            p-2 rounded-lg
                            bg-white/5 hover:bg-white/10
                            border border-border/40
                            transition
                          "
                        >
                          <Globe size={18} />
                        </a>
                      )}

                    </div>

                  </div>
                </div>
              ))}

            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                No team members found
              </p>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </>
  )
}
