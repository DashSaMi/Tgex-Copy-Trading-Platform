import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PageId, BlogPost } from '../../types';
import { blogService } from '../../services/blogService';
import { useLanguage } from '../../context/LanguageContext';
import blogHeroImg from '../../assets/images/blog_hero_editorial_1795337868925.jpg';
import {
  Search,
  BookOpen,
  Calendar,
  Clock,
  Eye,
  Heart,
  ArrowLeft,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Rocket
} from 'lucide-react';

interface BlogPageProps {
  onNavigate: (page: PageId) => void;
  onSelectPost: (slug: string) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ onNavigate, onSelectPost }) => {
  const { language, dir } = useLanguage();
  const isFa = language === 'fa';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const posts = blogService.getPublishedPosts();

  const categories = isFa
    ? [
        { id: 'all', label: 'همه مطالب' },
        { id: 'Reward Model & Matrix', label: 'طرح درآمدی و ماتریس' },
        { id: 'Copy Trading Guides', label: 'آموزش و راهنماها' },
        { id: 'Security & Crypto', label: 'امنیت و صرافی' },
        { id: 'Tgex News', label: 'اخبار تیجکس' }
      ]
    : [
        { id: 'all', label: 'All Articles' },
        { id: 'Reward Model & Matrix', label: 'Reward Model & Matrix' },
        { id: 'Copy Trading Guides', label: 'Strategy Guides' },
        { id: 'Security & Crypto', label: 'Security & Exchange' },
        { id: 'Tgex News', label: 'TGEX News' }
      ];

  const getPostTitle = (p: BlogPost) => (isFa ? p.title : p.titleEn || p.title);
  const getPostSummary = (p: BlogPost) => (isFa ? p.summary : p.summaryEn || p.summary);
  const getPostCategory = (p: BlogPost) => (isFa ? p.category : p.categoryEn || p.category);
  const getPostTags = (p: BlogPost) => (isFa ? p.tags : p.tagsEn || p.tags);

  const filteredPosts = posts.filter((post) => {
    const title = getPostTitle(post).toLowerCase();
    const summary = getPostSummary(post).toLowerCase();
    const tags = getPostTags(post).join(' ').toLowerCase();
    const term = searchTerm.toLowerCase();

    const matchesSearch = title.includes(term) || summary.includes(term) || tags.includes(term);
    const matchesCategory =
      selectedCategory === 'all' ||
      post.category === selectedCategory ||
      post.categoryEn === selectedCategory ||
      (selectedCategory === 'Reward Model & Matrix' &&
        (post.category.includes('طرح') || post.category.includes('ماتریس'))) ||
      (selectedCategory === 'Copy Trading Guides' &&
        (post.category.includes('کپی') || post.category.includes('آموزش'))) ||
      (selectedCategory === 'Security & Crypto' &&
        (post.category.includes('امنیت') || post.category.includes('کریپتو')));

    return matchesSearch && matchesCategory;
  });

  const featuredPost = posts.find((p) => p.isFeatured) || posts[0];

  return (
    <div className="min-h-screen bg-[#05070a] text-slate-100 py-10 px-4 sm:px-6 lg:px-8 selection:bg-blue-600 selection:text-white" dir={dir}>
      <div className="max-w-7xl mx-auto space-y-14">

        {/* SECTION 1: EDITORIAL MASTHEAD HERO */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative rounded-3xl overflow-hidden border border-white/10 bg-slate-950 p-7 sm:p-12 shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-[#070B14] to-slate-950" />
          <img
            src={blogHeroImg}
            alt={isFa ? 'تحلیل‌های بازار و پژوهش تیجکس' : 'TGEX Research & Editorial Studio'}
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/50" />

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
            <div className="flex items-center justify-center gap-2 text-xs font-mono text-cyan-300 font-bold">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>{isFa ? 'ژورنال و پایگاه دانش تیجکس' : 'TGEX RESEARCH & EDITORIAL DESK'}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight text-balance leading-[1.15]">
              {isFa ? (
                <>
                  تحلیل، آموزش و مستندات{' '}
                  <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
                    شبکه ۲۰ سطحی
                  </span>
                </>
              ) : (
                <>
                  Insights on{' '}
                  <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
                    Network Strategy
                  </span>{' '}
                  &amp; Security
                </>
              )}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {isFa
                ? 'بررسی تخصصی ساختار ۲۰ سطحی، منطق Spillover و Sponsor واقعی، مدیریت رتبه‌های سازمانی و استانداردهای امنیت API صرافی.'
                : 'Deep dives into 20-level Sun System mechanics, Sponsor vs. Spillover architecture, leadership ranks, and non-custodial API security.'}
            </p>

            {/* Search & Segmented Category Bar */}
            <div className="max-w-2xl mx-auto space-y-4 pt-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder={isFa ? 'جستجو در عناوین، برچسب‌ها و متن مقالات...' : 'Search titles, tags, and articles...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full py-3.5 bg-slate-950/90 border border-white/15 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm shadow-xl transition ${
                    isFa ? 'pl-4 pr-12' : 'pr-4 pl-12'
                  }`}
                />
                <Search className={`w-5 h-5 text-slate-400 absolute top-1/2 -translate-y-1/2 ${isFa ? 'right-4' : 'left-4'}`} />
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                        : 'bg-slate-900/80 text-slate-300 hover:text-white border border-white/10 hover:border-white/25'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* SECTION 2: FEATURED EDITOR SPOTLIGHT */}
        {!searchTerm && selectedCategory === 'all' && featuredPost && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold">
              <Sparkles className="w-4 h-4" />
              <span>{isFa ? 'مقاله ویژه سردبیر' : 'EDITOR’S FEATURED REPORT'}</span>
            </div>

            <div
              onClick={() => onSelectPost(featuredPost.slug)}
              className="group cursor-pointer rounded-3xl bg-gradient-to-br from-slate-900/90 to-[#070B14] border border-white/10 hover:border-cyan-500/45 p-6 sm:p-8 transition-all duration-300 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              <div className="lg:col-span-7 space-y-4">
                {/* Unboxed Metadata Line */}
                <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono text-slate-400">
                  <span className="text-cyan-400 font-bold">{getPostCategory(featuredPost)}</span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="inline-flex items-center gap-1 tabular-nums">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{featuredPost.publishedAt}</span>
                  </span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="inline-flex items-center gap-1 tabular-nums">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{featuredPost.readTimeMinutes} {isFa ? 'دقیقه مطالعه' : 'min read'}</span>
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-white group-hover:text-cyan-300 transition-colors leading-tight text-balance">
                  {getPostTitle(featuredPost)}
                </h2>

                <p className="text-slate-300 text-sm leading-relaxed line-clamp-3">
                  {getPostSummary(featuredPost)}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex items-center gap-3">
                    <img
                      src={featuredPost.author.avatar}
                      alt={featuredPost.author.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-xl object-cover border border-white/10"
                    />
                    <div>
                      <div className="text-xs font-bold text-white">{featuredPost.author.name}</div>
                      <div className="text-[11px] text-slate-400">{featuredPost.author.role}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 group-hover:text-cyan-300 transition-colors">
                    <span>{isFa ? 'مطالعه کامل مقاله' : 'Read Full Report'}</span>
                    {dir === 'rtl' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 overflow-hidden rounded-2xl border border-white/10 aspect-video lg:aspect-[4/3] relative bg-slate-900">
                <img
                  src={featuredPost.coverImage}
                  alt={getPostTitle(featuredPost)}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </motion.section>
        )}

        {/* SECTION 3: STAGGERED EDITORIAL ARTICLES GRID */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <span>{isFa ? `آرشیو مقالات و تحلیل‌ها (${filteredPosts.length})` : `Latest Research & Guides (${filteredPosts.length})`}</span>
            </h3>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-16 rounded-3xl bg-slate-900/40 border border-white/10 space-y-3">
              <Search className="w-8 h-8 text-slate-500 mx-auto" />
              <div className="text-white font-bold text-sm">
                {isFa ? 'هیچ مقاله‌ای با این عبارت یافت نشد' : 'No articles found matching your query'}
              </div>
              <p className="text-xs text-slate-400">
                {isFa ? 'لطفاً کلمات کلیدی دیگری را جستجو کرده یا دسته‌بندی را تغییر دهید.' : 'Try searching with different keywords or switching the category filter.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post, idx) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: Math.min(idx * 0.06, 0.3), duration: 0.4 }}
                  onClick={() => onSelectPost(post.slug)}
                  className="group cursor-pointer rounded-3xl bg-slate-900/65 border border-white/10 hover:border-cyan-500/40 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-950/20"
                >
                  <div>
                    <div className="aspect-video w-full overflow-hidden relative border-b border-white/10 bg-slate-900">
                      <img
                        src={post.coverImage}
                        alt={getPostTitle(post)}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <div className="p-6 space-y-3">
                      {/* Clean Unboxed Metadata */}
                      <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-slate-400 tabular-nums">
                        <span className="text-cyan-400 font-bold">{getPostCategory(post)}</span>
                        <span aria-hidden="true" className="text-slate-600">·</span>
                        <span>{post.publishedAt}</span>
                        <span aria-hidden="true" className="text-slate-600">·</span>
                        <span>{post.readTimeMinutes} {isFa ? 'دقیقه' : 'min'}</span>
                      </div>

                      <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug line-clamp-2">
                        {getPostTitle(post)}
                      </h4>

                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                        {getPostSummary(post)}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        referrerPolicy="no-referrer"
                        className="w-7 h-7 rounded-full object-cover border border-white/10"
                      />
                      <span className="text-[11px] font-medium text-slate-300">{post.author.name}</span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 tabular-nums">
                      <span className="inline-flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{post.viewsCount}</span>
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Heart className="w-3 h-3 text-rose-500" />
                        <span>{post.likesCount}</span>
                      </span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </section>

        {/* SECTION 4: KNOWLEDGE TO ACTION BANNER */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl bg-gradient-to-r from-slate-900 via-[#081020] to-slate-900 border border-white/10 p-7 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="space-y-2 text-center md:text-start">
            <div className="text-xs font-mono text-cyan-400 font-bold">
              {isFa ? 'آماده بررسی ساختار شبکه هستید؟' : 'READY TO EXPLORE THE NETWORK?'}
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              {isFa ? 'ساختار ۲۰ سطحی و رتبه‌های سازمانی تیجکس را بررسی کنید' : 'Explore TGEX 20-Level Matrix & Leadership Ranks'}
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('levels')}
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-white/10 transition cursor-pointer"
            >
              {isFa ? 'مشاهده ۲۰ سطح' : 'View 20 Levels'}
            </button>
            <button
              type="button"
              onClick={() => onNavigate('signup')}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold shadow-lg shadow-blue-600/25 flex items-center gap-2 transition cursor-pointer"
            >
              <Rocket className="w-4 h-4" />
              <span>{isFa ? 'ثبت‌نام در تیجکس' : 'Join TGEX'}</span>
            </button>
          </div>
        </motion.section>

      </div>
    </div>
  );
};
