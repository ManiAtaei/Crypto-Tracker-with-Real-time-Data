import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Coins, TrendingUp, Globe2 } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'fa' : 'en');
  };

  return (
    <div className="min-h-screen bg-gray-50" dir={i18n.language === 'fa' ? 'rtl' : 'ltr'}>
      <header className="bg-white shadow-md">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Link to="/" className="flex items-center space-x-2 text-indigo-600">
                <Coins className="h-6 w-6" />
                <span className="font-bold text-xl">CryptoTracker</span>
              </Link>
              <Link to="/" className="text-gray-600 hover:text-indigo-600">
                {t('common.home')}
              </Link>
              <Link to="/investments" className="text-gray-600 hover:text-indigo-600">
                {t('common.investments')}
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleLanguage}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
              >
                <Globe2 className="h-5 w-5" />
                <span>{t('common.language')}</span>
              </button>
            </div>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">CryptoTracker</h3>
              <p className="text-gray-400">
                Your trusted source for cryptocurrency tracking and analysis.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-gray-400 hover:text-white">
                    {t('common.home')}
                  </Link>
                </li>
                <li>
                  <Link to="/investments" className="text-gray-400 hover:text-white">
                    {t('common.investments')}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Contact</h3>
              <p className="text-gray-400">
                Email: contact@cryptotracker.com<br />
                Twitter: @cryptotracker
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;