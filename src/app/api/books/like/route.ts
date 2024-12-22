import { likeBook, unlikeBook } from "@/app/libs/data";


export async function POST(req: Request) {
    try {
        const { user_id, book_id } = await req.json();

        await likeBook(user_id, book_id);

        return Response.json({message: "ok"});
    } catch (error) {
        console.log(error);
        return Response.json({ error }, { status: 500 });
    }
}
export async function DELETE(req: Request) {
    try {
        const { user_id, book_id } = await req.json();

        await unlikeBook(user_id, book_id);

        return Response.json({message: "ok"});
    } catch (error) {
        console.log(error);
        return Response.json({ error }, { status: 500 });
    }
}

