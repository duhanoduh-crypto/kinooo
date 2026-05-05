import { useMemo } from 'react';
import { cinemas, screenings, movies } from '@/data/mockMovies';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CinemaCard from '@/components/CinemaCard';

const Cinemas = () => {
  const cinemasWithMovies = useMemo(() => {
    return cinemas.map(cinema => {
      // Получаем уникальные фильмы для этого кинотеатра
      const cinemaScreenings = screenings.filter(s => s.cinemaId === cinema.id);
      const uniqueMovieIds = [...new Set(cinemaScreenings.map(s => s.movieId))];
      const moviesCount = uniqueMovieIds.length;
      
      return {
        ...cinema,
        moviesCount,
      };
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Кинотеатры Краснодара</h1>
            <p className="text-muted-foreground">
              Найдено кинотеатров: {cinemas.length}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cinemasWithMovies.map(cinema => (
              <CinemaCard
                key={cinema.id}
                cinema={cinema}
                moviesCount={cinema.moviesCount}
              />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cinemas;
