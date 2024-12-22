import {createNewAuthor, getAuthorsForPage} from "@/app/libs/data";

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

export async function POST(request: Request) {
    try {
        const { name, bdate, country, photopath, bio } = await request.json()

        await createNewAuthor(name, bdate, country, photopath, bio);

        return Response.json({ message: 'Author created successfully' }, { status: 201 })
    } catch (error) {
        console.log(error)
        return Response.json(
            { error: 'Failed to create author' },
            { status: 500 }
        )
    }
}



