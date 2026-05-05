import { Genre } from '@/types/movie';
import { Badge } from './ui/badge';
import { getGenreIcon } from '@/lib/genreIcons';

interface GenreFilterProps {
  genres: Genre[];
  selectedGenres: number[];
  onGenreToggle: (genreId: number) => void;
  onClear?: () => void;
}

const GenreFilter = ({ genres, selectedGenres, onGenreToggle, onClear }: GenreFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {genres.map((genre) => {
        const isSelected = selectedGenres.includes(genre.id);
        const Icon = getGenreIcon(genre.name);
        
        return (
          <Badge
            key={genre.id}
            variant={isSelected ? "default" : "outline"}
            className="cursor-pointer transition-all hover:scale-105 flex items-center gap-1.5"
            onClick={() => onGenreToggle(genre.id)}
          >
            <Icon className="h-3 w-3" />
            {genre.name}
          </Badge>
        );
      })}
      {selectedGenres.length > 0 && (
        <Badge
          variant="secondary"
          className="cursor-pointer"
          onClick={() => onClear ? onClear() : selectedGenres.forEach(id => onGenreToggle(id))}
        >
          Очистить
        </Badge>
      )}
    </div>
  );
};

export default GenreFilter;
