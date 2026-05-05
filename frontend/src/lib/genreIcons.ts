import { 
  Swords,        // Военный
  Users,         // Семейный
  Heart,         // Мелодрама
  Music,         // Мюзикл
  Eye,           // Мистика
  Rocket,        // Фантастика
  Skull,         // Криминал
  Zap,           // Триллер
  Mountain,      // Вестерн
  BookOpen,      // История
  Laugh,         // Комедия
  Crosshair,     // Экшн
  Ghost,         // Ужасы
  Drama,         // Драма
  Palette,       // Анимация
  Wand2,         // Фэнтези
  Map,           // Приключения
  Film           // fallback
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export const genreIcons: Record<string, LucideIcon> = {
  'Военный': Swords,
  'Семейный': Users,
  'Мелодрама': Heart,
  'Мюзикл': Music,
  'Мистика': Eye,
  'Фантастика': Rocket,
  'Криминал': Skull,
  'Триллер': Zap,
  'Вестерн': Mountain,
  'История': BookOpen,
  'Комедия': Laugh,
  'Экшн': Crosshair,
  'Ужасы': Ghost,
  'Драма': Drama,
  'Анимация': Palette,
  'Фэнтези': Wand2,
  'Приключения': Map,
};

export const getGenreIcon = (genreName: string): LucideIcon => {
  return genreIcons[genreName] || Film;
};
