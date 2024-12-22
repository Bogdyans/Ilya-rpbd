'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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

export default function NewAuthor() {
    const router = useRouter()
    const [date, setDate] = useState<Date>()

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const formData = new FormData(event.currentTarget)
        const response = await fetch('/api/books/authors', {
            method: 'POST',
            body: JSON.stringify({
                name: formData.get('name'),
                country: formData.get('country'),
                photopath: formData.get('photopath'),
                bio: formData.get('bio'),
                bdate: date?.toISOString().split('T')[0],
            }),
        })

        if (response.ok) {
            router.push('/authors')
            router.refresh()
        }
    }

    return (
        <div className="container mx-auto py-10">
            <div className="max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Add New Author</CardTitle>
                        <CardDescription>
                            Enter the details of the new author to add them to the collection.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={onSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" name="name" required placeholder="Author's full name" />
                            </div>

                            <div className="space-y-2">
                                <Label>Birth Date</Label>
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
                                <Label htmlFor="country">Country</Label>
                                <Input id="country" name="country" placeholder="Author's country of origin" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="photopath">Photo URL</Label>
                                <Input id="photopath" name="photopath" type="url" placeholder="URL to author's photo" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bio">Biography</Label>
                                <Textarea
                                    id="bio"
                                    name="bio"
                                    placeholder="Write a brief biography of the author..."
                                    className="min-h-[100px]"
                                />
                            </div>

                            <div className="flex justify-end space-x-4">
                                <Button variant="outline" type="button" onClick={() => router.back()}>
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    Add Author
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

