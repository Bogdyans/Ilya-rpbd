import Image from "next/image";
import {Author} from "@/app/libs/types";
import { Heart } from 'lucide-react'

export default function AuthorCard({author, processLike}: {author: Author, processLike:  (aid: string, liked: boolean) => void}) {



    return (
        <div
            key={author.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow relative"
        >
            <div className="aspect-square relative">
                <Image
                    src={`${author.photo}`}
                    alt={author.name}
                    fill
                    className="object-cover"
                />
            </div>
            <div className="p-6">
                <h2 className="text-xl font-bold text-[#8B4513] mb-2">{author.name}</h2>
                <p className="text-sm text-gray-500 mb-3">Born: {author.birthdate}</p>
                <p className="text-gray-600">{author.bio}</p>
            </div>
            <button
                onClick={() => processLike(author.id, !author.liked)}
                className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                aria-label={`Like ${author.name}`}
            >
                <Heart
                    className={`w-6 h-6 ${author.liked ? 'text-red-500 fill-red-500' : 'text-gray-400'}`}
                />
            </button>
        </div>
    )
}