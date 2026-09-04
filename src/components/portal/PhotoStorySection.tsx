import React, { useState } from 'react';
import { Camera, Eye, ChevronRight, X, Image as ImageIcon } from 'lucide-react';

interface PhotoStory {
  id: string;
  caption: string;
  location: string;
  image: string;
  photographer: string;
}

const photoStories: PhotoStory[] = [
  {
    id: 'ps-1',
    caption: 'শীতের সকালে বুড়িগঙ্গায় কুয়াশা ভেদ করে ভেসে চলা খেয়ানৌকা',
    location: 'সদরঘাট, ঢাকা',
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1000&auto=format&fit=crop&q=80',
    photographer: 'দেশরিপোর্ট ফটো'
  },
  {
    id: 'ps-2',
    caption: 'বান্দরবানের নীলগিরি পাহাড়ে মেঘ ও রোদের অপরূপ মায়াবী খেলা',
    location: 'বান্দরবান',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
    photographer: 'আলোকচিত্রী তানজিম'
  },
  {
    id: 'ps-3',
    caption: 'ঐতিহাসিক লালবাগ কেল্লায় বসন্তের রোদ পোহাতে তরুণদের আড্ডা',
    location: 'পুরান ঢাকা',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop&q=80',
    photographer: 'সুমন আহমেদ'
  },
  {
    id: 'ps-4',
    caption: 'সিলেটের রাতারগুল সোয়াম্প ফরেস্টে সবুজ জলে স্বচ্ছ জলকেলি',
    location: 'গোয়াইনঘাট, সিলেট',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80',
    photographer: 'বিশেষ প্রতিনিধি'
  }
];

export const PhotoStorySection: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoStory | null>(null);

  return (
    <section className="mb-10 bg-slate-900 text-white rounded-2xl p-5 sm:p-7 border border-slate-800 shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center shadow-md shadow-rose-600/30">
            <Camera className="w-4 h-4" />
          </span>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif-bn text-white">
              ছবিতে বাংলাদেশ
            </h2>
            <span className="text-[11px] text-slate-400">
              ফটোসাংবাদিকদের ক্যামেরায় ফ্রেমবন্দী দেশের রূপ ও জনজীবন
            </span>
          </div>
        </div>

        <span className="text-xs text-rose-400 font-semibold hidden sm:inline">
          দৈনিক ফটো ফিচার
        </span>
      </div>

      {/* 4 Photo Story Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {photoStories.map(story => (
          <div
            key={story.id}
            onClick={() => setSelectedPhoto(story)}
            className="group cursor-pointer bg-slate-950 border border-slate-800/80 rounded-xl overflow-hidden hover:border-rose-500/60 transition-all flex flex-col justify-between"
          >
            <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-800">
              <img
                src={story.image}
                alt={story.caption}
                className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />
              <div className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-xs p-1.5 rounded-full text-white/80 group-hover:text-white">
                <Eye className="w-3.5 h-3.5" />
              </div>
              <span className="absolute bottom-2.5 left-2.5 text-[11px] font-semibold text-white bg-rose-600/90 px-2 py-0.5 rounded">
                {story.location}
              </span>
            </div>

            <div className="p-3.5 flex-1 flex flex-col justify-between">
              <p className="text-xs font-serif-bn text-slate-200 group-hover:text-rose-400 font-medium line-clamp-2 leading-relaxed">
                {story.caption}
              </p>
              <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Camera className="w-3 h-3 text-slate-400" />
                  <span>{story.photographer}</span>
                </span>
                <span className="text-rose-400 font-medium">বড় করে দেখুন</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal View */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in"
          >
            <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <span className="text-xs font-semibold text-slate-300">
                {selectedPhoto.location} • {selectedPhoto.photographer}
              </span>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="p-1 text-slate-400 hover:text-white rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-[65vh] w-full bg-black flex items-center justify-center overflow-hidden">
              <img
                src={selectedPhoto.image}
                alt={selectedPhoto.caption}
                className="max-h-[65vh] w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="p-4 bg-slate-900">
              <h4 className="text-base font-serif-bn text-white font-bold">
                {selectedPhoto.caption}
              </h4>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
