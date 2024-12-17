import {dropTableFavAuthors} from "@/app/libs/data";

export async function GET() {
    try {
        await dropTableFavAuthors()

        return Response.json({ message: 'Table favauthors dropped'});
    } catch (error) {

        return Response.json({ error }, { status: 500 });
    }
}