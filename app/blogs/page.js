import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function BlogsPage() {
  const session = await auth()
  
  if (!session) {
    redirect("/signin")
  }
  
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts`, {
    cache: "no-store"
  })
  
  if (!response.ok) {
    if (response.status === 401) {
      redirect("/signin")
    }
    throw new Error(`Failed to fetch blogs: ${response.status} ${response.statusText}`)
  }
  
  const blogs = await response.json()

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold text-gray-900 mb-4">
            Blog Posts
          </h1>
          <p className="text-gray-600 text-lg">
            Welcome, <span className="font-semibold text-gray-900">{session.user?.name}</span>! You have access to all blog posts.
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
                {blog.body}
              </p>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>User {blog.userId}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Post #{blog.id}</span>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-700 line-clamp-4">
                  {blog.body}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {blogs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No blog posts available.</p>
          </div>
        )}
      </div>
    </div>
  )
}

