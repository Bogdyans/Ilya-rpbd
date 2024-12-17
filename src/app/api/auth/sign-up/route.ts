import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import {createUser} from "@/app/libs/data";

export async function POST(req: Request) {
    try {
        const { username, password } = await req.json()
        const hashedPassword = await bcrypt.hash(password, 10)


        await createUser(username, hashedPassword);

        return NextResponse.json({ message: 'User registered successfully' }, { status: 201 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
    }
}

