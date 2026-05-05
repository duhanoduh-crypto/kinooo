import { Film, Github, Mail, Code, Server, Database } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-border/40 bg-background/95 backdrop-blur">
      <div className="container px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Film className="h-5 w-5 text-primary" />
              <span className="font-bold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Kinoclone
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Ваш персональный каталог фильмов и расписание кинотеатров Краснодара
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Навигация</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Главная
                </Link>
              </li>
              <li>
                <Link to="/movies" className="text-muted-foreground hover:text-primary transition-colors">
                  Каталог фильмов
                </Link>
              </li>
              <li>
                <Link to="/cinemas" className="text-muted-foreground hover:text-primary transition-colors">
                  Кинотеатры
                </Link>
              </li>
              <li>
                <Link to="/schedules" className="text-muted-foreground hover:text-primary transition-colors">
                  Расписание
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Личный кабинет</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/profile" className="text-muted-foreground hover:text-primary transition-colors">
                  Мои фильмы
                </Link>
              </li>
              <li>
                <Link to="/recommendations" className="text-muted-foreground hover:text-primary transition-colors">
                  Рекомендации
                </Link>
              </li>
              <li>
                <Link to="/auth" className="text-muted-foreground hover:text-primary transition-colors">
                  Вход / Регистрация
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Контакты</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                info@kinoclone.ru
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Github className="h-4 w-4" />
                github.com/kinoclone
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Команда разработки</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a 
                  href="https://vk.com/m_andrey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
                  aria-label="Frontend разработчик - Андрей Муратов"
                >
                  <Code className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <div>
                <div className="font-medium">Frontend</div>
                <div className="text-xs opacity-80">Андрей Муратов</div>
              </div>
                </a>
              </li>
              <li>
                <a 
                  href="https://vk.com/gore___poet" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
                  aria-label="Backend разработчик - Евгения Кулакова"
                >
                  <Server className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <div>
                <div className="font-medium">Backend</div>
                <div className="text-xs opacity-80">Евгения Кулакова</div>
              </div>
                </a>
              </li>
              <li>
                <a 
                  href="https://vk.com/kormilicyna" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
                  aria-label="Database разработчик - Дарья Кормилицына"
                >
                  <Database className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <div>
                <div className="font-medium">Database</div>
                <div className="text-xs opacity-80">Дарья Кормилицына</div>
              </div>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/40 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Kinoclone. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
