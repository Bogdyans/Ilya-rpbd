

import {getServerSession} from "next-auth/next";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import ReadStats from "@/app/(main)/(books)/profile/components/read-stats";
import FavAuthors from "@/app/(main)/(books)/profile/components/fav-authors";
import {getLastBooksChanges, getUserById} from "@/app/libs/data";
import ProfileHeader from "@/app/(main)/(books)/profile/components/profile-header";

import RecentActivity from "@/app/(main)/(books)/profile/components/recent-activity";

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);
    const user = await getUserById(session.user.id);
    const lastChanges = await getLastBooksChanges(session.user.id);

    return (
        <div className="min-h-screen bg-[#fff9e5]">
            <main className="container mx-auto px-4 py-8">
                {/* Profile Header */}
                <ProfileHeader user={user} />

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Reading Stats */}
                    <ReadStats user_id={session.user.id}/>

                    {/* Recent Activity */}
                    <RecentActivity lastChanges={lastChanges}  />

                    {/* Favorite Authors */}
                    <FavAuthors user_id={session.user.id}/>
                </div>
            </main>
        </div>
    )
}

