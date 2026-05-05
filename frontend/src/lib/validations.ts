import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string()
    .min(1, 'Email обязателен')
    .email('Неверный формат email'),
  password: z.string()
    .min(6, 'Пароль должен содержать минимум 6 символов')
});

export const registerSchema = z.object({
  username: z.string()
    .min(3, 'Имя пользователя должно содержать минимум 3 символа')
    .max(20, 'Имя пользователя не должно превышать 20 символов'),
  email: z.string()
    .min(1, 'Email обязателен')
    .email('Неверный формат email'),
  password: z.string()
    .min(6, 'Пароль должен содержать минимум 6 символов')
    .max(50, 'Пароль слишком длинный')
});

export const movieSchema = z.object({
  title: z.string().min(1, 'Название обязательно'),
  year: z.number().min(1895).max(new Date().getFullYear() + 5),
  duration: z.number().min(1),
  director: z.string().min(1, 'Режиссер обязателен'),
  description: z.string().min(10, 'Описание должно содержать минимум 10 символов'),
  country: z.string().min(1, 'Страна обязательна'),
  poster: z.string().url('Неверный формат URL'),
  rating: z.number().min(0).max(10),
});

export const cinemaSchema = z.object({
  name: z.string().min(1, 'Название обязательно'),
  address: z.string().min(1, 'Адрес обязателен'),
});

export const screeningSchema = z.object({
  cinemaId: z.number().min(1),
  movieId: z.number().min(1),
  datetime: z.string().min(1, 'Дата и время обязательны'),
  price: z.number().min(0, 'Цена не может быть отрицательной'),
});
