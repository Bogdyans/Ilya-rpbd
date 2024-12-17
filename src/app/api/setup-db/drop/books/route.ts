import {dropTableBooks} from "@/app/libs/data";

export async function GET() {
    try {
        await dropTableBooks()

        return Response.json({ message: 'Table books dropped'});
    } catch (error) {

        return Response.json({ error }, { status: 500 });
    }
}