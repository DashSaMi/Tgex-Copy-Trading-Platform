import { KycApplication, KycPersonalInfo, KycDocumentFiles, KycStatus, KycAuditLog, User } from '../types';
import { authService } from './authService';

const STORAGE_KYC_APPLICATIONS = 'tgex_kyc_applications';

// Initial pre-seeded KYC submissions for realistic testing & admin demo
const INITIAL_KYC_APPLICATIONS: KycApplication[] = [
  {
    id: 'kyc_app_809531',
    userId: 'usr_809531',
    userEmail: 'unverified@tgex.io',
    userName: 'unverified kjnj',
    personalInfo: {
      firstName: 'unverified',
      lastName: 'kjnj',
      dateOfBirth: '1996-08-19',
      country: 'ایران | +98',
      phone: '+989120000099',
      idNumber: '00999'
    },
    documents: {
      idFrontName: 'national_id_front.jpg',
      idFrontSize: '2.8 MB',
      idBackName: 'national_id_back.jpg',
      idBackSize: '2.3 MB',
      selfieName: 'selfie_verification.jpg',
      selfieSize: '3.4 MB'
    },
    status: 'approved',
    submittedAt: '2026-08-19T07:00:00Z',
    updatedAt: '2026-08-19T07:20:00Z',
    auditLogs: [
      {
        id: 'log_809_1',
        timestamp: '2026-08-19T07:00:00Z',
        action: 'SUBMITTED',
        adminEmail: 'system@tgex.io',
        note: 'درخواست احراز هویت اولیه توسط unverified kjnj ارسال گردید (تاریخ: ۱۴۰۵/۵/۲۸).'
      },
      {
        id: 'log_809_2',
        timestamp: '2026-08-19T07:20:00Z',
        action: 'APPROVED',
        adminEmail: 'admin@tgex.io',
        note: 'مدارک کارت شناسایی (national_id_front.jpg) و تصویر سلفی (selfie_verification.jpg) با کد ملی 00999 تایید شد.'
      }
    ]
  },
  {
    id: 'kyc_app_892174',
    userId: 'usr_892174',
    userEmail: 'trader@tgex.io',
    userName: 'سامان کریمیان',
    personalInfo: {
      firstName: 'سامان',
      lastName: 'کریمیان',
      dateOfBirth: '1992-05-14',
      country: 'ایران',
      phone: '+989123456789',
      idNumber: '0012938475'
    },
    documents: {
      idFrontName: 'national_id_front.jpg',
      idFrontSize: '2.4 MB',
      idBackName: 'national_id_back.jpg',
      idBackSize: '2.1 MB',
      selfieName: 'selfie_with_id.jpg',
      selfieSize: '3.8 MB'
    },
    status: 'approved',
    submittedAt: '2025-01-16T14:20:00Z',
    updatedAt: '2025-01-16T16:45:00Z',
    auditLogs: [
      {
        id: 'log_1',
        timestamp: '2025-01-16T14:20:00Z',
        action: 'SUBMITTED',
        adminEmail: 'system@tgex.io',
        note: 'درخواست احراز هویت اولیه توسط کاربر ارسال شد.'
      },
      {
        id: 'log_2',
        timestamp: '2025-01-16T16:45:00Z',
        action: 'APPROVED',
        adminEmail: 'admin@tgex.io',
        note: 'مدارک کارت ملی و سلفی با استانداردهای AML تایید گردید.'
      }
    ]
  },
  {
    id: 'kyc_app_449210',
    userId: 'usr_449210',
    userEmail: 'ali.reza@gmail.com',
    userName: 'علی رضایی',
    personalInfo: {
      firstName: 'علی',
      lastName: 'رضایی',
      dateOfBirth: '1995-11-20',
      country: 'ایران',
      phone: '+989351234567',
      idNumber: '0087654321'
    },
    documents: {
      idFrontName: 'passport_scan.pdf',
      idFrontSize: '4.1 MB',
      selfieName: 'selfie_camera.png',
      selfieSize: '3.2 MB'
    },
    status: 'pending',
    submittedAt: '2025-02-18T09:15:00Z',
    updatedAt: '2025-02-18T09:15:00Z',
    auditLogs: [
      {
        id: 'log_3',
        timestamp: '2025-02-18T09:15:00Z',
        action: 'SUBMITTED',
        adminEmail: 'system@tgex.io',
        note: 'درخواست در صف بررسی کارشناسان انطباق (Compliance) قرار گرفت.'
      }
    ]
  },
  {
    id: 'kyc_app_999000',
    userId: 'usr_999000',
    userEmail: 'disabled@tgex.io',
    userName: 'کاربر رد شده',
    personalInfo: {
      firstName: 'کامران',
      lastName: 'نجفی',
      dateOfBirth: '1988-02-10',
      country: 'ایران',
      phone: '+989129998877',
      idNumber: '1234567890'
    },
    documents: {
      idFrontName: 'blurry_id.jpg',
      idFrontSize: '0.8 MB'
    },
    status: 'rejected',
    rejectionReason: 'تصویر کارت شناسایی تار و ناخوانا است. لطفاً مدرک هویتی معتبر با وضوح بالا و تاریخ انقضای معتبر بارگذاری نمایید.',
    submittedAt: '2025-02-10T11:00:00Z',
    updatedAt: '2025-02-10T13:30:00Z',
    auditLogs: [
      {
        id: 'log_4',
        timestamp: '2025-02-10T11:00:00Z',
        action: 'SUBMITTED',
        adminEmail: 'system@tgex.io',
        note: 'ارسال اولیه مدرک.'
      },
      {
        id: 'log_5',
        timestamp: '2025-02-10T13:30:00Z',
        action: 'REJECTED',
        adminEmail: 'compliance@tgex.io',
        note: 'رد درخواست به دلیل کیفیت پایین تصویر و عدم تطابق چهره.'
      }
    ]
  }
];

export class KycService {
  private getApplications(): KycApplication[] {
    try {
      const stored = localStorage.getItem(STORAGE_KYC_APPLICATIONS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}
    this.saveApplications(INITIAL_KYC_APPLICATIONS);
    return INITIAL_KYC_APPLICATIONS;
  }

  private saveApplications(apps: KycApplication[]) {
    try {
      localStorage.setItem(STORAGE_KYC_APPLICATIONS, JSON.stringify(apps));
    } catch (e) {
      console.error('Failed to persist KYC applications', e);
    }
  }

  async getUserApplication(userId: string): Promise<KycApplication | null> {
    const apps = this.getApplications();
    return apps.find(a => a.userId === userId) || null;
  }

  async getAllApplications(): Promise<KycApplication[]> {
    return this.getApplications();
  }

  async submitApplication(
    user: User,
    personalInfo: KycPersonalInfo,
    documents: KycDocumentFiles
  ): Promise<KycApplication> {
    const apps = this.getApplications();
    const existingIndex = apps.findIndex(a => a.userId === user.id);

    const now = new Date().toISOString();
    const newLog: KycAuditLog = {
      id: 'log_' + Math.random().toString(36).substring(2, 9),
      timestamp: now,
      action: 'SUBMITTED',
      adminEmail: 'system@tgex.io',
      note: 'درخواست احراز هویت با موفقیت بارگذاری شد و در نوبت بررسی قرار گرفت.'
    };

    const newApp: KycApplication = {
      id: existingIndex >= 0 ? apps[existingIndex].id : 'kyc_app_' + Math.floor(100000 + Math.random() * 900000),
      userId: user.id,
      userEmail: user.email,
      userName: `${personalInfo.firstName} ${personalInfo.lastName}`,
      personalInfo,
      documents,
      status: 'pending',
      rejectionReason: undefined,
      submittedAt: existingIndex >= 0 ? apps[existingIndex].submittedAt : now,
      updatedAt: now,
      auditLogs: existingIndex >= 0 ? [newLog, ...apps[existingIndex].auditLogs] : [newLog]
    };

    if (existingIndex >= 0) {
      apps[existingIndex] = newApp;
    } else {
      apps.unshift(newApp);
    }

    this.saveApplications(apps);
    return newApp;
  }

  async reviewApplication(
    appId: string,
    action: 'APPROVED' | 'REJECTED' | 'DOCS_REQUESTED',
    adminEmail: string,
    reasonOrNote: string
  ): Promise<KycApplication | null> {
    const apps = this.getApplications();
    const index = apps.findIndex(a => a.id === appId);
    if (index === -1) return null;

    const now = new Date().toISOString();
    const target = apps[index];

    let newStatus: KycStatus = target.status;
    if (action === 'APPROVED') newStatus = 'approved';
    if (action === 'REJECTED') newStatus = 'rejected';
    if (action === 'DOCS_REQUESTED') newStatus = 'pending';

    const auditLog: KycAuditLog = {
      id: 'log_' + Math.random().toString(36).substring(2, 9),
      timestamp: now,
      action,
      adminEmail,
      note: reasonOrNote
    };

    target.status = newStatus;
    target.updatedAt = now;
    target.auditLogs.unshift(auditLog);
    if (action === 'REJECTED') {
      target.rejectionReason = reasonOrNote;
    } else if (action === 'APPROVED') {
      target.rejectionReason = undefined;
    }

    apps[index] = target;
    this.saveApplications(apps);

    // Synchronize with authService and notify active sessions immediately
    authService.syncUserKycStatus(target.userId, target.userEmail, newStatus, target.rejectionReason);

    return target;
  }
}

export const kycService = new KycService();
