import {seedBooks} from "@/app/libs/data";

export async function GET() {
    try {
        await seedBooks()

        return Response.json({ message: 'Table books seeded'});
    } catch (error) {

        return Response.json({ error }, { status: 500 });
    }
}