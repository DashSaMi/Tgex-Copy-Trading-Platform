import React, { useState, useEffect, useMemo, useRef } from 'react';
import { AdminUserItem, PageId } from '../../types';
import { databaseService, DbUserEntity } from '../../services/db/databaseService';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Network, 
  Search, 
  User, 
  Users, 
  ChevronRight, 
  ChevronLeft, 
  ChevronDown, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Layers, 
  TrendingUp, 
  Award, 
  DollarSign, 
  ShieldCheck, 
  ArrowUpRight,
  ExternalLink,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  MoveHorizontal,
  RefreshCw
} from 'lucide-react';

interface TreeNodeData {
  id: string;
  name: string;
  username: string;
  sponsorName: string;
  sponsorId: string;
  placementName: string;
  placementId: string;
  rank: string;
  level: string;
  networkSize: number;
  activeUsers: number;
  inactiveUsers: number;
  profitUsdt: number;
  commissionUsdt: number;
  status: 'active' | 'suspended' | 'pending';
  children?: TreeNodeData[];
}

function buildDynamicTreeFromDatabase(): TreeNodeData {
  const users = databaseService.getUsers();
  if (!users || users.length === 0) {
    return {
      id: 'DX-482917',
      name: 'سامان کریمیان',
      username: 'saman_karimian',
      sponsorName: 'ریشه شبکه تیجکس',
      sponsorId: 'TGEX-ROOT',
      placementName: 'شاخه اصلی سیستم هیبرید',
      placementId: 'ROOT',
      rank: 'Platinum Executive',
      level: 'ریشه سیستم',
      networkSize: 14,
      activeUsers: 13,
      inactiveUsers: 1,
      profitUsdt: 0,
      commissionUsdt: 0,
      status: 'active'
    };
  }

  // Apex Root is Saman Karimian (DX-482917) or first root user
  const rootUser = users.find(u => u.id === 'DX-482917') || users[0];
  const processedIds = new Set<string>();

  function buildNode(u: DbUserEntity): TreeNodeData {
    processedIds.add(u.id);
    // Find direct children whose placementParentId is u.id OR whose parent is missing and attach them to root
    const directChildren = users.filter(c => {
      if (processedIds.has(c.id)) return false;
      if (c.placementParentId === u.id) return true;
      // If root, also capture any unattached users
      if (u.id === rootUser.id && (!c.placementParentId || !users.some(p => p.id === c.placementParentId))) {
        return true;
      }
      return false;
    });

    const subtree = databaseService.getSubtreeUsers(u.id);
    const activeCount = subtree.filter(s => s.accountStatus === 'active').length + (u.accountStatus === 'active' ? 1 : 0);
    const inactiveCount = (subtree.length + 1) - activeCount;

    return {
      id: u.id,
      name: u.fullName,
      username: u.username,
      sponsorName: u.sponsorName || 'سامان کریمیان',
      sponsorId: u.sponsorId || 'DX-482917',
      placementName: u.placementName || `${u.fullName} (${u.placementSide === 'left' ? 'شاخه چپ' : 'شاخه راست'})`,
      placementId: u.placementParentId || 'ROOT',
      rank: u.rank,
      level: u.level,
      networkSize: users.length, // Global platform network size
      activeUsers: users.filter(usr => usr.accountStatus === 'active').length,
      inactiveUsers: users.filter(usr => usr.accountStatus !== 'active').length,
      profitUsdt: u.profitUsdt || 0,
      commissionUsdt: u.totalEarningsUsdt || 0,
      status: u.accountStatus,
      children: directChildren.length > 0 ? directChildren.map(c => buildNode(c)) : undefined
    };
  }

  return buildNode(rootUser);
}

interface AdminNetworkPageProps {
  onNavigate?: (page: PageId) => void;
  onSelectUserForDetail?: (userId: string) => void;
}

export const AdminNetworkPage: React.FC<AdminNetworkPageProps> = ({
  onNavigate,
  onSelectUserForDetail
}) => {
  const { dir } = useLanguage();

  const [treeData, setTreeData] = useState<TreeNodeData>(() => buildDynamicTreeFromDatabase());
  const [searchUserQuery, setSearchUserQuery] = useState('');
  const [selectedNode, setSelectedNode] = useState<TreeNodeData>(treeData);
  const [collapsedNodeIds, setCollapsedNodeIds] = useState<Set<string>>(new Set());
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const refreshTree = () => {
    const fresh = buildDynamicTreeFromDatabase();
    setTreeData(fresh);
    setSelectedNode(fresh);
  };

  useEffect(() => {
    const handleDbUpdate = () => refreshTree();
    window.addEventListener('tgex_database_updated', handleDbUpdate);
    window.addEventListener('tgex_db_updated', handleDbUpdate);
    return () => {
      window.removeEventListener('tgex_database_updated', handleDbUpdate);
      window.removeEventListener('tgex_db_updated', handleDbUpdate);
    };
  }, []);

  const toggleCollapse = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = new Set(collapsedNodeIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setCollapsedNodeIds(next);
  };

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -350, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 350, behavior: 'smooth' });
    }
  };

  const handleSearchNode = () => {
    const q = searchUserQuery.toLowerCase().trim();
    if (!q) return;

    const findInTree = (node: TreeNodeData): TreeNodeData | null => {
      if (
        node.name.toLowerCase().includes(q) ||
        node.username.toLowerCase().includes(q) ||
        node.id.toLowerCase().includes(q)
      ) {
        return node;
      }
      if (node.children) {
        for (const child of node.children) {
          const found = findInTree(child);
          if (found) return found;
        }
      }
      return null;
    };

    const result = findInTree(treeData);
    if (result) {
      setSelectedNode(result);
    }
  };

  const renderTreeCard = (node: TreeNodeData, depth: number = 0) => {
    const isSelected = selectedNode.id === node.id;
    const isCollapsed = collapsedNodeIds.has(node.id);
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.id} className="flex flex-col items-center shrink-0">
        
        {/* Node Card */}
        <div
          onClick={() => setSelectedNode(node)}
          className={`relative p-4 rounded-2xl border transition-all cursor-pointer w-64 shadow-xl select-none text-right ${
            isSelected
              ? 'bg-blue-600/25 border-blue-500 shadow-blue-500/25 ring-2 ring-blue-400'
              : 'bg-slate-900/95 border-white/10 hover:border-white/30 hover:bg-slate-800/90'
          }`}
        >
          {/* Status Indicator */}
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold">
              {node.id}
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 text-[9px] font-bold border border-amber-500/20">
              {node.rank}
            </span>
          </div>

          <div className="font-bold text-white text-xs truncate">{node.name}</div>
          <div className="text-[10px] text-slate-400 font-mono">@{node.username}</div>

          <div className="mt-3 pt-2.5 border-t border-white/5 grid grid-cols-2 gap-1 text-[10px]">
            <div>
              <span className="text-slate-500">سطح هیبرید:</span>
              <div className="text-blue-400 font-mono font-bold">{node.level}</div>
            </div>
            <div>
              <span className="text-slate-500">کل ساختار:</span>
              <div className="text-purple-300 font-mono font-bold">{node.networkSize} کاربر</div>
            </div>
          </div>

          {/* Expand/Collapse Handle */}
          {hasChildren && (
            <button
              onClick={(e) => toggleCollapse(node.id, e)}
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-slate-950 border border-white/20 text-slate-300 hover:text-white flex items-center justify-center text-xs shadow-md z-10"
              title={isCollapsed ? 'Expand Branches' : 'Collapse Branches'}
            >
              {isCollapsed ? '+' : '−'}
            </button>
          )}
        </div>

        {/* Children Branches */}
        {hasChildren && !isCollapsed && (
          <div className="flex flex-col items-center">
            {/* Vertical Connector */}
            <div className="w-0.5 h-6 bg-blue-500/50"></div>
            
            {/* Children Container with expansive spacing */}
            <div className="flex items-start gap-10 relative pt-2 px-4">
              {/* Horizontal top line connecting children */}
              {node.children!.length > 1 && (
                <div className="absolute top-0 left-32 right-32 h-0.5 bg-blue-500/50"></div>
              )}
              {node.children!.map((child) => renderTreeCard(child, depth + 1))}
            </div>
          </div>
        )}

      </div>
    );
  };

  return (
    <div className="space-y-6 pb-12 text-slate-200" dir={dir}>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono mb-2">
            <Network className="w-3.5 h-3.5" />
            <span>نظارت بر شجره‌نامه و ساختار هیبرید سازمان</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            درخت تعاملی سیستم هیبرید سازمان
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            ردیابی خطوط اسپانسر، جایگاه‌های استقرار، کاربران واقعی دیتابیس و اسکرول نامحدود افقی.
          </p>
        </div>

        <button
          onClick={refreshTree}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-2 transition"
        >
          <RefreshCw className="w-4 h-4" />
          <span>بروزرسانی درخت</span>
        </button>
      </div>

      {/* 1. SEARCH USER & INSPECTOR BAR */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="جستجوی کاربر بر اساس نام، نام کاربری یا شناسه برای تمرکز..."
              value={searchUserQuery}
              onChange={(e) => setSearchUserQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchNode()}
              className="w-full pl-3 pr-9 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            onClick={handleSearchNode}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow-lg shadow-blue-600/20"
          >
            جستجو و ردیابی
          </button>
        </div>

        {/* Selected User Lineage & Stats Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          
          {/* Card 1: Sponsor */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-white/5 space-y-1 text-xs">
            <div className="text-slate-400">اسپانسر مستقیم:</div>
            <div className="font-bold text-white">{selectedNode.sponsorName}</div>
            <div className="text-[10px] text-slate-500 font-mono">شناسه: {selectedNode.sponsorId}</div>
          </div>

          {/* Card 2: Rank & Level */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-white/5 space-y-1 text-xs">
            <div className="text-slate-400">سطح و رتبه سازمانی:</div>
            <div className="font-bold text-cyan-400">{selectedNode.rank}</div>
            <div className="text-[10px] text-blue-400 font-mono">سطح: {selectedNode.level}</div>
          </div>

          {/* Card 3: Network Breakdown */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-white/5 space-y-1 text-xs">
            <div className="text-slate-400">اعضای فعال / غیرفعال:</div>
            <div className="font-bold text-emerald-400 font-mono">{selectedNode.activeUsers} فعال</div>
            <div className="text-[10px] text-slate-400 font-mono">{selectedNode.inactiveUsers} غیرفعال</div>
          </div>

          {/* Card 4: Financial Status (Klix API Sync Ready) */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-white/5 space-y-1 text-xs">
            <div className="text-slate-400">سود و پورسانت تولید شده:</div>
            <div className="font-bold text-white font-mono" dir="ltr">0.00 USDT</div>
            <div className="text-[9px] text-blue-400 font-mono">اتصال به API وب‌سایت کلیکس</div>
          </div>

        </div>
      </div>

      {/* 2. INTERACTIVE TREE CANVAS WITH COMPLETE OVERFLOW-X SCROLLING */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-white/10 shadow-2xl relative flex flex-col space-y-4">
        
        {/* Canvas Controls Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4 z-20">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="font-bold text-xs text-white">درخت شبکه هیبرید جهانی</span>
          </div>

          {/* Scrolling & Zooming Navigation Bar */}
          <div className="flex items-center gap-2">
            
            {/* Direct Horizontal Scroll Buttons for 60+ users */}
            <div className="flex items-center gap-1 bg-slate-900 border border-white/10 rounded-xl p-1 text-xs">
              <button
                onClick={handleScrollRight}
                className="px-2.5 py-1 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white flex items-center gap-1 font-bold transition"
                title="اسکرول به راست"
              >
                <span>راست</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <div className="h-4 w-px bg-white/10"></div>
              <button
                onClick={handleScrollLeft}
                className="px-2.5 py-1 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white flex items-center gap-1 font-bold transition"
                title="اسکرول به چپ"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>چپ</span>
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1.5 bg-slate-900 border border-white/10 rounded-xl p-1 text-xs">
              <button
                onClick={() => setZoomLevel(Math.min(zoomLevel + 15, 150))}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white"
                title="بزرگنمایی"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <span className="px-2 font-mono text-[11px] text-slate-400">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel(Math.max(zoomLevel - 15, 60))}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white"
                title="کوچک‌نمایی"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomLevel(100)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white"
                title="بازنشانی زوم"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Scalable & Full Horizontal Scroll Canvas Container */}
        <div 
          ref={scrollContainerRef}
          className="w-full overflow-x-auto overflow-y-auto py-10 px-6 min-h-[480px] bg-slate-950/60 rounded-2xl border border-white/5 scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-slate-900"
          style={{ scrollBehavior: 'smooth' }}
        >
          <div 
            style={{ 
              transform: `scale(${zoomLevel / 100})`, 
              transformOrigin: 'top center',
              minWidth: 'max-content'
            }}
            className="transition-transform duration-200 inline-block px-12"
          >
            {renderTreeCard(treeData)}
          </div>
        </div>

        {/* Tree Legend & Helper Footer */}
        <div className="border-t border-white/10 pt-3 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400 z-20">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span>گره ریشه / شاخه اصلی هیبرید</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>رهبران و اعضای تایید شده</span>
            </span>
            <span className="flex items-center gap-1.5 text-cyan-400">
              <MoveHorizontal className="w-3.5 h-3.5" />
              <span>قابلیت اسکرول کامل افقی (Overflow-X)</span>
            </span>
          </div>
          <span>از دکمه‌های + و - روی کارت‌ها برای باز یا بسته کردن شاخه‌ها استفاده کنید.</span>
        </div>

      </div>

    </div>
  );
};
