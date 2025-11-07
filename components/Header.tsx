import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../hooks/useTheme';
import { AuthUser } from '../types';

interface HeaderProps {
    streak: number;
    xp: number;
    user: AuthUser | null;
    onViewProgress: () => void;
    onHomeClick: () => void;
    showHomeButton: boolean;
    onSignOut: () => void;
    onRequestSignIn: () => void;
}

const AppLogo = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-primary">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.627 48.627 0 0 1 12 20.904a48.627 48.627 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.902 59.902 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
    </svg>
);

const FireIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-orange-400">
        <path fillRule="evenodd" d="M10 2c-1.716 0-3.408.106-5.07.31C3.806 2.45 3 3.414 3 4.517V5.25a.75.75 0 0 0 1.5 0V4.517c0-.28.164-.533.41-.631A20.74 20.74 0 0 1 10 3.5c1.64 0 3.26.095 4.839.277.247.1.411.35.411.631V5.25a.75.75 0 0 0 1.5 0V4.517c0-1.103-.806-2.068-1.93-2.207A21.91 21.91 0 0 0 10 2Z" clipRule="evenodd" />
        <path d="M5.53 5.603a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.06 0l2.25-2.25a.75.75 0 0 0-1.06-1.06L9 6.84V6.75a2.25 2.25 0 0 1 2.25-2.25c.34 0 .672.083.969.233a.75.75 0 0 0 .8-.433a3.75 3.75 0 0 0-1.769-.383C8.7 4.25 7.25 5.642 7.25 7.25v.01l-1.72-1.657Z" />
        <path d="M9 8.25a.75.75 0 0 0-1.5 0v5.69l-1.72-1.657a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.06 0l2.25-2.25a.75.75 0 0 0-1.06-1.06L9 13.19V8.25Z" />
        <path d="M11.25 5.25a2.25 2.25 0 0 0-2.25 2.25v.01l1.72-1.657a.75.75 0 0 0 1.06 1.06l-2.25 2.25a.75.75 0 0 0 0 1.06l2.25 2.25a.75.75 0 0 0 1.06-1.06l-1.72-1.657V7.5a2.25 2.25 0 0 0-2.25-2.25Z" />
    </svg>
);

const StarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-yellow-400">
        <path fillRule="evenodd" d="M10.868 2.884c.321-.662 1.215-.662 1.536 0l1.822 3.758 4.144.604c.729.106 1.018.996.49 1.505l-2.997 2.92.707 4.127c.124.725-.636 1.282-1.28.944l-3.706-1.948-3.706 1.948c-.644.338-1.405-.219-1.28-.944l.707-4.127-2.997-2.92c-.528-.509-.239-1.399.49-1.505l4.144-.604 1.822-3.758Z" clipRule="evenodd" />
    </svg>
);

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
  </svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
  </svg>
);

const HomeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
);

const UserCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3"><path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" /></svg>;


const Header: React.FC<HeaderProps> = ({ user, streak, xp, onViewProgress, onHomeClick, showHomeButton, onSignOut, onRequestSignIn }) => {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  return (
    <header className="bg-surface-overlay backdrop-blur-lg border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
            <AppLogo />
            <h1 className="text-xl md:text-2xl font-bold text-primary tracking-tight">
              IELTS Scholar
            </h1>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
            {user && (
              <>
                <div className="hidden sm:flex items-center space-x-2 bg-surface-muted px-3 py-1.5 rounded-full">
                    <FireIcon />
                    <span className="font-bold text-sm text-primary">{streak}</span>
                </div>
                <div className="hidden sm:flex items-center space-x-2 bg-surface-muted px-3 py-1.5 rounded-full">
                    <StarIcon />
                    <span className="font-bold text-sm text-primary">{xp}</span>
                </div>
              </>
            )}
             {showHomeButton && (
                 <button
                    onClick={onHomeClick}
                    className="p-2 rounded-full text-secondary hover:bg-surface-muted transition-colors"
                    aria-label="Back to Dashboard"
                >
                    <HomeIcon />
                </button>
            )}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-secondary hover:bg-surface-muted transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <MoonIcon /> : <SunIcon />}
            </button>
            
            {user ? (
                <div className="relative" ref={menuRef}>
                    <button onClick={() => setIsMenuOpen(prev => !prev)} className="block w-9 h-9 rounded-full overflow-hidden border-2 border-border hover:border-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-start">
                        <img src={user.photoURL || 'default-avatar.png'} alt="User avatar" className="w-full h-full object-cover" />
                    </button>
                    {isMenuOpen && (
                        <div className="absolute right-0 mt-2 w-60 bg-surface rounded-lg shadow-xl border border-border py-2 animate-fade-in-up origin-top-right">
                            <div className="px-4 py-2 border-b border-border">
                                <p className="text-sm text-secondary">Đã đăng nhập với</p>
                                <p className="font-semibold text-primary truncate">{user.displayName || user.email}</p>
                            </div>
                            <div className="py-1">
                                <button onClick={() => { onViewProgress(); setIsMenuOpen(false); }} className="w-full flex items-center px-4 py-2 text-sm text-primary hover:bg-surface-muted">
                                    <UserCircleIcon /> Xem tiến độ
                                </button>
                                <button onClick={onSignOut} className="w-full flex items-center px-4 py-2 text-sm text-error hover:bg-error/10">
                                    <LogoutIcon /> Đăng xuất
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <button
                    onClick={onRequestSignIn}
                    className="px-5 py-2 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors shadow-sm"
                >
                    Đăng nhập
                </button>
            )}
        </div>
      </div>
    </header>
  );
};

export default Header;