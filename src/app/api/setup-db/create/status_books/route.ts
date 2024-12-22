import {createTableFavAuthors, createTableStatusBooks} from "@/app/libs/data";

export async function GET() {
    try {
        await createTableStatusBooks()

        return Response.json({ message: 'Table book_stats created'});
    } catch (error) {

        return Response.json({ error }, { status: 500 });
    }
}