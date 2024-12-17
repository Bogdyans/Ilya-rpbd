import { Navbar } from '@/app/components/navbar'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Search, Users } from 'lucide-react'
import Link from 'next/link'

export default function MainPage() {
    return (

            <>
                <h1 className="text-4xl font-bold text-center text-amber-800 mb-8">Welcome to BookWiki</h1>
                <p className="text-center text-lg mb-12">Your gateway to the world of books and authors</p>

                <div className="grid md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <BookOpen className="mr-2" />
                                Explore Books
                            </CardTitle>
                            <CardDescription>Discover new worlds through literature</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Browse our extensive collection of books across various genres and eras.</p>
                        </CardContent>
                        <CardFooter>
                            <Button asChild className="w-full">
                                <Link href="/books">View Books</Link>
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Users className="mr-2" />
                                Meet Authors
                            </CardTitle>
                            <CardDescription>Learn about the minds behind the stories</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Explore biographies and works of renowned authors from around the world.</p>
                        </CardContent>
                        <CardFooter>
                            <Button asChild className="w-full">
                                <Link href="/authors">View Authors</Link>
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Search className="mr-2" />
                                Search
                            </CardTitle>
                            <CardDescription>Find exactly what you're looking for</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Use our powerful search feature to find books, authors, or topics of interest.</p>
                        </CardContent>
                        <CardFooter>
                            <Button asChild className="w-full">
                                <Link href="/search">Start Searching</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </>

    )
}

