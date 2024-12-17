'use client'

import { useEffect, useState } from "react"
import { Author } from "@/app/libs/types"
import AuthorCard from "@/app/(main)/(books)/authors/components/author-card";
import {useSession} from "next-auth/react";


export default function AuthorsPage() {
    const [authors, setAuthors] = useState<Author[]>([])
    const { data: session } = useSession()

    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const processLike = async (id: string, liked: boolean) => {
        await fetch('/api/books/authors/like',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: session.user.id, author_id: id, liked }),
            }
        )

        setAuthors((prevAuthors) =>
            prevAuthors.map((author) =>
                author.id === id
                    ? { ...author, liked: !author.liked }
                    : author
            )
        );
    }

    useEffect(() => {
        const fetchAuthors = async () => {
            try {

                const res = await fetch(`/api/books/authors?userId=${session.user.id}`)
                if (!res.ok) {
                    throw new Error('Failed to fetch authors')
                }
                const data = await res.json()
                setAuthors(data.authors)
            } catch (err) {
                console.log(err)
                setError('An error occurred while fetching authors. Please try again later.')
            } finally {
                setIsLoading(false)
            }
        }

        fetchAuthors()
    }, [])

    if (isLoading) {
        return <div className="min-h-screen bg-[#fff9e5] flex items-center justify-center">
            <div className="text-2xl text-[#8B4513]">Loading authors...</div>
        </div>
    }

    if (error) {
        return <div className="min-h-screen bg-[#fff9e5] flex items-center justify-center">
            <div className="text-2xl text-red-600">{error}</div>
        </div>
    }

    return (
        <div className="min-h-screen bg-[#fff9e5]">
            <main className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold text-[#8B4513] mb-2 text-center">Authors</h1>
                <p className="text-center text-gray-600 mb-8">Discover the brilliant minds behind your favorite books</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {authors.map((author) => (

                        <AuthorCard author={author} key={author.id} processLike={processLike} />

                    ))}
                </div>
            </main>
        </div>
    )
}

