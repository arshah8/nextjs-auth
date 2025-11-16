import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { cookies } from "next/headers"

export default async function MainPage() {
  // Server-side session validation
  const session = await auth()
  
  // Redirect to signin if no session exists
  if (!session) {
    redirect("/signin")
  }

  // Fetch blogs from API route on the server
  try {
    const cookieStore = await cookies()
    const cookieHeader = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join('; ')
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/blogs`, {
      cache: "no-store", // Ensure fresh data on each request
      headers: {
        'Cookie': cookieHeader
      }
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch blogs: ${response.status} ${response.statusText}`)
    }
    
    const data = await response.json()
    const blogs = data.blogs || []
    
    if (!Array.isArray(blogs) || blogs.length === 0) {
      throw new Error("No blogs data available")
    }
    
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-semibold text-gray-900 mb-4">
              Blog Directory
            </h1>
            <p className="text-gray-600 text-lg">Server-rendered data from API route</p>
            <p className="text-gray-500 text-sm mt-2">
              Welcome, <span className="font-semibold text-gray-900">{data.user?.name}</span>! You have access to all blog posts.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow"
              >
                
                <h2 className="text-2xl font-bold text-gray-800 mb-3 line-clamp-2">
                  {blog.title}
                </h2>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {blog.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4 pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>{blog.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{blog.publishedAt}</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-700 line-clamp-4">
                    {blog.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error fetching blogs:", error)
    throw new Error(error.message || "Unable to load blogs. Please try again later.")
  }

}

