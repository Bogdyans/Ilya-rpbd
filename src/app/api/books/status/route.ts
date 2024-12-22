import {addBookStatus, changeBookStatus, deleteBookStatus} from "@/app/libs/data";


export async function POST(req: Request) {
    const { user_id, book_id, status } = await req.json();
    try {
        await addBookStatus(user_id, book_id, status);
        return Response.json({ message: 'Status changed'});
    } catch (e) {
         console.error(e);
        return Response.json({ e }, { status: 500 });
    }
}
export async function PUT(req: Request) {
    const { user_id, book_id, status } = await req.json();
    console.log(user_id, " ", book_id, " ", status);

    try {
        await changeBookStatus(user_id, book_id, status);
        return Response.json({ message: 'Status changed'});
    } catch (e) {
        console.error("asdsadsadas", e);
        return Response.json({ e }, { status: 501 });
    }
}
export async function DELETE(req: Request) {
    const { user_id, book_id } = await req.json();
    try {
        await deleteBookStatus(user_id, book_id);
        return Response.json({ message: 'Status changed'});
    } catch (e) {
        console.error(e);
        return Response.json({ e }, { status: 500 });
    }
}