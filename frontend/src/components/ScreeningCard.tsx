import { Clock, MapPin } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Screening, Movie, Cinema } from '@/types/movie';
import { Link } from 'react-router-dom';

interface ScreeningCardProps {
  screening: Screening;
  movie: Movie;
  cinema: Cinema;
}

const ScreeningCard = ({ screening, movie, cinema }: ScreeningCardProps) => {
  const screeningDate = new Date(screening.datetime);
  const timeString = screeningDate.toLocaleTimeString('ru-RU', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <Link to={`/movies/${movie.id}`} className="flex-shrink-0">
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-20 h-28 object-cover rounded"
            />
          </Link>
          
          <div className="flex-1 space-y-2">
            <Link to={`/movies/${movie.id}`}>
              <h3 className="font-semibold hover:text-primary transition-colors">
                {movie.title}
              </h3>
            </Link>
            
            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{cinema.name}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{timeString}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScreeningCard;
