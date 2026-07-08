import { useState } from 'react';
import { Flame, Menu, X, Coffee, Moon, Sun } from 'lucide-react';

interface NavbarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  currentPath: string;
  onNavigate: (path: string) => void;
}

export default function Navbar({ darkMode, onToggleDarkMode, currentPath, onNavigate }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: 'Hackathons', path: '/hackathons' },
    { label: 'Quiz', path: '/quiz' },
    { label: 'Stories', path: '/stories' },
    { label: 'Courses', path: '/courses' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-[#f2efe9] dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button 
            onClick={() => onNavigate('/')}
            className="flex items-center gap-2 group cursor-pointer text-left focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-black dark:bg-zinc-800 flex items-center justify-center text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-[#ff6b2b] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Coffee className="w-5 h-5 relative z-10 text-white" />
            </div>
            <span className="font-sans font-extrabold text-xl tracking-tight text-black dark:text-white">
              leetmaster<span className="text-[#ff6b2b]">.</span>
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.label}
                  onClick={() => onNavigate(item.path)}
                  className={`font-sans font-medium text-sm transition-colors relative py-1 cursor-pointer focus:outline-none ${
                    isActive ? 'text-[#ff6b2b]' : 'text-[#4a4a4a] dark:text-zinc-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  {item.label}
                  <span className={`absolute bottom-0 left-0 h-[2px] bg-[#ff6b2b] transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                </button>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={onToggleDarkMode}
              className="p-2 text-[#4a4a4a] dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-[#fcfbf9] dark:hover:bg-zinc-900 rounded-full transition-colors cursor-pointer"
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
            </button>
            
            <div className="flex items-center gap-1 bg-[#ff6b2b]/10 text-[#ff6b2b] px-3 py-1.5 rounded-full text-xs font-semibold">
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>127 Day Streak</span>
            </div>

            <button 
              onClick={() => onNavigate('/dashboard')}
              className="bg-black dark:bg-zinc-850 dark:hover:bg-[#ff6b2b] text-white px-5 py-2 rounded-full font-semibold text-sm hover:bg-[#ff6b2b] transition-all duration-300 hover:shadow-lg hover:shadow-[#ff6b2b]/10 cursor-pointer"
            >
              Start Learning
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onToggleDarkMode}
              className="p-2 text-[#4a4a4a] dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-[#fcfbf9] dark:hover:bg-zinc-900 rounded-full transition-colors cursor-pointer mr-1"
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
            </button>

            <div className="flex items-center gap-1 bg-[#ff6b2b]/10 text-[#ff6b2b] px-2.5 py-1 rounded-full text-[11px] font-semibold">
              <Flame className="w-3 h-3 fill-current" />
              <span>127 Days</span>
            </div>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-black dark:text-white hover:bg-[#fcfbf9] dark:hover:bg-zinc-900 transition-colors cursor-pointer"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-[#f2efe9] dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-4 space-y-3">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                onNavigate(item.path);
                setIsOpen(false);
              }}
              className="block w-full text-left font-medium text-[#4a4a4a] dark:text-zinc-400 hover:text-black dark:hover:text-white py-2 focus:outline-none cursor-pointer"
            >
              {item.label}
            </button>
          ))}
          <div className="pt-4 border-t border-[#f2efe9] dark:border-zinc-800 flex flex-col gap-3">
            <button 
              onClick={() => {
                onNavigate('/dashboard');
                setIsOpen(false);
              }}
              className="w-full bg-black dark:bg-zinc-800 text-white py-2.5 rounded-full font-semibold text-sm text-center cursor-pointer"
            >
              Start Learning
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
