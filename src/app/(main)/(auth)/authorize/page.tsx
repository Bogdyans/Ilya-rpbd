import {getServerSession} from "next-auth/next";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import { redirect } from 'next/navigation'
import AuthPage from "@/app/(main)/(auth)/authorize/components/auth-page";

export default async function SignUp(){
    const session = await getServerSession(authOptions);

    if (session) {
        redirect('/');
    }

    return (
        <>
            <AuthPage />
        </>
    )
}