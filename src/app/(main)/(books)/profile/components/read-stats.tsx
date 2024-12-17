

import {BookOpen, Star, Trophy} from "lucide-react";
import {userData} from "@/app/(main)/(books)/profile/data/user";
import {getFavAuthorsInNum} from "@/app/libs/data";

export default async function ReadStats({user_id}: {user_id: string}){
    const res = await getFavAuthorsInNum(user_id);

    const numOfFavAuthors = res.rows[0];


    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-[#8B4513] mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5"/>
                Reading Stats
            </h2>
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-[#fff9e5] rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="w-5 h-5 text-[#8B4513]"/>
                        <span className="text-gray-600">Num of Favorite Authors</span>
                    </div>
                    <p className="text-2xl font-bold text-[#8B4513]">{numOfFavAuthors.sum}</p>
                </div>
                <div className="p-4 bg-[#fff9e5] rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <Star className="w-5 h-5 text-[#8B4513]"/>
                        <span className="text-gray-600">Reviewed</span>
                    </div>
                    <p className="text-2xl font-bold text-[#8B4513]">WIP...</p>
                </div>
            </div>
            <div className="mt-4">
                <h3 className="font-semibold text-gray-700 mb-2">Favorite Genres</h3>
                {/*          <div className="flex flex-wrap gap-2">*/}
                {/*              {userData.stats.favoriteGenres.map((genre) => (*/}
                {/*                  <span*/}
                {/*                      key={genre}*/}
                {/*                      className="px-3 py-1 bg-[#8B4513] text-white text-sm rounded-full"*/}
                {/*                  >*/}
                {/*  {genre}*/}
                {/*</span>*/}
                {/*              ))}*/}
                {/*          </div>*/}
                <h1 className="text-gray-600 mx-auto text-4xl">WIP...</h1>
            </div>
        </div>
    )
}