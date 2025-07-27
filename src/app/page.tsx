"use client"

import { useState } from "react"
import { Navigation } from "@/components/layout/navigation"
import { Dashboard } from "@/components/features/dashboard"
import { JobSearch } from "@/components/features/job-search"
import { ResumeBuilder } from "@/components/features/resume-builder"
import { CoverLetterGenerator } from "@/components/features/cover-letter-generator"
import { Networking } from "@/components/features/networking"

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard")

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard onTabChange={setActiveTab} />
      case "job-search":
        return <JobSearch />
      case "resume-builder":
        return <ResumeBuilder />
      case "cover-letter":
        return <CoverLetterGenerator />
      case "networking":
        return <Networking />
      case "settings":
        return (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 className="text-h2 font-bold text-foreground mb-3">Settings</h2>
              <p className="text-muted-foreground mb-6">
                Configure your preferences, account settings, and customize your JobConnect AI experience.
              </p>
              <div className="space-y-3">
                <div className="p-4 border border-border rounded-xl bg-muted/30">
                  <h3 className="font-semibold text-foreground mb-1">Profile Settings</h3>
                  <p className="text-sm text-muted-foreground">Manage your personal information and preferences</p>
                </div>
                <div className="p-4 border border-border rounded-xl bg-muted/30">
                  <h3 className="font-semibold text-foreground mb-1">Job Preferences</h3>
                  <p className="text-sm text-muted-foreground">Set your job search criteria and location preferences</p>
                </div>
                <div className="p-4 border border-border rounded-xl bg-muted/30">
                  <h3 className="font-semibold text-foreground mb-1">Notification Settings</h3>
                  <p className="text-sm text-muted-foreground">Control how and when you receive updates</p>
                </div>
              </div>
            </div>
          </div>
        )
      default:
        return <Dashboard onTabChange={setActiveTab} />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 dark:from-background dark:via-background dark:to-muted/10">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="animate-fade-in">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}
