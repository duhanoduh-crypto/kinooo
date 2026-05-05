import { useParams, Link } from 'react-router-dom';
import { movies, cinemas, screenings } from '@/data/mockMovies';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MovieGrid from '@/components/MovieGrid';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Calendar, MapPin, Star, User, Check, Plus, X, Eye, ArrowLeft } from 'lucide-react';
import { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { MovieStatus } from '@/types/movie';
import StarRating from '@/components/StarRating';
import { getGenreIcon } from '@/lib/genreIcons';

const MovieDetail = () => {
  const { id } = useParams();
  const { isAuthenticated, updateUserMovie, getUserMovieStatus } = useAuth();
  const { toast } = useToast();

  const movie = movies.find(m => m.id === parseInt(id || ''));
  const userMovieStatus = movie ? getUserMovieStatus(movie.id) : undefined;

  const handleStatusChange = (status: MovieStatus) => {
    if (!isAuthenticated) {
      toast({
        title: 'Требуется авторизация',
        description: 'Войдите в аккаунт, чтобы добавить фильм в список',
        variant: 'destructive',
      });
      return;
    }

    if (!movie) return;

    updateUserMovie(movie.id, status, userMovieStatus?.rating);
    toast({
      title: 'Статус обновлен',
      description: `Фильм добавлен`,
    });
  };

  const handleRatingChange = (rating: number) => {
    if (!isAuthenticated) {
      toast({
        title: 'Требуется авторизация',
        description: 'Войдите в аккаунт, чтобы оценить фильм',
        variant: 'destructive',
      });
      return;
    }

    if (!movie) return;

    const status = userMovieStatus?.status || 'completed';
    updateUserMovie(movie.id, status, rating);
    toast({
      title: 'Оценка сохранена',
      description: `Вы поставили ${rating}/10`,
    });
  };

  const similarMovies = useMemo(() => {
    if (!movie) return [];
    return movies
      .filter(m => 
        m.id !== movie.id && 
        m.genres.some(g => movie.genres.some(mg => mg.id === g.id))
      )
      .slice(0, 5);
  }, [movie]);

  const movieScreenings = useMemo(() => {
    if (!movie) return [];
    return screenings
      .filter(s => s.movieId === movie.id)
      .slice(0, 3)
      .map(s => ({
        ...s,
        cinema: cinemas.find(c => c.id === s.cinemaId)
      }));
  }, [movie]);

  if (!movie) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 container px-4 py-20 text-center">
          <h1 className="text-2xl font-bold">Фильм не найден</h1>
          <Link to="/">
            <Button className="mt-4">Вернуться на главную</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container px-4 py-8">
        <Link to="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад
          </Button>
        </Link>

        <div className="grid md:grid-cols-[300px_1fr] gap-8 mb-12">
          <div className="relative rounded-xl overflow-hidden max-w-[250px] md:max-w-none mx-auto">
            <img src={movie.poster} alt={movie.title} className="w-full aspect-[2/3] object-cover" />
            <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-3 py-2 rounded-lg">
              <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
              <span className="text-lg font-bold text-white">{movie.rating}</span>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
              <div className="flex flex-wrap gap-2 mb-4">
                {movie.genres.map(genre => {
                  const Icon = getGenreIcon(genre.name);
                  return (
                    <Badge key={genre.id} variant="secondary" className="flex items-center gap-1.5">
                      <Icon className="h-3 w-3" />
                      {genre.name}
                    </Badge>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{movie.year} год</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{movie.duration} мин</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{movie.director}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{movie.country}</span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">Описание</h3>
              <p className="leading-relaxed">{movie.description}</p>
            </div>

            <div className="grid grid-cols-2 sm:flex gap-3">
              <Button 
                size="lg" 
                variant={userMovieStatus?.status === 'completed' ? 'default' : 'outline'}
                onClick={() => handleStatusChange('completed')}
              >
                <Check className="mr-2 h-4 w-4" />
                Просмотрено
              </Button>
              <Button 
                size="lg" 
                variant={userMovieStatus?.status === 'watching' ? 'default' : 'outline'}
                onClick={() => handleStatusChange('watching')}
              >
                <Eye className="mr-2 h-4 w-4" />
                Смотрю
              </Button>
              <Button 
                size="lg" 
                variant={userMovieStatus?.status === 'planned' ? 'default' : 'outline'}
                onClick={() => handleStatusChange('planned')}
              >
                <Plus className="mr-2 h-4 w-4" />
                В планах
              </Button>
              <Button 
                size="lg" 
                variant={userMovieStatus?.status === 'dropped' ? 'default' : 'outline'}
                onClick={() => handleStatusChange('dropped')}
              >
                <X className="mr-2 h-4 w-4" />
                Брошено
              </Button>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {userMovieStatus?.rating ? `Ваша оценка: ${userMovieStatus.rating}/10` : 'Поставьте оценку:'}
              </p>
              <StarRating
                rating={userMovieStatus?.rating || 0}
                onRatingChange={handleRatingChange}
                size="md"
                showLabel={!!userMovieStatus?.rating}
              />
            </div>

            {movieScreenings.length > 0 && (
              <Card>
                <CardContent className="p-6 space-y-3">
                  <h3 className="font-semibold text-lg">Где идет в Краснодаре?</h3>
                  {movieScreenings.map(s => (
                    <div key={s.id} className="flex flex-col gap-2 p-3 rounded-md bg-secondary/50">
                      <p className="font-medium">{s.cinema?.name}</p>
                      <p className="text-sm text-muted-foreground">{s.cinema?.address}</p>
                      <p className="font-semibold text-primary">
                        {new Date(s.datetime).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {similarMovies.length > 0 && (
          <section>
            <MovieGrid movies={similarMovies} title="Похожие фильмы" />
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MovieDetail;
