import { Film, CheckCircle2, Clock, Eye, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { UserMovie } from '@/types/movie';
import { movies, genres } from '@/data/mockMovies';
import { useMemo } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface UserStatsProps {
  userMovies: UserMovie[];
}

const UserStats = ({ userMovies }: UserStatsProps) => {
  const completedMovies = userMovies.filter(um => um.status === 'completed');
  const plannedMovies = userMovies.filter(um => um.status === 'planned');
  const watchingMovies = userMovies.filter(um => um.status === 'watching');
  const droppedMovies = userMovies.filter(um => um.status === 'dropped');

  const averageRating = completedMovies.length > 0
    ? (completedMovies.reduce((sum, um) => sum + (um.rating || 0), 0) / completedMovies.length).toFixed(1)
    : '0';

  // Статистика по жанрам
  const genreStats = useMemo(() => {
    const genreCount: { [key: string]: number } = {};
    
    userMovies.forEach(um => {
      const movie = movies.find(m => m.id === um.movieId);
      if (movie) {
        movie.genres.forEach(genre => {
          genreCount[genre.name] = (genreCount[genre.name] || 0) + 1;
        });
      }
    });

    return Object.entries(genreCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [userMovies]);

  const topGenres = genreStats.slice(0, 5);
  const rareGenres = genreStats.slice(-3).reverse();

  // Данные для круговой диаграммы статусов
  const statusData = [
    { name: 'Просмотрено', value: completedMovies.length, color: 'hsl(142, 76%, 36%)' },
    { name: 'В планах', value: plannedMovies.length, color: 'hsl(221, 83%, 53%)' },
    { name: 'Смотрю', value: watchingMovies.length, color: 'hsl(48, 96%, 53%)' },
    { name: 'Брошено', value: droppedMovies.length, color: 'hsl(0, 84%, 60%)' },
  ].filter(item => item.value > 0);

  const stats = [
    {
      title: 'Всего фильмов',
      value: userMovies.length,
      icon: Film,
      color: 'text-primary',
    },
    {
      title: 'Просмотрено',
      value: completedMovies.length,
      icon: CheckCircle2,
      color: 'text-green-500',
    },
    {
      title: 'В планах',
      value: plannedMovies.length,
      icon: Clock,
      color: 'text-blue-500',
    },
    {
      title: 'Смотрю',
      value: watchingMovies.length,
      icon: Eye,
      color: 'text-yellow-500',
    },
    {
      title: 'Брошено',
      value: droppedMovies.length,
      icon: XCircle,
      color: 'text-red-500',
    },
  ];

  if (userMovies.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">
            Недостаточно данных для статистики. Начните добавлять фильмы!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                  <span className="text-2xl font-bold">{stat.value}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {completedMovies.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Средняя оценка
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">
              ⭐ {averageRating} / 10
            </div>
          </CardContent>
        </Card>
      )}

      {genreStats.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Топ-5 жанров</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topGenres}>
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={100}
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Распределение по статусам</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="hsl(var(--primary))"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {rareGenres.length > 0 && genreStats.length > 5 && (
        <Card>
          <CardHeader>
            <CardTitle>Редкие жанры</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {rareGenres.map((genre) => (
                <div key={genre.name} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                  <span className="text-sm text-muted-foreground">{genre.name}</span>
                  <span className="text-sm font-medium">{genre.count} {genre.count === 1 ? 'фильм' : 'фильма'}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserStats;
