import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserMovie, MovieStatus } from '@/types/movie';
import { authAPI } from '@/services/api'; // Импорт реального API

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  userMovies: UserMovie[];
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserMovie: (movieId: number, status: MovieStatus, rating?: number) => void;
  getUserMovieStatus: (movieId: number) => UserMovie | undefined;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userMovies, setUserMovies] = useState<UserMovie[]>([]);

  useEffect(() => {
    // Проверяем сохраненную сессию (только пользователя, фильмы грузим с API)
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    
    if (savedUser && savedToken) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      // Загружаем пользовательские фильмы с бэкенда
      loadUserMovies();
    }
  }, []);

  const loadUserMovies = async () => {
    try {
      // TODO: Добавить эндпоинт для получения пользовательских фильмов
      // const movies = await userMoviesAPI.getAll();
      // setUserMovies(movies);
    } catch (error) {
      console.error('Failed to load user movies:', error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // ✅ РЕАЛЬНЫЙ запрос к бэкенду
      const response = await authAPI.login({ email, password });
      
      setUser(response.user);
      setUserMovies(response.userMovies || []);
      
      // Сохраняем токен и пользователя
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
    } catch (error) {
      console.error('Login failed:', error);
      throw error; // Пробрасываем ошибку для обработки в компоненте
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      // ✅ РЕАЛЬНЫЙ запрос к бэкенду
      const response = await authAPI.register({ username, email, password });
      
      setUser(response.user);
      setUserMovies([]);
      
      // Сохраняем токен и пользователя
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setUserMovies([]);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('userMovies'); // Удаляем если есть
  };

  const updateUserMovie = async (movieId: number, status: MovieStatus, rating?: number) => {
    if (!user) return;

    try {
      // ✅ РЕАЛЬНЫЙ запрос к бэкенду
      // TODO: Добавить вызов API для обновления пользовательского фильма
      // await userMoviesAPI.update(movieId, { status, rating });
      
      // Временная локальная логика (потом заменить на обновление с бэкенда)
      const existingIndex = userMovies.findIndex(
        um => um.userId === user.id && um.movieId === movieId
      );

      let newUserMovies: UserMovie[];

      if (existingIndex >= 0) {
        newUserMovies = [...userMovies];
        newUserMovies[existingIndex] = {
          ...newUserMovies[existingIndex],
          userId: user.id,
          movieId,
          status,
          rating,
        };
      } else {
        newUserMovies = [
          ...userMovies,
          {
            userId: user.id,
            movieId,
            status,
            rating,
            dateAdded: new Date().toISOString(),
          },
        ];
      }


      setUserMovies(newUserMovies);
      
    } catch (error) {
      console.error('Failed to update user movie:', error);
      throw error;
    }
  };

  const getUserMovieStatus = (movieId: number): UserMovie | undefined => {
    if (!user) return undefined;
    return userMovies.find(um => um.userId === user.id && um.movieId === movieId);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        userMovies,
        login,
        register,
        logout,
        updateUserMovie,
        getUserMovieStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
