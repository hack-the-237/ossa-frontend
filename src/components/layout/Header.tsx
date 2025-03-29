
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Search, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="fixed top-0 left-0 right-0 z-10 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            {isMobile && (
              <Button variant="ghost" size="icon" onClick={toggleMenu} className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            )}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 overflow-visible">
                <img src="/OSSA.png" alt="Ossa Logo" className="w-full h-full" />
              </div>
              <span className="font-semibold text-lg text-gray-900">Ossa</span>
            </Link>
          </div>

          <div className="flex items-center space-x-1">
            {/* Search bar - absolute positioned to avoid layout shifts */}
            <AnimatePresence>
              {isSearchOpen && (
                <motion.div 
                  initial={{ opacity: 0, width: 0 }} 
                  animate={{ opacity: 1, width: '100%' }} 
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-x-0 top-0 z-50 flex h-16 items-center justify-center bg-white px-4 sm:px-6 md:px-8"
                >
                  <div className="relative w-full max-w-md">
                    <Input
                      type="text"
                      placeholder="Search knowledge base..."
                      className="w-full pr-10"
                      autoFocus
                    />
                    <button
                      onClick={toggleSearch}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      <X className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Always visible header actions */}
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="icon" onClick={toggleSearch} aria-label="Search">
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Notifications">
                <Bell className="h-5 w-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/avatar.png" alt="User" />
                      <AvatarFallback className="bg-brand-100 text-navy-950">JD</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem>
                    <Link to="/profile" className="flex w-full">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/settings" className="flex w-full">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <button className="flex w-full">Sign out</button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobile && isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-navy-950 text-white"
          >
            <div className="flex justify-between items-center h-16 px-4 border-b border-navy-800">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 overflow-visible">
                  <img src="/OSSA.png" alt="Ossa Logo" className="w-full h-full" />
                </div>
                <span className="font-semibold text-lg text-white">Ossa</span>
              </Link>
              <Button variant="ghost" size="icon" onClick={toggleMenu} className="text-white">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="p-4">
              <ul className="space-y-2">
                <li>
                  <Link 
                    to="/" 
                    onClick={toggleMenu}
                    className="flex items-center w-full p-2 rounded-md hover:bg-navy-900"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/knowledge-base" 
                    onClick={toggleMenu}
                    className="flex items-center w-full p-2 rounded-md hover:bg-navy-900"
                  >
                    Knowledge Base
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/upload" 
                    onClick={toggleMenu}
                    className="flex items-center w-full p-2 rounded-md hover:bg-navy-900"
                  >
                    Upload Document
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/proposals" 
                    onClick={toggleMenu}
                    className="flex items-center w-full p-2 rounded-md hover:bg-navy-900"
                  >
                    RFP Proposals
                  </Link>
                </li>
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
