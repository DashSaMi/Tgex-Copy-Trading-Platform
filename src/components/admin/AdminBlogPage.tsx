import React, { useState, useRef } from 'react';
import { BlogPost, BlogSeo, BlogAuthor } from '../../types';
import { blogService } from '../../services/blogService';
import blogCoverMatrix from '../../assets/images/blog_cover_matrix.jpg';
import authorAria from '../../assets/images/author_aria.jpg';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  Save, 
  CheckCircle2, 
  ArrowLeft, 
  Image as ImageIcon, 
  Table as TableIcon, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify, 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  Code, 
  Sparkles, 
  Tag, 
  Calendar, 
  Clock, 
  Globe, 
  Layers, 
  Maximize2, 
  Sliders, 
  Undo, 
  Redo, 
  Link as LinkIcon, 
  HelpCircle, 
  AlertCircle,
  FileText,
  Percent,
  Columns,
  Rows,
  PlusCircle,
  MinusCircle,
  Palette,
  Type,
  Check,
  ChevronDown
} from 'lucide-react';

export const AdminBlogPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>(blogService.getAllPosts());
  const [viewMode, setViewMode] = useState<'list' | 'editor' | 'preview'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('همه');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Active Editor State
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [slug, setSlug] = useState('');
  const [summary, setSummary] = useState('');
  const [contentHtml, setContentHtml] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [category, setCategory] = useState('آموزش کپی تریدینگ');
  const [tagsInput, setTagsInput] = useState('');
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [authorName, setAuthorName] = useState('مهندس آریا شایان');
  const [authorRole, setAuthorRole] = useState('معمار ارشد سیستم‌های مالی');
  const [authorAvatar, setAuthorAvatar] = useState(authorAria);
  const [readTime, setReadTime] = useState(5);
  const [isFeatured, setIsFeatured] = useState(false);
  const [showOnMain, setShowOnMain] = useState(false);

  const handleToggleShowOnMain = (post: BlogPost) => {
    const currentMainCount = posts.filter(p => p.showOnMain && p.id !== post.id).length;
    if (!post.showOnMain && currentMainCount >= 3) {
      showToast('حداکثر ۳ مقاله می‌توانند همزمان در صفحه اصلی نمایش داده شوند.');
      return;
    }
    const updated = !post.showOnMain;
    blogService.updatePost(post.id, { showOnMain: updated });
    setPosts(blogService.getAllPosts());
    showToast(updated ? 'مقاله برای نمایش در صفحه اصلی فعال شد.' : 'مقاله از صفحه اصلی برداشته شد.');
  };

  // SEO State
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [focusKeyword, setFocusKeyword] = useState('');

  // Word Editor Formatting Controls
  const [fontSizePx, setFontSizePx] = useState('16px');
  const [textColor, setTextColor] = useState('#ffffff');
  const [textBgColor, setTextBgColor] = useState('transparent');
  const [textAlign, setTextAlign] = useState<'right' | 'center' | 'left' | 'justify'>('right');
  const [textDir, setTextDir] = useState<'rtl' | 'ltr'>('rtl');

  // Insert Image Modal State
  const [showImageModal, setShowImageModal] = useState(false);
  const [imgUrl, setImgUrl] = useState('');
  const [imgAlt, setImgAlt] = useState('');
  const [imgWidthPercent, setImgWidthPercent] = useState<number>(85);
  const [imgAlign, setImgAlign] = useState<'center' | 'left' | 'right'>('center');
  const [imgCaption, setImgCaption] = useState('');

  // Insert Table Modal State
  const [showTableModal, setShowTableModal] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const [tableHasHeader, setTableHasHeader] = useState(true);

  // Active Ribbon Tab in Word Editor
  const [ribbonTab, setRibbonTab] = useState<'home' | 'insert' | 'layout' | 'seo'>('home');

  const editorRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleCreateNew = () => {
    setEditingPostId(null);
    setTitle('');
    setSubtitle('');
    setSlug(`post-${Date.now().toString().slice(-5)}`);
    setSummary('');
    setContentHtml(`
      <p style="font-size: 16px; line-height: 1.8; color: #cbd5e1;">
        مقدمه مقاله و نکات کلیدی را در این قسمت بنویسید...
      </p>
      <h2 style="font-size: 22px; font-weight: bold; color: #38bdf8; margin-top: 24px; margin-bottom: 12px;">
        عنوان اصلی بخش اول
      </h2>
      <p style="font-size: 16px; line-height: 1.8; color: #94a3b8;">
        توضیحات تکمیلی پیرامون موضوع تحلیل کپی تریدینگ، ماتریس ۲۰ سطحی یا مدیریت سرمایه.
      </p>
    `);
    setCoverImage(blogCoverMatrix);
    setCategory('آموزش کپی تریدینگ');
    setTagsInput('کپی تریدینگ, ماتریس ۲۰ سطحی, آموزش, سود دلاری');
    setStatus('published');
    setAuthorName('مهندس آریا شایان');
    setAuthorRole('معمار سیستم مالی تیجکس');
    setAuthorAvatar(authorAria);
    setReadTime(5);
    setIsFeatured(false);
    setShowOnMain(false);
    setMetaTitle('');
    setMetaDescription('');
    setFocusKeyword('');
    setViewMode('editor');
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPostId(post.id);
    setTitle(post.title);
    setSubtitle(post.subtitle || '');
    setSlug(post.slug);
    setSummary(post.summary);
    setContentHtml(post.contentHtml);
    setCoverImage(post.coverImage);
    setCategory(post.category);
    setTagsInput(post.tags.join(', '));
    setStatus(post.status);
    setAuthorName(post.author.name);
    setAuthorRole(post.author.role);
    setAuthorAvatar(post.author.avatar);
    setReadTime(post.readTimeMinutes);
    setIsFeatured(!!post.isFeatured);
    setShowOnMain(!!post.showOnMain);
    setMetaTitle(post.seo?.metaTitle || post.title);
    setMetaDescription(post.seo?.metaDescription || post.summary);
    setFocusKeyword(post.seo?.focusKeyword || '');
    setViewMode('editor');
  };

  const handleDeletePost = (id: string, postTitle: string) => {
    if (window.confirm(`آیا از حذف مقاله "${postTitle}" اطمینان دارید؟`)) {
      blogService.deletePost(id);
      setPosts(blogService.getAllPosts());
      showToast('مقاله با موفقیت حذف گردید.');
    }
  };

  const handleSavePost = () => {
    if (!title.trim()) {
      showToast('لطفاً عنوان مقاله را وارد نمایید.');
      return;
    }

    const currentMainCount = posts.filter(p => p.showOnMain && p.id !== editingPostId).length;
    if (showOnMain && currentMainCount >= 3) {
      showToast('حداکثر ۳ مقاله می‌توانند همزمان در صفحه اصلی نمایش داده شوند.');
      return;
    }

    const tagsArray = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    const generatedSlug = slug.trim() || title.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-zA-Z0-9\u0600-\u06FF-]/g, '');

    const postData = {
      title,
      subtitle,
      slug: generatedSlug,
      summary: summary || title,
      contentHtml: contentHtml || '<p>محتوای مقاله...</p>',
      coverImage: coverImage || blogCoverMatrix,
      category,
      tags: tagsArray.length ? tagsArray : ['عمومی'],
      author: {
        name: authorName,
        role: authorRole,
        avatar: authorAvatar
      },
      readTimeMinutes: Number(readTime) || 5,
      status,
      isFeatured,
      showOnMain,
      seo: {
        metaTitle: metaTitle || title,
        metaDescription: metaDescription || summary,
        focusKeyword: focusKeyword || title
      }
    };

    if (editingPostId) {
      blogService.updatePost(editingPostId, postData);
      showToast('مقاله با موفقیت بروزرسانی و منتشر گردید.');
    } else {
      blogService.createPost(postData);
      showToast('مقاله جدید با موفقیت ایجاد و ذخیره شد.');
    }

    setPosts(blogService.getAllPosts());
    setViewMode('list');
  };

  // Word Editor Command Actions
  const appendContentBlock = (htmlSnippet: string) => {
    setContentHtml(prev => prev + '\n' + htmlSnippet);
    showToast('المان با موفقیت به متن مقاله افزوده شد.');
  };

  const handleInsertHeading = (level: 1 | 2 | 3 | 4) => {
    const sizeMap = { 1: '28px', 2: '24px', 3: '20px', 4: '18px' };
    const colorMap = { 1: '#38bdf8', 2: '#0ea5e9', 3: '#38bdf8', 4: '#cbd5e1' };
    const headingHtml = `\n<h${level} style="font-size: ${sizeMap[level]}; font-weight: 800; color: ${colorMap[level]}; margin-top: 28px; margin-bottom: 12px;">تیتر جدید H${level}</h${level}>\n<p style="font-size: ${fontSizePx}; line-height: 1.8; color: #94a3b8;">متن زیر تیتر را اینجا بنویسید...</p>`;
    appendContentBlock(headingHtml);
  };

  const handleInsertCalloutBox = (type: 'info' | 'success' | 'warning') => {
    const styles = {
      info: { bg: 'rgba(14, 165, 233, 0.08)', border: '#0284c7', titleColor: '#38bdf8', title: 'نکته آموزشی و فنی' },
      success: { bg: 'rgba(16, 185, 129, 0.08)', border: '#059669', titleColor: '#34d399', title: 'راهکار پیشنهادی بهینه‌سازی' },
      warning: { bg: 'rgba(245, 158, 11, 0.08)', border: '#d97706', titleColor: '#fbbf24', title: 'هشدار مدیریت ریسک و سرمایه' }
    }[type];

    const calloutHtml = `
<div style="background: ${styles.bg}; border-right: 4px solid ${styles.border}; padding: 18px 20px; border-radius: 12px; margin: 24px 0;">
  <h4 style="color: ${styles.titleColor}; font-weight: bold; margin-bottom: 6px; font-size: 15px;">${styles.title}</h4>
  <p style="color: #cbd5e1; font-size: 14px; line-height: 1.7; margin: 0;">متن توضیحات این کادر ویژه را اینجا بنویسید...</p>
</div>`;
    appendContentBlock(calloutHtml);
  };

  const handleInsertImageCommit = () => {
    if (!imgUrl.trim()) {
      showToast('لطفاً آدرس تصویر را وارد کنید.');
      return;
    }

    const alignmentStyle = imgAlign === 'center' 
      ? 'display: block; margin: 0 auto;' 
      : imgAlign === 'left' 
      ? 'float: left; margin: 0 20px 20px 0;' 
      : 'float: right; margin: 0 0 20px 20px;';

    const imageHtml = `
<div style="text-align: ${imgAlign}; margin: 28px 0; clear: both;">
  <img src="${imgUrl}" alt="${imgAlt || title}" style="width: ${imgWidthPercent}%; ${alignmentStyle} border-radius: 14px; border: 1px solid rgba(255,255,255,0.15); box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4);" />
  ${imgCaption ? `<p style="font-size: 12px; color: #64748b; margin-top: 8px; text-align: ${imgAlign};">${imgCaption}</p>` : ''}
</div>`;

    appendContentBlock(imageHtml);
    setShowImageModal(false);
    setImgUrl('');
    setImgCaption('');
    setImgAlt('');
  };

  const handleInsertTableCommit = () => {
    let headerHtml = '';
    if (tableHasHeader) {
      let ths = '';
      for (let c = 1; c <= tableCols; c++) {
        ths += `<th style="padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.15); background: #1e293b; color: #f8fafc; font-weight: bold;">ستون ${c}</th>`;
      }
      headerHtml = `<thead><tr>${ths}</tr></thead>`;
    }

    let rowsHtml = '';
    for (let r = 1; r <= tableRows; r++) {
      let tds = '';
      for (let c = 1; c <= tableCols; c++) {
        tds += `<td style="padding: 10px 14px; border-bottom: 1px solid rgba(255,255,255,0.05); color: #cbd5e1;">داده سطر ${r} ستون ${c}</td>`;
      }
      const bg = r % 2 === 0 ? 'background: rgba(255,255,255,0.02);' : '';
      rowsHtml += `<tr style="${bg}">${tds}</tr>`;
    }

    const tableHtml = `
<div style="overflow-x: auto; margin: 24px 0;">
  <table style="width: 100%; border-collapse: collapse; text-align: right; font-size: 14px; background: #0b1120; border-radius: 12px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
    ${headerHtml}
    <tbody>
      ${rowsHtml}
    </tbody>
  </table>
</div>`;

    appendContentBlock(tableHtml);
    setShowTableModal(false);
  };

  // Filtered post list
  const filteredPosts = posts.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'همه' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6" dir="rtl">
      
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 left-6 z-50 p-4 rounded-2xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-2xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-white/10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative overflow-hidden shadow-2xl">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-mono font-bold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>BLOG SYSTEM & WORD-STYLE SEO EDITOR</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            سیستم مدیریت وبلاگ، مقالات و ویرایشگر پیشرفته Word
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            محیط جامع نگارش و بهینه‌سازی مقالات با ابزارهای قالب‌بندی مایکروسافت ورد، تنظیمات ابعاد تصاویر (۳۰٪ تا ۱۰۰٪)، ساخت جداول، چینش RTL/LTR و آنالیز سئو.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 z-10">
          {viewMode === 'list' ? (
            <button
              onClick={handleCreateNew}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              <span>ایجاد مقاله جدید</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('list')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-800 text-slate-300 hover:text-white text-xs font-bold transition border border-white/10"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>بازگشت به لیست</span>
              </button>
              <button
                onClick={handleSavePost}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition"
              >
                <Save className="w-4 h-4" />
                <span>ذخیره و انتشار مقاله</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* VIEW 1: BLOG POSTS LIST */}
      {viewMode === 'list' && (
        <div className="space-y-6">
          
          {/* Filter & Search Bar */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="جستجو در مقالات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-3 pr-10 py-2.5 bg-slate-950 border border-white/15 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-xs"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {['همه', 'طرح درآمدی و ماتریس', 'آموزش کپی تریدینگ', 'امنیت و کریپتو'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Posts Table */}
          <div className="rounded-3xl bg-slate-900/80 border border-white/10 overflow-hidden shadow-xl">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-950 border-b border-white/10 text-slate-400">
                <tr>
                  <th className="p-4 font-bold">عنوان مقاله و دسته‌بندی</th>
                  <th className="p-4 font-bold">نویسنده</th>
                  <th className="p-4 font-bold">تاریخ انتشار</th>
                  <th className="p-4 font-bold">آمار بازدید / لایک</th>
                  <th className="p-4 font-bold">وضعیت</th>
                  <th className="p-4 font-bold text-center">نمایش در صفحه اصلی (حداکثر ۳)</th>
                  <th className="p-4 font-bold text-center">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {filteredPosts.map(post => (
                  <tr key={post.id} className="hover:bg-white/[0.02] transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={post.coverImage} alt={post.title} className="w-14 h-10 rounded-lg object-cover border border-white/10 shrink-0" />
                        <div>
                          <div className="font-bold text-white text-sm line-clamp-1">{post.title}</div>
                          <div className="text-[11px] text-cyan-400 font-mono mt-0.5">{post.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-white">{post.author.name}</div>
                      <div className="text-[10px] text-slate-500">{post.author.role}</div>
                    </td>
                    <td className="p-4 font-mono text-slate-400">
                      {post.publishedAt}
                    </td>
                    <td className="p-4 font-mono">
                      <span className="text-cyan-400">{post.viewsCount} بازدید</span>
                      <span className="text-slate-500 mx-1.5">•</span>
                      <span className="text-rose-400">{post.likesCount} لایک</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        post.status === 'published'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {post.status === 'published' ? 'منتشر شده' : 'پیش‌نویس'}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleToggleShowOnMain(post)}
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition flex items-center gap-1.5 mx-auto ${
                          post.showOnMain
                            ? 'bg-blue-600/30 text-blue-300 border-blue-500/50 shadow-md shadow-blue-500/20'
                            : 'bg-slate-950 text-slate-500 border-white/10 hover:text-slate-300'
                        }`}
                      >
                        <Globe className="w-3 h-3" />
                        <span>{post.showOnMain ? 'در صفحه اصلی (فعال)' : 'غیرفعال'}</span>
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEditPost(post)}
                          className="p-2 rounded-xl bg-slate-950 hover:bg-blue-600/30 border border-white/10 hover:border-blue-500/40 text-blue-400 transition"
                          title="ویرایش در ادیتور Word"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.id, post.title)}
                          className="p-2 rounded-xl bg-slate-950 hover:bg-rose-600/30 border border-white/10 hover:border-rose-500/40 text-rose-400 transition"
                          title="حذف مقاله"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* VIEW 2: FULL MICROSOFT WORD STYLE SUITE */}
      {viewMode === 'editor' && (
        <div className="space-y-6">
          
          {/* Word Ribbon Toolbar Container */}
          <div className="rounded-3xl bg-slate-900 border border-white/15 shadow-2xl overflow-hidden">
            
            {/* Top Ribbon Tabs (Home, Insert, Layout, SEO) */}
            <div className="bg-slate-950 border-b border-white/10 px-4 pt-2 flex items-center gap-2">
              <button
                onClick={() => setRibbonTab('home')}
                className={`px-4 py-2 text-xs font-bold rounded-t-xl transition border-t border-x ${
                  ribbonTab === 'home'
                    ? 'bg-slate-900 text-white border-white/15 border-b-0'
                    : 'text-slate-400 hover:text-white border-transparent'
                }`}
              >
                قالب‌بندی و متن (Home)
              </button>
              <button
                onClick={() => setRibbonTab('insert')}
                className={`px-4 py-2 text-xs font-bold rounded-t-xl transition border-t border-x ${
                  ribbonTab === 'insert'
                    ? 'bg-slate-900 text-white border-white/15 border-b-0'
                    : 'text-slate-400 hover:text-white border-transparent'
                }`}
              >
                درج المان و تصویر (Insert)
              </button>
              <button
                onClick={() => setRibbonTab('layout')}
                className={`px-4 py-2 text-xs font-bold rounded-t-xl transition border-t border-x ${
                  ribbonTab === 'layout'
                    ? 'bg-slate-900 text-white border-white/15 border-b-0'
                    : 'text-slate-400 hover:text-white border-transparent'
                }`}
              >
                تنظیمات سند و نویسنده (Layout)
              </button>
              <button
                onClick={() => setRibbonTab('seo')}
                className={`px-4 py-2 text-xs font-bold rounded-t-xl transition border-t border-x ${
                  ribbonTab === 'seo'
                    ? 'bg-slate-900 text-white border-white/15 border-b-0'
                    : 'text-slate-400 hover:text-white border-transparent'
                }`}
              >
                بهینه‌سازی و سئو (SEO Suite)
              </button>
            </div>

            {/* Ribbon Sub-Toolbar */}
            <div className="p-4 bg-slate-900 flex flex-wrap items-center gap-4 text-xs border-b border-white/10">
              
              {/* TAB: HOME / FORMATTING */}
              {ribbonTab === 'home' && (
                <div className="flex flex-wrap items-center gap-4 w-full">
                  
                  {/* Font Size in Pixels */}
                  <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-white/10">
                    <Type className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-slate-400">اندازه (Pixels):</span>
                    <select
                      value={fontSizePx}
                      onChange={(e) => setFontSizePx(e.target.value)}
                      className="bg-transparent text-white font-mono font-bold focus:outline-none cursor-pointer"
                    >
                      <option value="12px">12px (خیلی کوچک)</option>
                      <option value="14px">14px (کوچک)</option>
                      <option value="16px">16px (استاندارد متن)</option>
                      <option value="18px">18px (متوسط / لید)</option>
                      <option value="20px">20px (تیتر فرعی H4)</option>
                      <option value="24px">24px (تیتر H3)</option>
                      <option value="28px">28px (تیتر H2)</option>
                      <option value="32px">32px (تیتر H1)</option>
                      <option value="40px">40px (سرتیتر بنری)</option>
                    </select>
                  </div>

                  {/* Text Direction Controls: RTL vs LTR */}
                  <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-white/10">
                    <button
                      onClick={() => setTextDir('rtl')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                        textDir === 'rtl' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                      title="راست به چپ (RTL)"
                    >
                      راست‌چین (RTL)
                    </button>
                    <button
                      onClick={() => setTextDir('ltr')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                        textDir === 'ltr' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                      title="چپ به راست (LTR)"
                    >
                      چپ‌چین (LTR)
                    </button>
                  </div>

                  {/* Content Alignment Controls: Right, Center, Left, Justify */}
                  <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-white/10">
                    <button
                      onClick={() => setTextAlign('right')}
                      className={`p-1.5 rounded-lg transition ${
                        textAlign === 'right' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                      title="راست‌چین کردن محتوا"
                    >
                      <AlignRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setTextAlign('center')}
                      className={`p-1.5 rounded-lg transition ${
                        textAlign === 'center' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                      title="وسط‌چین کردن محتوا (Center Content)"
                    >
                      <AlignCenter className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setTextAlign('left')}
                      className={`p-1.5 rounded-lg transition ${
                        textAlign === 'left' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                      title="چپ‌چین کردن محتوا"
                    >
                      <AlignLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setTextAlign('justify')}
                      className={`p-1.5 rounded-lg transition ${
                        textAlign === 'justify' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                      title="تراز دوطرفه (Justify)"
                    >
                      <AlignJustify className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Font Color Picker */}
                  <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-white/10">
                    <Palette className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-slate-400">رنگ فونت:</span>
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                    />
                    <span className="font-mono text-[10px] text-slate-300">{textColor}</span>
                  </div>

                  {/* Headings Quick Insert */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleInsertHeading(1)}
                      className="px-2.5 py-1 rounded-lg bg-slate-950 border border-white/10 hover:border-blue-500 text-xs font-bold text-white"
                    >
                      + H1
                    </button>
                    <button
                      onClick={() => handleInsertHeading(2)}
                      className="px-2.5 py-1 rounded-lg bg-slate-950 border border-white/10 hover:border-blue-500 text-xs font-bold text-white"
                    >
                      + H2
                    </button>
                    <button
                      onClick={() => handleInsertHeading(3)}
                      className="px-2.5 py-1 rounded-lg bg-slate-950 border border-white/10 hover:border-blue-500 text-xs font-bold text-white"
                    >
                      + H3
                    </button>
                  </div>

                </div>
              )}

              {/* TAB: INSERT ELEMENTS */}
              {ribbonTab === 'insert' && (
                <div className="flex flex-wrap items-center gap-3 w-full">
                  <button
                    onClick={() => setShowImageModal(true)}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition shadow"
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>افزودن تصویر با تنظیم ابعاد (۳۰٪ تا ۱۰۰٪)</span>
                  </button>

                  <button
                    onClick={() => setShowTableModal(true)}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-200 border border-white/15 font-bold transition"
                  >
                    <TableIcon className="w-4 h-4 text-cyan-400" />
                    <span>ساخت جدول دلخواه (Table Builder)</span>
                  </button>

                  <div className="h-6 w-[1px] bg-white/10 mx-1" />

                  <button
                    onClick={() => handleInsertCalloutBox('info')}
                    className="px-3 py-1.5 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold"
                  >
                    + باکس آموزشی (Info)
                  </button>

                  <button
                    onClick={() => handleInsertCalloutBox('success')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold"
                  >
                    + باکس بهینه‌سازی (Success)
                  </button>

                  <button
                    onClick={() => handleInsertCalloutBox('warning')}
                    className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold"
                  >
                    + باکس هشدار ریسک (Warning)
                  </button>
                </div>
              )}

              {/* TAB: LAYOUT & AUTHOR */}
              {ribbonTab === 'layout' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">نام نویسنده</label>
                    <input
                      type="text"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-950 border border-white/15 rounded-xl text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">سمت و عنوان نویسنده</label>
                    <input
                      type="text"
                      value={authorRole}
                      onChange={(e) => setAuthorRole(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-950 border border-white/15 rounded-xl text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">تخمین زمان مطالعه (دقیقه)</label>
                    <input
                      type="number"
                      value={readTime}
                      onChange={(e) => setReadTime(Number(e.target.value))}
                      className="w-full px-3 py-1.5 bg-slate-950 border border-white/15 rounded-xl text-white text-xs"
                    />
                  </div>
                  <div className="sm:col-span-3 pt-2">
                    <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950 border border-white/10 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showOnMain}
                        onChange={(e) => setShowOnMain(e.target.checked)}
                        className="w-4 h-4 rounded bg-slate-900 border-white/20 text-blue-600 focus:ring-0 cursor-pointer"
                      />
                      <span className="text-xs font-bold text-white flex items-center gap-2">
                        <Globe className="w-4 h-4 text-cyan-400" />
                        نمایش در صفحه اصلی سایت (حداکثر ۳ مقاله)
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* TAB: SEO & METADATA */}
              {ribbonTab === 'seo' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>عنوان سئو (Meta Title)</span>
                      <span className="font-mono">{metaTitle.length}/60</span>
                    </div>
                    <input
                      type="text"
                      value={metaTitle}
                      onChange={(e) => setMetaTitle(e.target.value)}
                      placeholder="عنوان مقاله در گوگل..."
                      className="w-full px-3 py-1.5 bg-slate-950 border border-white/15 rounded-xl text-white text-xs"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>توضیحات سئو (Meta Description)</span>
                      <span className="font-mono">{metaDescription.length}/160</span>
                    </div>
                    <input
                      type="text"
                      value={metaDescription}
                      onChange={(e) => setMetaDescription(e.target.value)}
                      placeholder="چکیده کوتاه برای موتورهای جستجو..."
                      className="w-full px-3 py-1.5 bg-slate-950 border border-white/15 rounded-xl text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">کلمه کلیدی اصلی (Focus Keyword)</label>
                    <input
                      type="text"
                      value={focusKeyword}
                      onChange={(e) => setFocusKeyword(e.target.value)}
                      placeholder="مانند: کپی تریدینگ, ماتریس ۲۰ سطحی"
                      className="w-full px-3 py-1.5 bg-slate-950 border border-white/15 rounded-xl text-white text-xs"
                    />
                  </div>
                </div>
              )}

            </div>

            {/* Article Metadata Fields Bar */}
            <div className="p-6 space-y-4 bg-slate-950/70 border-b border-white/10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                
                {/* Title */}
                <div className="lg:col-span-8 space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300">عنوان اصلی مقاله (Post Title)</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="عنوان جذاب و سئو شده مقاله را بنویسید..."
                    className="w-full px-4 py-3 bg-slate-900 border border-white/15 rounded-2xl text-white font-bold text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Category & Status */}
                <div className="lg:col-span-4 grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-300">دسته‌بندی</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-3 bg-slate-900 border border-white/15 rounded-2xl text-white text-xs focus:outline-none"
                    >
                      <option value="طرح درآمدی و ماتریس">طرح درآمدی و ماتریس</option>
                      <option value="آموزش کپی تریدینگ">آموزش کپی تریدینگ</option>
                      <option value="امنیت و کریپتو">امنیت و کریپتو</option>
                      <option value="اخبار تیجکس">اخبار تیجکس</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-300">وضعیت انتشار</label>
                    <select
                      value={status}
                      onChange={(e: any) => setStatus(e.target.value)}
                      className="w-full px-3 py-3 bg-slate-900 border border-white/15 rounded-2xl text-white text-xs focus:outline-none"
                    >
                      <option value="published">انتشار عمومی</option>
                      <option value="draft">پیش‌نویس محرمانه</option>
                    </select>
                  </div>
                </div>

                {/* Subtitle & Cover Image */}
                <div className="lg:col-span-6 space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300">زیرعنوان یا شعار مقاله (Subtitle)</label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="توضیح تکمیلی زیر تیتر اصلی..."
                    className="w-full px-4 py-2.5 bg-slate-900 border border-white/15 rounded-xl text-white text-xs"
                  />
                </div>

                <div className="lg:col-span-6 space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300">لینک تصویر شاخص (Cover Image URL)</label>
                  <input
                    type="text"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 bg-slate-900 border border-white/15 rounded-xl text-white text-xs font-mono"
                  />
                </div>

              </div>
            </div>

            {/* Word Document Sheet / Workspace */}
            <div className="p-6 sm:p-10 bg-[#070b12] flex justify-center">
              <div className="w-full max-w-4xl bg-slate-950 border border-white/15 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-10 space-y-6">
                
                <div className="flex items-center justify-between border-b border-white/10 pb-4 text-xs text-slate-400">
                  <span className="font-bold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-cyan-400" />
                    صفحه سند (Document Workspace)
                  </span>
                  <span className="font-mono">
                    جهت: {textDir.toUpperCase()} • چینش: {textAlign} • فونت: {fontSizePx}
                  </span>
                </div>

                {/* HTML / Rich Text Editor Input */}
                <div className="space-y-2">
                  <textarea
                    rows={16}
                    value={contentHtml}
                    onChange={(e) => setContentHtml(e.target.value)}
                    style={{
                      fontSize: fontSizePx,
                      textAlign: textAlign,
                      direction: textDir,
                      color: textColor
                    }}
                    placeholder="متن مقاله، تیترها و المان‌های ورد را اینجا وارد و ویرایش کنید..."
                    className="w-full p-4 rounded-2xl bg-slate-900 border border-white/15 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono leading-relaxed text-xs sm:text-sm shadow-inner"
                  />
                </div>

                {/* Real-time Rendered Document Page Preview */}
                <div className="border-t border-white/10 pt-6 space-y-4">
                  <div className="text-xs font-bold text-cyan-400 flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span>پیش‌نمایش خروجی سند در سایت (Live Render Output):</span>
                  </div>

                  <div 
                    style={{
                      direction: textDir,
                      textAlign: textAlign
                    }}
                    dangerouslySetInnerHTML={{ __html: contentHtml }}
                    className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 space-y-4"
                  />
                </div>

              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="p-4 bg-slate-900 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={() => setViewMode('list')}
                className="px-5 py-2 rounded-xl bg-slate-950 border border-white/10 text-slate-400 hover:text-white text-xs font-bold"
              >
                انصراف و بازگشت
              </button>

              <button
                onClick={handleSavePost}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 hover:scale-[1.02] transition"
              >
                <Save className="w-4 h-4" />
                <span>ذخیره و انتشار نهایی در سایت عمومی</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 1: INSERT IMAGE WITH 30% TO 100% SLIDER */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" dir="rtl">
          <div className="w-full max-w-lg bg-slate-900 border border-white/15 rounded-3xl p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-blue-400" />
                <span>افزودن تصویر به سبک Microsoft Word</span>
              </h3>
              <button onClick={() => setShowImageModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">آدرس اینترنتی تصویر (Image URL)</label>
                <input
                  type="text"
                  placeholder="/assets/image.jpg"
                  value={imgUrl}
                  onChange={(e) => setImgUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-white/15 rounded-xl text-white text-xs font-mono"
                />
              </div>

              {/* Slider from 30% to 100% */}
              <div className="space-y-2 p-4 rounded-2xl bg-slate-950 border border-white/10">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-300 flex items-center gap-1.5">
                    <Percent className="w-4 h-4 text-cyan-400" />
                    ابعاد و پهنای تصویر (Image Scale):
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-blue-600/30 border border-blue-500/40 text-blue-300 font-mono font-bold">
                    {imgWidthPercent}%
                  </span>
                </div>

                <input
                  type="range"
                  min="30"
                  max="100"
                  step="5"
                  value={imgWidthPercent}
                  onChange={(e) => setImgWidthPercent(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>30% (کوچک و فشرده)</span>
                  <span>65% (متوسط)</span>
                  <span>100% (تمام عرض Full-Width)</span>
                </div>
              </div>

              {/* Alignment Controls */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">موقعیت و چینش تصویر (Alignment)</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setImgAlign('center')}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      imgAlign === 'center'
                        ? 'bg-blue-600 text-white border-blue-500'
                        : 'bg-slate-950 text-slate-400 border-white/10 hover:text-white'
                    }`}
                  >
                    وسط‌چین (Center)
                  </button>
                  <button
                    type="button"
                    onClick={() => setImgAlign('right')}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      imgAlign === 'right'
                        ? 'bg-blue-600 text-white border-blue-500'
                        : 'bg-slate-950 text-slate-400 border-white/10 hover:text-white'
                    }`}
                  >
                    راست‌چین (Right)
                  </button>
                  <button
                    type="button"
                    onClick={() => setImgAlign('left')}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      imgAlign === 'left'
                        ? 'bg-blue-600 text-white border-blue-500'
                        : 'bg-slate-950 text-slate-400 border-white/10 hover:text-white'
                    }`}
                  >
                    چپ‌چین (Left)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">توضیح زیر تصویر (Caption)</label>
                <input
                  type="text"
                  placeholder="عنوان یا منبع تصویر..."
                  value={imgCaption}
                  onChange={(e) => setImgCaption(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-white/15 rounded-xl text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">متن جایگزین برای سئو (Alt Text)</label>
                <input
                  type="text"
                  placeholder="توصیف تصویر برای موتورهای جستجو..."
                  value={imgAlt}
                  onChange={(e) => setImgAlt(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-white/15 rounded-xl text-white text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowImageModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-950 text-slate-400 hover:text-white text-xs font-bold"
              >
                انصراف
              </button>
              <button
                onClick={handleInsertImageCommit}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg"
              >
                درج تصویر در سند
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: CUSTOMIZABLE TABLE BUILDER (WORD STYLE) */}
      {showTableModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" dir="rtl">
          <div className="w-full max-w-md bg-slate-900 border border-white/15 rounded-3xl p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TableIcon className="w-5 h-5 text-cyan-400" />
                <span>ساخت جدول سفارشی ورد (Table Builder)</span>
              </h3>
              <button onClick={() => setShowTableModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300">تعداد سطرها (Rows)</label>
                  <input
                    type="number"
                    min="1"
                    max="15"
                    value={tableRows}
                    onChange={(e) => setTableRows(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-white/15 rounded-xl text-white text-xs font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300">تعداد ستون‌ها (Cols)</label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={tableCols}
                    onChange={(e) => setTableCols(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-white/15 rounded-xl text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-950 border border-white/10">
                <input
                  type="checkbox"
                  id="hasHeader"
                  checked={tableHasHeader}
                  onChange={(e) => setTableHasHeader(e.target.checked)}
                  className="rounded bg-slate-900 border-white/20 text-blue-600 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="hasHeader" className="text-xs text-slate-300 cursor-pointer select-none">
                  ایجاد سطر هدر با استایل برجسته (Header Row)
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowTableModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-950 text-slate-400 hover:text-white text-xs font-bold"
              >
                انصراف
              </button>
              <button
                onClick={handleInsertTableCommit}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg"
              >
                درج جدول در سند
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
