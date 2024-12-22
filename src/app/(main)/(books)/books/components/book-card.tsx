'use client'

import Image from "next/image"
import { useState } from "react"
import {  Heart, HeartOff } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {formatDate} from "@/app/libs/funcs";

interface BookCardProps {

        id: string
        title: string
        author_name: string
        href: string
        release_date: string
        status: string
        liked: boolean

}



export function BookCard({ book, user_id }: {book: BookCardProps, user_id: string}) {
    const [isLiked, setIsLiked] = useState(book.liked)
    const [status, setStatus] = useState<string>(book.status === 'on_hold'? 'collection' : book.status)

    const handleValueChange = async (value: string) => {
        const body = JSON.stringify({ user_id, book_id: book.id, status: value })
        if (value === "collection") {
            await fetch('/api/books/status',{
                method: "DELETE",
                body: JSON.stringify({ user_id, book_id: book.id})
            })
        } else if (status.trim().length === 0 || status !== "collection") {
            await fetch('/api/books/status',{
                method: "PUT",
                headers: { 'Content-Type': 'application/json' },
                body
            })
        } else {
            fetch('/api/books/status',{
                method: "POST",
                body
            })
        }

        setStatus(value)
    }

    const handleLikeClick = async () => {
        if (isLiked){
            await fetch(`/api/books/like`, {
                method: "DELETE",
                body: JSON.stringify({ user_id, book_id: book.id })
            })
        } else {
            await fetch(`/api/books/like`, {
                method: "POST",
                body: JSON.stringify({ user_id, book_id: book.id })
            })
        }

        setIsLiked(!isLiked);
    }

    return (
        <Card className="group overflow-hidden transition-all hover:shadow-lg">
            <CardContent className="p-0">
                <div className="relative aspect-[3/4] overflow-hidden">
                    <Image
                        src={book.href}
                        alt={book.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <Badge className="absolute right-2 top-2 bg-amber-900">{formatDate(book.release_date)}</Badge>
                    <button
                        onClick={handleLikeClick}
                        className="absolute left-2 top-2 rounded-full bg-white/90 p-1.5 text-amber-900 transition-colors hover:bg-white"
                        aria-label={isLiked ? "Unlike book" : "Like book"}
                    >
                        {isLiked ? (
                            <Heart className="h-4 w-4 fill-amber-900" />
                        ) : (
                            <HeartOff className="h-4 w-4" />
                        )}
                    </button>
                </div>
                <div className="space-y-3 p-4">
                    <div className="space-y-2">
                        <h3 className="font-semibold leading-none tracking-tight">{book.title}</h3>
                        <p className="text-sm text-gray-600">{book.author_name}</p>
                    </div>
                    <Select value={status} onValueChange={handleValueChange} >
                        <SelectTrigger className={`w-full bg-white ${status == 'completed'? "border-2 border-green-500" :
                            status == 'reading'? "border-2 border-blue-500" : 
                            status == 'dropped'? "border-2 border-red-500" : ""
                        
                        }`}>
                            <SelectValue placeholder="Set status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="collection">Set status</SelectItem>
                            <SelectItem className="border border-blue-500" value="reading">Reading</SelectItem>
                            <SelectItem className="border border-green-500" value="completed">Completed</SelectItem>
                            <SelectItem className="border border-red-500" value="dropped">Dropped</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>
    )
}

