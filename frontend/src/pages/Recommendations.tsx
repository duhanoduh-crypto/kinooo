import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { movies } from '@/data/mockMovies';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MovieGrid from '@/components/MovieGrid';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, TrendingUp, Clock } from 'lucide-react';

const Recommendations = () => {
  const { userMovies, isAuthenticated } = useAuth();

  // Похожие фильмы на основе высоко оцененных (8-10 баллов)
  const similarMovies = useMemo(() => {
    if (!isAuthenticated || userMovies.length === 0) return [];

    // Получаем фильмы с высокими оценками (8-10)
    const highRatedMovies = userMovies
      .filter(um => um.rating && um.rating >= 8)
      .map(um => movies.find(m => m.id === um.movieId))
      .filter(Boolean);

    if (highRatedMovies.length === 0) return [];

    // Собираем все жанры и режиссёров из высоко оцененных фильмов
    const favoriteGenreIds = new Set(
      highRatedMovies.flatMap(m => m!.genres.map(g => g.id))
    );
    
    const favoriteDirectors = new Set(
      highRatedMovies.map(m => m!.director)
    );

    // Ищем фильмы с похожими жанрами/режиссёрами, которые пользователь еще не смотрел
    const watchedMovieIds = new Set(userMovies.map(um => um.movieId));

    return movies
      .filter(movie => 
        !watchedMovieIds.has(movie.id) &&
        (movie.genres.some(g => favoriteGenreIds.has(g.id)) || favoriteDirectors.has(movie.director))
      )
      .sort((a, b) => {
        // Сортируем по количеству совпадений (жанры + режиссёр)
        const aGenreMatches = a.genres.filter(g => favoriteGenreIds.has(g.id)).length;
        const bGenreMatches = b.genres.filter(g => favoriteGenreIds.has(g.id)).length;
        const aDirectorMatch = favoriteDirectors.has(a.director) ? 2 : 0;
        const bDirectorMatch = favoriteDirectors.has(b.director) ? 2 : 0;
        
        return (bGenreMatches + bDirectorMatch) - (aGenreMatches + aDirectorMatch);
      })
      .slice(0, 8);
  }, [userMovies, isAuthenticated]);

  // Новинки (последние по году)
  const newReleases = useMemo(() => {
    return [...movies]
      .sort((a, b) => b.year - a.year)
      .slice(0, 8);
  }, [movies]);

  // Популярные (по рейтингу)
  const popularMovies = useMemo(() => {
    return [...movies]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 8);
  }, [movies]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div>
            <h1 className="text-4xl font-bold mb-2">Рекомендации</h1>
            <p className="text-muted-foreground">
              Подборка фильмов специально для вас
            </p>
          </div>

          {isAuthenticated && similarMovies.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">Похожие на ваши любимые</h2>
              </div>
              <MovieGrid movies={similarMovies} />
            </section>
          )}

          {isAuthenticated && similarMovies.length === 0 && userMovies.length > 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Оцените несколько фильмов на 8-10 баллов, чтобы получить персональные рекомендации
                </p>
              </CardContent>
            </Card>
          )}

          {!isAuthenticated && (
            <Card>
              <CardContent className="py-12 text-center">
                <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">
                  Войдите в аккаунт, чтобы получить персональные рекомендации
                </p>
                <Link to="/auth" className="text-primary hover:underline">
                  Войти или зарегистрироваться
                </Link>
              </CardContent>
            </Card>
          )}

          <section>
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Популярное сейчас</h2>
            </div>
            <MovieGrid movies={popularMovies} />
          </section>

          <section>
            <div className="flex items-center gap-2 mb-6">
              <Clock className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Новинки</h2>
            </div>
            <MovieGrid movies={newReleases} />
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Recommendations;
