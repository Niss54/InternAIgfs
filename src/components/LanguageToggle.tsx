import { Button } from "@/components/ui/button";
import { Globe, Check } from "lucide-react";
import { useTranslation, Language } from "@/lib/i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LanguageToggle = () => {
  const { language, switchLanguage } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 text-primary bg-primary/10 hover:bg-primary/20 transition-colors font-semibold"
        >
          <Globe className="w-4 h-4" />
          <span className="text-sm font-medium">
            {language === 'en' ? 'ENG' : 'हिं'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 glass-card">
        <DropdownMenuItem
          onClick={() => switchLanguage('en')}
          className={`cursor-pointer ${
            language === 'en' 
              ? 'bg-primary/20 text-primary font-semibold' 
              : 'hover:bg-primary/10'
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <span>English</span>
            {language === 'en' && <Check className="w-4 h-4 text-primary" />}
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => switchLanguage('hi')}
          className={`cursor-pointer ${
            language === 'hi' 
              ? 'bg-primary/20 text-primary font-semibold' 
              : 'hover:bg-primary/10'
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <span>हिंदी</span>
            {language === 'hi' && <Check className="w-4 h-4 text-primary" />}
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageToggle;