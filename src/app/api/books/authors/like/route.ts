import { likeAuthor, unlikeAuthor } from "@/app/libs/data";

export async function POST(req: Request) {
    try {
        const { user_id, author_id, liked } = await req.json();

        if (liked) {
            await likeAuthor(user_id, author_id);
        } else {
            await unlikeAuthor(user_id, author_id);
        }


        return true;
    } catch (error) {
        console.log(error);
        return Response.json({ error }, { status: 500 });
    }
}

