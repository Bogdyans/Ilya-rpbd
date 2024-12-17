import {createTableAuthors} from "@/app/libs/data";

export async function GET() {
    try {
        await createTableAuthors()

        return Response.json({ message: 'Table authors created'});
    } catch (error) {

        return Response.json({ error }, { status: 500 });
    }
}