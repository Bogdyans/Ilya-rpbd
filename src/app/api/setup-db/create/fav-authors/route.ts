import {createTableFavAuthors} from "@/app/libs/data";

export async function GET() {
    try {
        await createTableFavAuthors()

        return Response.json({ message: 'Table fav-auth created'});
    } catch (error) {

        return Response.json({ error }, { status: 500 });
    }
}