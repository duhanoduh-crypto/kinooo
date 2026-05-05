import { Movie } from '@/types/movie';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  return (
    <Link to={`/movies/${movie.id}`} className="group">
      <div className="relative overflow-hidden rounded-lg transition-transform duration-300 group-hover:scale-105">
        <div className="aspect-[2/3] relative overflow-hidden">
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-md">
            <Star className="h-4 w-4 fill-accent text-accent" />
            <span className="text-sm font-semibold text-white">{movie.rating}</span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/90 backdrop-blur-sm translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <p className="text-sm text-white/90 line-clamp-3">{movie.description}</p>
          </div>
        </div>

        <div className="mt-2">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {movie.title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1 min-h-[48px]">
            <span className="whitespace-nowrap">{movie.year}</span>
            <span>•</span>
            <span className="line-clamp-2">{movie.genres.map(g => g.name).join(', ')}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
