import {dropTableUsers} from "@/app/libs/data";

export async function GET() {
    try {
        await dropTableUsers()

        return Response.json({ message: 'Table users dropped'});
    } catch (error) {

        return Response.json({ error }, { status: 500 });
    }
}