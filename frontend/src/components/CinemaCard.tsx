import { MapPin, Film } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Cinema } from '@/types/movie';
import { Link } from 'react-router-dom';

interface CinemaCardProps {
  cinema: Cinema;
  moviesCount?: number;
}

const CinemaCard = ({ cinema, moviesCount }: CinemaCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-start justify-between">
          <span>{cinema.name}</span>
          <Film className="h-5 w-5 text-primary" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>{cinema.address}</span>
        </div>
        
        {moviesCount !== undefined && (
          <p className="text-sm text-muted-foreground">
            Фильмов в прокате: <span className="font-semibold text-foreground">{moviesCount}</span>
          </p>
        )}
        
        <Link to={`/schedules?cinema=${cinema.id}`}>
          <Button className="w-full">
            Посмотреть расписание
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default CinemaCard;
