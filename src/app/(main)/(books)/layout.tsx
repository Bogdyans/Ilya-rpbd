import {Navbar} from "@/app/components/navbar";
import {redirect} from "next/navigation";
import {getServerSession} from "next-auth/next";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";

export default async function BooksLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/authorize');
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

