import {getAllAuthors} from "@/app/libs/data";

export async function GET() {
    try {
        const authors = await getAllAuthors();

        return Response.json({ message: authors});
    } catch (error) {

        return Response.json({ error }, { status: 500 });
    }
}