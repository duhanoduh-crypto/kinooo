import { useState } from 'react';
import { Plus, Pencil, Trash2, Film, MapPin, Calendar, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { movies, cinemas, screenings } from '@/data/mockMovies';
import { useToast } from '@/hooks/use-toast';
import type { Movie, Cinema, Screening } from '@/types/movie';

const AdminPanel = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Movie management
  const [movieDialogOpen, setMovieDialogOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [movieFormData, setMovieFormData] = useState({
    title: '',
    year: new Date().getFullYear(),
    duration: 0,
    director: '',
    country: '',
    description: '',
    poster: '',
    rating: 0,
  });

  const handleAddMovie = () => {
    toast({
      title: 'Фильм добавлен',
      description: `"${movieFormData.title}" успешно добавлен в каталог`,
    });
    setMovieDialogOpen(false);
    resetMovieForm();
  };

  const handleUpdateMovie = () => {
    toast({
      title: 'Фильм обновлен',
      description: `"${movieFormData.title}" успешно обновлен`,
    });
    setMovieDialogOpen(false);
    setEditingMovie(null);
    resetMovieForm();
  };

  const handleDeleteMovie = (movie: Movie) => {
    toast({
      title: 'Фильм удален',
      description: `"${movie.title}" удален из каталога`,
      variant: 'destructive',
    });
  };

  const resetMovieForm = () => {
    setMovieFormData({
      title: '',
      year: new Date().getFullYear(),
      duration: 0,
      director: '',
      country: '',
      description: '',
      poster: '',
      rating: 0,
    });
  };

  const openEditMovie = (movie: Movie) => {
    setEditingMovie(movie);
    setMovieFormData({
      title: movie.title,
      year: movie.year,
      duration: movie.duration,
      director: movie.director,
      country: movie.country,
      description: movie.description,
      poster: movie.poster,
      rating: movie.rating,
    });
    setMovieDialogOpen(true);
  };

  // Cinema management
  const [cinemaDialogOpen, setCinemaDialogOpen] = useState(false);
  const [cinemaFormData, setCinemaFormData] = useState({
    name: '',
    address: '',
  });

  const handleAddCinema = () => {
    toast({
      title: 'Кинотеатр добавлен',
      description: `"${cinemaFormData.name}" успешно добавлен`,
    });
    setCinemaDialogOpen(false);
    setCinemaFormData({ name: '', address: '' });
  };

  const handleDeleteCinema = (cinema: Cinema) => {
    toast({
      title: 'Кинотеатр удален',
      description: `"${cinema.name}" удален`,
      variant: 'destructive',
    });
  };

  // Screening management
  const [screeningDialogOpen, setScreeningDialogOpen] = useState(false);
  const [screeningFormData, setScreeningFormData] = useState({
    cinemaId: 0,
    movieId: 0,
    datetime: '',
    price: 0,
  });

  const handleAddScreening = () => {
    toast({
      title: 'Сеанс добавлен',
      description: 'Сеанс успешно добавлен в расписание',
    });
    setScreeningDialogOpen(false);
    setScreeningFormData({ cinemaId: 0, movieId: 0, datetime: '', price: 0 });
  };

  const handleDeleteScreening = (screening: Screening) => {
    toast({
      title: 'Сеанс удален',
      description: 'Сеанс удален из расписания',
      variant: 'destructive',
    });
  };

  const getMovieTitle = (id: number) => movies.find(m => m.id === id)?.title || 'Неизвестно';
  const getCinemaName = (id: number) => cinemas.find(c => c.id === id)?.name || 'Неизвестно';

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-card">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Film className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Панель администратора</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {user?.username} ({user?.email})
            </span>
            <Button variant="ghost" onClick={() => navigate('/')}>
              На главную
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Управление контентом</h1>

        <Tabs defaultValue="movies" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="movies">Фильмы</TabsTrigger>
            <TabsTrigger value="cinemas">Кинотеатры</TabsTrigger>
            <TabsTrigger value="screenings">Сеансы</TabsTrigger>
          </TabsList>

          {/* Movies Tab */}
          <TabsContent value="movies" className="space-y-4 animate-fade-in">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Каталог фильмов</h2>
              <Dialog open={movieDialogOpen} onOpenChange={setMovieDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetMovieForm}>
                    <Plus className="mr-2 h-4 w-4" />
                    Добавить фильм
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingMovie ? 'Редактировать фильм' : 'Добавить фильм'}
                    </DialogTitle>
                    <DialogDescription>
                      Заполните информацию о фильме
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Название</Label>
                      <Input
                        id="title"
                        value={movieFormData.title}
                        onChange={(e) => setMovieFormData({ ...movieFormData, title: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="year">Год</Label>
                        <Input
                          id="year"
                          type="number"
                          value={movieFormData.year}
                          onChange={(e) => setMovieFormData({ ...movieFormData, year: parseInt(e.target.value) })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="duration">Длительность (мин)</Label>
                        <Input
                          id="duration"
                          type="number"
                          value={movieFormData.duration}
                          onChange={(e) => setMovieFormData({ ...movieFormData, duration: parseInt(e.target.value) })}
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="director">Режиссер</Label>
                      <Input
                        id="director"
                        value={movieFormData.director}
                        onChange={(e) => setMovieFormData({ ...movieFormData, director: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="country">Страна</Label>
                      <Input
                        id="country"
                        value={movieFormData.country}
                        onChange={(e) => setMovieFormData({ ...movieFormData, country: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="poster">URL постера</Label>
                      <Input
                        id="poster"
                        value={movieFormData.poster}
                        onChange={(e) => setMovieFormData({ ...movieFormData, poster: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="rating">Рейтинг (0-10)</Label>
                      <Input
                        id="rating"
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        value={movieFormData.rating}
                        onChange={(e) => setMovieFormData({ ...movieFormData, rating: parseFloat(e.target.value) })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Описание</Label>
                      <Textarea
                        id="description"
                        rows={4}
                        value={movieFormData.description}
                        onChange={(e) => setMovieFormData({ ...movieFormData, description: e.target.value })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setMovieDialogOpen(false);
                        setEditingMovie(null);
                        resetMovieForm();
                      }}
                    >
                      Отмена
                    </Button>
                    <Button onClick={editingMovie ? handleUpdateMovie : handleAddMovie}>
                      {editingMovie ? 'Обновить' : 'Добавить'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Постер</TableHead>
                    <TableHead>Название</TableHead>
                    <TableHead>Год</TableHead>
                    <TableHead>Режиссер</TableHead>
                    <TableHead>Рейтинг</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movies.slice(0, 10).map((movie) => (
                    <TableRow key={movie.id}>
                      <TableCell>
                        <img
                          src={movie.poster}
                          alt={movie.title}
                          className="w-12 h-16 object-cover rounded"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{movie.title}</TableCell>
                      <TableCell>{movie.year}</TableCell>
                      <TableCell>{movie.director}</TableCell>
                      <TableCell>{movie.rating}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditMovie(movie)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteMovie(movie)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Cinemas Tab */}
          <TabsContent value="cinemas" className="space-y-4 animate-fade-in">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Кинотеатры</h2>
              <Dialog open={cinemaDialogOpen} onOpenChange={setCinemaDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Добавить кинотеатр
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Добавить кинотеатр</DialogTitle>
                    <DialogDescription>
                      Заполните информацию о кинотеатре
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="cinema-name">Название</Label>
                      <Input
                        id="cinema-name"
                        value={cinemaFormData.name}
                        onChange={(e) => setCinemaFormData({ ...cinemaFormData, name: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="cinema-address">Адрес</Label>
                      <Input
                        id="cinema-address"
                        value={cinemaFormData.address}
                        onChange={(e) => setCinemaFormData({ ...cinemaFormData, address: e.target.value })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setCinemaDialogOpen(false)}>
                      Отмена
                    </Button>
                    <Button onClick={handleAddCinema}>Добавить</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Название</TableHead>
                    <TableHead>Адрес</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cinemas.map((cinema) => (
                    <TableRow key={cinema.id}>
                      <TableCell className="font-medium">{cinema.name}</TableCell>
                      <TableCell>{cinema.address}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteCinema(cinema)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Screenings Tab */}
          <TabsContent value="screenings" className="space-y-4 animate-fade-in">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Расписание сеансов</h2>
              <Dialog open={screeningDialogOpen} onOpenChange={setScreeningDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Добавить сеанс
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Добавить сеанс</DialogTitle>
                    <DialogDescription>
                      Создайте новый сеанс для фильма
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="screening-cinema">Кинотеатр</Label>
                      <select
                        id="screening-cinema"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={screeningFormData.cinemaId}
                        onChange={(e) => setScreeningFormData({ ...screeningFormData, cinemaId: parseInt(e.target.value) })}
                      >
                        <option value={0}>Выберите кинотеатр</option>
                        {cinemas.map((cinema) => (
                          <option key={cinema.id} value={cinema.id}>
                            {cinema.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="screening-movie">Фильм</Label>
                      <select
                        id="screening-movie"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={screeningFormData.movieId}
                        onChange={(e) => setScreeningFormData({ ...screeningFormData, movieId: parseInt(e.target.value) })}
                      >
                        <option value={0}>Выберите фильм</option>
                        {movies.map((movie) => (
                          <option key={movie.id} value={movie.id}>
                            {movie.title}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="screening-datetime">Дата и время</Label>
                      <Input
                        id="screening-datetime"
                        type="datetime-local"
                        value={screeningFormData.datetime}
                        onChange={(e) => setScreeningFormData({ ...screeningFormData, datetime: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="screening-price">Цена (₽)</Label>
                      <Input
                        id="screening-price"
                        type="number"
                        value={screeningFormData.price}
                        onChange={(e) => setScreeningFormData({ ...screeningFormData, price: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setScreeningDialogOpen(false)}>
                      Отмена
                    </Button>
                    <Button onClick={handleAddScreening}>Добавить</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Кинотеатр</TableHead>
                    <TableHead>Фильм</TableHead>
                    <TableHead>Дата и время</TableHead>
                    <TableHead>Цена</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {screenings.slice(0, 20).map((screening) => (
                    <TableRow key={screening.id}>
                      <TableCell>{getCinemaName(screening.cinemaId)}</TableCell>
                      <TableCell>{getMovieTitle(screening.movieId)}</TableCell>
                      <TableCell>
                        {new Date(screening.datetime).toLocaleString('ru-RU')}
                      </TableCell>
                      <TableCell>{screening.price} ₽</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteScreening(screening)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminPanel;
