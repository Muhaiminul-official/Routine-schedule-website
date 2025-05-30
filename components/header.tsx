import { GraduationCap } from "lucide-react"
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-red-100">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-8 w-8 text-red-600" />
            <h1 className="text-3xl font-bold text-gray-900">Routine Schedule</h1>
          </div>

          <div className="flex items-center gap-4">
            <SignedOut>
              <SignInButton>
                <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10",
                  },
                }}
              />
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  )
}
