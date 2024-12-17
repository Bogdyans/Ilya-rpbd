import {dropTableAuthors} from "@/app/libs/data";

export async function GET() {
    try {
        await dropTableAuthors()

        return Response.json({ message: 'Table authors dropped'});
    } catch (error) {

        return Response.json({ error }, { status: 500 });
    }
}