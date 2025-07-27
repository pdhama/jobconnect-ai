"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { 
  Search, 
  FileText, 
  Mail, 
  Users, 
  BarChart3, 
  Settings,
  Menu,
  X,
  Bell,
  User,
  Sparkles
} from "lucide-react"

interface NavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const tabs = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: BarChart3,
    description: "Overview & insights"
  },
  {
    id: "job-search",
    label: "Job Search",
    icon: Search,
    description: "Find opportunities"
  },
  {
    id: "resume-builder",
    label: "Resume Builder",
    icon: FileText,
    description: "Create & optimize"
  },
  {
    id: "cover-letter",
    label: "Cover Letter",
    icon: Mail,
    description: "Generate letters"
  },
  {
    id: "networking",
    label: "Networking",
    icon: Users,
    description: "Connect & grow"
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    description: "Preferences"
  }
]

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:block glass-effect sticky top-0 z-50 border-b border-white/20 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-h4 font-bold text-foreground">JobConnect AI</h1>
              </div>
            </div>

            {/* Desktop Navigation Tabs */}
            <div className="flex items-center space-x-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`group relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/10 dark:hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </div>
                    {isActive && (
                      <div className="absolute inset-0 rounded-xl bg-primary/10 animate-pulse" />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full" />
              </Button>
              <Button variant="ghost" size="icon">
                <User className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="lg:hidden glass-effect sticky top-0 z-50 border-b border-white/20 dark:border-white/10">
        <div className="px-4">
          <div className="flex items-center justify-between h-16">
            {/* Mobile Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-h4 font-bold text-foreground">JobConnect AI</h1>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="px-4 pb-4 animate-fade-in">
            <div className="bg-white/80 dark:bg-black/80 backdrop-blur-lg rounded-2xl border border-white/20 dark:border-white/10 shadow-xl">
              <div className="p-4 space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.id
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        onTabChange(tab.id)
                        setIsMobileMenuOpen(false)
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "text-foreground hover:bg-white/50 dark:hover:bg-white/10"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <div>
                        <div className="font-medium">{tab.label}</div>
                        <div className="text-xs opacity-75">{tab.description}</div>
                      </div>
                    </button>
                  )
                })}
              </div>
              
              {/* Mobile Actions */}
              <div className="border-t border-white/20 dark:border-white/10 p-4">
                <div className="flex items-center justify-between">
                  <ThemeToggle />
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <Bell className="w-4 h-4" />
                    <span>Notifications</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Bottom Navigation (when menu is closed) */}
      {!isMobileMenuOpen && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass-effect border-t border-white/20 dark:border-white/10">
          <div className="flex items-center justify-around px-4 py-2">
            {tabs.slice(0, 4).map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex flex-col items-center space-y-1 p-2 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </>
  )
} 