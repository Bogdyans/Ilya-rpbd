import {getAllUsers} from "@/app/libs/data";

export async function GET() {
    try {
        const users = await getAllUsers();

        return Response.json({ message: users});
    } catch (error) {

        return Response.json({ error }, { status: 500 });
    }
}