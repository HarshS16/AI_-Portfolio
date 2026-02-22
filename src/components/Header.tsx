import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navLinks = [
    { href: '#about', label: 'About' },
    { href: '#skills', label: 'Skills' },
    { href: '#experience', label: 'Experience' },
    { href: '#education', label: 'Education' },
    { href: '#projects', label: 'Projects' },
    { href: '#contact', label: 'Contact' },
  ];

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isMobileMenuOpen
          ? 'neural-border backdrop-blur-md shadow-[0_8px_32px_rgba(0,255,255,0.1)]' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex justify-between items-center h-16 md:h-20">
          <a href="#" className="text-xl md:text-2xl font-bold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]">
            Harsh Srivastava
          </a>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex gap-1">
            {navLinks.map((link, index) => (
              <a 
                key={link.href} 
                href={link.href} 
                className="relative px-4 py-2 text-sm font-mono text-foreground hover:text-accent transition-all duration-300 group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="relative z-10">{link.label}</span>
                
                {/* Hover effect */}
                <div className="absolute inset-0 neural-border rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Activity indicator */}
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300" />
              </a>
            ))}
          </nav>
          
          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-foreground hover:text-accent transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
        
        {/* Mobile navigation menu */}
        <nav 
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? 'max-h-80 pb-4' : 'max-h-0'
          }`}
        >
          <div className="flex flex-col gap-2">
            {navLinks.map((link, index) => (
              <a 
                key={link.href} 
                href={link.href}
                onClick={handleNavClick}
                className="relative px-4 py-3 text-sm font-mono text-foreground hover:text-accent hover:bg-accent/10 rounded-lg transition-all duration-300"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </nav>
        
        {/* Connection line */}
        {isScrolled && (
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
        )}
      </div>
    </header>
  );
};

export default Header;
