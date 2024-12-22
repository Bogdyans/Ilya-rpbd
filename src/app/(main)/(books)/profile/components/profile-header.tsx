import Image from "next/image";
import {formatDate} from "@/app/libs/funcs";
import {getWordsRead} from "@/app/libs/data";


export default async function ProfileHeader({user}: { user: { id: string, username: string, register_date: string}}) {
    const wordsRead = await getWordsRead(user.id)

    return (
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
                    <p className="text-sm text-gray-500">Words Read: {wordsRead}</p>
                </div>
            </div>
        </div>
    )
}