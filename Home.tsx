import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import MovieGrid from '@/components/MovieGrid';
import GenreFilter from '@/components/GenreFilter';
import Footer from '@/components/Footer';
import { movies, genres } from '@/data/mockMovies';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState<'rating' | 'year'>('rating');

  const handleGenreToggle = (genreId: number) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId]
    );
  };

  const filteredMovies = useMemo(() => {
    let result = [...movies];

    // Поиск
    if (searchQuery) {
      result = result.filter((movie) =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Фильтр по жанрам
    if (selectedGenres.length > 0) {
      result = result.filter((movie) =>
        movie.genres.some((genre) => selectedGenres.includes(genre.id))
      );
    }

    // Сортировка
    result.sort((a, b) => {
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      return b.year - a.year;
    });

    return result;
  }, [searchQuery, selectedGenres, sortBy]);

  const popularMovies = useMemo(
    () => [...movies].sort((a, b) => b.rating - a.rating).slice(0, 5),
    [movies]
  );

  const newMovies = useMemo(
    () => [...movies]
      .filter(movie => movie.year >= 2023)
      .sort((a, b) => b.year - a.year)
      .slice(0, 5),
    [movies]
  );

  const { userMovies, isAuthenticated } = useAuth();

  const recommendedMovies = useMemo(() => {
    if (!isAuthenticated || userMovies.length === 0) return [];

    const highRatedMovies = userMovies
      .filter(um => um.rating && um.rating >= 8)
      .map(um => movies.find(m => m.id === um.movieId))
      .filter(Boolean);

    if (highRatedMovies.length === 0) return [];

    const favoriteGenreIds = new Set(
      highRatedMovies.flatMap(m => m!.genres.map(g => g.id))
    );
    
    const favoriteDirectors = new Set(
      highRatedMovies.map(m => m!.director)
    );

    const watchedMovieIds = new Set(userMovies.map(um => um.movieId));

    return [...movies]
      .filter(movie => 
        !watchedMovieIds.has(movie.id) &&
        (movie.genres.some(g => favoriteGenreIds.has(g.id)) || favoriteDirectors.has(movie.director))
      )
      .sort((a, b) => {
        const aGenreMatches = a.genres.filter(g => favoriteGenreIds.has(g.id)).length;
        const bGenreMatches = b.genres.filter(g => favoriteGenreIds.has(g.id)).length;
        const aDirectorMatch = favoriteDirectors.has(a.director) ? 2 : 0;
        const bDirectorMatch = favoriteDirectors.has(b.director) ? 2 : 0;
        
        return (bGenreMatches + bDirectorMatch) - (aGenreMatches + aDirectorMatch);
      })
      .slice(0, 5);
  }, [userMovies, isAuthenticated]);

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={setSearchQuery} />

      <main className="container px-4 py-8 space-y-12">
        {/* Hero секция с популярными фильмами */}
        <section className="animate-fade-in">
          <div className="relative rounded-2xl overflow-hidden mb-8" style={{ background: 'var(--gradient-hero)' }}>
            <div className="p-8 md:p-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
                Добро пожаловать в Kinoclone
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Смотрите, отслеживайте и оценивайте фильмы. Находите расписание кинотеатров Краснодара.
              </p>
            </div>
          </div>

          <MovieGrid movies={popularMovies} title="🔥 Популярные фильмы" />
        </section>

        {/* Персонализированные рекомендации */}
        {isAuthenticated && recommendedMovies.length > 0 && (
          <section className="animate-fade-in">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">На основе ваших интересов</h2>
            </div>
            <MovieGrid movies={recommendedMovies} />
          </section>
        )}

        {isAuthenticated && recommendedMovies.length === 0 && userMovies.length > 0 && (
          <section className="animate-fade-in">
            <Card>
              <CardContent className="py-8 text-center">
                <Sparkles className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Оцените несколько фильмов на 8-10 баллов, чтобы увидеть персональные рекомендации
                </p>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Новинки */}
        <section className="animate-fade-in">
          <MovieGrid movies={newMovies} title="✨ Новинки" />
        </section>

        {/* Фильтры и каталог */}
        <section className="animate-fade-in">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4 text-foreground">Каталог фильмов</h2>
            
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1">
                <GenreFilter
                  genres={genres}
                  selectedGenres={selectedGenres}
                  onGenreToggle={handleGenreToggle}
                />
              </div>
              
              <Tabs value={sortBy} onValueChange={(v) => setSortBy(v as 'rating' | 'year')}>
                <TabsList>
                  <TabsTrigger value="rating">По рейтингу</TabsTrigger>
                  <TabsTrigger value="year">По году</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          <MovieGrid movies={filteredMovies} />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
