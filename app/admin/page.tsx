'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Users, Calendar, Briefcase, Mail } from 'lucide-react'

import AdminMembers from '@/components/admin/members'
import AdminEvents from '@/components/admin/events'
import AdminProjects from '@/components/admin/projects'
import AdminAttendance from '@/components/admin/attendance'
import AdminMessages from '@/components/admin/messages'
import AdminSettings from '@/components/admin/settings'
import TeamComponent from '@/components/admin/team'

export default function AdminPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const [isAdmin, setIsAdmin] = useState(false)

  const [stats, setStats] = useState({
    totalMembers: 0,
    totalEvents: 0,
    totalProjects: 0,
    totalMessages: 0,
  })

  useEffect(() => {
    if (!loading) {
      checkAdminAccess()
    }
  }, [user, loading])


  const checkAdminAccess = async () => {
    if (!user) {
     router.push('/auth/login')
     return
  }

  try {
    const res = await fetch('/api/auth/me')
    const data = await res.json()

    const isAdminUser = data?.user?.role === 'admin' // <-- FIXED LINE

    if (isAdminUser) {
      setIsAdmin(true)
      await fetchStats()
    } else {
      console.warn('User is not admin:', data?.user?.role)
      router.push('/')
    }
  } catch (error) {
    console.error('Admin access check error:', error)
    router.push('/auth/login')
  }
}


  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats')
      const data = await res.json()

      setStats({
        totalMembers: data.totalMembers || 0,
        totalEvents: data.totalEvents || 0,
        totalProjects: data.totalProjects || 0,
        totalMessages: data.totalMessages || 0,
      })
    } catch (error) {
      console.error('[Stats error]', error)
    }
  }


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-b-2 border-black"></div>
      </div>
    )
  }


  if (!isAdmin) {
    return null
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen pt-24">
        <div className="max-w-7xl mx-auto px-4 py-8">

          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-500 mb-8">
            Manage everything from one place
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">

            <Card className="p-6">
              <Users className="mb-2" />
              <p>Total Members</p>
              <h2 className="text-2xl font-bold">{stats.totalMembers}</h2>
            </Card>

            <Card className="p-6">
              <Calendar className="mb-2" />
              <p>Events</p>
              <h2 className="text-2xl font-bold">{stats.totalEvents}</h2>
            </Card>

            <Card className="p-6">
              <Briefcase className="mb-2" />
              <p>Projects</p>
              <h2 className="text-2xl font-bold">{stats.totalProjects}</h2>
            </Card>

            <Card className="p-6">
              <Mail className="mb-2" />
              <p>Messages</p>
              <h2 className="text-2xl font-bold">{stats.totalMessages}</h2>
            </Card>

          </div>

          {/* Tabs */}
          <Tabs defaultValue="members">

            <TabsList className="grid grid-cols-7 mb-6">
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="members"><AdminMembers /></TabsContent>
            <TabsContent value="team"><TeamComponent /></TabsContent>
            <TabsContent value="events"><AdminEvents /></TabsContent>
            <TabsContent value="projects"><AdminProjects /></TabsContent>
            <TabsContent value="attendance"><AdminAttendance /></TabsContent>
            <TabsContent value="messages"><AdminMessages /></TabsContent>
            <TabsContent value="settings"><AdminSettings /></TabsContent>

          </Tabs>

        </div>
      </main>

      <Footer />
    </>
  )
}
