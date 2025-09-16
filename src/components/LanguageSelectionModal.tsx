import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, Check } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

export const LanguageSelectionModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState<'en' | 'hi'>('en');
  const { setLanguage } = useLanguage();

  useEffect(() => {
    const hasSeenLanguageSelection = localStorage.getItem('hasSeenLanguageSelection');
    if (!hasSeenLanguageSelection) {
      setIsOpen(true);
    }
  }, []);

  const handleLanguageSelect = (lang: 'en' | 'hi') => {
    setSelectedLang(lang);
  };

  const handleContinue = () => {
    setLanguage(selectedLang);
    localStorage.setItem('hasSeenLanguageSelection', 'true');
    setIsOpen(false);
  };

  const languages = [
    {
      code: 'en' as const,
      name: 'English',
      nativeName: 'English',
      flag: '🇺🇸'
    },
    {
      code: 'hi' as const,
      name: 'Hindi',
      nativeName: 'हिंदी',
      flag: '🇮🇳'
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center text-center p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Globe className="h-8 w-8 text-orange-600" />
            <h2 className="text-2xl font-bold text-gray-900">Choose Your Language</h2>
          </div>
          
          <p className="text-gray-600 mb-8">
            Select your preferred language for the best experience
          </p>

          <div className="grid grid-cols-1 gap-4 w-full mb-8">
            {languages.map((lang) => (
              <Card
                key={lang.code}
                className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedLang === lang.code
                    ? 'ring-2 ring-orange-500 bg-orange-50 border-orange-200'
                    : 'hover:bg-gray-50 border-gray-200'
                }`}
                onClick={() => handleLanguageSelect(lang.code)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{lang.flag}</span>
                    <div className="text-left">
                      <div className="font-semibold text-gray-900">{lang.name}</div>
                      <div className="text-sm text-gray-600">{lang.nativeName}</div>
                    </div>
                  </div>
                  {selectedLang === lang.code && (
                    <Check className="h-5 w-5 text-orange-600" />
                  )}
                </div>
              </Card>
            ))}
          </div>

          <Button
            onClick={handleContinue}
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
          >
            Continue
          </Button>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};