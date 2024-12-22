import {createTableFavBooks} from "@/app/libs/data";

export async function GET() {
    try {
        await createTableFavBooks()

        return Response.json({ message: 'Table fav-books created'});
    } catch (error) {

        return Response.json({ error }, { status: 500 });
    }
}