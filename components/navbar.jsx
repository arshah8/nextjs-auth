import { auth } from "@/auth"
import Link from "next/link"
import { signOut } from "@/auth"
import { redirect } from "next/navigation"

export async function Navbar() {
  const session = await auth()

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link 
              href="/" 
              className="text-gray-900 hover:text-gray-700 font-medium transition-colors"
            >
              Home
            </Link>
            {session && (
              <Link 
                href="/main" 
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Blog Directory
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <div className="flex items-center space-x-4">
                  {session.user?.image && (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <span className="text-gray-700 font-medium hidden md:block text-sm">
                    {session.user?.name || "User"}
                  </span>
                  <form
                    action={async () => {
                      "use server"
                      await signOut({ redirect: false })
                      redirect("/signin")
                    }}
                  >
                    <button
                      type="submit"
                      className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-md font-medium transition-colors text-sm"
                    >
                      Logout
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <Link
                href="/signin"
                className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-md font-medium transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

