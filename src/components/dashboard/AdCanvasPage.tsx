import React, { useState, useEffect, useRef } from 'react';
import adSticker1 from '../../assets/images/ad_sticker_1.jpg';
import adSticker2 from '../../assets/images/ad_sticker_2.jpg';
import adSticker3 from '../../assets/images/ad_sticker_3.jpg';
import adSticker4 from '../../assets/images/ad_sticker_4_1795338480255.jpg';

const REMOTE_STICKER_MAP: Array<[string, string]> = [
  ['photo-1618005182384-a83a8bd57fbe', adSticker1],
  ['photo-1639762681485-074b7f938ba0', adSticker2],
  ['photo-1642543492481-44e81e3914a7', adSticker3],
  ['photo-1633156189535-b547974a72ec', adSticker4]
];

function localizeStickerUrl(url: string): string {
  for (const [token, asset] of REMOTE_STICKER_MAP) {
    if (url.includes(token)) return asset;
  }
  return url;
}
import { 
  Megaphone, 
  Paintbrush, 
  Type, 
  Image as ImageIcon, 
  Share2, 
  Save, 
  Trash2, 
  Undo, 
  Plus, 
  Maximize2, 
  Minimize2,
  Sparkles, 
  Eye, 
  Copy, 
  Check, 
  X,
  FileSpreadsheet,
  Palette,
  Layers,
  Download,
  RotateCcw
} from 'lucide-react';

interface TextElement {
  id: string;
  text: string;
  x: number; // 0 to 1280
  y: number; // 0 to 720
  color: string;
  fontSize: number;
}

interface ImageElement {
  id: string;
  url: string;
  x: number; // 0 to 1280
  y: number; // 0 to 720
  width: number;
  height: number;
}

interface AdCanvasPageProps {
  userId: string;
  isPublicShared?: boolean;
}

const CANVAS_WIDTH = 1280;
const CANVAS_HEIGHT = 720;

export const AdCanvasPage: React.FC<AdCanvasPageProps> = ({ userId, isPublicShared = false }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const boardWrapperRef = useRef<HTMLDivElement | null>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Paint tool settings
  const [brushColor, setBrushColor] = useState('#3b82f6');
  const [brushSize, setBrushSize] = useState(5);
  const [isEraser, setIsEraser] = useState(false);

  // Dynamic board elements
  const [texts, setTexts] = useState<TextElement[]>([]);
  const [images, setImages] = useState<ImageElement[]>([]);

  // Input states for creating elements
  const [newText, setNewText] = useState('');
  const [newTextColor, setNewTextColor] = useState('#ffffff');
  const [newTextSize, setNewTextSize] = useState(24);
  const [imageUrlInput, setImageUrlInput] = useState('');

  // Dragging states
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [activeDragType, setActiveDragType] = useState<'text' | 'image' | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Share, copy, and save status states
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [boardTitle, setBoardTitle] = useState('پیشنهاد فوق‌العاده سرمایه‌گذاری تریدرهای حرفه‌ای TGEX');

  // Load saved state
  useEffect(() => {
    // Try multiple keys for maximum reliability
    const saved = localStorage.getItem(`tgex_user_board_${userId}`) || localStorage.getItem('tgex_user_board_default');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.texts && Array.isArray(parsed.texts)) setTexts(parsed.texts);
        if (parsed.images && Array.isArray(parsed.images)) {
          setImages(
            parsed.images.map((img: ImageElement) => ({
              ...img,
              url: localizeStickerUrl(img.url)
            }))
          );
        }
        if (parsed.title) setBoardTitle(parsed.title);
        
        // Restore canvas drawing
        if (parsed.canvasImage && canvasRef.current) {
          const ctx = canvasRef.current.getContext('2d');
          if (ctx) {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
              ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
              ctx.drawImage(img, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            };
            img.src = parsed.canvasImage;
          }
        }
      } catch (err) {
        console.error('Error parsing saved board', err);
      }
    } else if (!isPublicShared) {
      // Seed rich 16:9 defaults
      setTexts([
        { id: 't1', text: '📊 بازدهی میانگین ماهانه کپی تریدینگ: ۴۲٪', x: 80, y: 80, color: '#10b981', fontSize: 32 },
        { id: 't2', text: '🚀 به شبکه پیشرفته و سودآور ۲۰ لایه‌ای TGEX بپیوندید', x: 80, y: 170, color: '#3b82f6', fontSize: 26 },
        { id: 't3', text: 'کد دعوت انحصاری من: DX-482917', x: 80, y: 250, color: '#f59e0b', fontSize: 24 }
      ]);
      setImages([
        { id: 'img1', url: adSticker3, x: 860, y: 80, width: 320, height: 320 }
      ]);
    } else {
      // Shared page with general template
      setTexts([
        { id: 't1', text: '📈 سیستم هوشمند کپی تریدینگ TGEX Live', x: 80, y: 90, color: '#3b82f6', fontSize: 34 },
        { id: 't2', text: 'بدون نیاز به دانش قبلی، سود تریدرهای درجه یک را کپی کنید.', x: 80, y: 180, color: '#e2e8f0', fontSize: 26 },
        { id: 't3', text: 'پاداش مستقیم ۲ لایه‌ای و تا ۲۰ لایه کارمزد معاملاتی ماتریسی', x: 80, y: 260, color: '#a78bfa', fontSize: 22 }
      ]);
      setImages([
        { id: 'img1', url: adSticker2, x: 880, y: 90, width: 300, height: 300 }
      ]);
    }
  }, [userId, isPublicShared]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (boardWrapperRef.current?.requestFullscreen) {
        boardWrapperRef.current.requestFullscreen().catch(() => {
          setIsFullscreen(true);
        });
      } else {
        setIsFullscreen(true);
      }
      setIsFullscreen(true);
    } else {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  // Canvas drawing coordinate mapper
  const getEventCoords = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>, 
    canvas: HTMLCanvasElement
  ) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const x = ((clientX - rect.left) / rect.width) * CANVAS_WIDTH;
    const y = ((clientY - rect.top) / rect.height) * CANVAS_HEIGHT;
    return { x: Math.max(0, Math.min(CANVAS_WIDTH, x)), y: Math.max(0, Math.min(CANVAS_HEIGHT, y)) };
  };

  // Drawing Events
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (isPublicShared) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getEventCoords(e, canvas);
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || isPublicShared) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getEventCoords(e, canvas);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = isEraser ? '#090d16' : brushColor;
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    if (window.confirm('آیا از پاک کردن کامل نقاشی روی بورد اطمینان دارید؟')) {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      }
    }
  };

  // Add Custom Elements
  const addTextElement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;

    const newEl: TextElement = {
      id: `text_${Date.now()}`,
      text: newText,
      x: 120,
      y: 200,
      color: newTextColor,
      fontSize: newTextSize
    };

    setTexts(prev => [...prev, newEl]);
    setNewText('');
  };

  const addImageElement = (e: React.FormEvent) => {
    e.preventDefault();
    const url = imageUrlInput.trim() || adSticker2;
    
    const newEl: ImageElement = {
      id: `img_${Date.now()}`,
      url: url,
      x: 400,
      y: 180,
      width: 240,
      height: 240
    };

    setImages(prev => [...prev, newEl]);
    setImageUrlInput('');
  };

  // Drag and drop in 16:9 coordinate space
  const handleElementMouseDown = (
    e: React.MouseEvent | React.TouchEvent, 
    id: string, 
    type: 'text' | 'image'
  ) => {
    if (isPublicShared) return;
    
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const currX = ((clientX - rect.left) / rect.width) * CANVAS_WIDTH;
    const currY = ((clientY - rect.top) / rect.height) * CANVAS_HEIGHT;

    setActiveDragId(id);
    setActiveDragType(type);

    let elementX = 0;
    let elementY = 0;

    if (type === 'text') {
      const el = texts.find(t => t.id === id);
      if (el) {
        elementX = el.x;
        elementY = el.y;
      }
    } else {
      const el = images.find(img => img.id === id);
      if (el) {
        elementX = el.x;
        elementY = el.y;
      }
    }

    setDragOffset({
      x: currX - elementX,
      y: currY - elementY
    });
  };

  const handleContainerMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!activeDragId || !activeDragType) return;
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const currX = ((clientX - rect.left) / rect.width) * CANVAS_WIDTH;
    const currY = ((clientY - rect.top) / rect.height) * CANVAS_HEIGHT;

    const newX = Math.max(10, Math.min(CANVAS_WIDTH - 80, currX - dragOffset.x));
    const newY = Math.max(10, Math.min(CANVAS_HEIGHT - 60, currY - dragOffset.y));

    if (activeDragType === 'text') {
      setTexts(prev => prev.map(t => t.id === activeDragId ? { ...t, x: newX, y: newY } : t));
    } else {
      setImages(prev => prev.map(img => img.id === activeDragId ? { ...img, x: newX, y: newY } : img));
    }
  };

  const handleDragEnd = () => {
    setActiveDragId(null);
    setActiveDragType(null);
  };

  const removeText = (id: string) => {
    setTexts(prev => prev.filter(t => t.id !== id));
  };

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const handleSaveBoard = () => {
    let canvasImage = '';
    const canvas = canvasRef.current;
    if (canvas) {
      try {
        canvasImage = canvas.toDataURL('image/png');
      } catch (err) {
        console.warn('Canvas export warning:', err);
      }
    }

    const dataToSave = {
      texts,
      images,
      title: boardTitle,
      canvasImage,
      updatedAt: new Date().toISOString()
    };

    const serialized = JSON.stringify(dataToSave);
    if (userId) {
      localStorage.setItem(`tgex_user_board_${userId}`, serialized);
    }
    localStorage.setItem('tgex_user_board_default', serialized);

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 3000);
  };

  const getShareLink = () => {
    return `${window.location.origin}?shareAds=${userId}`;
  };

  const handleCopyLink = () => {
    const link = getShareLink();
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const STICKERS = [
    adSticker1,
    adSticker2,
    adSticker3,
    adSticker4
  ];

  const handleAddSticker = (url: string) => {
    const newEl: ImageElement = {
      id: `img_${Date.now()}`,
      url: url,
      x: 480,
      y: 200,
      width: 220,
      height: 220
    };
    setImages(prev => [...prev, newEl]);
  };

  return (
    <div className="w-full space-y-6 text-slate-100 min-w-0" dir="rtl">
      
      {/* Top Header & Actions Bar */}
      {!isPublicShared && (
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-white flex items-center gap-2.5">
              <Megaphone className="text-blue-500 w-5 h-5 animate-pulse" />
              <span>سازنده بورد و کمپین‌های تبلیغاتی (Ad Creator 16:9)</span>
            </h2>
            <p className="text-xs text-slate-400">
              بورد تمام‌عرض اختصاصی خود را در نسبت استاندارد ۱۶:۹ با ابزارهای نقاشی، استیکرها و داده‌های گوگل‌شیت طراحی کرده و لینک اختصاصی آن را منتشر کنید.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={toggleFullscreen}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 border border-white/10 transition cursor-pointer"
              title="تمام‌صفحه بورد"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4 text-cyan-400" /> : <Maximize2 className="w-4 h-4 text-cyan-400" />}
              <span>{isFullscreen ? 'خروج از تمام‌صفحه' : 'حالت تمام‌صفحه (16:9)'}</span>
            </button>

            <button
              onClick={handleSaveBoard}
              className={`px-4 py-2 rounded-xl text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-lg ${
                savedSuccess
                  ? 'bg-emerald-500 text-white shadow-emerald-500/40 ring-2 ring-emerald-400/50'
                  : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30'
              }`}
            >
              {savedSuccess ? <Check className="w-4 h-4 text-white" /> : <Save className="w-4 h-4" />}
              <span>{savedSuccess ? 'با موفقیت ذخیره شد!' : 'ذخیره طرح بورد'}</span>
            </button>

            <button
              onClick={handleCopyLink}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                copied ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? 'لینک کپی شد!' : 'کپی لینک بدون لاگین'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Editor Controls - Placed cleanly ABOVE the 16:9 Canvas */}
      {!isPublicShared && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Board Title */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-2.5 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-2">
                <FileSpreadsheet className="w-3.5 h-3.5 text-blue-400" />
                <span>عنوان عمومی بورد</span>
              </h3>
              <input
                type="text"
                value={boardTitle}
                onChange={(e) => setBoardTitle(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                placeholder="عنوان صفحه تبلیغاتی..."
              />
            </div>
            <span className="text-[10px] text-slate-500 font-mono">فرمت خروجی: 16:9 Full HD</span>
          </div>

          {/* Card 2: Paint Tools */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Paintbrush className="w-3.5 h-3.5 text-blue-400" />
                <span>قلم‌مو و نقاشی</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">{brushSize}px</span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#ffffff'].map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    setBrushColor(color);
                    setIsEraser(false);
                  }}
                  className={`w-5 h-5 rounded-full border transition-transform ${
                    brushColor === color && !isEraser ? 'scale-125 border-white ring-2 ring-blue-500/40' : 'border-transparent opacity-80'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
              <input
                type="range"
                min="2"
                max="25"
                value={brushSize}
                onChange={(e) => setBrushSize(parseInt(e.target.value))}
                className="flex-1 accent-blue-500 bg-slate-950 rounded-lg cursor-pointer h-1.5 min-w-[60px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsEraser(!isEraser)}
                className={`py-1.5 px-2 rounded-xl text-[10px] font-bold border transition text-center ${
                  isEraser 
                    ? 'bg-amber-600/20 text-amber-300 border-amber-500' 
                    : 'bg-slate-950 text-slate-300 border-white/5 hover:bg-slate-800'
                }`}
              >
                {isEraser ? 'قلم‌مو فعال' : 'پاک‌کن'}
              </button>

              <button
                type="button"
                onClick={clearCanvas}
                className="py-1.5 px-2 rounded-xl text-[10px] font-bold bg-rose-950/40 text-rose-300 border border-rose-500/20 hover:bg-rose-900/30 transition text-center"
              >
                پاک کردن بورد
              </button>
            </div>
          </div>

          {/* Card 3: Dynamic Text Overlay */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-2.5">
            <h3 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-emerald-400" />
              <span>درج متغیرها و متن (Google Sheets)</span>
            </h3>

            <form onSubmit={addTextElement} className="space-y-2">
              <input
                type="text"
                required
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                placeholder="متن دلخواه خود را بنویسید..."
                className="w-full p-2 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              />

              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={newTextColor}
                  onChange={(e) => setNewTextColor(e.target.value)}
                  className="w-7 h-7 rounded-lg bg-transparent border-0 cursor-pointer p-0 shrink-0"
                  title="رنگ متن"
                />
                <select
                  value={newTextSize}
                  onChange={(e) => setNewTextSize(parseInt(e.target.value))}
                  className="flex-1 p-1.5 bg-slate-950 border border-white/10 rounded-lg text-[10px] text-white focus:outline-none"
                >
                  <option value="18">کوچک (18px)</option>
                  <option value="24">متوسط (24px)</option>
                  <option value="32">بزرگ (32px)</option>
                  <option value="42">تیتر اصلی (42px)</option>
                </select>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shrink-0 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>افزودن</span>
                </button>
              </div>
            </form>
          </div>

          {/* Card 4: Image & Stickers */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-2.5">
            <h3 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-purple-400" />
              <span>تصاویر و استیکرها</span>
            </h3>

            <div className="flex items-center gap-1.5">
              {STICKERS.map((st, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleAddSticker(st)}
                  className="rounded-lg overflow-hidden border border-white/10 bg-slate-950 w-8 h-8 hover:scale-110 transition shrink-0"
                  title="افزودن استیکر به صفحه"
                >
                  <img src={st} className="w-full h-full object-cover" alt="sticker" />
                </button>
              ))}
            </div>

            <form onSubmit={addImageElement} className="flex gap-1.5 pt-1">
              <input
                type="url"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                placeholder="آدرس URL عکس..."
                className="w-full p-1.5 bg-slate-950 border border-white/10 rounded-lg text-[10px] text-white focus:outline-none focus:border-purple-500"
              />
              <button
                type="submit"
                className="px-2.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shrink-0 transition"
              >
                + عکس
              </button>
            </form>
          </div>

        </div>
      )}

      {/* Shared Presentation Banner (For Public Viewers) */}
      {isPublicShared && (
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-white/15 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400">
              <Megaphone className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <h1 className="text-lg font-black text-white">{boardTitle}</h1>
              <p className="text-xs text-slate-400 mt-0.5">صفحه رسمی تبلیغات و بورد اختصاصی TGEX Live (شناسه ناشر: {userId})</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleFullscreen}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-2 border border-white/10 transition cursor-pointer"
            >
              <Maximize2 className="w-4 h-4 text-cyan-400" />
              <span>نمایش تمام‌صفحه ۱۶:۹</span>
            </button>
            <div className="text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-3 py-1.5 rounded-xl font-mono">
              Live Verified • No Login Required
            </div>
          </div>
        </div>
      )}

      {/* 
        ========================================================================
        FULL-WIDTH 16:9 CANVAS BOARD CONTAINER (STRICT 16:9 ASPECT RATIO ALWAYS)
        ========================================================================
      */}
      <div 
        ref={boardWrapperRef}
        className={`w-full transition-all duration-300 ${
          isFullscreen 
            ? 'fixed inset-0 z-[9999] bg-black/95 flex flex-col items-center justify-center p-4 sm:p-8 backdrop-blur-2xl' 
            : 'relative'
        }`}
      >
        {/* Fullscreen Floating Header Bar */}
        {isFullscreen && (
          <div className="w-full max-w-7xl mx-auto flex items-center justify-between pb-4 text-white">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
              <h2 className="text-base font-bold text-white truncate">{boardTitle}</h2>
              <span className="text-xs text-blue-400 font-mono bg-blue-500/10 px-2 py-0.5 rounded-md">16:9 Cinema Mode</span>
            </div>

            <div className="flex items-center gap-2">
              {!isPublicShared && (
                <button
                  onClick={handleSaveBoard}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-lg ${
                    savedSuccess
                      ? 'bg-emerald-500 text-white shadow-emerald-500/40'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  {savedSuccess ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                  <span>{savedSuccess ? 'ذخیره شد' : 'ذخیره'}</span>
                </button>
              )}

              <button
                onClick={toggleFullscreen}
                className="px-4 py-1.5 rounded-xl bg-rose-600/30 hover:bg-rose-600 text-rose-200 hover:text-white border border-rose-500/30 text-xs font-bold flex items-center gap-2 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
                <span>خروج از تمام‌صفحه (ESC)</span>
              </button>
            </div>
          </div>
        )}

        {/* The 16:9 Canvas Sandbox Box */}
        <div
          ref={containerRef}
          onMouseMove={handleContainerMouseMove}
          onTouchMove={handleContainerMouseMove}
          onMouseUp={handleDragEnd}
          onTouchEnd={handleDragEnd}
          className="relative w-full aspect-[16/9] rounded-3xl bg-[#090d16] border border-white/15 overflow-hidden select-none shadow-2xl shadow-black/90 mx-auto"
          style={{ touchAction: 'none' }}
        >
          {/* Google Sheets / Spreadsheet Style Background Grid Matrix */}
          <div className="absolute inset-0 grid grid-cols-16 grid-rows-9 opacity-15 pointer-events-none">
            {Array.from({ length: 144 }).map((_, i) => (
              <div key={i} className="border-r border-b border-white/30" />
            ))}
          </div>

          {/* High-Resolution 16:9 Canvas for Freehand Drawing */}
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            onMouseDown={startDrawing}
            onTouchStart={startDrawing}
            onMouseMove={draw}
            onTouchMove={draw}
            onMouseUp={stopDrawing}
            onTouchEnd={stopDrawing}
            onMouseLeave={stopDrawing}
            className={`absolute inset-0 w-full h-full object-contain z-10 ${
              isPublicShared ? 'pointer-events-none' : 'cursor-crosshair'
            }`}
          />

          {/* Dynamic Interactive Overlay Elements (Positioned via Percentage to stay 100% accurate in 16:9) */}
          
          {/* Text Overlays */}
          {texts.map((t) => (
            <div
              key={t.id}
              onMouseDown={(e) => handleElementMouseDown(e, t.id, 'text')}
              onTouchStart={(e) => handleElementMouseDown(e, t.id, 'text')}
              style={{ 
                left: `${(t.x / CANVAS_WIDTH) * 100}%`, 
                top: `${(t.y / CANVAS_HEIGHT) * 100}%`, 
                color: t.color, 
                fontSize: `clamp(12px, ${t.fontSize * 0.12}vw, ${t.fontSize}px)` 
              }}
              className={`absolute z-20 px-3 py-1.5 rounded-xl select-none font-black flex items-center gap-1.5 group leading-normal max-w-[45%] text-right whitespace-pre-wrap ${
                isPublicShared 
                  ? 'border-0 bg-slate-950/40 backdrop-blur-sm' 
                  : 'border border-dashed border-white/30 hover:border-blue-400 bg-slate-950/90 cursor-move shadow-lg'
              }`}
            >
              <span>{t.text}</span>
              {!isPublicShared && (
                <button
                  onClick={() => removeText(t.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded-full bg-rose-950 text-rose-300 hover:bg-rose-900 transition shrink-0"
                  title="حذف متن"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}

          {/* Image & Sticker Overlays */}
          {images.map((img) => (
            <div
              key={img.id}
              onMouseDown={(e) => handleElementMouseDown(e, img.id, 'image')}
              onTouchStart={(e) => handleElementMouseDown(e, img.id, 'image')}
              style={{ 
                left: `${(img.x / CANVAS_WIDTH) * 100}%`, 
                top: `${(img.y / CANVAS_HEIGHT) * 100}%`,
                width: `${(img.width / CANVAS_WIDTH) * 100}%`,
                height: 'auto',
                aspectRatio: '1/1'
              }}
              className={`absolute z-20 select-none group ${
                isPublicShared 
                  ? 'border-0' 
                  : 'border border-dashed border-white/30 hover:border-purple-400 cursor-move bg-slate-950/40 p-1 rounded-2xl shadow-xl'
              }`}
            >
              <img 
                src={img.url} 
                alt="Ad Graphic" 
                className="w-full h-full object-cover rounded-xl pointer-events-none" 
              />
              {!isPublicShared && (
                <button
                  onClick={() => removeImage(img.id)}
                  className="absolute -top-2 -right-2 p-1 rounded-full bg-rose-950 text-rose-300 hover:bg-rose-900 transition z-30 shadow-lg"
                  title="حذف تصویر"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}

          {/* Floating Canvas Quick Actions */}
          <div className="absolute top-4 left-4 z-30 flex items-center gap-2">
            <button
              onClick={toggleFullscreen}
              className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 text-white border border-white/10 backdrop-blur-md shadow-lg transition cursor-pointer"
              title="تمام‌صفحه"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4 text-cyan-400" /> : <Maximize2 className="w-4 h-4 text-cyan-400" />}
            </button>
          </div>

          {/* Watermark Notice */}
          <div className="absolute bottom-3 left-4 z-30 text-[10px] text-slate-500 font-mono pointer-events-none bg-slate-950/70 px-2 py-0.5 rounded-md border border-white/5">
            TGEX AdSpace 16:9 • {CANVAS_WIDTH}x{CANVAS_HEIGHT}
          </div>
        </div>
      </div>

      {/* Footer Info Callout */}
      {!isPublicShared && (
        <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-500/20 text-xs text-blue-300 flex flex-col sm:flex-row items-center gap-3 justify-between">
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
            <span>بورد در تمام دستگاه‌ها (تبلت، لپ‌تاپ و موبایل) نسبت ابعاد ۱۶:۹ استاندارد را حفظ کرده و به صورت تمام‌صفحه قابل ارائه است.</span>
          </span>

          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
            <span>نسبت تصویر: ۱۶ به ۹</span>
            <span>•</span>
            <span className="text-emerald-400 font-bold">سازگار با تمامی مرورگرها</span>
          </div>
        </div>
      )}

    </div>
  );
};
