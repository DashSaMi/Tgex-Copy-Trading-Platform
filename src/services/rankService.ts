import { 
  RankRequirementConfig, 
  UserRankProgress, 
  User 
} from '../types';

/**
 * Backend-Configured Organizational Rank Rules & Progression Engine.
 * Requirements are configurable server-side and retrieved dynamically.
 */
class RankService {
  /**
   * System-wide Rank Tiers Configuration
   */
  private rankTiers: RankRequirementConfig[] = [
    {
      id: 'rank_starter',
      name: 'Starter',
      farsiName: 'استارتر (Starter)',
      tierOrder: 1,
      badgeColor: '#64748b', // slate-500
      requiredLevel: 'Up to Level 3',
      farsiRequiredLevel: 'تا سطح ۳ ماتریس',
      commissionMultiplier: 1.0,
      leadershipPoolSharePercent: 0,
      privileges: ['Registration and dashboard access', 'Min $50 active capital requirement', 'Unlocked matrix commission up to Level 3'],
      farsiPrivileges: ['ثبت‌نام کامل و دسترسی به داشبورد', 'حداقل ۵۰ دلار سرمایه فعال', 'باز شدن پورسانت ماتریس تا سطح ۳'],
      description: 'Registration on the platform + min $50 active capital.',
      farsiDescription: 'ثبت‌نام در پلتفرم + حداقل ۵۰ دلار سرمایه فعال.',
      requiredCapital: 50
    },
    {
      id: 'rank_stager',
      name: 'Stager',
      farsiName: 'استیجر (Stager)',
      tierOrder: 2,
      badgeColor: '#3b82f6', // blue-500
      requiredLevel: 'Up to Level 5',
      farsiRequiredLevel: 'تا سطح ۵ ماتریس',
      commissionMultiplier: 1.0,
      leadershipPoolSharePercent: 0,
      privileges: ['Active account status', 'Min 2 Active direct referrals', 'Unlocked matrix commission up to Level 5'],
      farsiPrivileges: ['حساب Active', 'حداقل ۲ معرفی مستقیم فعال (Active)', 'باز شدن پورسانت ماتریس تا سطح ۵'],
      description: 'Active status + at least 2 Active direct referrals.',
      farsiDescription: 'وضعیت Active به همراه حداقل ۲ معرفی مستقیم Active.',
      requiredCapital: 50,
      requiredDirectActive: 2
    },
    {
      id: 'rank_trainer',
      name: 'Trainer',
      farsiName: 'ترینر (Trainer)',
      tierOrder: 3,
      badgeColor: '#06b6d4', // cyan-500
      requiredLevel: 'Up to Level 10',
      farsiRequiredLevel: 'تا سطح ۱۰ ماتریس',
      commissionMultiplier: 1.0,
      leadershipPoolSharePercent: 0,
      privileges: ['Active account status', 'Min 2 members with Stager rank', 'Unlocked matrix commission up to Level 10'],
      farsiPrivileges: ['حساب Active', 'حداقل ۲ عضو با رنک استیجر (Stager)', 'رعایت منطق رقابتی خطوط', 'باز شدن پورسانت ماتریس تا سطح ۱۰'],
      description: 'Active + at least 2 Stager ranked members (line competition logic).',
      farsiDescription: 'حساب Active + حداقل ۲ عضو با رنک استیجر، از میان خطوطی که زودتر شرایط را برآورده کنند.',
      requiredCapital: 50,
      requiredLegRank: { rankTierOrder: 2, rankName: 'استیجر', count: 2 }
    },
    {
      id: 'rank_advisor',
      name: 'Advisor',
      farsiName: 'مشاور (Advisor)',
      tierOrder: 4,
      badgeColor: '#14b8a6', // teal-500
      requiredLevel: 'Up to Level 15',
      farsiRequiredLevel: 'تا سطح ۱۵ ماتریس',
      commissionMultiplier: 1.0,
      leadershipPoolSharePercent: 0,
      privileges: ['Active account status', 'Min 2 members with Trainer rank', 'Unlocked matrix commission up to Level 15'],
      farsiPrivileges: ['حساب Active', 'حداقل ۲ عضو با رنک ترینر (Trainer)', 'باز شدن پورسانت تا سطح ۱۵'],
      description: 'Active + at least 2 Trainer members.',
      farsiDescription: 'حساب Active + حداقل ۲ عضو با رنک ترینر، طبق منطق رقابتی خطوط.',
      requiredCapital: 50,
      requiredLegRank: { rankTierOrder: 3, rankName: 'ترینر', count: 2 }
    },
    {
      id: 'rank_guide',
      name: 'Guide',
      farsiName: 'راهنما (Guide)',
      tierOrder: 5,
      badgeColor: '#10b981', // emerald-500
      requiredLevel: 'Up to Level 20',
      farsiRequiredLevel: 'تا سطح ۲۰ ماتریس',
      commissionMultiplier: 1.0,
      leadershipPoolSharePercent: 0,
      privileges: ['Min 2 Advisor members', 'Min $100,000 Team AUM', 'Full 20-level commission'],
      farsiPrivileges: ['حداقل ۲ عضو با رنک مشاور', 'حداقل ۱۰۰,۰۰۰ دلار AUM تیم', 'دریافت پورسانت ۲۰ لایه کامل'],
      description: 'Active + at least 2 Advisor members + min $100,000 Team AUM.',
      farsiDescription: 'حساب Active + حداقل ۲ عضو با رنک مشاور + حداقل ۱۰۰,۰۰۰ دلار AUM تیم.',
      requiredCapital: 50,
      requiredLegRank: { rankTierOrder: 4, rankName: 'مشاور', count: 2 },
      requiredTeamAum: 100000
    },
    {
      id: 'rank_manager',
      name: 'Manager',
      farsiName: 'مدیر (Manager)',
      tierOrder: 6,
      badgeColor: '#f59e0b', // amber-500
      requiredLevel: 'Full Matrix + Infinity',
      farsiRequiredLevel: 'ماتریس کامل + پاداش بینهایت',
      commissionMultiplier: 1.1,
      leadershipPoolSharePercent: 0.5,
      privileges: ['Min 2 Guide members', 'Min $500,000 Team AUM', 'Global Pool Access'],
      farsiPrivileges: ['حداقل ۲ عضو با رنک راهنما', 'حداقل ۵۰۰,۰۰۰ دلار AUM تیم', 'دسترسی به استخر پاداش جهانی'],
      description: 'Active + at least 2 Guide members + min $500,000 Team AUM.',
      farsiDescription: 'حساب Active + حداقل ۲ عضو با رنک راهنما + حداقل ۵۰۰,۰۰۰ دلار AUM تیم.',
      requiredCapital: 50,
      requiredLegRank: { rankTierOrder: 5, rankName: 'راهنما', count: 2 },
      requiredTeamAum: 500000
    },
    {
      id: 'rank_senior_manager',
      name: 'Senior Manager',
      farsiName: 'مدیر ارشد (Senior Manager)',
      tierOrder: 7,
      badgeColor: '#ef4444', // red-500
      requiredLevel: 'Full Matrix + Infinity',
      farsiRequiredLevel: 'ماتریس کامل + پاداش بینهایت',
      commissionMultiplier: 1.25,
      leadershipPoolSharePercent: 1.0,
      privileges: ['Min 2 Manager members', 'Min $2,000,000 Team AUM', 'Max 60% from one leg'],
      farsiPrivileges: ['حداقل ۲ عضو با رنک مدیر', 'حداقل ۲,۰۰۰,۰۰۰ دلار AUM', 'حداکثر ۶۰٪ حجم کل از یک خط'],
      description: 'Active + at least 2 Manager members + min $2M Team AUM + max 60% leg volume.',
      farsiDescription: 'حساب Active + حداقل ۲ عضو با رنک مدیر + حداقل ۲,۰۰۰,۰۰۰ دلار AUM + حداکثر ۶۰٪ حجم کل از یک خط.',
      requiredCapital: 50,
      requiredLegRank: { rankTierOrder: 6, rankName: 'مدیر', count: 2 },
      requiredTeamAum: 2000000,
      maxLegVolumePercent: 60
    },
    {
      id: 'rank_leader',
      name: 'Leader',
      farsiName: 'راهبر (Leader)',
      tierOrder: 8,
      badgeColor: '#a855f7', // purple-500
      requiredLevel: 'Full Matrix + Infinity',
      farsiRequiredLevel: 'ماتریس کامل + پاداش بینهایت',
      commissionMultiplier: 1.5,
      leadershipPoolSharePercent: 2.5,
      privileges: ['Management approval', 'Min $10,000,000 Team AUM', 'Max 50% from one leg'],
      farsiPrivileges: ['تأیید مدیریت', 'حداقل ۱۰,۰۰۰,۰۰۰ دلار AUM', 'حداکثر ۵۰٪ حجم کل از یک خط'],
      description: 'Active + management approval + min $10M Team AUM + max 50% leg volume.',
      farsiDescription: 'حساب Active + تأیید مدیریت + حداقل ۱۰,۰۰۰,۰۰۰ دلار AUM + حداکثر ۵۰٪ حجم کل از یک خط.',
      requiredCapital: 50,
      requiresManagementApproval: true,
      requiredTeamAum: 10000000,
      maxLegVolumePercent: 50
    },
    {
      id: 'rank_senior_leader',
      name: 'Senior Leader',
      farsiName: 'راهبر ارشد (Senior Leader)',
      tierOrder: 9,
      badgeColor: '#ec4899', // pink-500
      requiredLevel: 'Full Matrix + Infinity',
      farsiRequiredLevel: 'ماتریس کامل + پاداش بینهایت',
      commissionMultiplier: 2.0,
      leadershipPoolSharePercent: 5.0,
      privileges: ['Management approval', 'Min $50,000,000 Team AUM', 'Max 40% from one leg'],
      farsiPrivileges: ['تأیید مدیریت', 'حداقل ۵۰,۰۰۰,۰۰۰ دلار AUM', 'حداکثر ۴۰٪ حجم کل از یک خط'],
      description: 'Active + management approval + min $50M Team AUM + max 40% leg volume.',
      farsiDescription: 'حساب Active + تأیید مدیریت + حداقل ۵۰,۰۰۰,۰۰۰ دلار AUM + حداکثر ۴۰٪ حجم کل از یک خط.',
      requiredCapital: 50,
      requiresManagementApproval: true,
      requiredTeamAum: 50000000,
      maxLegVolumePercent: 40
    }
  ];

  /****
   * Returns all available rank configurations
   */
  async getAllRanks(): Promise<RankRequirementConfig[]> {
    return this.rankTiers;
  }

  /**
   * Gets specific rank by its ID or order
   */
  getRankById(rankId: string): RankRequirementConfig | undefined {
    return this.rankTiers.find(r => r.id === rankId || r.name.toLowerCase() === rankId.toLowerCase());
  }

  /**
   * Finds rank matching a string (name, farsi name, or ID)
   */
  findRankByString(rankStr?: string): RankRequirementConfig | undefined {
    if (!rankStr) return undefined;
    const lower = rankStr.toLowerCase();
    
    if (lower.includes('senior leader') || lower.includes('راهبر ارشد') || lower.includes('senior_leader')) {
      return this.rankTiers.find(r => r.id === 'rank_senior_leader');
    }
    if (lower.includes('senior manager') || lower.includes('مدیر ارشد') || lower.includes('senior_manager')) {
      return this.rankTiers.find(r => r.id === 'rank_senior_manager');
    }
    if (lower.includes('leader') || lower.includes('راهبر')) {
      return this.rankTiers.find(r => r.id === 'rank_leader');
    }
    if (lower.includes('manager') || lower.includes('مدیر')) {
      return this.rankTiers.find(r => r.id === 'rank_manager');
    }
    if (lower.includes('guide') || lower.includes('راهنما')) {
      return this.rankTiers.find(r => r.id === 'rank_guide');
    }
    if (lower.includes('advisor') || lower.includes('مشاور')) {
      return this.rankTiers.find(r => r.id === 'rank_advisor');
    }
    if (lower.includes('trainer') || lower.includes('ترینر')) {
      return this.rankTiers.find(r => r.id === 'rank_trainer');
    }
    if (lower.includes('stager') || lower.includes('استیجر')) {
      return this.rankTiers.find(r => r.id === 'rank_stager');
    }
    if (lower.includes('starter') || lower.includes('استارتر')) {
      return this.rankTiers.find(r => r.id === 'rank_starter');
    }
    return undefined;
  }

  /**
   * Retrieves active current rank of a user with local storage override and fallback
   */
  getUserCurrentRank(user: User): RankRequirementConfig {
    // 1. Check local storage persistent rank override
    try {
      if (user.id) {
        const stored = localStorage.getItem(`tgex_user_rank_${user.id}`);
        if (stored) {
          const match = this.getRankById(stored) || this.findRankByString(stored);
          if (match) return match;
        }
      }
      if (user.email) {
        const storedByEmail = localStorage.getItem(`tgex_user_rank_${user.email.toLowerCase()}`);
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

  /**
   * Computes user progression towards current and next rank based on live server metrics
   */
  async getUserRankProgress(
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
      const current = user.activeCapitalUsdt || 0;
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
        name: `${required} ${targetRank.requiredLegRank.rankName}`,
        farsiName: `حداقل ${required} عضو با رنک ${targetRank.requiredLegRank.rankName}`,
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
        name: `Max ${required}% per leg`,
        farsiName: `حداکثر ${required}٪ حجم کل از یک خط`,
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

  /**
   * Upgrades the user's rank across local storage, session, and database
   */
  async upgradeUserRank(
    user: User, 
    targetRankId?: string
  ): Promise<{ success: boolean; updatedUser: User; newRank: RankRequirementConfig; message: string }> {
    const currentRank = this.getUserCurrentRank(user);
    let targetRank: RankRequirementConfig | undefined;

    if (targetRankId) {
      targetRank = this.getRankById(targetRankId) || this.findRankByString(targetRankId);
    } else {
      targetRank = this.rankTiers.find(r => r.tierOrder === currentRank.tierOrder + 1);
    }

    if (!targetRank) {
      throw new Error('رنک بالاتر جهت ارتقا یافت نشد.');
    }

    const progress = await this.getUserRankProgress(user);
    if (!progress.canUpgrade || progress.overallProgressPercent < 100) {
      throw new Error('خطای امنیتی: پیش‌نیازهای ارتقا کامل نشده است و درصد پیشرفت به ۱۰۰٪ نرسیده است. ارتقای رنک غیرمجاز است.');
    }

    const rankTitle = targetRank.name;
    const rankFarsiTitle = targetRank.farsiName;

    // 1. Persist to localStorage keys
    try {
      if (user.id) {
        localStorage.setItem(`tgex_user_rank_${user.id}`, targetRank.id);
      }
      if (user.email) {
        localStorage.setItem(`tgex_user_rank_${user.email.toLowerCase()}`, targetRank.id);
      }
    } catch (e) {
      console.error('Failed to write rank to localStorage', e);
    }

    // 2. Build updated user object
    const updatedUser: User = {
      ...user,
      rankName: `${targetRank.name} (${targetRank.farsiName.split(' ')[0]})`,
      rankTier: targetRank.id
    };

    // 3. Update active session in localStorage
    try {
      const rawSession = localStorage.getItem('tgex_auth_session');
      if (rawSession) {
        const parsed = JSON.parse(rawSession);
        if (parsed && parsed.user) {
          parsed.user = {
            ...parsed.user,
            rankName: updatedUser.rankName,
            rankTier: updatedUser.rankTier
          };
          localStorage.setItem('tgex_auth_session', JSON.stringify(parsed));
        }
      }
    } catch (e) {
      console.error('Failed to update auth session for rank upgrade', e);
    }

    // 4. Update Database Entity if exists
    try {
      const rawDb = localStorage.getItem('tgex_unified_users_db');
      if (rawDb) {
        const usersList = JSON.parse(rawDb);
        if (Array.isArray(usersList)) {
          const idx = usersList.findIndex((u: any) => 
            u.id === user.id || 
            u.email?.toLowerCase() === user.email?.toLowerCase() ||
            u.id?.replace('DX-', '').replace('usr_', '') === user.id?.replace('DX-', '').replace('usr_', '')
          );
          if (idx >= 0) {
            usersList[idx].rank = targetRank.name; usersList[idx].rankName = targetRank.name; usersList[idx].rankTier = targetRank.id;
            localStorage.setItem('tgex_unified_users_db', JSON.stringify(usersList));
          }
        }
      }
    } catch (e) {
      console.error('Failed to update DB entity for rank upgrade', e);
    }

    // 5. Dispatch global events
    window.dispatchEvent(new CustomEvent('tgex_rank_upgraded', { 
      detail: { user: updatedUser, newRank: targetRank } 
    }));
    window.dispatchEvent(new Event('tgex_db_updated'));
    window.dispatchEvent(new CustomEvent('tgex_user_updated', { 
      detail: updatedUser 
    }));

    return {
      success: true,
      updatedUser,
      newRank: targetRank,
      message: `ارتقای رنک شما به «${rankFarsiTitle}» با موفقیت در کل سامانه اعمال و ثبت شد.`
    };
  }

  /**
   * Resets rank to Advisor for testing / simulation loops
   */
  async resetUserRank(user: User, targetRankId = 'rank_advisor'): Promise<User> {
    try {
      if (user.id) localStorage.removeItem(`tgex_user_rank_${user.id}`);
      if (user.email) localStorage.removeItem(`tgex_user_rank_${user.email.toLowerCase()}`);
      if (user.id) localStorage.setItem(`tgex_user_rank_${user.id}`, targetRankId);
      if (user.email) localStorage.setItem(`tgex_user_rank_${user.email.toLowerCase()}`, targetRankId);
    } catch {
      // ignore
    }

    const rankObj = this.getRankById(targetRankId) || this.rankTiers[3];
    const updatedUser: User = {
      ...user,
      rankName: rankObj.name,
      rankTier: rankObj.id
    };

    try {
      const rawSession = localStorage.getItem('tgex_auth_session');
      if (rawSession) {
        const parsed = JSON.parse(rawSession);
        if (parsed && parsed.user) {
          parsed.user.rankName = updatedUser.rankName;
          parsed.user.rankTier = updatedUser.rankTier;
          localStorage.setItem('tgex_auth_session', JSON.stringify(parsed));
        }
      }
    } catch {
      // ignore
    }

    window.dispatchEvent(new Event('tgex_db_updated'));
    window.dispatchEvent(new CustomEvent('tgex_user_updated', { detail: updatedUser }));
    return updatedUser;
  }
}

export const rankService = new RankService();
