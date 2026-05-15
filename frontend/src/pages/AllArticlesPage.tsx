import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ArrowLeft, ChevronRight, Calendar, User, Tag } from 'lucide-react';
import { Article, Page } from '../types';
import { ARTICLES } from '../constants';

interface AllArticlesPageProps {
  onArticleClick: (id: string) => void;
  onBack: () => void;
}

export default function AllArticlesPage({ onArticleClick, onBack }: AllArticlesPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');

  const categories = ['Semua', 'Gizi', 'Gaya Hidup', 'Vaksin', 'Virus Terbaru'];

  const filteredArticles = ARTICLES.filter(art => {
    const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         art.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'Semua' || art.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <button 
                onClick={onBack}
                className="p-3 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
                id="back-button"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-primary">Artikel Kesehatan</h1>
                <p className="text-gray-500 font-medium">Informasi medis terpercaya dari para ahli RS Louis</p>
              </div>
            </div>

            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Cari artikel..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary/20 font-medium"
                id="article-search"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 mt-8 overflow-x-auto pb-2 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                    : 'bg-white text-gray-500 border border-gray-100 hover:border-primary/20'
                }`}
                id={`cat-${cat.toLowerCase().replace(' ', '-')}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="max-w-7xl mx-auto px-6 mt-12">
        {filteredArticles.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-gray-100 shadow-sm">
            <p className="text-gray-400 font-bold text-lg italic">Tidak ada artikel yang sesuai dengan pencarian Anda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => onArticleClick(article.id)}
                  className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all cursor-pointer group flex flex-col"
                  id={`article-card-${article.id}`}
                >
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={article.image} 
                      alt={article.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-primary">
                        {article.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-8 flex-grow flex flex-col">
                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-4 font-bold uppercase tracking-tighter">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" /> {article.date}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" /> {article.author}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-primary group-hover:text-blue-700 transition-colors mb-4 line-clamp-2 leading-snug">
                      {article.title}
                    </h3>
                    
                    <p className="text-gray-500 text-sm line-clamp-3 mb-6 font-medium leading-relaxed">
                      {article.content}
                    </p>
                    
                    <div className="mt-auto flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest group-hover:gap-3 transition-all">
                      Baca Selengkapnya <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
