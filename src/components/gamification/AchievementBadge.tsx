import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AchievementBadgeProps {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  unlocked?: boolean;
  unlockedAt?: string;
  size?: 'sm' | 'md' | 'lg';
  showAnimation?: boolean;
}

export const AchievementBadge = ({ 
  name, 
  description, 
  icon, 
  points, 
  unlocked = false, 
  unlockedAt,
  size = 'md',
  showAnimation = false 
}: AchievementBadgeProps) => {
  const sizeClasses = {
    sm: 'w-16 h-16 text-xs',
    md: 'w-20 h-20 text-sm', 
    lg: 'w-24 h-24 text-base'
  };

  return (
    <Card className={cn(
      'relative overflow-hidden transition-all duration-300',
      unlocked 
        ? 'bg-gradient-to-br from-primary/20 to-accent/20 border-primary/50 hover:scale-105' 
        : 'bg-muted/50 border-muted-foreground/20 opacity-60',
      showAnimation && unlocked && 'animate-pulse',
      sizeClasses[size]
    )}>
      <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center">
        <div className={cn(
          'text-2xl mb-1',
          size === 'lg' && 'text-3xl mb-2',
          size === 'sm' && 'text-xl mb-0.5'
        )}>
          {unlocked ? icon : '🔒'}
        </div>
        
        <div className={cn(
          'font-semibold leading-tight',
          size === 'sm' && 'text-xs',
          size === 'md' && 'text-xs', 
          size === 'lg' && 'text-sm'
        )}>
          {name}
        </div>
        
        {unlocked && (
          <Badge variant="secondary" className={cn(
            'mt-1 px-1 py-0 text-xs',
            size === 'sm' && 'text-[10px] px-0.5'
          )}>
            +{points}pts
          </Badge>
        )}
        
        {size === 'lg' && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {description}
          </p>
        )}
      </div>
      
      {unlocked && unlockedAt && (
        <div className="absolute bottom-0 right-0 w-2 h-2 bg-accent rounded-full animate-pulse" />
      )}
    </Card>
  );
};