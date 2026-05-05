import { Film, User, LogOut, UserCircle, Heart, Shield, Menu } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { useAuth } from '@/contexts/AuthContext';
import ThemeToggle from './ThemeToggle';
import AccessibilityToggle from './AccessibilityToggle';
import SearchAutocomplete from './SearchAutocomplete';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from './ui/sheet';

interface HeaderProps {
  onSearch?: (query: string) => void;
}

const Header = ({ onSearch }: HeaderProps) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const isMobile = useIsMobile();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Mobile menu
  if (isMobile) {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <Film className="h-6 w-6 text-primary" />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Kinoclone
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <AccessibilityToggle />
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Открыть меню">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[350px]">
                <div className="flex flex-col gap-6 mt-6">
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">Поиск</h3>
                    <SearchAutocomplete onSearch={onSearch} />
                  </div>

                  <nav className="flex flex-col gap-2">
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Навигация</h3>
                    <Link to="/">
                      <Button variant="ghost" className="w-full justify-start">Главная</Button>
                    </Link>
                    <Link to="/movies">
                      <Button variant="ghost" className="w-full justify-start">Фильмы</Button>
                    </Link>
                    <Link to="/cinemas">
                      <Button variant="ghost" className="w-full justify-start">Кинотеатры</Button>
                    </Link>
                    <Link to="/schedules">
                      <Button variant="ghost" className="w-full justify-start">Расписание</Button>
                    </Link>
                  </nav>

                  {isAuthenticated ? (
                    <div className="flex flex-col gap-2 pt-4 border-t">
                      <div className="mb-2">
                        <p className="text-sm font-medium">{user?.username}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                      </div>
                      <Link to="/profile">
                        <Button variant="ghost" className="w-full justify-start">
                          <UserCircle className="mr-2 h-4 w-4" />
                          Мой профиль
                        </Button>
                      </Link>
                      <Link to="/recommendations">
                        <Button variant="ghost" className="w-full justify-start">
                          <Heart className="mr-2 h-4 w-4" />
                          Рекомендации
                        </Button>
                      </Link>
                      {isAdmin && (
                        <Link to="/admin">
                          <Button variant="ghost" className="w-full justify-start">
                            <Shield className="mr-2 h-4 w-4" />
                            Панель администратора
                          </Button>
                        </Link>
                      )}
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-destructive hover:text-destructive"
                        onClick={handleLogout}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Выйти
                      </Button>
                    </div>
                  ) : (
                    <Link to="/auth">
                      <Button className="w-full">
                        <User className="mr-2 h-4 w-4" />
                        Войти
                      </Button>
                    </Link>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    );
  }

  // Desktop menu
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <Film className="h-6 w-6 text-primary" />
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Kinoclone
          </span>
        </Link>

        <div className="flex-1 max-w-md mx-8">
          <SearchAutocomplete onSearch={onSearch} />
        </div>

        <nav className="flex items-center gap-2">
          <Link to="/">
            <Button variant="ghost">Главная</Button>
          </Link>
          <Link to="/movies">
            <Button variant="ghost">Фильмы</Button>
          </Link>
          <Link to="/cinemas">
            <Button variant="ghost">Кинотеатры</Button>
          </Link>
          <Link to="/schedules">
            <Button variant="ghost">Расписание</Button>
          </Link>
          
          <AccessibilityToggle />
          <ThemeToggle />
          
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.username}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <UserCircle className="mr-2 h-4 w-4" />
                  Мой профиль
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/recommendations')}>
                  <Heart className="mr-2 h-4 w-4" />
                  Рекомендации
                </DropdownMenuItem>
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/admin')}>
                      <Shield className="mr-2 h-4 w-4" />
                      Панель администратора
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Выйти
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
