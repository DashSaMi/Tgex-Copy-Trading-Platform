import fs from 'fs';

let content = fs.readFileSync('src/components/rank/UserRankPage.tsx', 'utf8');

// Replace progress.overallProgressPercent with safe fallback
content = content.replace(/progress\.overallProgressPercent\.toLocaleString/g, '(progress?.overallProgressPercent || 0).toLocaleString');

// Replace metric properties with safe fallbacks
content = content.replace(/metric\.percent\.toLocaleString/g, '(metric?.percent || 0).toLocaleString');
content = content.replace(/metric\.current\.toLocaleString/g, '(metric?.current ?? 0).toLocaleString');
content = content.replace(/metric\.required\.toLocaleString/g, '(metric?.required ?? 0).toLocaleString');

// Replace rank properties with safe fallbacks
content = content.replace(/rank\.requiredCapital\.toLocaleString/g, '(rank?.requiredCapital ?? 0).toLocaleString');
content = content.replace(/rank\.requiredDirectActive\.toLocaleString/g, '(rank?.requiredDirectActive ?? 0).toLocaleString');
content = content.replace(/rank\.requiredTeamAum\.toLocaleString/g, '(rank?.requiredTeamAum ?? 0).toLocaleString');
content = content.replace(/rank\.leadershipPoolSharePercent\.toLocaleString/g, '(rank?.leadershipPoolSharePercent ?? 0).toLocaleString');

// Fix selectedRankDetail modal requirements rendering in UserRankPage.tsx
const oldSelectedRankStats = `              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <span className="text-slate-400 block mb-1">{t('dash.rank.total_network_volume')}:</span>
                <span className="font-bold text-emerald-400 font-mono" dir={isRtl ? 'rtl' : 'ltr'}>
                  {isRtl ? '' : '$'}{selectedRankDetail.requiredNetworkVolumeUsdt.toLocaleString(isRtl ? 'fa-IR' : 'en-US')}{isRtl ? ' دلار' : ' USDT'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <span className="text-slate-400 block mb-1">{t('dash.rank.required_active_members')}:</span>
                <span className="font-bold text-cyan-400 font-mono">
                  {selectedRankDetail.requiredActiveUsers.toLocaleString(isRtl ? 'fa-IR' : 'en-US')} {t('dash.rank.person_unit')}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <span className="text-slate-400 block mb-1">{t('dash.rank.required_direct_qualified')}:</span>
                <span className="font-bold text-purple-400 font-mono">
                  {selectedRankDetail.requiredDirectQualified.toLocaleString(isRtl ? 'fa-IR' : 'en-US')} {t('dash.rank.active_users_unit')}
                </span>
              </div>`;

const newSelectedRankStats = `              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <span className="text-slate-400 block mb-1">{isRtl ? 'حداقل سرمایه فعال:' : 'Min Active Capital:'}</span>
                <span className="font-bold text-emerald-400 font-mono" dir={isRtl ? 'rtl' : 'ltr'}>
                  {isRtl ? '' : '$'}{(selectedRankDetail.requiredCapital ?? 50).toLocaleString(isRtl ? 'fa-IR' : 'en-US')}{isRtl ? ' دلار' : ' USDT'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <span className="text-slate-400 block mb-1">{isRtl ? 'حداقل معرفی مستقیم:' : 'Min Direct Active:'}</span>
                <span className="font-bold text-cyan-400 font-mono">
                  {(selectedRankDetail.requiredDirectActive ?? 0).toLocaleString(isRtl ? 'fa-IR' : 'en-US')} {t('dash.rank.person_unit')}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <span className="text-slate-400 block mb-1">{isRtl ? 'حداقل حجم AUM تیم:' : 'Min Team AUM:'}</span>
                <span className="font-bold text-purple-400 font-mono">
                  ${(selectedRankDetail.requiredTeamAum ?? 0).toLocaleString(isRtl ? 'fa-IR' : 'en-US')}
                </span>
              </div>`;

if (content.includes('selectedRankDetail.requiredNetworkVolumeUsdt')) {
  content = content.replace(oldSelectedRankStats, newSelectedRankStats);
}

fs.writeFileSync('src/components/rank/UserRankPage.tsx', content, 'utf8');
console.log('UserRankPage.tsx updated successfully with safe toLocaleString and correct rank properties.');
