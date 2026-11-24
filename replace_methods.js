import fs from 'fs';

let content = fs.readFileSync('src/services/rankService.ts', 'utf8');

// Replace getUserCurrentRank
const getCurRankStart = content.indexOf('getUserCurrentRank(user: User): RankRequirementConfig {');
const getCurRankEnd = content.indexOf('  /**\n   * Computes user progression');
if (getCurRankStart !== -1 && getCurRankEnd !== -1) {
  const newGetCurRank = `getUserCurrentRank(user: User): RankRequirementConfig {
    // 1. Check local storage persistent rank override
    try {
      if (user.id) {
        const stored = localStorage.getItem(\`tgex_user_rank_\${user.id}\`);
        if (stored) {
          const match = this.getRankById(stored) || this.findRankByString(stored);
          if (match) return match;
        }
      }
      if (user.email) {
        const storedByEmail = localStorage.getItem(\`tgex_user_rank_\${user.email.toLowerCase()}\`);
        if (storedByEmail) {
          const match = this.getRankById(storedByEmail) || this.findRankByString(storedByEmail);
          if (match) return match;
        }
      }
    } catch {
      // ignore
    }

    // 2. Check user.rankTier or user.rankName
    if (user.rankTier) {
      const match = this.getRankById(user.rankTier) || this.findRankByString(user.rankTier);
      if (match) return match;
    }
    if (user.rankName) {
      const match = this.findRankByString(user.rankName);
      if (match) return match;
    }

    // Default to Starter
    return this.rankTiers[0];
  }

`;
  content = content.substring(0, getCurRankStart) + newGetCurRank + content.substring(getCurRankEnd);
}

// Replace getUserRankProgress
const getProgStart = content.indexOf('async getUserRankProgress(');
const getProgEnd = content.indexOf('  /**\n   * Upgrades the user\'s rank');
if (getProgStart !== -1 && getProgEnd !== -1) {
  const newGetProg = `async getUserRankProgress(
    user: User, 
    customMetrics?: {
      networkSize?: number;
      activeUsers?: number;
      networkVolume?: number;
      directQualified?: number;
    }
  ): Promise<any> { // will typecast to UserRankProgress
    const currentRank = this.getUserCurrentRank(user);
    const nextRank = this.rankTiers.find(r => r.tierOrder === currentRank.tierOrder + 1) || null;
    
    // We base the progress on nextRank's requirements if it exists, otherwise currentRank's
    const targetRank = nextRank || currentRank;
    
    const metrics: any[] = [];
    let totalPercents = 0;
    let count = 0;
    
    if (targetRank.requiredCapital !== undefined) {
      const current = user.totalCapital || 0;
      const required = targetRank.requiredCapital;
      const percent = required > 0 ? Math.min(100, Math.round((current / required) * 100)) : 100;
      metrics.push({
        id: 'capital',
        name: 'سرمایه فعال',
        farsiName: 'سرمایه فعال',
        current,
        required,
        percent,
        achieved: current >= required,
        format: 'currency'
      });
      totalPercents += percent;
      count++;
    }
    
    if (targetRank.requiredDirectActive !== undefined) {
      const current = user.directReferralsCount || 0;
      const required = targetRank.requiredDirectActive;
      const percent = required > 0 ? Math.min(100, Math.round((current / required) * 100)) : 100;
      metrics.push({
        id: 'direct_active',
        name: 'معرفی مستقیم فعال',
        farsiName: 'معرفی مستقیم Active',
        current,
        required,
        percent,
        achieved: current >= required,
        format: 'number'
      });
      totalPercents += percent;
      count++;
    }
    
    if (targetRank.requiredLegRank) {
      const current = 0; // Requires deep calculation, mock for now to 0
      const required = targetRank.requiredLegRank.count;
      const percent = required > 0 ? Math.min(100, Math.round((current / required) * 100)) : 100;
      metrics.push({
        id: 'leg_rank',
        name: \`\${required} \${targetRank.requiredLegRank.rankName}\`,
        farsiName: \`حداقل \${required} عضو با رنک \${targetRank.requiredLegRank.rankName}\`,
        current,
        required,
        percent,
        achieved: current >= required,
        format: 'number'
      });
      totalPercents += percent;
      count++;
    }
    
    if (targetRank.requiredTeamAum !== undefined) {
      const current = user.networkVolumeUsdt || 0;
      const required = targetRank.requiredTeamAum;
      const percent = required > 0 ? Math.min(100, Math.round((current / required) * 100)) : 100;
      metrics.push({
        id: 'team_aum',
        name: 'حجم AUM تیم',
        farsiName: 'حجم معاملات تیمی (AUM)',
        current,
        required,
        percent,
        achieved: current >= required,
        format: 'currency'
      });
      totalPercents += percent;
      count++;
    }
    
    if (targetRank.maxLegVolumePercent !== undefined) {
      const current = 0; // Mock calculation
      const required = targetRank.maxLegVolumePercent;
      const percent = 100; // It's a max limit
      metrics.push({
        id: 'max_leg_vol',
        name: \`Max \${required}% per leg\`,
        farsiName: \`حداکثر \${required}٪ حجم کل از یک خط\`,
        current,
        required,
        percent,
        achieved: current <= required,
        format: 'percent'
      });
      totalPercents += percent;
      count++;
    }
    
    if (targetRank.requiresManagementApproval) {
      const achieved = false;
      metrics.push({
        id: 'management_approval',
        name: 'تایید مدیریت',
        farsiName: 'تأیید مدیریت',
        current: achieved ? 1 : 0,
        required: 1,
        percent: achieved ? 100 : 0,
        achieved,
        format: 'boolean'
      });
      totalPercents += (achieved ? 100 : 0);
      count++;
    }

    // Default dummy metric if none defined (for Starter)
    if (count === 0) {
       metrics.push({
        id: 'registered',
        name: 'Registered',
        farsiName: 'ثبت نام موفق',
        current: 1,
        required: 1,
        percent: 100,
        achieved: true,
        format: 'boolean'
      });
      totalPercents = 100;
      count = 1;
    }

    const overallProgress = Math.round(totalPercents / count);
    const canUpgrade = !!nextRank && metrics.every(m => m.achieved);

    return {
      currentRank,
      currentLevel: user.networkLevel || 'سطح ۳ (Level C)',
      nextRank,
      overallProgressPercent: overallProgress,
      canUpgrade,
      eligibleRank: canUpgrade ? nextRank : null,
      metrics,
      unlockedPrivileges: currentRank.privileges,
      nextRankPrivileges: nextRank ? nextRank.privileges : []
    };
  }

`;
  content = content.substring(0, getProgStart) + newGetProg + content.substring(getProgEnd);
}

fs.writeFileSync('src/services/rankService.ts', content, 'utf8');
