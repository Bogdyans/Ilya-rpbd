import {Navbar} from "@/app/components/navbar";
import {redirect} from "next/navigation";
import {getServerSession} from "next-auth/next";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";

export default function BooksLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    const session = getServerSession(authOptions);

    if (!session) {
        redirect('/');
    }

    return (
        <div className="min-h-screen bg-amber-50">
            <Navbar/>
            <main className="container mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    )
}
