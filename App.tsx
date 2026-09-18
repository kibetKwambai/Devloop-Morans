

import React, { useState, useMemo, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { SettingsPage } from './components/SettingsPage';
import { EmployerDashboard } from './components/EmployerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { ProfileView } from './components/ProfileView';
import { LandingPage } from './components/LandingPage';
import { PricingPage } from './components/PricingPage';
import { SignInPage } from './components/SignInPage';
import { SignUpPage } from './components/SignUpPage';
import { ForgotPasswordPage } from './components/ForgotPasswordPage';
import { AboutPage } from './components/AboutPage';
import { CareersPage } from './components/CareersPage';
import { ContactPage } from './components/ContactPage';
import { PrivacyPolicyPage } from './components/PrivacyPolicyPage';
import { TermsOfServicePage } from './components/TermsOfServicePage';
import { SecurityPage } from './components/SecurityPage';
import { BecomeAnAgentPage } from './components/BecomeAnAgentPage';
import { VerificationAgentPortal } from './components/VerificationAgentPortal';
import { JobBoard } from './components/JobBoard';
import { JobDetailView } from './components/JobDetailView';
import { JobPortalHome } from './components/JobPortalHome';
import { Icon, IconName } from './components/Icon';
import { UserRole } from './types';
import { useAppContext } from './components/AppContext';
import { ThemeToggle } from './components/ThemeToggle';
import { VerifiedHireLogo } from './components/VerifiedHireLogo';

type PublicAppView = 'landing' | 'jobPortal' | 'pricing' | 'signin' | 'signup' | 'forgotpassword' | 'about' | 'careers' | 'contact' | 'privacy' | 'terms' | 'security' | 'becomeAnAgent';
type AppView = PublicAppView | 'app';
type DashboardView = 'dashboard' | 'employer' | 'admin' | 'agent' | 'settings' | 'profileDetail' | 'jobBoard' | 'jobDetail';
interface ViewState {
  page: DashboardView;
  profileId?: string;
  jobId?: string;
}
type AdminViewRole = UserRole.Employer | UserRole.Admin;

interface NavLink {
    page: string;
    label: string;
    icon: IconName;
    isNewTab?: boolean;
}

const AdminRoleSwitcher: React.FC<{ role: AdminViewRole; setRole: (role: AdminViewRole) => void }> = ({ role, setRole }) => {
  const roles: { id: AdminViewRole; name: string; icon: IconName }[] = [
    { id: UserRole.Employer, name: 'View as Employer', icon: 'userGroup' },
    { id: UserRole.Admin, name: 'Admin Panel', icon: 'shieldCheck' },
  ];

  return (
    <div className="bg-slate-200 dark:bg-indigo-900 rounded-lg p-1 flex space-x-1">
      {roles.map((r) => (
        <button
          key={r.id}
          onClick={() => setRole(r.id)}
          className={`flex items-center text-xs sm:text-sm font-semibold py-1.5 px-3 rounded-md transition-colors ${
            role === r.id
              ? 'bg-white dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-600 dark:text-indigo-200 hover:bg-slate-100 dark:hover:bg-indigo-800'
          }`}
        >
          <Icon name={r.icon} className="h-4 w-4 mr-1.5" />
          {r.name}
        </button>
      ))}
    </div>
  );
};

const getInitialView = (): PublicAppView => {
    if (typeof window === 'undefined') return 'landing';
    const params = new URLSearchParams(window.location.search);
    const page = params.get('page') as PublicAppView;
    const publicViews: PublicAppView[] = ['landing', 'jobPortal', 'pricing', 'signin', 'signup', 'forgotpassword', 'about', 'careers', 'contact', 'privacy', 'terms', 'security', 'becomeAnAgent'];
    if (page && publicViews.includes(page)) {
        return page;
    }
    return 'landing';
};


const App: React.FC = () => {
  const { getProfileById, currentUserRole, loginUser, logoutUser } = useAppContext();
  const [currentView, setCurrentView] = useState<AppView>(getInitialView());
  const [loggedInRole, setLoggedInRole] = useState<UserRole | null>(() => currentUserRole);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [activeRoleView, setActiveRoleView] = useState<UserRole>(() => currentUserRole || UserRole.JobSeeker);
  const [signInTarget, setSignInTarget] = useState<'jobSeeker' | 'employer' | 'agent' | 'admin' | 'all'>('all');
  const [pendingRedirect, setPendingRedirect] = useState<{ viewState: ViewState; noticeMessage?: string } | null>(null);
  
  const [dashboardViewState, setDashboardViewState] = useState<ViewState>({ page: 'dashboard' });

  // Sync state if currentUserRole updates in context
  useEffect(() => {
    if (currentUserRole && !loggedInRole) {
      setLoggedInRole(currentUserRole);
      setActiveRoleView(currentUserRole);
    }
  }, [currentUserRole]);

  const handleLogin = (role: UserRole, userIdentifier?: string) => {
    loginUser(userIdentifier || '', role);
    setLoggedInRole(role);
    setActiveRoleView(role);
    setCurrentView('app');

    if (pendingRedirect) {
      setDashboardViewState(pendingRedirect.viewState);
      setPendingRedirect(null);
    } else {
      if (role === UserRole.JobSeeker) setDashboardViewState({ page: 'dashboard' });
      else if (role === UserRole.Employer) setDashboardViewState({ page: 'employer' });
      else if (role === UserRole.Admin) setDashboardViewState({ page: 'admin' });
      else if (role === UserRole.Agent) setDashboardViewState({ page: 'agent' });
    }
    window.scrollTo(0, 0);
  };
  
  const handleLogout = () => {
    logoutUser();
    setLoggedInRole(null);
    setPendingRedirect(null);
    setCurrentView('landing');
    window.scrollTo(0, 0);
  };

  const handleAdminRoleSwitch = (role: AdminViewRole) => {
    setActiveRoleView(role);
    if (role === UserRole.Employer) {
        setDashboardViewState({ page: 'employer' });
    } else if (role === UserRole.Admin) {
        setDashboardViewState({ page: 'admin' });
    }
  }
  
  const navigateToProfile = (profileId: string) => {
    setDashboardViewState({ page: 'profileDetail', profileId });
  };

  const navigateToJob = (jobId: string) => {
    setDashboardViewState({ page: 'jobDetail', jobId });
  };

  const navigateBack = () => {
    if (dashboardViewState.page === 'jobDetail') {
        setDashboardViewState({ page: 'jobBoard' });
        return;
    }
    if (activeRoleView === UserRole.Employer) setDashboardViewState({ page: 'employer' });
    else if (activeRoleView === UserRole.Admin) setDashboardViewState({ page: 'admin' });
    else if (activeRoleView === UserRole.Agent) setDashboardViewState({ page: 'agent' });
    else setDashboardViewState({ page: 'dashboard' });
  };
  
  const handlePublicNavigation = (
    view: string, 
    target?: 'jobSeeker' | 'employer' | 'agent' | 'admin' | 'all',
    options?: { redirectTarget?: ViewState; message?: string; profileId?: string; jobId?: string }
  ) => {
      const publicViews: PublicAppView[] = ['landing', 'jobPortal', 'pricing', 'signin', 'signup', 'forgotpassword', 'about', 'careers', 'contact', 'privacy', 'terms', 'security', 'becomeAnAgent'];
      const dashboardViews: DashboardView[] = ['dashboard', 'employer', 'admin', 'agent', 'settings', 'jobBoard', 'profileDetail', 'jobDetail'];

      if (dashboardViews.includes(view as DashboardView)) {
          if (loggedInRole) {
              setCurrentView('app');
              setDashboardViewState({ 
                page: view as DashboardView,
                profileId: options?.profileId,
                jobId: options?.jobId,
              });
              window.scrollTo(0, 0);
              return;
          } else {
              setSignInTarget(target || 'jobSeeker');
              setPendingRedirect({
                viewState: {
                  page: view as DashboardView,
                  profileId: options?.profileId,
                  jobId: options?.jobId,
                },
                noticeMessage: options?.message || `Please sign in to access the ${view === 'jobBoard' ? 'Job Board' : view} section.`
              });
              setCurrentView('signin');
              window.scrollTo(0, 0);
              return;
          }
      }

      if (view === 'signin') {
          if (target) setSignInTarget(target);
          else setSignInTarget('all');
          
          if (options?.redirectTarget) {
            setPendingRedirect({
              viewState: options.redirectTarget,
              noticeMessage: options.message,
            });
          }
      }

      if (publicViews.includes(view as PublicAppView)) {
          setCurrentView(view as PublicAppView);
      } else {
          setCurrentView('landing');
      }
      window.scrollTo(0, 0);
  };

  const getTargetDashboardPage = (): DashboardView => {
    if (loggedInRole === UserRole.JobSeeker) {
        return 'dashboard';
    }
    if (loggedInRole === UserRole.Employer) {
        return 'employer';
    }
    if (loggedInRole === UserRole.Agent) {
        return 'agent';
    }
    if (loggedInRole === UserRole.Admin) {
        if (activeRoleView === UserRole.Employer) {
            return 'employer';
        }
        return 'admin';
    }
    return 'dashboard';
  };

  const navLinks: NavLink[] = useMemo(() => {
    const homeLink: NavLink = { page: 'landing', label: 'Home', icon: 'home' };
    const agentLink: NavLink = { page: 'becomeAnAgent', label: 'Become an Agent', icon: 'shieldCheck' };
    
    if (!loggedInRole) {
        return [
            homeLink,
            { page: 'jobPortal', label: 'Job Portal', icon: 'briefcase' },
            agentLink,
            { page: 'pricing', label: 'Pricing', icon: 'dollarSign' },
            { page: 'signin', label: 'Sign In', icon: 'login' },
        ];
    }

    const commonLinks: NavLink[] = [
      { page: 'settings', label: 'Settings', icon: 'cog' },
    ];

    switch (loggedInRole) {
      case UserRole.JobSeeker:
        return [
            { page: 'dashboard', label: 'My Dashboard', icon: 'home' }, 
            { page: 'jobBoard', label: 'Job Board', icon: 'briefcase' },
            { page: 'jobPortal', label: 'Job Portal', icon: 'globeAlt' },
            agentLink, 
            ...commonLinks
        ];
      case UserRole.Employer:
        return [
            { page: 'employer', label: 'Candidate Search', icon: 'userGroup' }, 
            { page: 'jobPortal', label: 'Job Portal', icon: 'briefcase' },
            { page: 'pricing', label: 'Pricing', icon: 'dollarSign' },
            ...commonLinks
        ];
      case UserRole.Admin: {
         const currentAdminView: AdminViewRole = (activeRoleView === UserRole.Admin || activeRoleView === UserRole.Employer) ? activeRoleView : UserRole.Admin;
         const roleBasedLink: NavLink = currentAdminView === UserRole.Employer
            ? { page: 'employer', label: 'Candidate Search', icon: 'userGroup' }
            : { page: 'admin', label: 'Verification Panel', icon: 'shieldCheck' };
         return [
            roleBasedLink, 
            { page: 'jobPortal', label: 'Job Portal', icon: 'globeAlt' },
            agentLink, 
            ...commonLinks
         ];
      }
      case UserRole.Agent:
        return [
            { page: 'dashboard', label: 'Verification Audits', icon: 'shieldCheck' },
            { page: 'jobBoard', label: 'Job Board', icon: 'briefcase' },
            { page: 'jobPortal', label: 'Job Portal', icon: 'globeAlt' },
            ...commonLinks
        ];
      default:
        return [agentLink, ...commonLinks];
    }
  }, [loggedInRole, activeRoleView]);

  const handleNavClick = (page: string) => {
      const publicViews: PublicAppView[] = ['landing', 'jobPortal', 'pricing', 'signin', 'signup', 'forgotpassword', 'about', 'careers', 'contact', 'privacy', 'terms', 'security', 'becomeAnAgent'];
      const dashboardViews: DashboardView[] = ['dashboard', 'employer', 'admin', 'agent', 'settings', 'jobBoard', 'profileDetail', 'jobDetail'];

      if (dashboardViews.includes(page as DashboardView)) {
          if (loggedInRole) {
              setCurrentView('app');
              setDashboardViewState({ page: page as DashboardView });
              window.scrollTo(0, 0);
              return;
          } else {
              setSignInTarget('jobSeeker');
              setCurrentView('signin');
              window.scrollTo(0, 0);
              return;
          }
      }

      if (publicViews.includes(page as PublicAppView)) {
          handlePublicNavigation(page as PublicAppView);
      }
  };
  
  const renderAppContent = () => {
    let currentDisplayPage = dashboardViewState.page;
    if (loggedInRole === UserRole.Admin) {
        if (activeRoleView !== UserRole.Admin && activeRoleView !== UserRole.Employer) {
            // This state is not expected, default to admin view
            currentDisplayPage = 'admin';
        } else {
            const currentAdminView: AdminViewRole = activeRoleView;
            currentDisplayPage = currentAdminView === UserRole.Admin ? 'admin' : 'employer';
        }
        
        if (dashboardViewState.page === 'settings') {
            currentDisplayPage = 'settings';
        }
    }

    if (dashboardViewState.page === 'profileDetail') {
        const profile = getProfileById(dashboardViewState.profileId!);
        if (profile) {
            return <ProfileView profile={profile} viewerRole={activeRoleView} onBack={navigateBack} />;
        }
        return <div>Profile not found</div>;
    }

    if (dashboardViewState.page === 'jobDetail') {
        const { jobs } = useAppContext();
        const job = jobs.find(j => j.id === dashboardViewState.jobId);
        if (job) {
            return <JobDetailView job={job} onBack={navigateBack} />;
        }
        return <div>Job not found</div>;
    }

    switch (currentDisplayPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'jobBoard':
        return <JobBoard onViewJob={navigateToJob} />;
      case 'employer':
        return <EmployerDashboard onViewProfile={navigateToProfile} />;
      case 'admin':
        return <AdminDashboard onViewProfile={navigateToProfile} />;
      case 'agent':
        return <VerificationAgentPortal />;
      case 'settings':
        return <SettingsPage />;
      default:
        if(loggedInRole === UserRole.JobSeeker) return <Dashboard />;
        if(loggedInRole === UserRole.Employer) return <EmployerDashboard onViewProfile={navigateToProfile} />;
        if(loggedInRole === UserRole.Admin) return <AdminDashboard onViewProfile={navigateToProfile} />;
        if(loggedInRole === UserRole.Agent) return <VerificationAgentPortal />;
        return <Dashboard />;
    }
  };

  const renderPublicContent = () => {
    switch(currentView) {
        case 'landing':
            return <LandingPage onNavigate={handlePublicNavigation} isLoggedIn={isLoggedIn} userRole={loggedInRole} />;
        case 'jobPortal':
            return <JobPortalHome onNavigate={handlePublicNavigation} isLoggedIn={isLoggedIn} userRole={loggedInRole} />;
        case 'pricing':
            return <PricingPage onNavigate={handlePublicNavigation} />;
        case 'signin':
            return <SignInPage onLogin={handleLogin} onNavigate={handlePublicNavigation} showRole={signInTarget} redirectNotice={pendingRedirect?.noticeMessage} />;
        case 'signup':
            return <SignUpPage onNavigate={handlePublicNavigation} onLogin={handleLogin} />;
        case 'forgotpassword':
            return <ForgotPasswordPage onNavigate={handlePublicNavigation} />;
        case 'about':
            return <AboutPage onNavigate={handlePublicNavigation} />;
        case 'careers':
            return <CareersPage onNavigate={handlePublicNavigation} />;
        case 'contact':
            return <ContactPage onNavigate={handlePublicNavigation} />;
        case 'privacy':
            return <PrivacyPolicyPage onNavigate={handlePublicNavigation} />;
        case 'terms':
            return <TermsOfServicePage onNavigate={handlePublicNavigation} />;
        case 'security':
            return <SecurityPage onNavigate={handlePublicNavigation} />;
        case 'becomeAnAgent':
            return <BecomeAnAgentPage onNavigate={handlePublicNavigation} />;
        default:
            return <LandingPage onNavigate={handlePublicNavigation} isLoggedIn={isLoggedIn} userRole={loggedInRole} />;
    }
  };

  const isLoggedIn = !!loggedInRole;

  const adminViewRoleForSwitcher = (activeRoleView === UserRole.Admin || activeRoleView === UserRole.Employer) ? activeRoleView : null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-indigo-50 flex flex-col transition-colors duration-500 selection:bg-indigo-600 selection:text-white">
      <header className="bg-white/90 dark:bg-slate-950/90 backdrop-blur-2xl border-b border-slate-200/60 dark:border-indigo-900/40 sticky top-0 z-50 transition-all duration-500">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex justify-between items-center h-24">
            <div className="flex items-center gap-8">
              <VerifiedHireLogo 
                variant="horizontal" 
                size="md" 
                showTagline={false}
                onClick={() => {
                  if (isLoggedIn) {
                    setCurrentView('app');
                    setDashboardViewState({ page: getTargetDashboardPage() });
                  } else {
                    handlePublicNavigation('landing');
                  }
                }}
              />

              {isLoggedIn && loggedInRole === UserRole.Admin && adminViewRoleForSwitcher && (
                <div className="hidden xl:block">
                   <AdminRoleSwitcher role={adminViewRoleForSwitcher} setRole={handleAdminRoleSwitch} />
                </div>
              )}
            </div>
            
            <nav className="hidden lg:flex items-center space-x-1">
                {isLoggedIn && (
                    <div className="flex items-center mr-6 px-4 py-2 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-xl border border-indigo-100/50 dark:border-indigo-900/30">
                        <div className="h-2 w-2 rounded-full bg-indigo-600 mr-2 animate-pulse shadow-[0_0_10px_rgba(79,70,229,0.4)]"></div>
                        <span className="text-xs font-semibold text-slate-600 dark:text-indigo-300">
                            Logged in as <span className="font-bold text-indigo-700 dark:text-indigo-400 ml-1">
                                {loggedInRole === UserRole.Employer ? 'Employer' : 
                                 loggedInRole === UserRole.Admin ? 'Admin' : 
                                 loggedInRole === UserRole.Agent ? 'Agent' : 'Job Seeker'}
                            </span>
                        </span>
                    </div>
                )}

                <div className="flex items-center space-x-2">
                  {navLinks.map(link => {
                      const isActive = currentView === 'app' ? dashboardViewState.page === link.page : currentView === link.page;
                      return (
                          <button 
                            key={link.page} 
                            onClick={() => handleNavClick(link.page)} 
                            className={`flex items-center px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                              isActive
                              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                              : 'text-slate-600 dark:text-indigo-200 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5'
                            }`}
                          >
                            <Icon name={link.icon} className={`h-4 w-4 mr-2 ${isActive ? 'text-white' : 'text-indigo-500 opacity-70'}`}/>
                            {link.label}
                          </button>
                      );
                  })}
                </div>

                {isLoggedIn && (
                    <button onClick={handleLogout} className="flex items-center ml-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-indigo-200 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all">
                        <Icon name="logout" className="h-4 w-4 mr-2 text-red-500"/>
                        Logout
                    </button>
                )}
                
                <div className="ml-4 pl-4 border-l border-slate-200 dark:border-indigo-900/50">
                    <ThemeToggle />
                </div>
            </nav>

            <div className="lg:hidden flex items-center gap-3">
                <ThemeToggle />
                <button 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  aria-label="Toggle navigation menu"
                  className="h-11 w-11 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center border border-slate-200 dark:border-indigo-900/50 hover:bg-slate-200 dark:hover:bg-indigo-900/50 transition-colors"
                >
                    <Icon name={isMobileMenuOpen ? "xMark" : "menu"} className="h-6 w-6 text-slate-700 dark:text-indigo-200" />
                </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-indigo-900/50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl px-4 pt-4 pb-6 space-y-2 shadow-2xl animate-in slide-in-from-top-4 duration-300">
            {isLoggedIn && (
              <div className="flex items-center px-4 py-3 mb-3 bg-indigo-50/70 dark:bg-indigo-950/50 rounded-xl border border-indigo-100 dark:border-indigo-900/40">
                <div className="h-2.5 w-2.5 rounded-full bg-indigo-600 mr-2.5 animate-pulse shadow-[0_0_10px_rgba(79,70,229,0.5)]"></div>
                <span className="text-xs font-semibold text-slate-700 dark:text-indigo-200">
                  Active Role: <span className="font-bold text-indigo-700 dark:text-indigo-300 capitalize">{loggedInRole === UserRole.Employer ? 'Employer' : loggedInRole === UserRole.Admin ? 'Admin' : 'Job Seeker'}</span>
                </span>
              </div>
            )}
            <div className="space-y-1">
              {navLinks.map(link => {
                const isActive = currentView === 'app' ? dashboardViewState.page === link.page : currentView === link.page;
                return (
                  <button
                    key={link.page}
                    onClick={() => {
                      handleNavClick(link.page);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-700 dark:text-indigo-200 hover:bg-slate-100 dark:hover:bg-white/5'
                    }`}
                  >
                    <Icon name={link.icon} className={`h-5 w-5 mr-3 ${isActive ? 'text-white' : 'text-indigo-500'}`} />
                    {link.label}
                  </button>
                );
              })}
            </div>

            {isLoggedIn && (
              <div className="pt-3 border-t border-slate-200 dark:border-indigo-900/40 mt-3">
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center px-4 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                >
                  <Icon name="logout" className="h-5 w-5 mr-3 text-red-500" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </header>
      <main className="flex-grow">
          {currentView === 'app' && isLoggedIn ? (
             <div className="container mx-auto px-4 lg:px-8 py-12">{renderAppContent()}</div>
          ) : (
            renderPublicContent()
          )}
      </main>
      <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-indigo-900 shadow-[0_-20px_50px_rgba(0,0,0,0.02)]">
        <div className="container mx-auto px-4 lg:px-8 py-20">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-16">
                <div className="md:col-span-2">
                    <VerifiedHireLogo 
                      variant="horizontal" 
                      size="lg" 
                      onClick={() => {
                        if (isLoggedIn) {
                          setCurrentView('app');
                          setDashboardViewState({ page: getTargetDashboardPage() });
                        } else {
                          handlePublicNavigation('landing');
                        }
                      }}
                    />
                    <p className="mt-6 text-lg text-slate-500 dark:text-indigo-300 leading-relaxed max-w-sm">The world's first surgical-grade verification layer for professional integrity.</p>
                </div>
                {[
                    { t: 'Strategic', l: [{p: 'jobPortal', n: 'Job Portal'}, {p: 'pricing', n: 'Pricing'}, {p: 'signin', n: 'Access'}] },
                    { t: 'Network', l: [{p: 'about', n: 'About'}, {p: 'careers', n: 'Careers'}, {p: 'contact', n: 'Contact'}] },
                    { t: 'Security', l: [{p: 'privacy', n: 'Privacy'}, {p: 'terms', n: 'Terms'}, {p: 'security', n: 'Compliance'}] },
                    { t: 'Ecosystem', l: [{p: 'becomeAnAgent', n: 'Field Agents'}, {p: 'landing', n: 'Overview'}] }
                ].map((col, i) => (
                    <div key={i}>
                        <h3 className="text-xs font-black text-slate-900 dark:text-white tracking-[0.2em] uppercase mb-8">{col.t}</h3>
                        <ul className="space-y-4">
                            {col.l.map((link, j) => (
                                <li key={j}><button onClick={() => handlePublicNavigation(link.p as any)} className="text-sm font-semibold text-slate-500 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-white transition-colors">{link.n}</button></li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            <div className="mt-20 pt-10 border-t border-slate-100 dark:border-indigo-900 flex flex-col md:flex-row justify-between items-center text-slate-400 dark:text-indigo-500 text-xs font-bold uppercase tracking-widest gap-6">
                <p>&copy; {new Date().getFullYear()} VerifiedHire Architecture. All Rights Reserved.</p>
                <div className="flex gap-10">
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 transition-colors">Twitter</a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 transition-colors">LinkedIn</a>
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 transition-colors">Github</a>
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default App;