'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, Search } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

type Author = {
    id: string
    name: string
}

export default function NewBook() {
    const router = useRouter()
    const [date, setDate] = useState<Date>()
    const [authors, setAuthors] = useState<Author[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null)
    const [isSearching, setIsSearching] = useState(false)

    useEffect(() => {
        fetchAuthors()
    }, [])

    const fetchAuthors = async () => {
        try {
            const response = await fetch('/api/books/authors/search')
            const data = await response.json()
            setAuthors(data)
        } catch (error) {
            console.error('Failed to fetch authors:', error)
        }
    }

    const filteredAuthors = authors.filter(author =>
        author.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (!selectedAuthor) {
            alert('Please select an author')
            return
        }

        const formData = new FormData(event.currentTarget)
        const response = await fetch('/api/books', {
            method: 'POST',
            body: JSON.stringify({
                title: formData.get('title'),
                author_id: selectedAuthor.id,
                num_of_words: parseInt(formData.get('num_of_words') as string) || 0,
                date_of_release: date?.toISOString().split('T')[0],
                cover_image: formData.get('cover_image'),
            }),
        })

        if (response.ok) {
            router.push('/books')
            router.refresh()
        }
    }

    return (
        <div className="container mx-auto py-10">
            <div className="max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Add New Book</CardTitle>
                        <CardDescription>
                            Enter the details of the new book to add it to the collection.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={onSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" name="title" required placeholder="Book title" />
                            </div>

                            <div className="space-y-2">
                                <Label>Author</Label>
                                <div className="relative">
                                    <div className="relative">
                                        <Input
                                            type="text"
                                            placeholder="Search authors..."
                                            value={searchTerm}
                                            onChange={(e) => {
                                                setSearchTerm(e.target.value)
                                                setIsSearching(true)
                                            }}
                                            onFocus={() => setIsSearching(true)}
                                        />
                                        <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    </div>
                                    {isSearching && searchTerm && (
                                        <div className="absolute z-10 mt-1 w-full rounded-md border bg-popover shadow-md">
                                            <div className="max-h-[200px] overflow-auto p-1">
                                                {filteredAuthors.length > 0 ? (
                                                    filteredAuthors.map((author) => (
                                                        <div
                                                            key={author.id}
                                                            className="cursor-pointer rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
                                                            onClick={() => {
                                                                setSelectedAuthor(author)
                                                                setSearchTerm(author.name)
                                                                setIsSearching(false)
                                                            }}
                                                        >
                                                            {author.name}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="px-2 py-1.5 text-sm text-muted-foreground">
                                                        No authors found
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {selectedAuthor && (
                                    <div className="mt-2 text-sm text-muted-foreground">
                                        Selected: {selectedAuthor.name}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="num_of_words">Number of Words</Label>
                                <Input
                                    id="num_of_words"
                                    name="num_of_words"
                                    type="number"
                                    placeholder="Enter number of words"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Release Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={`w-full justify-start text-left font-normal ${!date && "text-muted-foreground"}`}
                                        >
                                            <Calendar className="mr-2 h-4 w-4" />
                                            {date ? date.toLocaleDateString() : "Select date"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <CalendarComponent
                                            mode="single"
                                            selected={date}
                                            onSelect={setDate}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="cover_image">Cover Image URL</Label>
                                <Input
                                    id="cover_image"
                                    name="cover_image"
                                    type="url"
                                    placeholder="URL to book cover image"
                                />
                            </div>

                            <div className="flex justify-end space-x-4">
                                <Button variant="outline" type="button" onClick={() => router.back()}>
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    Add Book
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

