import {User2} from "lucide-react";
import Image from "next/image";
import {getFavAuthors} from "@/app/libs/data";

export default async function FavAuthors({user_id}: {user_id: string}) {
    const res = await getFavAuthors(user_id);

    const authors = res.rows;
    console.log(authors)

    return (
        <div className="md:col-span-2 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-[#8B4513] mb-4 flex items-center gap-2">
                <User2 className="w-5 h-5"/>
                Last Favorite Authors
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {authors.map((author) => (
                    <div
                        key={author.id}
                        className="flex items-center gap-4 p-4 bg-[#fff9e5] rounded-lg"
                    >
                        <div className="relative w-16 h-16">
                            <Image
                                src={author.photo}
                                alt={author.name}
                                fill
                                className="rounded-full object-cover"
                            />
                        </div>
                        <div>
                            <h3 className="font-semibold text-[#8B4513]">{author.name}</h3>
                            <p className="text-sm text-gray-500">{author.birthDate}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}