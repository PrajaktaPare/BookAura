import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import PopularBooks from '../components/PopularBooks';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import LoginDialog from '../components/LoginDialog';
import RegisterDialog from '../components/RegisterDialog';
import PublisherRegisterDialog from '../components/PublisherRegisterDialog';

export default function LandingPage() {
  const { theme } = useTheme();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isPublisherRegisterOpen, setIsPublisherRegisterOpen] = useState(false);

  const openLogin = () => setIsLoginOpen(true);
  const openRegister = () => setIsRegisterOpen(true);
  const openPublisherRegister = () => {
    console.log('Opening publisher register dialog');
    setIsPublisherRegisterOpen(true);
  };

  return (
    <main className={`bg-gray-50 ${theme === 'dark' ? 'dark' : ''}`}>
      <Navbar openLogin={openLogin} openRegister={openRegister} />
      <Hero openLogin={openLogin} openRegister={openRegister} />
      <Features />
      <PopularBooks openPublisherRegister={openPublisherRegister} />
      <Testimonials />
      <FAQ />
      <CTA openRegister={openRegister} />
      <Footer />
      <LoginDialog isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} openRegister={openRegister} />
      <RegisterDialog isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} openLogin={openLogin} isPublisher={false} />
      <PublisherRegisterDialog isOpen={isPublisherRegisterOpen} onClose={() => setIsPublisherRegisterOpen(false)} openLogin={openLogin} />
    </main>
  );
}

