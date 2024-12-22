import {getBooksForPage, getTotalBooks} from "@/app/libs/data";


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