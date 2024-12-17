import { getAuthorsForPage } from "@/app/libs/data";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return Response.json({ error: "User ID is required" }, { status: 400 });
        }

        const authors = await getAuthorsForPage(userId);

        return Response.json({ authors: authors.rows });
    } catch (error) {
        console.log(error);
        return Response.json({ error }, { status: 500 });
    }
}

