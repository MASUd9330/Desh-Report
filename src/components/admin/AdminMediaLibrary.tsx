import React, { useState } from 'react';
import { useNews } from '../../context/NewsContext';
import {
  Image as ImageIcon,
  Upload,
  Search,
  Copy,
  Check,
  Trash2,
  Sparkles,
  X
} from 'lucide-react';

export const AdminMediaLibrary: React.FC = () => {
  const { mediaLibrary = [], addMediaItem, deleteMediaItem } = useNews();
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterFormat, setFilterFormat] = useState('all');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Upload modal state
  const [uploadUrl, setUploadUrl] = useState('');
  const [uploadTitle, setUploadTitle] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);

  const handleCopy = (url: string, id: string) => {
    try {
      navigator.clipboard.writeText(url);
    } catch (_) {}
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadUrl.trim()) return;

    addMediaItem({
      title: uploadTitle.trim() || 'Uploaded Image',
      url: uploadUrl.trim(),
      mimeType: 'image/webp',
      size: 142000,
      width: 1200,
      height: 800,
      alt: uploadTitle.trim() || 'DeshReport News Media'
    });

    setUploadUrl('');
    setUploadTitle('');
    setShowUploadModal(false);
  };

  const filteredMedia = mediaLibrary.filter(item => {
    const matchQuery = !searchQuery || item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchFormat =
      filterFormat === 'all' || item.mimeType.toLowerCase().includes(filterFormat);
    return matchQuery && matchFormat;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-purple-600" />
            <span>Media Library & Assets</span>
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage high-resolution optimized images, WebP assets, and CDN image URLs
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Image Asset</span>
        </button>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <form
          onSubmit={handleUploadSubmit}
          className="bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-900/40 rounded-xl p-5 shadow-xs space-y-4 animate-fade-in"
        >
          <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>Image Upload & Registration (Auto 1200x800 WebP)</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Image Title / Caption *
            </label>
            <input
              type="text"
              required
              value={uploadTitle}
              onChange={e => setUploadTitle(e.target.value)}
              placeholder="e.g. Dhaka Metro Rail Station"
              className="w-full text-xs px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Direct Image File URL *
            </label>
            <input
              type="url"
              required
              value={uploadUrl}
              onChange={e => setUploadUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full text-xs px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:border-purple-500"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowUploadModal(false)}
              className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs cursor-pointer"
            >
              Save to Library
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-3.5 shadow-xs">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search images by title..."
            className="w-full text-xs pl-8 pr-3 py-1.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-400">Format:</span>
          <select
            value={filterFormat}
            onChange={e => setFilterFormat(e.target.value)}
            className="text-xs bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-hidden"
          >
            <option value="all">All Formats</option>
            <option value="webp">WebP (Optimized)</option>
            <option value="jpeg">JPEG / JPG</option>
            <option value="png">PNG</option>
          </select>
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filteredMedia.map(item => (
          <div
            key={item.id}
            className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs group flex flex-col justify-between"
          >
            <div className="relative aspect-16/10 w-full overflow-hidden bg-gray-100 dark:bg-slate-800">
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-1.5 right-1.5 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-black/70 text-white font-mono">
                {item.mimeType.split('/')[1] || 'img'}
              </span>
            </div>

            <div className="p-3">
              <h4 className="font-semibold text-xs text-gray-900 dark:text-white truncate" title={item.title}>
                {item.title}
              </h4>
              <div className="mt-1 flex items-center justify-between text-[10px] text-gray-400 font-mono">
                <span>{item.width}x{item.height} px</span>
                <span>{(item.size / 1024).toFixed(0)} KB</span>
              </div>

              <div className="mt-3 pt-2 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => handleCopy(item.url, item.id)}
                  className="flex items-center gap-1 text-[11px] text-gray-600 dark:text-gray-300 hover:text-indigo-600 font-semibold cursor-pointer"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>

                {confirmDeleteId === item.id ? (
                  <div className="inline-flex items-center gap-1">
                    <button
                      onClick={() => {
                        deleteMediaItem(item.id);
                        setConfirmDeleteId(null);
                      }}
                      className="p-1 bg-red-600 text-white rounded cursor-pointer"
                      title="Confirm delete"
                    >
                      <Check className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer"
                      title="Cancel"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDeleteId(item.id)}
                    className="p-1 text-gray-400 hover:text-red-600 rounded cursor-pointer"
                    title="Delete image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
