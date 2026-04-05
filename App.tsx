

import React, { useState, useMemo } from 'react';
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
import { JobBoard } from './components/JobBoard';
import { JobDetailView } from './components/JobDetailView';
import { JobPortalHome } from './components/JobPortalHome';
import { Icon, IconName } from './components/Icon';
import { UserRole } from './types';
import { useAppContext } from './components/AppContext';
import { ThemeToggle } from './components/ThemeToggle';

type PublicAppView = 'landing' | 'jobPortal' | 'pricing' | 'signin' | 'signup' | 'forgotpassword' | 'about' | 'careers' | 'contact' | 'privacy' | 'terms' | 'security' | 'becomeAnAgent';
type AppView = PublicAppView | 'app';
type DashboardView = 'dashboard' | 'employer' | 'admin' | 'settings' | 'profileDetail' | 'jobBoard' | 'jobDetail';
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
  const [currentView, setCurrentView] = useState<AppView>(getInitialView());
  const [loggedInRole, setLoggedInRole] = useState<UserRole | null>(null);
  
  const [activeRoleView, setActiveRoleView] = useState<UserRole>(UserRole.JobSeeker);
  const [signInTarget, setSignInTarget] = useState<'jobSeeker' | 'employer' | 'all'>('all');
  
  const [dashboardViewState, setDashboardViewState] = useState<ViewState>({ page: 'dashboard' });
  const { getProfileById } = useAppContext();

  const handleLogin = (role: UserRole) => {
    setLoggedInRole(role);
    setActiveRoleView(role);
    setCurrentView('app');
    if (role === UserRole.JobSeeker) setDashboardViewState({ page: 'dashboard' });
    if (role === UserRole.Employer) setDashboardViewState({ page: 'employer' });
    if (role === UserRole.Admin) setDashboardViewState({ page: 'admin' });
    if (role === UserRole.Agent) setDashboardViewState({ page: 'dashboard' });
  };
  
  const handleLogout = () => {
    setLoggedInRole(null);
    setCurrentView('landing');
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
    else setDashboardViewState({ page: 'dashboard' });
  };
  
  const handlePublicNavigation = (view: PublicAppView, target?: 'jobSeeker' | 'employer') => {
      if (view === 'signin' && target) {
          setSignInTarget(target);
      } else {
          setSignInTarget('all');
      }
      setCurrentView(view);
      window.scrollTo(0, 0);
  }

  const getTargetDashboardPage = (): DashboardView => {
    if (loggedInRole === UserRole.JobSeeker) {
        return 'dashboard';
    }
    if (loggedInRole === UserRole.Employer) {
        return 'employer';
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
            { page: 'jobPortal', label: 'Job Portal', icon: 'briefcase' },
            agentLink, 
            { page: 'dashboard', label: 'My Dashboard', icon: 'home' }, 
            { page: 'jobBoard', label: 'Job Board', icon: 'briefcase' },
            ...commonLinks
        ];
      case UserRole.Employer:
        return [
            homeLink, 
            { page: 'jobPortal', label: 'Job Portal', icon: 'briefcase' },
            { page: 'pricing', label: 'Pricing', icon: 'dollarSign' }
        ];
      case UserRole.Admin: {
         if (activeRoleView !== UserRole.Admin && activeRoleView !== UserRole.Employer) {
            // This state is not expected, but we can default to the admin view to be safe.
            const roleBasedLink: NavLink = { page: 'admin', label: 'Verification Panel', icon: 'shieldCheck' };
            return [
                { page: 'jobPortal', label: 'Job Portal', icon: 'briefcase' },
                agentLink, 
                roleBasedLink, 
                ...commonLinks
            ];
         }
         const currentAdminView: AdminViewRole = activeRoleView;
         const roleBasedLink: NavLink = currentAdminView === UserRole.Employer
            ? { page: 'employer', label: 'Candidate Search', icon: 'userGroup' }
            : { page: 'admin', label: 'Verification Panel', icon: 'shieldCheck' };
         return [
            { page: 'jobPortal', label: 'Job Portal', icon: 'briefcase' },
            agentLink, 
            roleBasedLink, 
            ...commonLinks
         ];
      }
      default:
        return [agentLink, ...commonLinks];
    }
  }, [loggedInRole, activeRoleView]);

  const handleNavClick = (page: string) => {
      const publicViews: PublicAppView[] = ['landing', 'jobPortal', 'pricing', 'signin', 'signup', 'forgotpassword', 'about', 'careers', 'contact', 'privacy', 'terms', 'security', 'becomeAnAgent'];
      if ((publicViews as readonly string[]).includes(page)) {
          handlePublicNavigation(page as PublicAppView);
      } else if (loggedInRole) {
           const dashboardViews: DashboardView[] = ['dashboard', 'employer', 'admin', 'settings', 'jobBoard'];
           if (dashboardViews.includes(page as DashboardView)) {
                setDashboardViewState({ page: page as DashboardView });
           }
      }
  }
  
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
      case 'settings':
        return <SettingsPage />;
      default:
        if(loggedInRole === UserRole.JobSeeker) return <Dashboard />;
        if(loggedInRole === UserRole.Employer) return <EmployerDashboard onViewProfile={navigateToProfile} />;
        if(loggedInRole === UserRole.Admin) return <AdminDashboard onViewProfile={navigateToProfile} />;
        return <div>Error</div>
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
            return <SignInPage onLogin={handleLogin} onNavigate={handlePublicNavigation} showRole={signInTarget} />;
        case 'signup':
            return <SignUpPage onNavigate={handlePublicNavigation} />;
        case 'forgotpassword':
            return <ForgotPasswordPage onNavigate={handlePublicNavigation} />;
        case 'about':
            return <AboutPage />;
        case 'careers':
            return <CareersPage />;
        case 'contact':
            return <ContactPage />;
        case 'privacy':
            return <PrivacyPolicyPage />;
        case 'terms':
            return <TermsOfServicePage />;
        case 'security':
            return <SecurityPage />;
        case 'becomeAnAgent':
            return <BecomeAnAgentPage onNavigate={handlePublicNavigation} />;
        default:
            return <LandingPage onNavigate={handlePublicNavigation} />;
    }
  };

  const isLoggedIn = !!loggedInRole;

  const adminViewRoleForSwitcher = (activeRoleView === UserRole.Admin || activeRoleView === UserRole.Employer) ? activeRoleView : null;

  return (
    <div className="min-h-screen bg-white dark:bg-indigo-950 font-sans text-slate-800 dark:text-white flex flex-col transition-colors duration-300">
      <header className="bg-white/80 dark:bg-indigo-950/80 backdrop-blur-sm shadow-sm sticky top-0 z-20 transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 flex-wrap">
            <div className="flex-shrink-0 mb-2 sm:mb-0">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white cursor-pointer" onClick={() => isLoggedIn ? setDashboardViewState({ page: getTargetDashboardPage() }) : handlePublicNavigation('landing')}>
                <span className="text-indigo-600 dark:text-indigo-400">Verified</span>Hire
              </h1>
            </div>
            {isLoggedIn && loggedInRole === UserRole.Admin && adminViewRoleForSwitcher && (
                <div className="order-first sm:order-none w-full sm:w-auto flex justify-center mb-2 sm:mb-0">
                   <AdminRoleSwitcher role={adminViewRoleForSwitcher} setRole={handleAdminRoleSwitch} />
                </div>
            )}
            <nav className="flex items-center space-x-1">
                {isLoggedIn && (
                    <div className="hidden md:flex items-center mr-4 px-3 py-1.5 bg-slate-100 dark:bg-indigo-900/40 rounded-full border border-slate-200 dark:border-indigo-800">
                        <div className="h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                        <span className="text-xs font-medium text-slate-600 dark:text-indigo-200">
                            Logged in as <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                                {loggedInRole === UserRole.Employer ? 'Employer' : 
                                 loggedInRole === UserRole.Admin ? 'Admin' : 
                                 loggedInRole === UserRole.Agent ? 'Agent' : 'Job Seeker'}
                            </span>
                        </span>
                    </div>
                )}
                {navLinks.map(link => {
                    const isActive = (isLoggedIn ? dashboardViewState.page === link.page : currentView === link.page);
                    const className = `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive
                        ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300'
                        : 'text-slate-600 dark:text-indigo-200 hover:bg-slate-100 dark:hover:bg-indigo-900/50 hover:text-slate-900 dark:hover:text-white'
                    }`;

                    if (link.isNewTab) {
                        return (
                            <a
                                key={link.page}
                                href={`/?page=${link.page}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={className}
                            >
                               <Icon name={link.icon} className="h-4 w-4 mr-1.5"/>
                               {link.label}
                            </a>
                        );
                    }
                    
                    return (
                        <button
                          key={link.page}
                          onClick={() => handleNavClick(link.page)}
                          className={className}
                        >
                           <Icon name={link.icon} className="h-4 w-4 mr-1.5"/>
                           {link.label}
                        </button>
                    );
                })}
                {isLoggedIn && (
                    <button onClick={handleLogout} className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-slate-600 dark:text-indigo-200 hover:bg-slate-100 dark:hover:bg-indigo-900/50 hover:text-slate-900 dark:hover:text-white">
                        <Icon name="logout" className="h-4 w-4 mr-1.5"/>
                        Logout
                    </button>
                )}
                 <div className="ml-2">
                    <ThemeToggle />
                </div>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-grow">
          {isLoggedIn ? (
             <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">{renderAppContent()}</div>
          ) : (
            renderPublicContent()
          )}
      </main>
      <footer className="bg-white dark:bg-black/20 border-t border-slate-200 dark:border-indigo-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-12 grid grid-cols-2 md:grid-cols-5 gap-8">
                <div className="col-span-2 md:col-span-1">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white cursor-pointer" onClick={() => isLoggedIn ? setDashboardViewState({ page: getTargetDashboardPage() }) : handlePublicNavigation('landing')}>
                        <span className="text-indigo-600 dark:text-indigo-400">Verified</span>Hire
                    </h1>
                    <p className="mt-2 text-sm text-slate-500 dark:text-indigo-300">The trusted platform for verified talent in Kenya.</p>
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white tracking-wider uppercase">Solutions</h3>
                    <ul className="mt-4 space-y-2">
                        <li><button onClick={() => handlePublicNavigation('jobPortal')} className="text-sm text-slate-500 dark:text-indigo-300 hover:text-slate-900 dark:hover:text-white">Job Portal</button></li>
                        <li><button onClick={() => handlePublicNavigation('signin', 'employer')} className="text-sm text-slate-500 dark:text-indigo-300 hover:text-slate-900 dark:hover:text-white">For Employers</button></li>
                        <li><button onClick={() => handlePublicNavigation('signin', 'jobSeeker')} className="text-sm text-slate-500 dark:text-indigo-300 hover:text-slate-900 dark:hover:text-white">For Job Seekers</button></li>
                        <li><button onClick={() => handlePublicNavigation('pricing')} className="text-sm text-slate-500 dark:text-indigo-300 hover:text-slate-900 dark:hover:text-white">Pricing</button></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white tracking-wider uppercase">Company</h3>
                    <ul className="mt-4 space-y-2">
                        <li><button onClick={() => handlePublicNavigation('about')} className="text-sm text-slate-500 dark:text-indigo-300 hover:text-slate-900 dark:hover:text-white">About</button></li>
                        <li><button onClick={() => handlePublicNavigation('careers')} className="text-sm text-slate-500 dark:text-indigo-300 hover:text-slate-900 dark:hover:text-white">Careers</button></li>
                        <li><button onClick={() => handlePublicNavigation('contact')} className="text-sm text-slate-500 dark:text-indigo-300 hover:text-slate-900 dark:hover:text-white">Contact</button></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white tracking-wider uppercase">Legal</h3>
                    <ul className="mt-4 space-y-2">
                        <li><button onClick={() => handlePublicNavigation('privacy')} className="text-sm text-slate-500 dark:text-indigo-300 hover:text-slate-900 dark:hover:text-white">Privacy Policy</button></li>
                        <li><button onClick={() => handlePublicNavigation('terms')} className="text-sm text-slate-500 dark:text-indigo-300 hover:text-slate-900 dark:hover:text-white">Terms of Service</button></li>
                    </ul>
                </div>
                 <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white tracking-wider uppercase">Platform</h3>
                    <ul className="mt-4 space-y-2">
                        <li><button onClick={() => handlePublicNavigation('security')} className="text-sm text-slate-500 dark:text-indigo-300 hover:text-slate-900 dark:hover:text-white">Security</button></li>
                        <li><button onClick={() => handlePublicNavigation('becomeAnAgent')} className="text-sm text-slate-500 dark:text-indigo-300 hover:text-slate-900 dark:hover:text-white">Become an Agent</button></li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-slate-200 dark:border-indigo-800 py-4 text-center text-slate-500 dark:text-indigo-300 text-sm">
                &copy; {new Date().getFullYear()} VerifiedHire. All rights reserved.
            </div>
        </div>
      </footer>
    </div>
  );
};

export default App;