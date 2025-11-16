import { auth } from "@/auth"

export async function GET(request) {
    const session = await auth()
    
    // Require authentication - return 401 if not authenticated
    if (!session) {
        return new Response(JSON.stringify({
            error: 'Unauthorized',
            message: 'You must be authenticated to access blog posts'
        }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        })
    }
    
    try {
        // Fetch blogs from JSONPlaceholder API
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
            cache: 'no-store', // Ensure fresh data on each request
        })
        
        if (!response.ok) {
            throw new Error(`Failed to fetch blogs: ${response.status} ${response.statusText}`)
        }
        
        const posts = await response.json()
        
        // Transform the data to match expected format
        const blogs = posts.map((post) => {
            // Create excerpt from body (first 100 characters)
            const excerpt = post.body.length > 100 
                ? post.body.substring(0, 100).trim() + '...'
                : post.body
            
            return {
                id: post.id,
                title: post.title,
                excerpt: excerpt,
                content: post.body,
                author: `User ${post.userId}`,
                publishedAt: new Date(Date.now() - Math.random() * 10000000000).toISOString().split('T')[0] // Random date for demo
            }
        })
        
        return new Response(JSON.stringify({
            authenticated: true,
            user: {
                name: session.user?.name,
                email: session.user?.email
            },
            blogs: blogs
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        })
    } catch (error) {
        console.error('Error fetching blogs:', error)
        return new Response(JSON.stringify({
            error: 'Internal Server Error',
            message: 'Failed to fetch blog posts. Please try again later.'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        })
    }
}

export async function POST(request) {
    const session = await auth()
    
    // Only authenticated users can create blogs
    if (!session) {
        return new Response(JSON.stringify({
            error: 'Unauthorized',
            message: 'You must be authenticated to create a blog post'
        }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        })
    }
    
    try {
        const body = await request.json()
        
        // In a real app, you would save this to a database
        const newBlog = {
            id: Date.now(),
            title: body.title || 'Untitled',
            excerpt: body.excerpt || '',
            content: body.content || '',
            author: session.user?.name || 'Unknown',
            publishedAt: new Date().toISOString().split('T')[0],
            isPublic: body.isPublic || false
        }
        
        return new Response(JSON.stringify({
            success: true,
            message: 'Blog post created successfully',
            blog: newBlog
        }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        })
    } catch (error) {
        return new Response(JSON.stringify({
            error: 'Bad Request',
            message: 'Invalid request body'
        }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        })
    }
}