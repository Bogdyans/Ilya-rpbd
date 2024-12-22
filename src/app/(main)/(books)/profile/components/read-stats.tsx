

import {BookOpen, CheckCircle, Star, Trophy, Users, XCircle} from "lucide-react";
import {getBooksStats, getFavAuthorsInNum, getFavBooksInNum} from "@/app/libs/data";

export default async function ReadStats({user_id}: {user_id: string}){
    const numOfFavAuthors = await getFavAuthorsInNum(user_id);
    const numOfFavBooks = await getFavBooksInNum(user_id);
    const booksStats = await getBooksStats(user_id);

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-[#8B4513] mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5"/>
                Reading Stats
            </h2>
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-[#fff9e5] rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <Users className="w-5 h-5 text-[#8B4513]"/>
                        <span className="text-gray-600">Num of Favorite Authors</span>
                    </div>
                    <p className="text-2xl font-bold text-[#8B4513]">{numOfFavAuthors.sum}</p>
                </div>
                <div className="p-4 bg-[#fff9e5] rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <Star className="w-5 h-5 text-[#8B4513]"/>
                        <span className="text-gray-600">Num of Favorite Books</span>
                    </div>
                    <p className="text-2xl font-bold text-[#8B4513]">{numOfFavBooks.sum}</p>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="p-4 bg-[#fff9e5] rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-[#8B4513]"/>
                        <span className="text-gray-600">Completed</span>
                    </div>
                    <p className="text-2xl font-bold text-[#8B4513]">{booksStats.completed}</p>
                </div>
                <div className="p-4 bg-[#fff9e5] rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="w-5 h-5 text-[#8B4513]"/>
                        <span className="text-gray-600">Reading</span>
                    </div>
                    <p className="text-2xl font-bold text-[#8B4513]">{booksStats.reading}</p>
                </div>
                <div className="p-4 bg-[#fff9e5] rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <XCircle className="w-5 h-5 text-[#8B4513]"/>
                        <span className="text-gray-600">Dropped</span>
                    </div>
                    <p className="text-2xl font-bold text-[#8B4513]">{booksStats.dropped}</p>
                </div>
            </div>
        </div>
    )
}