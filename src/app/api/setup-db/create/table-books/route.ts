import {createTableBooks} from "@/app/libs/data";

export async function GET() {
    try {
        await createTableBooks()

        return Response.json({ message: 'Table books created'});
    } catch (error) {

        return Response.json({ error }, { status: 500 });
    }
}