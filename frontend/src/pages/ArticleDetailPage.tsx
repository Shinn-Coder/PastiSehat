/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Clock, 
  User, 
  Share2, 
  Bookmark,
  ChevronRight,
  Stethoscope
} from 'lucide-react';
import { ARTICLES } from '../constants';

interface ArticleDetailPageProps {
  id: string | null;
  onBack: () => void;
}

export default function ArticleDetailPage({ id, onBack }: ArticleDetailPageProps) {
  const article = ARTICLES.find(a => a.id === id) || ARTICLES[0];
  const relatedArticles = ARTICLES.filter(a => a.id !== article.id);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
      <div className="flex mb-4">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 p-3 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all font-bold text-primary group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Kembali
        </button>
      </div>

      <article className="space-y-10">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 bg-secondary text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <Stethoscope className="w-4 h-4" />
            {article.category}
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
            {article.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 pt-4 text-sm text-gray-500 font-medium">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <span className="font-bold text-gray-900">{article.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" /> {article.date}
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
              Estimasi Baca: 5 Menit
            </div>
          </div>
        </div>

        <div className="aspect-video w-full rounded-[3rem] overflow-hidden shadow-2xl">
          <img src={article.image} className="w-full h-full object-cover" alt={article.title} />
        </div>

        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6 font-medium">
          <p>{article.content}</p>
          <p>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.
          </p>
          <div className="bg-secondary/30 p-8 rounded-3xl border-l-4 border-primary">
            <p className="font-bold italic text-primary">
              "Kesehatan bukan sekadar ketiadaan penyakit, melainkan sebuah kondisi keseimbangan mental, fisik, dan sosial yang utuh."
            </p>
          </div>
          <p>
            Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.
          </p>
        </div>

        <div className="pt-12 border-t border-gray-100 flex justify-between items-center">
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-6 py-3 bg-gray-50 rounded-xl font-bold hover:bg-gray-100 transition-colors">
              <Share2 className="w-4 h-4" /> Bagikan
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-gray-50 rounded-xl font-bold hover:bg-gray-100 transition-colors">
              <Bookmark className="w-4 h-4" /> Simpan
            </button>
          </div>
        </div>
      </article>

      {/* Recommended Articles Section */}
      <section className="space-y-8 pt-12">
        <h2 className="text-2xl font-bold border-l-4 border-primary pl-4">Artikel Terkait</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {relatedArticles.map(rel => (
            <div key={rel.id} className="flex gap-4 p-4 bg-white border border-gray-100 rounded-3xl card-hover group cursor-pointer shadow-sm">
              <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                <img src={rel.image} className="w-full h-full object-cover" alt={rel.title} />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">{rel.title}</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase">{rel.date}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
