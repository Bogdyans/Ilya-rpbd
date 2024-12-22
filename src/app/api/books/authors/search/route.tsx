import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'
import {findAuthors} from "@/app/libs/data";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const query = searchParams.get('q') || ''

        const result = await findAuthors(query);

        return NextResponse.json(result)
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to search authors' },
            { status: 500 }
        )
    }
}

