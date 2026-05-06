import { useEffect, useState } from 'react';
import { Film, Send, Server, Sparkles } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const STORAGE_KEY = 'kinoclone:welcome-dialog-seen';

const WelcomeDialog = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const seen = window.localStorage.getItem(STORAGE_KEY);
      if (!seen) {
        setOpen(true);
      }
    } catch {
      setOpen(true);
    }
  }, []);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      try {
        window.localStorage.setItem(STORAGE_KEY, '1');
      } catch {
        // ignore — privacy mode / disabled storage
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Film className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-center text-xl">Добро пожаловать в Kinoclone</DialogTitle>
          <DialogDescription className="text-center">
            Pet-проект Муратова Андрея
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          <div className="flex gap-3">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <p className="text-muted-foreground">
              Это персональный каталог фильмов и расписание кинотеатров Краснодара. Вы можете
              искать фильмы, оценивать их, вести свою коллекцию и получать персональные
              рекомендации, а также смотреть актуальное расписание сеансов.
            </p>
          </div>

          <div className="flex gap-3">
            <Server className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <p className="text-muted-foreground">
              Деплой фронтенда на Vercel и бэкенда на Render выполнен автором проекта.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-md border border-border/60 bg-muted/40 p-3">
            <Send className="h-4 w-4 shrink-0 text-primary" />
            <div className="flex-1 text-sm">
              <div className="font-medium">Связаться с автором</div>
              <a
                href="https://t.me/m203ac"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Telegram: @m203ac
              </a>
            </div>
          </div>
        </div>

        <DialogFooter className="sm:justify-center">
          <Button onClick={() => handleOpenChange(false)} className="w-full sm:w-auto">
            Понятно, поехали
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeDialog;
