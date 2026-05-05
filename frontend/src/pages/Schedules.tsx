import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { cinemas, screenings, movies } from '@/data/mockMovies';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScreeningCard from '@/components/ScreeningCard';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Calendar, MapPin, Search } from 'lucide-react';

const Schedules = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCinema, setSelectedCinema] = useState(searchParams.get('cinema') || 'all');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredScreenings = useMemo(() => {
    return screenings.filter(screening => {
      const screeningDate = new Date(screening.datetime).toISOString().split('T')[0];
      const movie = movies.find(m => m.id === screening.movieId);
      
      const cinemaMatch = selectedCinema === 'all' || screening.cinemaId === parseInt(selectedCinema);
      const dateMatch = screeningDate === selectedDate;
      const searchMatch = !searchQuery || movie?.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      return cinemaMatch && dateMatch && searchMatch;
    }).sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());
  }, [selectedCinema, selectedDate, searchQuery]);

  const handleCinemaChange = (value: string) => {
    setSelectedCinema(value);
    if (value !== 'all') {
      setSearchParams({ cinema: value });
    } else {
      setSearchParams({});
    }
  };

  // Генерируем даты на следующие 7 дней
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date.toISOString().split('T')[0];
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Расписание сеансов</h1>
            <p className="text-muted-foreground">Кинотеатры Краснодара</p>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Кинотеатр
                  </label>
                  <Select value={selectedCinema} onValueChange={handleCinemaChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все кинотеатры</SelectItem>
                      {cinemas.map(cinema => (
                        <SelectItem key={cinema.id} value={cinema.id.toString()}>
                          {cinema.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Дата
                  </label>
                  <Select value={selectedDate} onValueChange={setSelectedDate}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {dates.map(date => {
                        const dateObj = new Date(date);
                        const isToday = date === new Date().toISOString().split('T')[0];
                        const label = isToday 
                          ? 'Сегодня' 
                          : dateObj.toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'short' });
                        
                        return (
                          <SelectItem key={date} value={date}>
                            {label}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    Поиск фильма
                  </label>
                  <Input
                    type="search"
                    placeholder="Название фильма..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div>
            <h2 className="text-xl font-semibold mb-4">
              Найдено сеансов: {filteredScreenings.length}
            </h2>
            
            {filteredScreenings.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    Сеансов на выбранную дату не найдено
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredScreenings.map(screening => {
                  const movie = movies.find(m => m.id === screening.movieId);
                  const cinema = cinemas.find(c => c.id === screening.cinemaId);
                  
                  if (!movie || !cinema) return null;
                  
                  return (
                    <ScreeningCard
                      key={screening.id}
                      screening={screening}
                      movie={movie}
                      cinema={cinema}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Schedules;
