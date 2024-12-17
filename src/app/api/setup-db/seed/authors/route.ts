import {seedTableAuthors} from "@/app/libs/data";

export async function GET() {
    try {
        await seedTableAuthors()

        return Response.json({ message: 'Table authors seeded'});
    } catch (error) {

        return Response.json({ error }, { status: 500 });
    }
}