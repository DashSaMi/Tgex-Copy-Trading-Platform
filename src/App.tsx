import React, { useState, useEffect } from 'react';
import { PageId, User, DashboardTab } from './types';
import { authService } from './services/authService';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { LanguageLoadingOverlay } from './components/LanguageLoadingOverlay';

// Pages
import { HomePage } from './components/pages/HomePage';
import { AboutPage } from './components/pages/AboutPage';
import { LevelsPage } from './components/pages/LevelsPage';
import { RanksPage } from './components/pages/RanksPage';
import { FaqPage } from './components/pages/FaqPage';
import { BlogPage } from './components/pages/BlogPage';
import { BlogDetailPage } from './components/pages/BlogDetailPage';
import { TermsPage } from './components/pages/TermsPage';
import { PrivacyPage } from './components/pages/PrivacyPage';
import { RiskDisclosurePage } from './components/pages/RiskDisclosurePage';

// Authentication Pages
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { VerifyEmailPage } from './components/auth/VerifyEmailPage';
import { ForgotPasswordPage } from './components/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './components/auth/ResetPasswordPage';
import { AuthFlowDiagram } from './components/auth/AuthFlowDiagram';

// Dashboard & KYC & Dedicated Pages
import { UserDashboard } from './components/dashboard/UserDashboard';
import { UserNetworkPage } from './components/network/UserNetworkPage';
import { TwentyLevelsPage } from './components/levels/TwentyLevelsPage';
import { UserEarningsPage } from './components/earnings/UserEarningsPage';
import { UserRankPage } from './components/rank/UserRankPage';
import { KycAdminPanel } from './components/kyc/KycAdminPanel';
import { AdCanvasPage } from './components/dashboard/AdCanvasPage';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLoginPage } from './components/admin/AdminLoginPage';
import { adminAuthService } from './services/adminAuthService';
import { useCmsContent } from './services/cmsService';
import { Megaphone, ArrowLeft, ArrowRight } from 'lucide-react';
import { MOCK_USER_AUTHENTICATED } from './services/authService';

const SECRET_ADMIN_LOGIN_PATH = 'cwpm0idm203idm0i2c2i0m/admin/tgex/admin-login';

const resolveRouteFromPathname = (pathname: string): { page: PageId; shouldReplaceHome?: boolean } => {
  const cleanPath = pathname.replace(/^\/+|\/+$/g, '');
  if (!cleanPath) return { page: 'home' };
  if (cleanPath === SECRET_ADMIN_LOGIN_PATH) {
    return { page: SECRET_ADMIN_LOGIN_PATH };
  }
  if (cleanPath === 'admin-login' || ((cleanPath === 'admin' || cleanPath.startsWith('admin-')) && !adminAuthService.isAuthenticated())) {
    return { page: 'home', shouldReplaceHome: true };
  }
  return { page: cleanPath as PageId };
};

function AppContent() {
  const { language, dir, t } = useLanguage();
  const cms = useCmsContent();
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [pendingEmail, setPendingEmail] = useState<string>('');
  const [referralCode, setReferralCode] = useState<string>('482917635');
  const [selectedBlogSlug, setSelectedBlogSlug] = useState<string>('complete-guide-to-20-level-matrix-rewards');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [sharedAdUserId, setSharedAdUserId] = useState<string | null>(null);
  const [dashboardInitialTab, setDashboardInitialTab] = useState<DashboardTab>('overview');
  const [authTransitionDir, setAuthTransitionDir] = useState<number>(0);

  // Initialize session and URL params
  useEffect(() => {
    // Check local session
    const session = authService.getCurrentSession();
    if (session && session.user) {
      setCurrentUser(session.user);
    }

    // Set initial page from path
    const initialRoute = resolveRouteFromPathname(window.location.pathname);
    setCurrentPage(initialRoute.page);
    if (initialRoute.shouldReplaceHome) {
      window.history.replaceState(null, '', '/');
    }

    // Check referral query param in browser URL
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const ref = urlParams.get('ref');
      if (ref) {
        setReferralCode(ref);
      }
      const shareAds = urlParams.get('shareAds');
      if (shareAds) {
        setSharedAdUserId(shareAds);
      }
    } catch {
      // Ignore if not supported
    }

    // Listen to popstate for back/forward navigation
    const handlePopState = () => {
      const route = resolveRouteFromPathname(window.location.pathname);
      setCurrentPage(route.page);
      if (route.shouldReplaceHome) {
        window.history.replaceState(null, '', '/');
      }
    };
    window.addEventListener('popstate', handlePopState);

    // Listen to user/KYC updates from Admin panel or user verification
    const handleUserUpdate = (e: any) => {
      const updated = e.detail;
      if (updated) {
        setCurrentUser((prev) => {
          if (!prev) {
            // Keep user session logged out if there is no active session
            return null;
          }
          if (prev.id === updated.id || prev.email === updated.email) {
            return { ...prev, ...updated };
          }
          return prev;
        });
      }
    };

    window.addEventListener('tgex_user_updated', handleUserUpdate);
    return () => {
      window.removeEventListener('tgex_user_updated', handleUserUpdate);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleNavigate = (page: PageId, userOverride?: User | null) => {
    let targetPage = page;
    if (targetPage === 'register') {
      targetPage = 'signup';
    }
    if (targetPage === 'admin-login') {
      targetPage = 'home';
    }
    const effectiveUser = userOverride !== undefined ? userOverride : (currentUser || authService.getCurrentSession()?.user || null);

    // Block unauthenticated programmatic navigation to admin routes
    if ((targetPage === 'admin' || targetPage.startsWith('admin-')) && !adminAuthService.isAuthenticated()) {
      targetPage = 'home';
    }

    // Support and Contact redirection to User Dashboard Support Tickets section
    if (targetPage === 'contact' || targetPage === 'support' || targetPage === 'support-tickets') {
      if (effectiveUser) {
        setDashboardInitialTab('support-tickets');
        targetPage = 'dashboard';
      } else {
        showToast(
          language === 'fa'
            ? 'برای دسترسی به بخش پشتیبانی و ثبت تیکت، لطفاً ابتدا ثبت‌نام کنید یا وارد حساب کاربری خود شوید.'
            : 'Please sign up or log in to access the support desk and submit tickets.'
        );
        targetPage = 'signup';
      }
    } else if (targetPage === 'dashboard') {
      if (!effectiveUser) {
        showToast(t('nav.dashboard_signin_required'));
        targetPage = 'login';
      } else {
        // If regular dashboard click, open overview unless already on support-tickets
        setDashboardInitialTab(prev => prev === 'support-tickets' ? 'overview' : prev);
      }
    }

    const isCurrentAuth = currentPage === 'login' || currentPage === 'signup' || currentPage === 'register';
    const isTargetAuth = targetPage === 'login' || targetPage === 'signup';
    if (isCurrentAuth && isTargetAuth && currentPage !== targetPage) {
      setAuthTransitionDir(targetPage === 'signup' ? 1 : -1);
    } else {
      setAuthTransitionDir(0);
    }

    setCurrentPage(targetPage);
    if (targetPage === 'home') {
      window.history.pushState(null, '', '/');
    } else {
      window.history.pushState(null, '', `/${targetPage}`);
    }
    if (window.scrollY > 24) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    showToast(t('auth.login.success_msg').replace('{name}', user.fullName || user.email));
    handleNavigate('dashboard', user);
  };

  const handleRegistrationSuccess = (email: string) => {
    setPendingEmail(email);
    showToast(t('auth.register.success_msg').replace('{email}', email));
    handleNavigate('verify-email');
  };

  const handleVerificationComplete = (user: User) => {
    setCurrentUser(user);
    showToast(t('auth.verify.success_msg'));
    handleNavigate('dashboard', user);
  };

  const handleLogout = async () => {
    await authService.logout();
    setCurrentUser(null);
    showToast(t('auth.logout.success_msg'));
    handleNavigate('home');
  };

  const activeUser = currentUser || MOCK_USER_AUTHENTICATED;
  const isAdminRoute = currentPage === 'admin' || currentPage.startsWith('admin-');

  // Intercept shared Ads presentation board
  if (sharedAdUserId) {
    return (
      <div className="min-h-screen bg-[#05070A] text-slate-100 flex flex-col p-3 sm:p-6 lg:p-8 selection:bg-blue-600/30 selection:text-blue-300 antialiased" dir={dir}>
        <div className="max-w-7xl mx-auto w-full space-y-6">
          <div className="flex justify-between items-center">
            <button
              onClick={() => {
                setSharedAdUserId(null);
                // Clear query parameter from browser address bar cleanly
                window.history.pushState(null, '', '/');
                handleNavigate('home');
              }}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-xs text-slate-400 hover:text-white transition cursor-pointer"
            >
              ← {language === 'fa' ? 'بازگشت به صفحه اصلی پلتفرم' : 'Back to Platform Home'}
            </button>

            <span className="text-xs text-slate-500 font-mono">TGEX AdSpace # {sharedAdUserId}</span>
          </div>

          <AdCanvasPage userId={sharedAdUserId} isPublicShared={true} />
        </div>
      </div>
    );
  }

  // Dedicated Secret Admin Login Route (only accessible via exact secret path)
  if (currentPage === SECRET_ADMIN_LOGIN_PATH) {
    return (
      <AdminLoginPage
        onNavigate={handleNavigate}
        onAdminLoginSuccess={() => {
          showToast(t('admin.login.success_msg'));
          handleNavigate('admin');
        }}
      />
    );
  }

  // If navigating in protected Admin workspace, render full-screen Admin Layout only when authenticated
  if (isAdminRoute && adminAuthService.isAuthenticated()) {

    return (
      <div className="min-h-screen overflow-x-hidden bg-[#05070A] text-slate-100 selection:bg-blue-600/30 selection:text-blue-300 antialiased" dir={dir}>
        {toastMessage && (
          <div className={`fixed bottom-6 ${dir === 'rtl' ? 'left-6' : 'right-6'} z-50 p-4 rounded-2xl bg-blue-600 text-white text-xs font-bold shadow-2xl shadow-blue-600/40 animate-in slide-in-from-bottom-5 duration-200 flex items-center gap-3 border border-white/15`}>
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            <span>{toastMessage}</span>
            <button 
              onClick={() => setToastMessage(null)}
              className="text-blue-200 hover:text-white mr-2 text-sm"
            >
              ✕
            </button>
          </div>
        )}
        <AdminLayout
          currentUser={currentUser}
          onNavigatePage={handleNavigate}
          onLogout={() => {
            adminAuthService.logout();
            showToast(t('admin.logout.success_msg'));
            handleNavigate('home');
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#05070A] text-slate-100 flex flex-col selection:bg-blue-600/30 selection:text-blue-300 antialiased" dir={dir}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed bottom-6 ${dir === 'rtl' ? 'left-6' : 'right-6'} z-50 p-4 rounded-2xl bg-blue-600 text-white text-xs font-bold shadow-2xl shadow-blue-600/40 animate-in slide-in-from-bottom-5 duration-200 flex items-center gap-3 border border-white/15`}>
          <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
          <span>{toastMessage}</span>
          <button 
            onClick={() => setToastMessage(null)}
            className="text-blue-200 hover:text-white mr-2 text-sm"
          >
            ✕
          </button>
        </div>
      )}

      {/* Global Announcement Banner from CMS (if enabled) */}
      {cms.announcement && cms.announcement.enabled && (
        <div className="bg-gradient-to-r from-blue-950/90 via-slate-900 to-cyan-950/90 border-b border-blue-500/20 text-slate-200 text-xs py-2 px-4 relative z-30 transition-all">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono text-[10px] font-bold border border-blue-500/30 shrink-0">
                {cms.announcement.badge || 'اعلان رسمی'}
              </span>
              <span className="truncate text-slate-200 font-medium text-[11px] sm:text-xs">
                {cms.announcement.text}
              </span>
            </div>
            {cms.announcement.linkText && (
              <button
                onClick={() => handleNavigate((cms.announcement.linkTarget as PageId) || 'about')}
                className="text-cyan-400 hover:text-cyan-300 font-bold text-[11px] shrink-0 flex items-center gap-1 transition"
              >
                <span>{cms.announcement.linkText}</span>
                {dir === 'rtl' ? <ArrowLeft className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Header / Navbar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Page Content Body */}
      <main className="flex-1 overflow-x-hidden">
        <AnimatePresence
          mode="wait"
          custom={{ authDir: authTransitionDir, isRtl: dir === 'rtl' }}
        >
          <motion.div
            key={`${currentPage}-${language}`}
            custom={{ authDir: authTransitionDir, isRtl: dir === 'rtl' }}
            variants={{
              initial: ({ authDir, isRtl }: { authDir: number; isRtl: boolean }) =>
                authDir !== 0
                  ? {
                      opacity: 0,
                      x: (isRtl ? -1 : 1) * authDir * 64,
                      scale: 0.975,
                      filter: 'blur(6px)'
                    }
                  : {
                      opacity: 0,
                      y: 12,
                      scale: 0.992
                    },
              animate: {
                opacity: 1,
                x: 0,
                y: 0,
                scale: 1,
                filter: 'blur(0px)',
                transition: {
                  duration: 0.36,
                  ease: [0.22, 1, 0.36, 1]
                }
              },
              exit: ({ authDir, isRtl }: { authDir: number; isRtl: boolean }) =>
                authDir !== 0
                  ? {
                      opacity: 0,
                      x: (isRtl ? 1 : -1) * authDir * 64,
                      scale: 0.975,
                      filter: 'blur(6px)',
                      transition: {
                        duration: 0.24,
                        ease: [0.4, 0, 1, 1]
                      }
                    }
                  : {
                      opacity: 0,
                      y: -8,
                      scale: 0.995,
                      transition: {
                        duration: 0.18,
                        ease: [0.4, 0, 1, 1]
                      }
                    }
            }}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full h-full"
          >
            {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
            {currentPage === 'about' && <AboutPage onNavigate={handleNavigate} />}
            {currentPage === 'blog' && (
              <BlogPage
                onNavigate={handleNavigate}
                onSelectPost={(slug) => {
                  setSelectedBlogSlug(slug);
                  handleNavigate('blog-detail');
                }}
              />
            )}
            {currentPage === 'blog-detail' && (
              <BlogDetailPage
                slug={selectedBlogSlug}
                onNavigate={handleNavigate}
                onSelectPost={(slug) => {
                  setSelectedBlogSlug(slug);
                  handleNavigate('blog-detail');
                }}
              />
            )}
            {currentPage === 'levels' && (
              <TwentyLevelsPage
                user={activeUser}
                onNavigate={handleNavigate}
                isAuthenticatedViewer={Boolean(currentUser)}
              />
            )}
            {currentPage === 'ranks' && <RanksPage onNavigate={handleNavigate} />}
            {currentPage === 'faq' && <FaqPage onNavigate={handleNavigate} />}
            {currentPage === 'terms' && <TermsPage onNavigate={handleNavigate} />}
            {currentPage === 'privacy' && <PrivacyPage onNavigate={handleNavigate} />}
            {currentPage === 'risk' && <RiskDisclosurePage onNavigate={handleNavigate} />}

            {/* Authentication Pages */}
            {currentPage === 'login' && (
              <LoginPage
                onNavigate={handleNavigate}
                onLoginSuccess={handleLoginSuccess}
                currentUser={currentUser}
                onEmailVerificationNeeded={(email) => {
                  setPendingEmail(email);
                  handleNavigate('verify-email');
                }}
              />
            )}

            {(currentPage === 'signup' || currentPage === 'register') && (
              <RegisterPage
                onNavigate={handleNavigate}
                onEmailVerificationNeeded={(email) => {
                  setPendingEmail(email);
                  handleNavigate('verify-email');
                }}
              />
            )}

            {currentPage === 'verify-email' && (
              <VerifyEmailPage
                email={pendingEmail}
                onNavigate={handleNavigate}
                onVerificationComplete={handleVerificationComplete}
              />
            )}

            {currentPage === 'forgot-password' && (
              <ForgotPasswordPage
                onNavigate={handleNavigate}
                onResetLinkSent={(email) => {
                  showToast(t('auth.forgot.success_msg').replace('{email}', email));
                  handleNavigate('login');
                }}
              />
            )}

            {currentPage === 'reset-password' && (
              <ResetPasswordPage
                onNavigate={handleNavigate}
                onResetComplete={() => {
                  showToast(t('auth.reset.success_msg'));
                  handleNavigate('login');
                }}
              />
            )}

            {currentPage === 'auth-architecture' && (
              <AuthFlowDiagram onNavigate={handleNavigate} />
            )}

            {/* Dashboard & KYC Views */}
            {currentPage === 'dashboard' && (
              (currentUser || authService.getCurrentSession()?.user) ? (
                <UserDashboard
                  user={currentUser || authService.getCurrentSession()!.user}
                  onNavigatePage={handleNavigate}
                  onLogout={handleLogout}
                  onUserUpdate={(updated) => setCurrentUser(updated)}
                  initialTab={dashboardInitialTab}
                />
              ) : (
                <LoginPage
                  onNavigate={handleNavigate}
                  onLoginSuccess={handleLoginSuccess}
                  currentUser={currentUser}
                  onEmailVerificationNeeded={(email) => {
                    setPendingEmail(email);
                    handleNavigate('verify-email');
                  }}
                />
              )
            )}

            {currentPage === 'kyc' && (
              (currentUser || authService.getCurrentSession()?.user) ? (
                <UserDashboard
                  user={currentUser || authService.getCurrentSession()!.user}
                  onNavigatePage={handleNavigate}
                  onLogout={handleLogout}
                  onUserUpdate={(updated) => setCurrentUser(updated)}
                  initialTab={dashboardInitialTab}
                />
              ) : (
                <LoginPage
                  onNavigate={handleNavigate}
                  onLoginSuccess={handleLoginSuccess}
                  currentUser={currentUser}
                  onEmailVerificationNeeded={(email) => {
                    setPendingEmail(email);
                    handleNavigate('verify-email');
                  }}
                />
              )
            )}

            {(isAdminRoute || currentPage === 'admin-login') && !adminAuthService.isAuthenticated() && (
              <HomePage onNavigate={handleNavigate} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global Footer */}
      <Footer onNavigate={handleNavigate} />

    </div>
  );
}

export function App() {
  return (
    <LanguageProvider>
      <LanguageLoadingOverlay />
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
