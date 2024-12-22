import {addBook, getAuthorById, getBooksForPage, getTotalBooks} from "@/app/libs/data";
import {NextResponse} from "next/server";


export async function GET(req: Request) {

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const userId = searchParams.get('userId');
        const limit = 16;
        const offset = (page - 1) * limit;

        console.log(page, "   ", userId)

        if (!userId) {
            return Response.json({ error: "User ID is required" }, { status: 400 });
        }
    try {
        const books = await getBooksForPage(userId, offset, limit);
        const total = await getTotalBooks();


        return Response.json({
            books,
            total: parseInt(total.count),
            currentPage: page,
            totalPages: Math.ceil(parseInt(total.count) / limit)
        });
    } catch (error) {
        console.log(error);
        return Response.json({ error }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { title, author_id, num_of_words, date_of_release, cover_image } = await request.json()

        // Verify author exists
        const authorResult = await getAuthorById(author_id);

        if (authorResult.length === 0) {
            return NextResponse.json(
                { error: 'Author not found' },
                { status: 404 }
            )
        }

        await addBook(title, author_id, num_of_words, date_of_release, cover_image);

        return NextResponse.json({ message: 'Book created successfully' }, { status: 201 })
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to create book' },
            { status: 500 }
        )
    }
}