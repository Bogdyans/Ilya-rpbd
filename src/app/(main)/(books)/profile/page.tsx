import Image from "next/image"
import { Book, BookOpen, Star, Trophy, User2 } from 'lucide-react'
import { userData } from "./data/user"
import {getServerSession} from "next-auth/next";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import ReadStats from "@/app/(main)/(books)/profile/components/read-stats";
import FavAuthors from "@/app/(main)/(books)/profile/components/fav-authors";
import {getUserById} from "@/app/libs/data";

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);
    const user = await getUserById(session.user.id)

    console.log(user)

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        }).format(date);
    };

    return (
        <div className="min-h-screen bg-[#fff9e5]">
            <main className="container mx-auto px-4 py-8">
                {/* Profile Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        <div className="relative w-32 h-32">
                            <Image
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpBFbCgb0ajYdgdzEXKZ3Kg7y1Lc3upM0IDg&s"
                                alt={user.username}
                                fill
                                className="rounded-full object-cover"
                            />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl font-bold text-[#8B4513] mb-2">{user.username}</h1>
                            <p className="text-sm text-gray-500">Member since {formatDate(user.register_date)}</p>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Reading Stats */}
                    <ReadStats user_id={session.user.id}/>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold text-[#8B4513] mb-4 flex items-center gap-2">
                            <Book className="w-5 h-5" />
                            Recent Activity
                        </h2>
                        {/*<div className="space-y-4">*/}
                        {/*    {userData.recentActivity.map((activity) => (*/}
                        {/*        <div*/}
                        {/*            key={activity.id}*/}
                        {/*            className="flex items-center gap-3 p-3 bg-[#fff9e5] rounded-lg"*/}
                        {/*        >*/}
                        {/*            <div className="w-2 h-2 rounded-full bg-[#8B4513]" />*/}
                        {/*            <div className="flex-1">*/}
                        {/*                <p className="text-gray-600">*/}
                        {/*                    {activity.type === "review" ? "Reviewed" : activity.type === "finished" ? "Finished reading" : "Started reading"}*/}
                        {/*                    {" "}*/}
                        {/*                    <span className="font-semibold text-[#8B4513]">{activity.book}</span>*/}
                        {/*                </p>*/}
                        {/*                <p className="text-sm text-gray-500">{activity.date}</p>*/}
                        {/*            </div>*/}
                        {/*        </div>*/}
                        {/*    ))}*/}
                        {/*</div>*/}
                        <h1 className="text-gray-600 mx-auto text-4xl">WIP...</h1>
                    </div>

                    {/* Favorite Authors */}
                    <FavAuthors user_id={session.user.id} />
                </div>
            </main>
        </div>
    )
}

