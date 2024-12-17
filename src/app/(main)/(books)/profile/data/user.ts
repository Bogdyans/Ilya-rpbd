import { authors } from "../../authors/data/authors"

export const userData = {
    username: "bookworm_jane",
    name: "Jane Smith",
    avatar: "/placeholder.svg?height=200&width=200",
    joinDate: "January 2023",
    bio: "Avid reader with a passion for classic literature and contemporary fiction. Always looking for new book recommendations!",
    stats: {
        booksRead: 47,
        booksReviewed: 32,
        favoriteGenres: ["Classic Literature", "Science Fiction", "Mystery"],
        readingGoal: 52
    },
    favoriteAuthors: authors.slice(0, 3), // Taking first 3 authors from our authors data
    recentActivity: [
        {
            id: 1,
            type: "review",
            book: "The Midnight Library",
            date: "2 days ago"
        },
        {
            id: 2,
            type: "finished",
            book: "Project Hail Mary",
            date: "1 week ago"
        },
        {
            id: 3,
            type: "started",
            book: "Klara and the Sun",
            date: "2 weeks ago"
        }
    ]
}

