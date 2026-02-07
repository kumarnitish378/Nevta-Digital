"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { IndianRupee, Users, ShieldCheck, CloudDownload, Loader2, Smartphone } from 'lucide-react';
import { useLanguage } from '@/components/LanguageContext';
import { LanguageToggle } from '@/components/LanguageToggle';

export default function Home() {
  const { t } = useLanguage();
  const [isMounted, setIsMounted] = useState(false);
  const DOWNLOAD_URL = "https://drive.google.com/file/d/1LaJ8y0Q5dwN7uKBd2FXdt4htmiVUQ-L0/view?usp=sharing";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary p-1.5 rounded-lg">
            <IndianRupee className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-headline text-2xl font-bold text-accent">{t('appName')}</span>
        </Link>
        <nav className="ml-auto flex items-center gap-4 sm:gap-6">
          <LanguageToggle />
          <Button asChild variant="outline" size="sm" className="hidden sm:flex border-primary text-primary hover:bg-primary/10">
            <a href={DOWNLOAD_URL} target="_blank" rel="noopener noreferrer">
              <Smartphone className="w-4 h-4 mr-2" /> {t('downloadApp')}
            </a>
          </Button>
          <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
            {t('login')}
          </Link>
          <Link href="/register" className="text-sm font-medium hover:text-primary transition-colors">
            {t('register')}
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-cover bg-center relative" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop')" }}>
          <div className="absolute inset-0 bg-background/80" />
          <div className="container px-4 md:px-6 relative z-10 mx-auto text-center">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-accent">
                  {t('landingTitle')}
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl font-body">
                  {t('landingSubtitle')}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 rounded-full h-14 text-lg font-bold">
                  <Link href="/register">{t('getStarted')}</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/10 px-8 rounded-full h-14 text-lg font-bold">
                  <a href={DOWNLOAD_URL} target="_blank" rel="noopener noreferrer">
                    <Smartphone className="w-5 h-5 mr-2" /> {t('downloadApp')}
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="border-none shadow-sm bg-secondary/20">
                <CardContent className="pt-6 space-y-4">
                  <div className="p-3 bg-primary/10 w-fit rounded-xl">
                    <ShieldCheck className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold font-headline">{t('securePermanent')}</h3>
                  <p className="text-muted-foreground font-body">
                    {t('secureDesc')}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm bg-secondary/20">
                <CardContent className="pt-6 space-y-4">
                  <div className="p-3 bg-primary/10 w-fit rounded-xl">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold font-headline">{t('realtimeInsights')}</h3>
                  <p className="text-muted-foreground font-body">
                    {t('realtimeDesc')}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm bg-secondary/20">
                <CardContent className="pt-6 space-y-4">
                  <div className="p-3 bg-primary/10 w-fit rounded-xl">
                    <CloudDownload className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold font-headline">{t('easyExports')}</h3>
                  <p className="text-muted-foreground font-body">
                    {t('easyDesc')}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 bg-secondary/10">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row px-4 mx-auto">
          <p className="text-sm text-muted-foreground font-body">
            © 2024 {t('appName')}. {t('footerRights')}
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-xs text-muted-foreground hover:underline">{t('privacyPolicy')}</Link>
            <Link href="#" className="text-xs text-muted-foreground hover:underline">{t('termsOfService')}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
