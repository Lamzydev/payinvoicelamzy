import { useTheme } from '../../store/ThemeContext';

export default function ThemeToggle({ size = 'md' }) {
  const { isDark, toggleTheme } = useTheme();

  const sizes = {
    sm: { btn: 'w-8 h-8', icon: 'text-sm' },
    md: { btn: 'w-9 h-9', icon: 'text-base' },
    lg: { btn: 'w-10 h-10', icon: 'text-lg' },
  };

  const s = sizes[size] || sizes.md;

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
      className={`
        ${s.btn} rounded-lg flex items-center justify-center
        transition-all duration-300 relative overflow-hidden
        dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-yellow-300
        bg-slate-100 hover:bg-slate-200 text-slate-600
        active:scale-90
      `}
    >
      <span className={`${s.icon} absolute transition-all duration-300 ${
        isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50'
      }`}>☀️</span>

      <span className={`${s.icon} absolute transition-all duration-300 ${
        isDark ? 'opacity-0 -rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'
      }`}>🌙</span>
    </button>
  );
}