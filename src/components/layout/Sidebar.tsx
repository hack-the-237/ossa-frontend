
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  FileText, 
  Upload, 
  FolderOpen, 
  Settings, 
  Menu,
  ChevronLeft,
  ChevronRight 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();

  // Hide sidebar on mobile
  if (isMobile) return null;

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <aside
      className={cn(
        "fixed left-0 z-20 flex h-screen flex-col border-r border-navy-800 bg-navy-950 transition-all duration-300",
        collapsed ? "w-[70px]" : "w-[240px]"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 border-b border-navy-800">
        {!collapsed && (
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 overflow-visible">
              <img src="/OSSA.png" alt="Ossa Logo" className="w-full h-full" />
            </div>
            <span className="font-semibold text-white">Ossa</span>
          </Link>
        )}
        {collapsed && (
          <div className="w-8 h-8 overflow-visible mx-auto">
            <img src="/OSSA.png" alt="Ossa Logo" className="w-full h-full" />
          </div>
        )}
        {!collapsed && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-400 hover:text-white hover:bg-navy-800"
            onClick={toggleSidebar}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-2">
          <li>
            <Link
              to="/"
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive('/')
                  ? "bg-brand-500/20 text-brand-400"
                  : "text-gray-400 hover:bg-navy-900 hover:text-white"
              )}
            >
              <LayoutDashboard className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-3")} />
              {!collapsed && <span>Dashboard</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/knowledge-base"
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive('/knowledge-base')
                  ? "bg-brand-500/20 text-brand-400"
                  : "text-gray-400 hover:bg-navy-900 hover:text-white"
              )}
            >
              <BookOpen className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-3")} />
              {!collapsed && <span>Knowledge Base</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/upload"
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive('/upload')
                  ? "bg-brand-500/20 text-brand-400"
                  : "text-gray-400 hover:bg-navy-900 hover:text-white"
              )}
            >
              <Upload className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-3")} />
              {!collapsed && <span>Upload Document</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/proposals"
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive('/proposals')
                  ? "bg-brand-500/20 text-brand-400"
                  : "text-gray-400 hover:bg-navy-900 hover:text-white"
              )}
            >
              <FileText className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-3")} />
              {!collapsed && <span>RFP Proposals</span>}
            </Link>
          </li>
        </ul>
      </nav>

      <div className="border-t border-navy-800 p-3">
        {collapsed ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 mx-auto text-gray-400 hover:text-white hover:bg-navy-800"
            onClick={toggleSidebar}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Link
            to="/settings"
            className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-400 hover:bg-navy-900 hover:text-white"
          >
            <Settings className="h-5 w-5 mr-3" />
            <span>Settings</span>
          </Link>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
