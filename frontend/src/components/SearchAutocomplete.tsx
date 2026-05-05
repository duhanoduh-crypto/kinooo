import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/useDebounce';
import { movies } from '@/data/mockMovies';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';

interface SearchAutocompleteProps {
  onSearch?: (query: string) => void;
}

const SearchAutocomplete = ({ onSearch }: SearchAutocompleteProps) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const debouncedQuery = useDebounce(query, 300);
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const results = debouncedQuery.trim()
    ? movies
        .filter(movie =>
          movie.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
          movie.director.toLowerCase().includes(debouncedQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  useEffect(() => {
    if (debouncedQuery) {
      setIsOpen(true);
      setSelectedIndex(-1);
    } else {
      setIsOpen(false);
    }
  }, [debouncedQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (movieId: number) => {
    navigate(`/movies/${movieId}`);
    setQuery('');
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSelect(results[selectedIndex].id);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleClear = () => {
    setQuery('');
    setIsOpen(false);
    if (onSearch) {
      onSearch('');
    }
  };

  const handleChange = (value: string) => {
    setQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Поиск фильмов, режиссёров..."
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-10"
          role="searchbox"
          aria-label="Поиск фильмов"
          aria-autocomplete="list"
          aria-controls="search-results"
          aria-expanded={isOpen}
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Очистить поиск"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <Card
          id="search-results"
          role="listbox"
          className="absolute top-full mt-2 w-full z-50 max-h-96 overflow-y-auto"
        >
          {results.map((movie, index) => (
            <button
              key={movie.id}
              onClick={() => handleSelect(movie.id)}
              role="option"
              aria-selected={index === selectedIndex}
              className={`w-full flex items-start gap-3 p-3 hover:bg-accent transition-colors border-b border-border last:border-0 text-left ${
                index === selectedIndex ? 'bg-accent' : ''
              }`}
            >
              <img
                src={movie.poster}
                alt=""
                className="w-12 h-18 object-cover rounded flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{movie.title}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {movie.year} • {movie.director}
                </div>
                <div className="text-xs text-muted-foreground mt-1 truncate">
                  {movie.genres.map(g => g.name).join(', ')}
                </div>
              </div>
              <div className="flex-shrink-0 text-sm font-medium">
                ⭐ {movie.rating}
              </div>
            </button>
          ))}
        </Card>
      )}

      {isOpen && debouncedQuery && results.length === 0 && (
        <Card className="absolute top-full mt-2 w-full z-50 p-4 text-center text-sm text-muted-foreground">
          Ничего не найдено
        </Card>
      )}
    </div>
  );
};

export default SearchAutocomplete;
