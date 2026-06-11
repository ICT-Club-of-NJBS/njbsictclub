'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Menu, X, LogOut, User, Moon, Sun, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useTheme } from '@/contexts/theme-context';

const navItems = [
  { label: 'Team', href: '/team' },
  { label: 'Projects', href: '/projects' },
  { label: 'Events', href: '/events' },
  { label: 'Contact', href: '/contact' },
];

interface UserProfile {
  full_name: string;
  avatar?: string;
  user_id: string;
  role: 'member' | 'organizer' | 'admin';
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, loading, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Only fetch if we are mounted and have a user object from useAuth
    if (mounted && user) {
      fetchProfile();
    } else if (mounted && !user) {
      setProfile(null);
    }
  }, [user, mounted]);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/auth/me');
      
      // If the API returns 401, we just clear the profile
      if (!response.ok) {
        setProfile(null);
        return;
      }

      const data = await response.json();
      
      if (data.user) {
        setProfile({
          full_name: data.user.full_name || 'User',
          avatar: data.user.avatar || undefined,
          user_id: data.user.user_id || 'NJBS-MEMBER',
          role: data.user.role || 'member',
        });
      }
    } catch (error) {
      console.error('[v0] Profile fetch failed:', error);
      setProfile(null);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
    setProfile(null);
    router.push('/');
  };

  // Prevent hydration mismatch
  if (!mounted) return null;

  // Check if current user is an admin
  const isAdmin = profile?.role === 'admin' || user?.email === 'sangamkunwar48@gmail.com';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 mx-4 my-4 rounded-2xl bg-card/40 backdrop-blur-xl border border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Image
              src="/ictclubNJBS.jpg"
              alt="ICT Club Logo"
              width={40}
              height={40}
              className="rounded-full object-cover border border-primary/20"
            />
            <span className="font-bold text-lg hidden sm:inline tracking-tight">
              ICT Club
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* User Actions & Theme Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-foreground/70 hover:bg-primary/10 hover:text-primary transition-all"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {loading ? (
              <div className="h-9 w-9 rounded-full bg-muted animate-pulse border border-border/50"></div>
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1 pr-3 rounded-full bg-secondary/50 hover:bg-secondary border border-border/50 transition-all"
                >
                  {profile?.avatar ? (
                    <img src={profile.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                      <User size={14} />
                    </div>
                  )}
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {profile?.user_id || 'Member'}
                  </span>
                </button>

                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-[-1]" onClick={() => setShowUserMenu(false)} />
                    <div className="absolute right-0 top-full mt-3 w-72 bg-card border border-border shadow-2xl rounded-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                      {/* User Info Header */}
                      <div className="px-6 py-5 border-b border-border/50 bg-muted/30 space-y-2">
                        <p className="text-sm font-bold text-foreground">User</p>
                        <p className="text-sm text-muted-foreground">{user?.email}</p>
                        <p className="text-xs font-medium uppercase tracking-widest text-primary">{profile?.role || 'Member'}</p>
                      </div>

                      {/* Menu Items */}
                      <div className="p-2 space-y-1">
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <User size={16} /> Edit Profile
                        </Link>

                        {isAdmin && (
                           <button
                             className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-primary hover:bg-primary/10 transition-colors w-full text-left"
                             onClick={() => {
                               setShowUserMenu(false);
                               router.push('/admin');
                             }}
                             type="button"
                            >
                             <Settings size={16} /> Admin Dashboard
                            </button>
                        )}

                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-destructive hover:bg-destructive/10 transition-colors border-t border-border/50"
                        >
                          <LogOut size={16} /> Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild className="rounded-full">
                  <Link href="/auth/login">Login</Link>
                </Button>
                <Button size="sm" asChild className="rounded-full px-6">
                  <Link href="/auth/signup">Join Club</Link>
                </Button>
              </div>
            )}

            <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border/50 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-3 text-base font-medium hover:bg-primary/10 rounded-xl transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {!user && (
              <div className="pt-4 grid grid-cols-2 gap-2 px-4">
                <Button variant="outline" asChild>
                  <Link href="/auth/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/signup">Join</Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
