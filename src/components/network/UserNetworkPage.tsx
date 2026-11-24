import React, { useState, useMemo, useEffect } from 'react';
import { User, PageId, NetworkTreeNode } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { 
  MOCK_SPONSOR_INFO, 
  MOCK_PLACEMENT_INFO,
  getUserNetworkTree 
} from '../../data/mockData';
import { databaseService } from '../../services/db/databaseService';
import { 
  Users, 
  UserCheck, 
  UserX, 
  UserPlus, 
  Search, 
  Filter, 
  ShieldCheck, 
  ChevronDown, 
  ChevronRight, 
  ChevronUp,
  Layers, 
  Award, 
  TrendingUp, 
  DollarSign, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Share2, 
  Info, 
  ArrowLeft,
  ArrowRight,
  GitBranch,
  Network,
  Maximize2,
  Lock,
  ExternalLink,
  ChevronLeft,
  Copy,
  Check
} from 'lucide-react';

interface UserNetworkPageProps {
  user: User;
  onNavigate: (page: PageId) => void;
}

export const UserNetworkPage: React.FC<UserNetworkPageProps> = ({ user, onNavigate }) => {
  const { t, language } = useLanguage();
  const isRtl = language === 'fa';

  const [dbTick, setDbTick] = useState(0);

  useEffect(() => {
    const handleDbUpdate = () => {
      setDbTick(prev => prev + 1);
    };
    window.addEventListener('tgex_database_updated', handleDbUpdate);
    window.addEventListener('tgex_db_updated', handleDbUpdate);
    return () => {
      window.removeEventListener('tgex_database_updated', handleDbUpdate);
      window.removeEventListener('tgex_db_updated', handleDbUpdate);
    };
  }, []);

  const relationalData = useMemo(() => {
    return databaseService.getUserRelationalData(user.id || user.email);
  }, [user.id, user.email, dbTick]);
  
  const totalNet = relationalData ? relationalData.totalNetworkCount : (user.totalNetworkCount ?? 0);
  const activeNet = relationalData ? relationalData.activeNetworkCount : (user.activeNetworkCount ?? 0);
  const inactiveNet = relationalData ? relationalData.inactiveNetworkCount : Math.max(0, totalNet - activeNet);
  const directNet = relationalData ? relationalData.directReferralsCount : (user.directReferralsCount ?? 0);
  const indirectNet = relationalData ? relationalData.indirectReferralsCount : Math.max(0, totalNet - directNet);
  const activityRate = totalNet > 0 ? ((activeNet / totalNet) * 100).toFixed(1) : '0';

  const userReferralCode = user.referralCode || relationalData?.user?.referralCode || (user.id ? user.id.replace('usr_', '').replace('DX-', '') : '482917635');
  const referralLink = `https://tgex.com/register?ref=${userReferralCode}`;

  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const copyToClipboard = (text: string, type: 'link' | 'code') => {
    try {
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(text).catch(() => {
          fallbackCopy(text);
        });
      } else {
        fallbackCopy(text);
      }
    } catch {
      fallbackCopy(text);
    }
    if (type === 'link') {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } else {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const fallbackCopy = (text: string) => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    } catch (e) {
      console.warn('Clipboard fallback error:', e);
    }
  };

  const activeUser = {
    ...user,
    fullName: user.fullName || relationalData?.user?.fullName || user.email?.split('@')[0] || (isRtl ? 'کاربر گرامی' : 'Valued User'),
    username: user.username || relationalData?.user?.username || user.email?.split('@')[0] || 'user',
    referralCode: userReferralCode,
    totalNetworkCount: totalNet,
    activeNetworkCount: activeNet,
    inactiveNetworkCount: inactiveNet,
    directReferralsCount: directNet,
    indirectReferralsCount: indirectNet,
    totalEarningsUsdt: relationalData ? relationalData.totalEarningsUsdt : (user.totalEarningsUsdt ?? 0),
    currentMonthEarningsUsdt: relationalData ? relationalData.currentMonthEarningsUsdt : (user.currentMonthEarningsUsdt ?? 0),
    networkProfitUsdt: relationalData ? relationalData.networkProfitUsdt : (user.networkProfitUsdt ?? 0),
    networkVolumeUsdt: relationalData ? relationalData.networkVolumeUsdt : (user.networkVolumeUsdt ?? 0),
    rankName: relationalData?.user?.rank || user.rankName || (isRtl ? 'عضو جدید (New Member)' : 'New Member'),
    networkLevel: relationalData?.user?.level || user.networkLevel || (isRtl ? 'سطح ۱ (Level A)' : 'Level A'),
    sponsorName: relationalData?.sponsorUser?.fullName || relationalData?.user?.sponsorName || user.sponsorName || (isRtl ? 'سامان کریمیان' : 'Saman Karimian'),
  };

  const sponsorDisplay = useMemo(() => {
    if (relationalData?.sponsorUser) {
      return {
        name: relationalData.sponsorUser.fullName,
        username: relationalData.sponsorUser.username,
        rank: relationalData.sponsorUser.rank,
        level: relationalData.sponsorUser.level,
        id: relationalData.sponsorUser.id
      };
    }
    return {
      name: user.sponsorName || MOCK_SPONSOR_INFO.name,
      username: 'saman_karimian',
      rank: 'رتبه طلایی (Gold)',
      level: 'سطح ۸ (Level H)',
      id: user.sponsorId || 'DX-482917'
    };
  }, [relationalData, user.sponsorName, user.sponsorId]);

  const placementDisplay = useMemo(() => {
    if (relationalData?.placementUser) {
      return {
        matrixNodeCode: relationalData.user?.placementParentId || user.placementParentId || 'TX-NODE-1001',
        parentName: relationalData.placementUser.fullName,
        parentUsername: relationalData.placementUser.username,
        side: relationalData.user?.placementSide === 'left' ? 'شاخه چپ (Left Branch)' : 'شاخه راست (Right Branch)',
        treeDepth: 2,
        description: isRtl 
          ? 'حساب کاربری شما مستقیماً در ساختار درختی شبکه تیجکس متصل و تثبیت شده است.' 
          : 'Your account is positioned within the Tgex tree network structure.'
      };
    }
    return {
      matrixNodeCode: user.placementParentId || 'TX-NODE-1001',
      parentName: 'سامان کریمیان',
      parentUsername: 'saman_karimian',
      side: 'شاخه راست (Right Branch)',
      treeDepth: 1,
      description: isRtl 
        ? 'حساب کاربری شما مستقیماً در ساختار درختی شبکه تیجکس متصل و تثبیت شده است.' 
        : 'Your account is positioned within the Tgex tree network structure.'
    };
  }, [relationalData, user.placementParentId, isRtl]);

  const networkTreeRoot = useMemo(() => {
    return databaseService.buildNetworkTree(user.id || user.email);
  }, [user.id, user.email, dbTick]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<string>('all');
  const [selectedRankFilter, setSelectedRankFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  
  // Selected node for inspection drawer
  const [selectedNode, setSelectedNode] = useState<NetworkTreeNode | null>(() => databaseService.buildNetworkTree(user.id || user.email));
  
  // Tree Zoom Level state
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  
  // Helper to determine relationship: root, direct, or indirect (not invited by you)
  const getNodeRelationship = (node: NetworkTreeNode): 'root' | 'direct' | 'indirect' => {
    if (node.id === networkTreeRoot.id || node.id === 'usr_root' || node.id === activeUser.id) {
      return 'root';
    }
    // Direct children of the active user / root
    if (
      node.sponsorId === 'usr_root' ||
      node.sponsorId === activeUser.id ||
      node.sponsorName === 'سامان کریمیان' ||
      node.sponsorName === activeUser.fullName ||
      ['usr_c1', 'usr_c2', 'usr_c3', 'usr_c4', 'usr_c5'].includes(node.id)
    ) {
      return 'direct';
    }
    // Not directly invited by you (invited by someone else in your sub-branch)
    return 'indirect';
  };

  // Flatten tree for list/search filtering
  const flattenTree = (node: NetworkTreeNode): NetworkTreeNode[] => {
    let list: NetworkTreeNode[] = [node];
    if (node.children) {
      for (const child of node.children) {
        list = list.concat(flattenTree(child));
      }
    }
    return list;
  };

  const allNetworkNodes = useMemo(() => {
    return flattenTree(networkTreeRoot);
  }, [networkTreeRoot]);

  // Expanded nodes set for tree and mobile list
  const [expandedNodeIds, setExpandedNodeIds] = useState<Set<string>>(
    new Set(allNetworkNodes.map(n => n.id))
  );

  const toggleNodeExpansion = (id: string) => {
    setExpandedNodeIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAllNodes = () => {
    setExpandedNodeIds(new Set(allNetworkNodes.map(n => n.id)));
  };

  const collapseAllNodes = () => {
    setExpandedNodeIds(new Set([networkTreeRoot.id]));
  };

  // Filtered members list
  const filteredNodes = useMemo(() => {
    return allNetworkNodes.filter((item) => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.placementId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sponsorName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesLevel = selectedLevelFilter === 'all' || item.levelLetter === selectedLevelFilter;
      const matchesRank = selectedRankFilter === 'all' || item.rank.includes(selectedRankFilter);
      const matchesStatus = selectedStatusFilter === 'all' || item.status === selectedStatusFilter;

      return matchesSearch && matchesLevel && matchesRank && matchesStatus;
    });
  }, [allNetworkNodes, searchQuery, selectedLevelFilter, selectedRankFilter, selectedStatusFilter]);

  // Render a single tree node recursively
  const renderTreeNode = (node: NetworkTreeNode, depth = 0) => {
    const isExpanded = expandedNodeIds.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = selectedNode?.id === node.id;
    const relationship = getNodeRelationship(node);

    return (
      <div key={node.id} className="flex flex-col items-center flex-shrink-0">
        {/* The Node Card */}
        <div
          onClick={() => setSelectedNode(node)}
          className={`relative p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer select-none text-right flex flex-col justify-between w-64 sm:w-72 backdrop-blur-md shadow-xl ${
            isSelected
              ? 'bg-blue-900/80 border-blue-400 ring-2 ring-blue-500/50 shadow-blue-500/30'
              : node.status === 'active'
              ? 'bg-slate-900/90 hover:bg-slate-800/95 border-white/15 hover:border-blue-500/40'
              : 'bg-slate-950/80 border-rose-500/20 opacity-80'
          }`}
        >
          {/* Top Row: Level Pill & Direct / Indirect Badge */}
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="px-2 py-0.5 rounded-lg bg-blue-500/25 text-blue-300 font-mono text-[10px] font-bold">
                L{node.levelNumber} ({node.levelLetter})
              </span>
              {relationship === 'root' ? (
                <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {t('dash.network.rel_root')}
                </span>
              ) : relationship === 'direct' ? (
                <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {t('dash.network.rel_direct')}
                </span>
              ) : (
                <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {t('dash.network.rel_indirect')}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${node.status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`}></span>
              <span className={`text-[10px] font-bold ${node.status === 'active' ? 'text-emerald-400' : 'text-rose-400'}`}>
                {node.status === 'active' ? t('dash.network.status_active') : t('dash.network.status_inactive')}
              </span>
            </div>
          </div>

          {/* Middle Info */}
          <div className="py-2.5 space-y-1">
            <div className="flex items-center justify-between gap-2">
              <span className="font-black text-white text-xs sm:text-sm truncate">
                {node.name}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30 truncate max-w-[110px]">
                {node.rank}
              </span>
            </div>
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-blue-400 font-mono">@{node.username}</span>
              {relationship === 'indirect' && (
                <span className="text-slate-400 text-[9px] truncate max-w-[110px]">
                  {t('common.sponsor')}: {node.sponsorName}
                </span>
              )}
            </div>
          </div>

          {/* Bottom Stats Metric */}
          <div className="pt-2 border-t border-white/10 grid grid-cols-2 gap-2 text-[11px] text-slate-300">
            <div>
              <span className="text-slate-400">{t('dash.network.members_count')}: </span>
              <strong className="text-white font-mono">{node.networkSize} {isRtl ? 'کاربر' : 'Users'}</strong>
            </div>
            <div className={isRtl ? 'text-left' : 'text-right'} dir="ltr">
              <span className="text-slate-400">{t('dash.network.table.volume')}: </span>
              <strong className="text-emerald-400 font-mono">${node.networkVolumeUsdt.toLocaleString()} USDT</strong>
            </div>
          </div>

          {/* Expand/Collapse Child Trigger Button */}
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleNodeExpansion(node.id);
              }}
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-slate-800 border border-blue-500/50 hover:bg-blue-600 text-white flex items-center justify-center text-xs font-bold transition shadow-lg z-10"
            >
              {isExpanded ? '−' : '+'}
            </button>
          )}
        </div>

        {/* Tree Branch Connector & Sub-branches */}
        {hasChildren && isExpanded && (
          <div className="flex flex-col items-center w-full mt-4">
            {/* Vertical connector from parent */}
            <div className="w-0.5 h-6 bg-blue-500/50"></div>

            {/* Horizontal distribution line if multiple children */}
            {node.children!.length > 1 && (
              <div className="w-full max-w-[92%] h-0.5 bg-blue-500/50 relative"></div>
            )}

            {/* Children grid */}
            <div className="flex items-start justify-center gap-6 sm:gap-10 pt-4 flex-nowrap">
              {node.children!.map((child) => (
                <div key={child.id} className="relative flex flex-col items-center flex-shrink-0">
                  {/* Vertical connector down to child */}
                  <div className="w-0.5 h-4 bg-blue-500/50 -mt-4 mb-2"></div>
                  {renderTreeNode(child, depth + 1)}
                </div>
              ))}
            </div>
          </div>
        )}

        {!hasChildren && depth === 0 && (
          <div className="flex flex-col items-center pt-3 text-center">
            <div className="w-0.5 h-6 bg-slate-700/60 mb-2"></div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-dashed border-white/15 max-w-sm text-xs text-slate-400 space-y-1">
              <span className="font-bold text-slate-300 block">
                {isRtl ? 'در حال حاضر هیچ کاربری به شبکه شما متصل نشده است' : 'No downline members connected yet'}
              </span>
              <p className="text-[11px] text-slate-500">
                {isRtl ? 'با اشتراک‌گذاری کد و لینک دعوت خود، کاربران ثبت‌نامی مستقیماً در زیرمجموعه درختی شما قرار خواهند گرفت.' : 'Share your referral code to grow your network.'}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`space-y-8 py-6 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full min-w-0 overflow-hidden text-slate-200 ${isRtl ? 'font-vazir' : ''}`} dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* PAGE BREADCRUMB & HEADER */}
      <div className="border-b border-white/10 pb-6">
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
          <button onClick={() => onNavigate('dashboard')} className="hover:text-white transition cursor-pointer">{t('dash.network.breadcrumb')}</button>
          {isRtl ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          <span className="text-blue-400 font-bold">{t('dash.sidebar.network')}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
          <GitBranch className="w-7 h-7 text-blue-400 shrink-0" />
          <span>{t('dash.network.page_title')}</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          {t('dash.network.page_desc')}
        </p>
      </div>

      {/* 5 TOP SUMMARY KPI METRIC CARDS - Fully Responsive Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 w-full min-w-0">
        
        <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/60 border border-white/10 space-y-2 min-w-0">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="truncate">{t('dash.network.stats.total')}</span>
            <Users className="w-4 h-4 text-blue-400 shrink-0" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono truncate">
            {activeUser.totalNetworkCount.toLocaleString(isRtl ? 'fa-IR' : 'en-US')}
          </div>
          <div className="text-[10px] text-blue-400 font-mono truncate">
            {t('dash.network.stats.network_size_hint')}
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/60 border border-cyan-500/20 space-y-2 min-w-0">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="truncate">{t('dash.network.rel_direct')}</span>
            <UserPlus className="w-4 h-4 text-cyan-400 shrink-0" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono truncate">
            {activeUser.directReferralsCount.toLocaleString(isRtl ? 'fa-IR' : 'en-US')}
          </div>
          <div className="text-[10px] text-cyan-400/80 truncate">
            {t('dash.network.stats.direct_hint')}
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/60 border border-purple-500/20 space-y-2 min-w-0">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="truncate">{t('dash.network.stats.indirect')}</span>
            <Network className="w-4 h-4 text-purple-400 shrink-0" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-400 font-mono truncate">
            {(activeUser.totalNetworkCount - activeUser.directReferralsCount).toLocaleString(isRtl ? 'fa-IR' : 'en-US')}
          </div>
          <div className="text-[10px] text-purple-300/80 truncate">
            {t('dash.network.stats.indirect_hint')}
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/60 border border-emerald-500/20 space-y-2 min-w-0">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="truncate">{t('dash.network.stats.active')}</span>
            <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono truncate">
            {activeUser.activeNetworkCount.toLocaleString(isRtl ? 'fa-IR' : 'en-US')}
          </div>
          <div className="text-[10px] text-emerald-400/80 font-mono truncate">
            {t('dash.network.stats.active_hint').replace('{rate}', activityRate)}
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/60 border border-white/10 space-y-2 min-w-0 col-span-2 sm:col-span-1 md:col-span-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="truncate">{t('dash.network.stats.inactive')}</span>
            <UserX className="w-4 h-4 text-slate-400 shrink-0" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-300 font-mono truncate">
            {activeUser.inactiveNetworkCount.toLocaleString(isRtl ? 'fa-IR' : 'en-US')}
          </div>
          <div className="text-[10px] text-slate-500 truncate">
            {t('dash.network.stats.inactive_hint')}
          </div>
        </div>

      </div>

      {/* SPONSOR & REFERRAL CONNECTION CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full min-w-0">
        
        {/* SPONSOR CARD */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900/90 to-slate-950 border border-blue-500/20 space-y-4 shadow-xl min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold font-mono shrink-0">
                SP
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-white truncate">{t('dash.network.sponsor.title')}</h3>
                <span className="text-[11px] text-slate-400 truncate block">{t('dash.network.sponsor.desc')}</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold shrink-0">
              {t('dash.network.sponsor.active')}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/5 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">{t('dash.network.sponsor.name')}</span>
              <span className="font-bold text-white truncate">{sponsorDisplay.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">{t('dash.network.sponsor.username')}</span>
              <span className="font-mono text-blue-400 font-bold truncate">@{sponsorDisplay.username}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">{t('dash.network.sponsor.rank')}</span>
              <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-bold border border-amber-500/20">
                {sponsorDisplay.rank}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">{t('dash.network.sponsor.level')}</span>
              <span className="font-mono text-white">{sponsorDisplay.level}</span>
            </div>
          </div>
        </div>

        {/* YOUR REFERRAL & CONNECTION SUMMARY CARD */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-900/95 to-slate-950 border border-cyan-500/30 space-y-4 shadow-xl min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold font-mono shrink-0">
                REF
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-white truncate">{isRtl ? 'کد معرف و لینک دعوت شما' : 'Your Referral & Invite Link'}</h3>
                <span className="text-[11px] text-slate-400 truncate block">{isRtl ? 'مشخصات اختصاصی دعوت شما' : 'Your exclusive invitation details'}</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-bold font-mono shrink-0">
              {activeUser.referralCode}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/5 space-y-3.5 text-xs">
            {/* Direct Referral Code Row with Copy Button */}
            <div className="space-y-1.5 min-w-0">
              <span className="text-slate-400 text-[11px] block">{isRtl ? 'کد معرف اختصاصی شما:' : 'Your Referral Code:'}</span>
              <div className="flex items-center gap-2 min-w-0">
                <input
                  type="text"
                  readOnly
                  value={activeUser.referralCode}
                  dir="ltr"
                  className="w-full min-w-0 bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-sm font-mono font-bold text-emerald-400 focus:outline-none truncate"
                />
                <button
                  type="button"
                  onClick={() => copyToClipboard(activeUser.referralCode, 'code')}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 border border-white/10 transition cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-300" />}
                  <span>{copiedCode ? (isRtl ? 'کپی شد' : 'Copied') : (isRtl ? 'کپی کد' : 'Copy Code')}</span>
                </button>
              </div>
            </div>

            {/* Direct Referral Link Row with Copy Button */}
            <div className="space-y-1.5 min-w-0">
              <span className="text-slate-400 text-[11px] block">{isRtl ? 'لینک دعوت اختصاصی شما:' : 'Your Direct Invite Link:'}</span>
              <div className="flex items-center gap-2 min-w-0">
                <input
                  type="text"
                  readOnly
                  value={referralLink}
                  dir="ltr"
                  className="w-full min-w-0 bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-cyan-300 focus:outline-none truncate"
                />
                <button
                  type="button"
                  onClick={() => copyToClipboard(referralLink, 'link')}
                  className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 transition cursor-pointer"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5 text-white" />}
                  <span>{copiedLink ? (isRtl ? 'کپی شد' : 'Copied') : (isRtl ? 'کپی لینک' : 'Copy Link')}</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <span className="text-slate-400">{isRtl ? 'تعداد افراد دعوت‌شده مستقیم:' : 'Direct Referrals Count:'}</span>
              <span className="font-bold text-cyan-300 font-mono">{activeUser.directReferralsCount} {isRtl ? 'نفر' : 'Users'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">{isRtl ? 'سطح سازمانی شبکه:' : 'Your Network Tier:'}</span>
              <span className="font-mono text-white font-bold">{activeUser.networkLevel}</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed pt-2 border-t border-white/5">
              {isRtl 
                ? 'کلیه کاربرانی که با کد معرف یا لینک دعوت شما ثبت‌نام نمایند، به طور مستقیم و خودکار در ساختار زیرمجموعه شما قرار می‌گیرند.'
                : 'All users registered with your referral code or link are automatically connected directly under your hierarchy tree.'}
            </p>
          </div>
        </div>

      </div>

      {/* CLARIFICATION CALLOUT BANNER */}
      <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-500/30 text-xs text-blue-200 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-white block font-bold mb-0.5">
            {isRtl ? 'سیستم یکپارچه معرفی و اتصالات درختی:' : 'Unified Referral and Network Placement System:'}
          </strong>
          {isRtl 
            ? 'در سیستم TGEX، کلیه اتصالات بر اساس کد معرف (Referral Code) سازماندهی می‌شوند. وقتی کاربری را به پلتفرم دعوت می‌کنید، او مستقیماً در زیرمجموعه شما قرار می‌گیرد و پورسانت‌های ماتریس و پاداش‌های ارتقاء رتبه به صورت خودکار محاسبه و واریز می‌گردد.'
            : 'In TGEX, all network connections are unified based on your Referral Code. When you invite new users, they are automatically placed under your tier in the hierarchy, with commissions and leadership pool shares calculated automatically.'}
        </div>
      </div>

      {/* SEARCH & FILTERS BAR */}
      <div className="p-5 rounded-3xl bg-slate-900/60 border border-white/10 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder={isRtl ? 'جستجوی نام، نام‌کاربری یا شناسه/کد معرف...' : 'Search name, username or referral ID...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full bg-slate-950 border border-white/10 rounded-xl ${isRtl ? 'px-3.5 pr-10' : 'px-3.5 pl-10'} py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500`}
            />
            <Search className={`w-4 h-4 text-slate-500 absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2`} />
          </div>

          {/* Filter Selects */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            
            {/* Level Filter */}
            <select
              value={selectedLevelFilter}
              onChange={(e) => setSelectedLevelFilter(e.target.value)}
              className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option value="all">{t('dash.network.all_levels')}</option>
              <option value="A">{isRtl ? 'سطح A (Level 1)' : 'Level A (Tier 1)'}</option>
              <option value="B">{isRtl ? 'سطح B (Level 2)' : 'Level B (Tier 2)'}</option>
              <option value="C">{isRtl ? 'سطح C (Level 3)' : 'Level C (Tier 3)'}</option>
              <option value="D">{isRtl ? 'سطح D (Level 4)' : 'Level D (Tier 4)'}</option>
              <option value="E">{isRtl ? 'سطح E (Level 5)' : 'Level E (Tier 5)'}</option>
              <option value="F">{isRtl ? 'سطح F (Level 6)' : 'Level F (Tier 6)'}</option>
              <option value="G">{isRtl ? 'سطح G (Level 7)' : 'Level G (Tier 7)'}</option>
              <option value="H">{isRtl ? 'سطح H (Level 8)' : 'Level H (Tier 8)'}</option>
            </select>

            {/* Rank Filter */}
            <select
              value={selectedRankFilter}
              onChange={(e) => setSelectedRankFilter(e.target.value)}
              className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option value="all">{t('dash.network.all_ranks')}</option>
              <option value="عضو">{isRtl ? 'عضو رسمی' : 'Official Member'}</option>
              <option value="برنزی">{isRtl ? 'برنزی (Bronze)' : 'Bronze Member'}</option>
              <option value="نقره‌ای">{isRtl ? 'نقره‌ای (Silver)' : 'Silver Member'}</option>
              <option value="طلایی">{isRtl ? 'طلایی (Gold)' : 'Gold Member'}</option>
              <option value="الماس">{isRtl ? 'الماس (Diamond)' : 'Diamond Leader'}</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option value="all">{t('dash.network.all_statuses')}</option>
              <option value="active">{isRtl ? 'فقط فعال‌ها' : 'Active Only'}</option>
              <option value="inactive">{isRtl ? 'غیرفعال‌ها' : 'Inactive Only'}</option>
            </select>

            {(searchQuery || selectedLevelFilter !== 'all' || selectedRankFilter !== 'all' || selectedStatusFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedLevelFilter('all');
                  setSelectedRankFilter('all');
                  setSelectedStatusFilter('all');
                }}
                className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs whitespace-nowrap transition"
              >
                {isRtl ? 'پاک‌سازی فیلترها' : 'Clear Filters'}
              </button>
            )}

          </div>

        </div>
      </div>

      {/* INTERACTIVE TREE CANVAS CONTAINER (Google Sheets / Infinite Canvas Style) */}
      <div className="hidden md:block p-6 rounded-3xl bg-slate-950/95 border border-white/15 relative overflow-hidden shadow-2xl">
        
        {/* Tree Control Bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-ping"></span>
            <span className="font-bold text-sm text-white">
              {isRtl ? 'نمای گرافیکی زنده ماتریس شبکه' : 'Live Network Matrix Graphical View'}
            </span>
            <span className="text-xs text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md font-mono">
              Zoom: {Math.round(zoomLevel * 100)}%
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={expandAllNodes}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/10 text-xs font-bold transition flex items-center gap-1.5"
            >
              <ChevronDown className="w-3.5 h-3.5 text-blue-400" />
              <span>{isRtl ? 'گسترش همه' : 'Expand All'}</span>
            </button>
            <button
              onClick={collapseAllNodes}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/10 text-xs font-bold transition flex items-center gap-1.5"
            >
              <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
              <span>{isRtl ? 'بستن لایه‌ها' : 'Collapse Layers'}</span>
            </button>

            <div className="h-4 w-px bg-white/10 mx-1"></div>

            <button
              onClick={() => setZoomLevel((prev) => Math.min(Number((prev + 0.1).toFixed(1)), 1.5))}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/10 transition"
              title="بزرگ‌نمایی (+)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel((prev) => Math.max(Number((prev - 0.1).toFixed(1)), 0.5))}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/10 transition"
              title="کوچک‌نمایی (-)"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/10 text-xs font-mono font-bold transition flex items-center gap-1"
              title="بازنشانی اندازه (100%)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>100%</span>
            </button>
          </div>
        </div>

        {/* Scrollable Canvas Container */}
        <div className="overflow-auto max-h-[720px] min-h-[520px] rounded-2xl bg-gradient-to-b from-[#03060c] to-[#080d1a] border border-white/5 p-4 custom-scrollbar">
          <div 
            className="min-w-[1950px] min-h-[650px] p-8 flex items-start justify-center"
            style={{ 
              transform: `scale(${zoomLevel})`, 
              transformOrigin: 'top center',
              transition: 'transform 0.15s ease-out'
            }}
          >
            {renderTreeNode(networkTreeRoot)}
          </div>
        </div>

      </div>

      {/* MOBILE / RESPONSIVE EXPANDABLE CARDS & SEARCH RESULTS LIST */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">
              {searchQuery || selectedLevelFilter !== 'all' || selectedRankFilter !== 'all' || selectedStatusFilter !== 'all'
                ? `نتایج جستجو و فیلتر (${filteredNodes.length} کاربر)`
                : 'فهرست تعاملی اعضای شبکه (Expandable List)'}
            </h3>
            <p className="text-xs text-slate-400">نمایش بهینه ساختار سلسله‌مراتبی با کارت‌های بازشونده</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredNodes.map((member) => {
            const memberRel = getNodeRelationship(member);
            return (
              <div
                key={member.id}
                onClick={() => setSelectedNode(member)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                  selectedNode?.id === member.id
                    ? 'bg-blue-950/80 border-blue-400 ring-1 ring-blue-400 shadow-lg shadow-blue-500/10'
                    : 'bg-slate-900/70 hover:bg-slate-800/80 border-white/10'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-300 border border-blue-500/20 flex items-center justify-center font-black text-sm font-mono flex-shrink-0">
                      {member.name[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-xs sm:text-sm">{member.name}</h4>
                      <span className="text-[10px] text-blue-400 font-mono block">@{member.username}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      member.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                    }`}>
                      {member.status === 'active' ? 'فعال' : 'غیرفعال'}
                    </span>
                    {memberRel === 'root' ? (
                      <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        جایگاه شما (You)
                      </span>
                    ) : memberRel === 'direct' ? (
                      <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        معرفی مستقیم (Direct)
                      </span>
                    ) : (
                      <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        توسط شما دعوت نشده
                      </span>
                    )}
                  </div>
                </div>

                {memberRel === 'indirect' && (
                  <div className="text-[10px] text-slate-400 bg-slate-950/60 px-2.5 py-1 rounded-lg border border-white/5 flex items-center justify-between">
                    <span>اسپانسر / معرف:</span>
                    <strong className="text-slate-200">{member.sponsorName}</strong>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5 text-[10px]">
                  <div>
                    <span className="text-slate-500 block">سطح:</span>
                    <span className="font-bold text-blue-400 font-mono">Level {member.levelLetter}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">رتبه:</span>
                    <span className="font-bold text-amber-300 truncate block">{member.rank}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">اعضای تیم:</span>
                    <span className="font-mono text-white font-bold">{member.networkSize}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-white/5 text-[10px] text-slate-400 font-mono">
                  <span>شناسه: {member.id}</span>
                  <span className="text-emerald-400 font-bold">${member.networkVolumeUsdt.toLocaleString()} USDT</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* INSPECTED NODE DETAILS DRAWER / MODAL */}
      {selectedNode && (() => {
        const selectedRel = getNodeRelationship(selectedNode);
        return (
          <div className="p-6 rounded-3xl bg-slate-900/95 border border-blue-500/40 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold text-base font-mono shadow-md shadow-blue-500/20 flex-shrink-0">
                  {selectedNode.name[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-black text-white">{selectedNode.name}</h3>
                    <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-mono font-bold">
                      {isRtl ? `Level ${selectedNode.levelLetter} (لایه ${selectedNode.levelNumber})` : `Level ${selectedNode.levelLetter} (Layer ${selectedNode.levelNumber})`}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                      {selectedNode.rank}
                    </span>
                    {selectedRel === 'root' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        {t('dash.network.rel_root')}
                      </span>
                    ) : selectedRel === 'direct' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {t('dash.network.rel_direct')}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {t('dash.network.rel_indirect')}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 font-mono">@{selectedNode.username} • {isRtl ? 'شناسه:' : 'User ID:'} {selectedNode.id}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedNode(null)}
                className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-xl bg-slate-800 border border-white/10 transition"
              >
                {t('dash.network.close_inspector')}
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-white/5 space-y-1">
                <span className="text-slate-500 text-[10px]">{isRtl ? 'وضعیت فعالیت:' : 'Activity Status:'}</span>
                <div className={`font-bold flex items-center gap-1.5 ${selectedNode.status === 'active' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  <span className={`w-2 h-2 rounded-full ${selectedNode.status === 'active' ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
                  {selectedNode.status === 'active' ? (isRtl ? 'فعال در کپی ترید' : 'Active Trading') : (isRtl ? 'غیرفعال' : 'Inactive')}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-white/5 space-y-1">
                <span className="text-slate-500 text-[10px]">{isRtl ? 'مجموع اعضای زیرشبکه:' : 'Total Sub-network:'}</span>
                <div className="text-base font-black text-white font-mono">{selectedNode.networkSize.toLocaleString(isRtl ? 'fa-IR' : 'en-US')} {isRtl ? 'کاربر' : 'Users'}</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-white/5 space-y-1">
                <span className="text-slate-500 text-[10px]">{isRtl ? 'حجم کل معاملات تیمی:' : 'Total Team Volume:'}</span>
                <div className="text-base font-black text-emerald-400 font-mono" dir="ltr">
                  ${selectedNode.networkVolumeUsdt.toLocaleString()} USDT
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-white/5 space-y-1">
                <span className="text-slate-500 text-[10px]">{isRtl ? 'اسپانسر مستقیم:' : 'Direct Sponsor:'}</span>
                <div className="font-bold text-white truncate">{selectedNode.sponsorName}</div>
              </div>
            </div>

            {selectedRel === 'indirect' ? (
              <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-[11px] text-purple-200 leading-relaxed">
                <strong>{isRtl ? 'توجه ساختاری:' : 'Structural Note:'}</strong> {isRtl 
                  ? `این کاربر توسط «${selectedNode.sponsorName}» به شبکه دعوت شده است و توسط شما دعوت نشده؛ با این حال به عنوان زیرمجموعه لایه ${selectedNode.levelLetter} (سطح ${selectedNode.levelNumber}) در ساختار ماتریسی شما قرار دارد و پورسانت لایه‌ای معاملات تیمی آن به حساب شما منظور می‌گردد.`
                  : `This user was invited by "${selectedNode.sponsorName}" and not directly by you; however, they are positioned as a Layer ${selectedNode.levelLetter} (Level ${selectedNode.levelNumber}) sub-member in your matrix structure, and their team trading commissions accrue to your account.`}
              </div>
            ) : selectedRel === 'direct' ? (
              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-[11px] text-emerald-200 leading-relaxed">
                <strong>{isRtl ? 'معرفی مستقیم:' : 'Direct Referral:'}</strong> {isRtl 
                  ? 'این کاربر مستقیماً با کد دعوت شما ثبت‌نام کرده و پاداش مستقیم سطح ۱ به همراه کارمزد معاملات لایه‌ای به شما تعلق می‌گیرد.'
                  : 'This user registered directly with your referral code. You receive Level 1 direct rewards along with tiered trading commissions.'}
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-500/30 text-[11px] text-blue-200 leading-relaxed">
                <strong>{isRtl ? 'جایگاه اختصاصی شما:' : 'Your Root Account:'}</strong> {isRtl 
                  ? 'این حساب ریشه اصلی شبکه شماست و کارمزد حاصل از کلیه لایه‌های زیرمجموعه تا سطح ۲۰ به این حساب واریز می‌شود.'
                  : 'This account is the root of your network. Commissions from all sub-layers up to level 20 are deposited into this account.'}
              </div>
            )}
          </div>
        );
      })()}

      {/* SECURITY & DATA PRIVACY ASSURANCE */}
      <div className={`p-5 rounded-3xl bg-slate-950 border border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 ${isRtl ? 'text-right' : 'text-left'}`}>
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-emerald-400 flex-shrink-0" />
          <div className="leading-relaxed">
            <strong className="text-white block font-bold">
              {isRtl ? 'امنیت و حریم خصوصی داده‌های شبکه:' : 'Network Data Security & Privacy:'}
            </strong>
            {isRtl 
              ? 'تنها اطلاعات مجاز شبکه‌ای (نام مستعار، رتبه، سطح و شاخص‌های آماری فعالیت) در این نما قابل رویت هستند. اطلاعات هویتی KYC، پسوردها و موجودی‌های کیف‌پول خصوصی تحت هیچ شرایطی به اشتراک گذاشته نمی‌شوند.'
              : 'Only authorized network information (pseudonym, rank, level, and performance metrics) are visible here. KYC identity data, passwords, and private wallet balances are never shared under any circumstances.'}
          </div>
        </div>
      </div>

    </div>
  );
};
