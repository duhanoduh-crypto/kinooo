export interface Movie {
  id: number;
  title: string;
  year: number;
  duration: number;
  director: string;
  description: string;
  poster: string;
  rating: number;
  country: string;
  genres: Genre[];
}

export interface Genre {
  id: number;
  name: string;
}

export type MovieStatus = 'planned' | 'watching' | 'completed' | 'dropped';

export interface UserMovie {
  userId: number;
  movieId: number;
  status: MovieStatus;
  rating?: number;
  comment?: string;
  dateAdded?: string;
}

export interface MovieFilters {
  search?: string;
  genreIds?: number[];
  sortBy?: 'rating' | 'year' | 'title';
  yearFrom?: number;
  yearTo?: number;
  ratingFrom?: number;
  ratingTo?: number;
  country?: string;
  director?: string;
}

export interface Cinema {
  id: number;
  name: string;
  address: string;
}

export interface Screening {
  id: number;
  cinemaId: number;
  movieId: number;
  datetime: string;
  price: number;
}

export type UserRole = 'user' | 'admin';

export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
}
