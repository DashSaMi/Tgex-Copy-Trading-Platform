import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { PageId, BlogPost } from '../../types';
import { blogService } from '../../services/blogService';
import { useLanguage } from '../../context/LanguageContext';
import {
  ArrowRight,
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  Heart,
  Share2,
  Check,
  BookOpen,
  Tag,
  TrendingUp
} from 'lucide-react';

interface BlogDetailPageProps {
  slug: string;
  onNavigate: (page: PageId) => void;
  onSelectPost: (slug: string) => void;
}

export const BlogDetailPage: React.FC<BlogDetailPageProps> = ({ slug, onNavigate, onSelectPost }) => {
  const { language, dir } = useLanguage();
  const isFa = language === 'fa';
  const [post, setPost] = useState<BlogPost | undefined>(undefined);
  const [copied, setCopied] = useState(false);
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 24, restDelta: 0.001 });

  useEffect(() => {
    const found = blogService.getPostBySlug(slug) || blogService.getAllPosts()[0];
    if (found) {
      setPost(found);
      setLikes(found.likesCount);
      blogService.incrementViews(found.slug);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#05070a] text-slate-100 py-20 px-4 text-center" dir={dir}>
        <div className="max-w-md mx-auto space-y-4">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
          <h2 className="text-xl font-bold text-white">
            {isFa ? 'مقاله مورد نظر یافت نشد' : 'Article Not Found'}
          </h2>
          <p className="text-xs text-slate-400">
            {isFa ? 'ممکن است این مقاله حذف شده یا آدرس آن تغییر کرده باشد.' : 'The article may have been removed or the URL has changed.'}
          </p>
          <button
            type="button"
            onClick={() => onNavigate('blog')}
            className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-500 transition cursor-pointer"
          >
            {isFa ? 'بازگشت به آرشیو وبلاگ' : 'Return to Blog Archive'}
          </button>
        </div>
      </div>
    );
  }

  const allPosts = blogService.getPublishedPosts();
  const relatedPosts = allPosts.filter((p) => p.id !== post.id).slice(0, 3);

  const getPostTitle = (p: BlogPost) => (isFa ? p.title : p.titleEn || p.title);
  const getPostSubtitle = (p: BlogPost) => (isFa ? p.subtitle : p.subtitleEn || p.subtitle);
  const getPostCategory = (p: BlogPost) => (isFa ? p.category : p.categoryEn || p.category);
  const getPostTags = (p: BlogPost) => (isFa ? p.tags : p.tagsEn || p.tags);
  const getPostHtml = (p: BlogPost) => (isFa ? p.contentHtml : p.contentHtmlEn || p.contentHtml);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleLike = () => {
    if (!hasLiked) {
      const newCount = blogService.toggleLike(post.slug);
      setLikes(newCount);
      setHasLiked(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070a] text-slate-100 py-10 px-4 sm:px-6 lg:px-8 selection:bg-blue-600 selection:text-white relative" dir={dir}>
      {/* Reading Progress Bar */}
      <motion.div
        style={{ scaleX }}
        className={`fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 z-50 ${isFa ? 'origin-right' : 'origin-left'}`}
      />

      <div className="max-w-4xl mx-auto space-y-10">

        {/* Breadcrumb & Back */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4"
        >
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 font-medium">
            <button type="button" onClick={() => onNavigate('home')} className="hover:text-white transition cursor-pointer">
              {isFa ? 'صفحه اصلی' : 'Home'}
            </button>
            <span>/</span>
            <button type="button" onClick={() => onNavigate('blog')} className="hover:text-white transition text-cyan-400 cursor-pointer">
              {isFa ? 'وبلاگ و مقالات' : 'Blog & Knowledge Base'}
            </button>
            <span>/</span>
            <span className="text-slate-300 truncate max-w-xs">{getPostTitle(post)}</span>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('blog')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 hover:border-white/25 text-slate-300 hover:text-white text-xs font-bold transition cursor-pointer"
          >
            {dir === 'rtl' ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
            <span>{isFa ? 'لیست مقالات' : 'All Articles'}</span>
          </button>
        </motion.div>

        {/* Article Header */}
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.06 }}
          className="space-y-6"
        >
          {/* Unboxed Metadata */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-400 tabular-nums">
            <span className="text-cyan-400 font-bold">{getPostCategory(post)}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{post.publishedAt}</span>
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{post.readTimeMinutes} {isFa ? 'دقیقه زمان مطالعه' : 'min read'}</span>
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="inline-flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              <span>{post.viewsCount} {isFa ? 'بازدید' : 'views'}</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight text-balance">
            {getPostTitle(post)}
          </h1>

          {getPostSubtitle(post) && (
            <p className="text-base sm:text-lg text-slate-300 font-medium leading-relaxed">
              {getPostSubtitle(post)}
            </p>
          )}

          {/* Author Strip */}
          <div className="p-4 rounded-2xl bg-slate-900/65 border border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                referrerPolicy="no-referrer"
                className="w-11 h-11 rounded-xl object-cover border border-white/10"
              />
              <div>
                <div className="text-sm font-bold text-white">{post.author.name}</div>
                <div className="text-xs text-slate-400">{post.author.role}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleLike}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  hasLiked
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : 'bg-slate-950 border border-white/10 text-slate-300 hover:text-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${hasLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span className="font-mono tabular-nums">{likes}</span>
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                className="p-2 rounded-xl bg-slate-950 border border-white/10 text-slate-300 hover:text-white transition cursor-pointer"
                title={isFa ? 'کپی لینک مقاله' : 'Copy article link'}
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Cover Image */}
          <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl aspect-video relative bg-slate-900">
            <img
              src={post.coverImage}
              alt={getPostTitle(post)}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.header>

        {/* Rich Article Body */}
        <motion.article
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.14 }}
          className="prose prose-invert max-w-none space-y-6 text-slate-300 leading-relaxed text-sm sm:text-base border-b border-white/10 pb-12"
        >
          <div
            dangerouslySetInnerHTML={{ __html: getPostHtml(post) }}
            className="rich-blog-content space-y-6"
          />
        </motion.article>

        {/* Unboxed Tags Row */}
        <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-400">
          <Tag className="w-4 h-4 text-slate-500" />
          <span className="font-bold text-slate-300">{isFa ? 'کلیدواژه‌ها:' : 'Topics:'}</span>
          {getPostTags(post).map((tag, i) => (
            <React.Fragment key={tag}>
              {i > 0 && <span aria-hidden="true" className="text-slate-600">·</span>}
              <span className="text-cyan-400/90 font-mono">#{tag}</span>
            </React.Fragment>
          ))}
        </div>

        {/* Share & Feedback Panel */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-white">
              {isFa ? 'این مقاله برای شما مفید بود؟' : 'Was this report helpful?'}
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              {isFa
                ? 'با اشتراک‌گذاری این مطلب، آگاهی اعضای شبکه خود را افزایش دهید.'
                : 'Share this report across your network to strengthen strategy alignment.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                hasLiked
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/25'
                  : 'bg-slate-950 border border-white/10 text-slate-300 hover:text-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${hasLiked ? 'fill-white' : ''}`} />
              <span>{hasLiked ? (isFa ? 'پسندیده شد' : 'Liked') : (isFa ? 'پسندیدم' : 'Like')}</span>
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-lg shadow-blue-600/25 cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? (isFa ? 'لینک کپی شد!' : 'Link Copied!') : (isFa ? 'اشتراک‌گذاری' : 'Share Link')}</span>
            </button>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="space-y-6 pt-6">
            <div className="flex items-center gap-2 text-white font-black text-lg">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <span>{isFa ? 'مقالات مرتبط پیشنهادی' : 'Recommended Related Articles'}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {relatedPosts.map((rPost, i) => (
                <motion.div
                  key={rPost.id}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  onClick={() => onSelectPost(rPost.slug)}
                  className="group p-4 rounded-2xl bg-slate-900/65 border border-white/10 hover:border-cyan-500/40 cursor-pointer space-y-3 transition-all hover:-translate-y-1"
                >
                  <div className="aspect-video w-full rounded-xl overflow-hidden border border-white/5 bg-slate-900">
                    <img
                      src={rPost.coverImage}
                      alt={getPostTitle(rPost)}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="text-[11px] font-mono text-cyan-400 font-bold">{getPostCategory(rPost)}</div>
                  <h5 className="text-sm font-bold text-white line-clamp-2 group-hover:text-cyan-300 transition-colors">
                    {getPostTitle(rPost)}
                  </h5>
                  <div className="text-[11px] text-slate-400 flex items-center justify-between font-mono pt-1 tabular-nums">
                    <span>{rPost.readTimeMinutes} {isFa ? 'دقیقه' : 'min'}</span>
                    <span>{rPost.publishedAt}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
};
