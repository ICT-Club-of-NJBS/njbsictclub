'use client'

import { useEffect, useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Github, Twitter, Globe, Mail, Phone } from 'lucide-react'

// Move dynamic configuration out of Client Component if Next.js throws an error,
// or configure it inside your layout / page wrapper.
export const dynamic = 'force-dynamic'

interface TeamMember {
  _id?: string
  id?: string
  name: string
  role: string
  bio?: string
  avatar?: string
  avatar_url?: string 
  image_url?: string  
  email?: string       
  phone?: string       
  github?: string
  twitter?: string
  website?: string
}

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Flag to handle component unmounting gracefully
    let isMounted = true

    const fetchMembers = async () => {
      try {
        const response = await fetch('/api/admin/team')
        
        if (!response.ok) {
          throw new Error('Failed to fetch team members')
        }

        const data = await response.json()
        if (isMounted) {
          // Fallback to empty array if data isn't structured as expected
          setMembers(Array.isArray(data) ? data : data.members || [])
        }
      } catch (error) {
        console.error('Error fetching team members:', error)
        if (isMounted) setMembers([])
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchMembers()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 pt-32 pb-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">

          {/* HEADER */}
          <div className="text-center mb-14">
            <h1 className="text-5xl font-extrabold mb-4 tracking-tight text-slate-900 dark:text-white">
              Our Team
            </h1>
            <p className="text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto text-lg">
              Meet the talented people building the future of our project
            </p>
          </div>

          {/* LOADING & DISPLAY PATTERNS */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : members.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

              {members.map((member, index) => {
                const memberImage = member.avatar || member.avatar_url || member.image_url || '/default-avatar.png';
                // Fallback to index if no database ID is provided to guarantee a unique React key
                const uniqueId = member._id || member.id || `member-${index}`;

                return (
                  <div
                    key={uniqueId}
                    className="
                      group relative rounded-3xl p-6
                      bg-white dark:bg-zinc-900/50 backdrop-blur-xl
                      border border-slate-200 dark:border-zinc-800/80
                      hover:border-slate-400/40
                      transition-all duration-300
                      hover:-translate-y-2 hover:shadow-xl
                    "
                  >
                    <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition bg-gradient-to-r from-blue-500/10 via-transparent to-blue-500/10 blur-xl pointer-events-none" />

                    <div className="relative z-10">

                      {/* AVATAR DISPLAY */}
                      <div className="flex justify-center mb-4">
                        <div className="relative w-24 h-24">
                          <img
                            src={memberImage}
                            alt={member.name || 'Team member'}
                            className="
                              w-full h-full rounded-full object-cover
                              border-2 border-blue-500/40
                              shadow-md
                              group-hover:scale-105 transition duration-300
                            "
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              if (target.src !== '/default-avatar.png') {
                                target.src = '/default-avatar.png';
                              }
                            }}
                          />
                        </div>
                      </div>

                      {/* NAME */}
                      <h3 className="text-xl font-bold text-center text-slate-900 dark:text-zinc-50">
                        {member.name || 'No Name Provided'}
                      </h3>

                      {/* ROLE BADGE */}
                      <div className="flex justify-center mt-2 mb-4">
                        <span className="text-xs px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold border border-blue-500/20 uppercase tracking-wider">
                          {member.role || 'Member'}
                        </span>
                      </div>

                      {/* CONTACT INFO (Email & Phone Section) */}
                      {(member.email || member.phone) && (
                        <div className="flex flex-col items-center gap-2 mb-4 text-sm text-slate-600 dark:text-zinc-300 bg-slate-50 dark:bg-zinc-900/80 p-3 rounded-xl border border-slate-100 dark:border-zinc-800">
                          {member.email && (
                            <div className="flex items-center gap-2 w-full justify-center">
                              <Mail size={14} className="text-slate-400" />
                              <a href={`mailto:${member.email}`} className="hover:underline truncate max-w-[200px]">
                                {member.email}
                              </a>
                            </div>
                          )}
                          {member.phone && (
                            <div className="flex items-center gap-2 w-full justify-center">
                              <Phone size={14} className="text-slate-400" />
                              <span className="font-mono">{member.phone}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* BIO BLOCK */}
                      {member.bio && (
                        <p className="text-sm text-slate-500 dark:text-zinc-400 text-center mb-6 leading-relaxed line-clamp-3">
                          {member.bio}
                        </p>
                      )}

                      {/* SOCIAL LINKS */}
                      <div className="flex justify-center gap-3">
                        {member.github && (
                          <a
                            href={member.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 transition"
                          >
                            <Github size={18} />
                          </a>
                        )}

                        {member.twitter && (
                          <a
                            href={member.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 transition"
                          >
                            <Twitter size={18} />
                          </a>
                        )}

                        {member.website && (
                          <a
                            href={member.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 transition"
                          >
                            <Globe size={18} />
                          </a>
                        )}
                      </div>

                    </div>
                  </div>
                );
              })}

            </div>
          ) : (
            <div className="text-center py-20 border border-dashed rounded-3xl border-slate-200 dark:border-zinc-800">
              <p className="text-slate-400 dark:text-zinc-500 text-lg">
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