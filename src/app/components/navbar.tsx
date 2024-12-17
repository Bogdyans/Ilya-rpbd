import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { UserCircle } from 'lucide-react'

export function Navbar() {
    return (
        <nav className="bg-amber-100 p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold text-amber-800">BookWiki</Link>
                <div className="flex items-center space-x-4">
                    <Button variant="ghost" asChild>
                        <Link href="/books">Books</Link>
                    </Button>
                    <Button variant="ghost" asChild>
                        <Link href="/authors">Authors</Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/profile">
                            <UserCircle className="h-6 w-6" />
                            <span className="sr-only">Profile</span>
                        </Link>
                    </Button>
                </div>
            </div>
        </nav>
    )
}

