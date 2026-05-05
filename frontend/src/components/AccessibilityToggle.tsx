import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { useToast } from '@/hooks/use-toast';

const AccessibilityToggle = () => {
  const { isAccessibilityMode, toggleAccessibilityMode } = useAccessibility();
  const { toast } = useToast();

  const handleToggle = () => {
    toggleAccessibilityMode();
    toast({
      title: isAccessibilityMode ? 'Обычная версия' : 'Версия для слабовидящих',
      description: isAccessibilityMode 
        ? 'Стандартное отображение восстановлено' 
        : 'Включен режим повышенной контрастности и увеличенный шрифт',
    });
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={handleToggle}
      aria-label="Переключить версию для слабовидящих"
      title={isAccessibilityMode ? 'Обычная версия' : 'Версия для слабовидящих'}
    >
      <Eye className={`h-5 w-5 ${isAccessibilityMode ? 'text-primary' : ''}`} />
    </Button>
  );
};

export default AccessibilityToggle;
