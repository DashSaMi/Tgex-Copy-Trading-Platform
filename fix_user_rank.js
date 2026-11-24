import fs from 'fs';

let content = fs.readFileSync('src/components/rank/UserRankPage.tsx', 'utf8');

const startStr = '{/* 2. PROGRESS METRICS & VISUAL INDICATORS */}';
const endStr = '{/* 3. ALL RANKS ROADMAP (Server Configured Tiers) */}';

const startIndex = content.indexOf(startStr);
const endIndex = content.indexOf(endStr);

if (startIndex !== -1 && endIndex !== -1) {
  const newMetricsCode = `{/* 2. PROGRESS METRICS & VISUAL INDICATORS */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-white/10 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            <span>{t('dash.rank.indicators_title')}</span>
          </h2>
          <p className="text-xs text-slate-400">
            {t('dash.rank.indicators_subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
  
  content = content.substring(0, startIndex) + newMetricsCode + content.substring(endIndex);
  fs.writeFileSync('src/components/rank/UserRankPage.tsx', content, 'utf8');
  console.log('Metrics grid successfully replaced');
} else {
  console.log('Failed to find start or end block');
}
