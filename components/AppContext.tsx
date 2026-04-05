
import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { JobSeekerProfile, VerificationStatus, UserRole } from '../types';
import { mockProfiles } from '../services/mockData';

export type Theme = 'light' | 'dark' | 'system';

interface AppContextType {
  profiles: JobSeekerProfile[];
  getProfileById: (id: string) => JobSeekerProfile | undefined;
  updateProfileStatus: (id: string, status: VerificationStatus, reason?: string) => void;
  toggleShortlist: (id: string) => void;
  getLoggedInSeeker: () => JobSeekerProfile;
  addUser: (user: Omit<JobSeekerProfile, 'id'>) => void;
  updateProfile: (profile: JobSeekerProfile) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profiles, setProfiles] = useState<JobSeekerProfile[]>(mockProfiles);
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
        return (localStorage.getItem('theme') as Theme) || 'system';
    }
    return 'system';
  });

  const setTheme = (newTheme: Theme) => {
    localStorage.setItem('theme', newTheme);
    setThemeState(newTheme);
  };
  
  useEffect(() => {
    const root = window.document.documentElement;
    const isDark =
      theme === 'dark' ||
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    root.classList.toggle('dark', isDark);
  }, [theme]);

  const getProfileById = useCallback((id: string) => {
    return profiles.find(p => p.id === id);
  }, [profiles]);

  const updateProfileStatus = useCallback((id: string, status: VerificationStatus, reason?: string) => {
    setProfiles(prevProfiles =>
      prevProfiles.map(p => {
        if (p.id === id) {
          const updatedProfile = { ...p, verificationStatus: status };
          if (status === VerificationStatus.REJECTED) {
            updatedProfile.rejectionReason = reason;
          }
          if (status === VerificationStatus.PENDING || status === VerificationStatus.VERIFIED) {
             delete updatedProfile.rejectionReason;
          }
          return updatedProfile;
        }
        return p;
      })
    );
  }, []);

  const toggleShortlist = useCallback((id: string) => {
    setProfiles(prevProfiles =>
      prevProfiles.map(p =>
        p.id === id ? { ...p, isShortlisted: !p.isShortlisted } : p
      )
    );
  }, []);
  
  const addUser = useCallback((user: Omit<JobSeekerProfile, 'id'>) => {
    const newUser: JobSeekerProfile = {
      ...user,
      id: `usr_${String(Date.now()).slice(-6)}`,
    };
    setProfiles(prevProfiles => [newUser, ...prevProfiles]);
  }, []);

  const updateProfile = useCallback((updatedProfile: JobSeekerProfile) => {
    setProfiles(prevProfiles =>
      prevProfiles.map(p =>
        p.id === updatedProfile.id ? updatedProfile : p
      )
    );
  }, []);
  
  // For demonstration, the profile with id 'usr_00001' is considered the logged-in user.
  const getLoggedInSeeker = useCallback(() => {
    const seeker = profiles.find(p => p.id === 'usr_00001');
    if (!seeker) {
        // Fallback to the first profile if the specific one isn't found, though it should be.
        return profiles[0];
    }
    return seeker;
  }, [profiles]);

  const value = {
    profiles,
    getProfileById,
    updateProfileStatus,
    toggleShortlist,
    getLoggedInSeeker,
    addUser,
    updateProfile,
    theme,
    setTheme,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};