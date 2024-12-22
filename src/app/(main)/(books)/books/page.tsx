'use client'

import {useEffect, useState} from "react"
import { BookCard } from "./components/book-card"
import { Pagination } from "./components/pagination"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, Loader2 } from 'lucide-react'
import {useSession} from "next-auth/react";
import Link from "next/link";



export default function BooksPage() {
    const [books, setBooks] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const { data: session } = useSession()
    const [totalPages, setTotalPages] = useState(1)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)


    useEffect(() => {
        fetchData(currentPage)
    }, [currentPage])

    const fetchData = async (page: number) => {
        try {
            setIsLoading(true)
            setError(null)
            const response = await fetch(`/api/books/?page=${page}&userId=${session.user.id}`)
            if (!response.ok) throw new Error('Failed to fetch products')
            const data = await response.json()
            setBooks(data.books)
            setTotalPages(data.totalPages)
        } catch (err) {
            setError('Failed to load products. Please try again later.')
        } finally {
            setIsLoading(false)
        }
    }




    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-amber-900">Books</h1>
                    <p className="text-gray-600">Explore our collection of literary treasures</p>

                </div>
                <div className="flex gap-4">

                    <Link href="/books/add" className="h-full">
                        <Button className="h-full bg-[#8B4513]">Add new Books</Button>
                    </Link>
                </div>
            </div>
            {isLoading && (
                <div className="flex justify-center items-center min-h-[400px] mx-auto">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            )}

            {error && (
                <div className="text-center py-12">
                    <p className="text-red-500">{error}</p>
                    <Button onClick={() => fetchData(currentPage)} className="mt-4">
                        Try Again
                    </Button>
                </div>
            )}

            {!isLoading && !error && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {books.map((book) => (
                    <BookCard key={book.id} book={book} user_id={session?.user?.id}/>
                ))}
            </div>
            )}

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
    )
}

