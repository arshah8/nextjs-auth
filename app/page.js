import React from 'react'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function HomePage() {
  // Server-side session validation
  const session = await auth()
  
  // Redirect to signin if no session exists
  if (!session) {
    redirect("/signin")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-semibold text-gray-900 mb-4">
              Welcome
            </h1>
            <p className="text-lg text-gray-600">
              Hello, {session.user?.name || "User"}
            </p>
          </div>

          {/* Blog Directory Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Blog Directory</h2>
                <p className="text-gray-600">Browse and explore blog posts from our directory</p>
              </div>
              <Link
                href="/main"
                className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-md font-medium transition-colors flex items-center gap-2"
              >
                <span>Explore Blogs</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
