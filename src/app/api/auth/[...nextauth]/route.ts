import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcrypt'
import {getUserByUsername} from "@/app/libs/data";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) {
                    return null
                }

                const user = await getUserByUsername(credentials.username);

                if (!user) {
                    return null
                }

                const passwordMatch = await bcrypt.compare(credentials.password, user.hashed_pass)

                if (!passwordMatch) {
                    return null
                }

                return {
                    id: user.id,
                    username: user.username,
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
            }
            return token
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id
            }
            return session
        }
    },
    pages: {
        signIn: '/authorize',
    },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

