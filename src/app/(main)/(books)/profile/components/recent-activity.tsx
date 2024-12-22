

import {Book, Clock} from "lucide-react";
import {recentBooks} from "@/app/(main)/(books)/profile/data/user";
import {Badge} from "@/components/ui/badge";
import Image from "next/image"
import {formatDate} from "@/app/libs/funcs";

export default function RecentActivity({lastChanges} :{ lastChanges: any[]}) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-[#8B4513] mb-4 flex items-center gap-2">
                <Book className="w-5 h-5"/>
                Recent Activity
            </h2>

            <div className="space-y-4">
                {lastChanges.map((book) => (
                    <div key={book.id}
                         className="flex items-center gap-4 p-3 rounded-lg hover:bg-[#fff9e5] transition-colors">
                        <Image
                            src={book.cover}
                            alt={`Cover of ${book.title}`}
                            width={80}
                            height={120}
                            className="rounded shadow-sm"
                        />
                        <div className="flex-1">
                            <h3 className="font-semibold text-lg text-[#8B4513]">{book.title}</h3>
                            <p className="text-gray-600">{book.author}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <Clock className="w-4 h-4 text-gray-400"/>
                                <span className="text-sm text-gray-500">Last updated at {formatDate(book.date)}</span>
                            </div>
                        </div>
                        <Badge variant="secondary" className={`${book.status === 'completed' ? "bg-green-100 text-green-800" :
                                                                 book.status === 'reading'   ? "bg-blue-100 text-blue-800" : "bg-red-100 text-red-800"}
                         px-3 py-1`}>
                            {book.status}
                        </Badge>
                    </div>
                ))}
            </div>
        </div>
    )
}