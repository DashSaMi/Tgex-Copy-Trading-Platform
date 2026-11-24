import fs from 'fs';

let content = fs.readFileSync('src/components/rank/UserRankPage.tsx', 'utf8');

// Replace the hardcoded 4 metrics render with a loop over progress.metrics
const metricsStart = content.indexOf('{/* 2. PROGRESS METRICS GRID */}');
const metricsEnd = content.indexOf('{/* 3. ALL RANKS ROADMAP (Server Configured Tiers) */}');

if (metricsStart !== -1 && metricsEnd !== -1) {
  const newMetrics = `{/* 2. PROGRESS METRICS GRID */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-white/10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-400" />
              <span>{t('dash.rank.progress_indicators_title') || 'شاخص‌های پیشرفت و پیش‌نیازهای ارتقا'}</span>
            </h2>
            <p className="text-xs text-slate-400">
              {t('dash.rank.progress_indicators_subtitle') || 'بررسی دقیق وضعیت پیش‌نیازهای کلیدی احراز رتبه با محاسبات سرور'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {progress.metrics.map((metric, idx) => (
            <div key={metric.id} className="p-5 rounded-2xl bg-slate-950/70 border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <div className="w-5 h-5 rounded bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs">
                    {idx + 1}
                  </div>
                  <span>{isRtl ? metric.farsiName : metric.name}</span>
                </div>
                <span className={\`px-2.5 py-0.5 rounded-full text-[10px] font-bold \${
                  metric.achieved ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                }\`}>
                  {metric.percent.toLocaleString(isRtl ? 'fa-IR' : 'en-US')}% {t('dash.rank.completed_short') || 'تکمیل'}
                </span>
              </div>

              <div className="flex justify-between text-xs text-slate-400 font-mono">
                <span>{t('dash.rank.current') || 'فعلی'}: {
                  metric.format === 'currency' 
                    ? \`$\${metric.current.toLocaleString(isRtl ? 'fa-IR' : 'en-US')}\` 
                    : metric.format === 'percent'
                    ? \`\${metric.current.toLocaleString(isRtl ? 'fa-IR' : 'en-US')}%\`
                    : metric.current.toLocaleString(isRtl ? 'fa-IR' : 'en-US')
                }</span>
                <span>{t('dash.rank.target') || 'هدف'}: {
                  metric.format === 'currency' 
                    ? \`$\${metric.required.toLocaleString(isRtl ? 'fa-IR' : 'en-US')}\` 
                    : metric.format === 'percent'
                    ? \`\${metric.required.toLocaleString(isRtl ? 'fa-IR' : 'en-US')}%\`
                    : metric.required.toLocaleString(isRtl ? 'fa-IR' : 'en-US')
                }</span>
              </div>

              {/* ASCII & Styled visual bar */}
              <div className="space-y-1.5">
                <div className="font-mono text-xs text-blue-400 tracking-wider overflow-x-auto whitespace-nowrap bg-slate-900/80 p-2 rounded-xl border border-white/5" dir="ltr">
                  {renderAsciiBlocks(metric.percent)} {metric.percent.toLocaleString(isRtl ? 'fa-IR' : 'en-US')}%
                </div>
                <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                  <div 
                    className={\`h-full rounded-full transition-all \${metric.achieved ? 'bg-emerald-500' : 'bg-blue-500'}\`}
                    style={{ width: \`\${metric.percent}%\` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      `;
  content = content.substring(0, metricsStart) + newMetrics + content.substring(metricsEnd);
}

// Replace roadmap card details which hardcoded the network size/vol etc
const roadmapStart = content.indexOf('<div className="space-y-1.5 text-xs pt-3 border-t border-white/5 text-slate-300">');
const roadmapEnd = content.indexOf('</div>\n              </div>\n            );\n          })}\n        </div>\n\n        {/* Selected Rank Modal');

if (roadmapStart !== -1 && roadmapEnd !== -1) {
  const newRoadmap = `<div className="space-y-1.5 text-xs pt-3 border-t border-white/5 text-slate-300">
                  {rank.requiredCapital !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">{isRtl ? 'سرمایه فعال:' : 'Active Capital:'}</span>
                      <span className="font-mono text-white" dir={isRtl ? 'rtl' : 'ltr'}>
                        {isRtl ? '' : '$'}{rank.requiredCapital.toLocaleString(isRtl ? 'fa-IR' : 'en-US')}{isRtl ? ' دلار' : ''}
                      </span>
                    </div>
                  )}
                  {rank.requiredDirectActive !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">{isRtl ? 'معرف مستقیم:' : 'Direct Active:'}</span>
                      <span className="font-mono text-cyan-400">
                        {rank.requiredDirectActive.toLocaleString(isRtl ? 'fa-IR' : 'en-US')}
                      </span>
                    </div>
                  )}
                  {rank.requiredLegRank && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">{isRtl ? 'شرط رنک زیرمجموعه:' : 'Required Leg Rank:'}</span>
                      <span className="font-mono text-blue-400">
                        {rank.requiredLegRank.count} x {rank.requiredLegRank.rankName}
                      </span>
                    </div>
                  )}
                  {rank.requiredTeamAum !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">{isRtl ? 'حجم AUM تیم:' : 'Team AUM:'}</span>
                      <span className="font-mono text-white" dir={isRtl ? 'rtl' : 'ltr'}>
                        {isRtl ? '' : '$'}{rank.requiredTeamAum.toLocaleString(isRtl ? 'fa-IR' : 'en-US')}{isRtl ? ' دلار' : ''}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-500">{t('dash.rank.leadership_share') || 'سهم رهبری'}:</span>
                    <span className="font-mono text-amber-400 font-bold">
                      {rank.leadershipPoolSharePercent.toLocaleString(isRtl ? 'fa-IR' : 'en-US')}%
                    </span>
                  </div>
                `;
  content = content.substring(0, roadmapStart) + newRoadmap + content.substring(roadmapEnd);
}


// Replace selectedRankDetail hardcoded values
const selRankStart = content.indexOf('<div className="space-y-1.5 text-xs text-slate-300 bg-slate-900/50 p-4 rounded-xl">');
const selRankEnd = content.indexOf('</div>\n              </div>\n\n            </div>\n\n            <div className="pt-4 border-t border-white/10 flex items-center justify-between');

if (selRankStart !== -1 && selRankEnd !== -1) {
  const newSelRank = `<div className="space-y-1.5 text-xs text-slate-300 bg-slate-900/50 p-4 rounded-xl">
                  {selectedRankDetail.requiredCapital !== undefined && (
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-slate-500">{isRtl ? 'حداقل سرمایه:' : 'Min Capital:'}</span>
                      <span className="font-mono text-white">${selectedRankDetail.requiredCapital}</span>
                    </div>
                  )}
                  {selectedRankDetail.requiredTeamAum !== undefined && (
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-slate-500">{isRtl ? 'حجم تیم (AUM):' : 'Team AUM:'}</span>
                      <span className="font-mono text-white">${selectedRankDetail.requiredTeamAum}</span>
                    </div>
                  )}
                  {selectedRankDetail.requiredLegRank && (
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-slate-500">{isRtl ? 'زیرمجموعه واجد شرایط:' : 'Qualified Legs:'}</span>
                      <span className="font-mono text-cyan-400">{selectedRankDetail.requiredLegRank.count} x {selectedRankDetail.requiredLegRank.rankName}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">{t('dash.rank.leadership_share') || 'Share'}:</span>
                    <span className="font-mono text-amber-400 font-bold">{selectedRankDetail.leadershipPoolSharePercent}%</span>
                  </div>
                `;
  content = content.substring(0, selRankStart) + newSelRank + content.substring(selRankEnd);
}

// In the re-evaluation modal
const reevalStart = content.indexOf('<div className="space-y-2">\n                  <div className="p-3 rounded-xl bg-slate-950 border border-white/5');
const reevalEnd = content.indexOf('</div>\n                {isEligibleForUpgrade && progress.nextRank ? (');
if (reevalStart !== -1 && reevalEnd !== -1) {
  const newReeval = `<div className="space-y-2">
                  {progress.metrics.map(metric => (
                    <div key={metric.id} className="p-3 rounded-xl bg-slate-950 border border-white/5 flex items-center justify-between text-xs">
                      <span className="text-slate-300">{isRtl ? metric.farsiName : metric.name}:</span>
                      <span className={\`font-mono font-bold flex items-center gap-1 \${metric.achieved ? 'text-emerald-400' : 'text-slate-400'}\`}>
                        {metric.achieved ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <X className="w-3.5 h-3.5 text-rose-400" />}
                        {metric.current} / {metric.required}
                      </span>
                    </div>
                  ))}
                `;
  content = content.substring(0, reevalStart) + newReeval + content.substring(reevalEnd);
}

fs.writeFileSync('src/components/rank/UserRankPage.tsx', content, 'utf8');
