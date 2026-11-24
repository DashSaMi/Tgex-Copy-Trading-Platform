import fs from 'fs';

const ranksData = `
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
`;

let content = fs.readFileSync('src/services/rankService.ts', 'utf8');

// replace the rankTiers array
const startIndex = content.indexOf('private rankTiers: RankRequirementConfig[] = [');
const endIndex = content.indexOf('  ];\n\n  /**');

if (startIndex !== -1 && endIndex !== -1) {
  content = content.substring(0, startIndex) + 'private rankTiers: RankRequirementConfig[] = [' + ranksData + '  ];\n\n  /**' + content.substring(endIndex + 9);
}

fs.writeFileSync('src/services/rankService.ts', content, 'utf8');
