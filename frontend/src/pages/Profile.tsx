import { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { movies } from '@/data/mockMovies';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import UserStats from '@/components/UserStats';
import UserMovieCard from '@/components/UserMovieCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail } from 'lucide-react';

const Profile = () => {
  const { user, userMovies } = useAuth();
  const [activeTab, setActiveTab] = useState('all');

  const filteredMovies = useMemo(() => {
    let filtered = userMovies;

    if (activeTab !== 'all') {
      filtered = userMovies.filter(um => um.status === activeTab);
    }

    return filtered.map(um => {
      const movie = movies.find(m => m.id === um.movieId);
      return { userMovie: um, movie };
    }).filter(item => item.movie !== undefined);
  }, [userMovies, activeTab]);

  const counts = {
    all: userMovies.length,
    completed: userMovies.filter(um => um.status === 'completed').length,
    planned: userMovies.filter(um => um.status === 'planned').length,
    watching: userMovies.filter(um => um.status === 'watching').length,
    dropped: userMovies.filter(um => um.status === 'dropped').length,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Личный кабинет</h1>
              <p className="text-muted-foreground">Управляйте своей коллекцией фильмов</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Профиль</CardTitle>
              <CardDescription>Информация о пользователе</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{user?.username}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{user?.email}</span>
              </div>
            </CardContent>
          </Card>

          <UserStats userMovies={userMovies} />

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 sm:grid-cols-5 w-full max-w-3xl">
              <TabsTrigger value="all">
                Все ({counts.all})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Просмотрено ({counts.completed})
              </TabsTrigger>
              <TabsTrigger value="planned">
                В планах ({counts.planned})
              </TabsTrigger>
              <TabsTrigger value="watching">
                Смотрю ({counts.watching})
              </TabsTrigger>
              <TabsTrigger value="dropped">
                Брошено ({counts.dropped})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {filteredMovies.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">
                      {activeTab === 'all' 
                        ? 'У вас пока нет фильмов в коллекции'
                        : 'Нет фильмов с этим статусом'}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredMovies.map(({ movie, userMovie }) => (
                    movie && (
                      <UserMovieCard
                        key={userMovie.movieId}
                        movie={movie}
                        userMovie={userMovie}
                      />
                    )
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
