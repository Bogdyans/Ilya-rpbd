import {createTableUsers} from "@/app/libs/data";

export async function GET() {
    try {
        await createTableUsers()

        return Response.json({ message: 'Table users created'});
    } catch (error) {

        return Response.json({ error }, { status: 500 });
    }
}