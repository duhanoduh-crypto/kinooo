import { Star } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Movie, MovieStatus, UserMovie } from '@/types/movie';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import StarRating from './StarRating';
import { getGenreIcon } from '@/lib/genreIcons';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface UserMovieCardProps {
  movie: Movie;
  userMovie: UserMovie;
}

const statusLabels: Record<MovieStatus, string> = {
  planned: 'В планах',
  watching: 'Смотрю',
  completed: 'Просмотрено',
  dropped: 'Брошено',
};

const statusColors: Record<MovieStatus, string> = {
  planned: 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20',
  watching: 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20',
  completed: 'bg-green-500/10 text-green-500 hover:bg-green-500/20',
  dropped: 'bg-red-500/10 text-red-500 hover:bg-red-500/20',
};

const UserMovieCard = ({ movie, userMovie }: UserMovieCardProps) => {
  const { updateUserMovie } = useAuth();

  const handleStatusChange = (newStatus: string) => {
    updateUserMovie(movie.id, newStatus as MovieStatus, userMovie.rating);
  };

  const handleRatingChange = (newRating: number) => {
    updateUserMovie(movie.id, userMovie.status, newRating);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <Link to={`/movies/${movie.id}`} className="flex-shrink-0">
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-24 h-36 object-cover rounded"
            />
          </Link>

          <div className="flex-1 space-y-3">
            <div>
              <Link to={`/movies/${movie.id}`}>
                <h3 className="font-semibold text-lg hover:text-primary transition-colors">
                  {movie.title}
                </h3>
              </Link>
              <p className="text-sm text-muted-foreground">{movie.year} • {movie.director}</p>
            </div>

            <div className="flex flex-wrap gap-1">
              {movie.genres.map(genre => {
                const Icon = getGenreIcon(genre.name);
                return (
                  <Badge key={genre.id} variant="secondary" className="text-xs flex items-center gap-1">
                    <Icon className="h-2.5 w-2.5" />
                    {genre.name}
                  </Badge>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
              <span className="font-semibold">{movie.rating}</span>
            </div>

            <div className="space-y-3">
              <Select value={userMovie.status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planned">В планах</SelectItem>
                  <SelectItem value="watching">Смотрю</SelectItem>
                  <SelectItem value="completed">Просмотрено</SelectItem>
                  <SelectItem value="dropped">Брошено</SelectItem>
                </SelectContent>
              </Select>

              {(userMovie.status === 'completed' || userMovie.status === 'dropped') && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Ваша оценка:</p>
                  <StarRating
                    rating={userMovie.rating || 0}
                    onRatingChange={handleRatingChange}
                    size="sm"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserMovieCard;
