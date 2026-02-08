"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, CheckCircle2, IndianRupee } from 'lucide-react';
import { useLanguage } from '@/components/LanguageContext';
import { LanguageToggle } from '@/components/LanguageToggle';

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white shadow-sm sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary p-1.5 rounded-lg">
            <IndianRupee className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-headline text-2xl font-bold text-accent">{t('appName')}</span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <LanguageToggle />
          <Button asChild variant="ghost" size="sm">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" /> {t('back')}
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-headline font-bold text-accent tracking-tight">
              {t('aboutTitle')}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-body max-w-2xl mx-auto leading-relaxed">
              {t('aboutSubtitle')}
            </p>
          </div>

          <Card className="border-none shadow-lg overflow-hidden">
            <div className="relative aspect-video w-full">
              <img 
                src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop" 
                alt="Nevta Digital Shagun Management" 
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-accent/50 to-transparent" />
            </div>
            <CardContent className="p-8 md:p-12 space-y-12 bg-white">
              <div className="space-y-4">
                <h2 className="text-3xl font-headline font-bold text-accent">{t('aboutH2_1')}</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {t('aboutP1')}
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-3xl font-headline font-bold text-accent">{t('aboutH2_2')}</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {t('aboutP2')}
                </p>
                <ul className="grid gap-4 mt-6">
                  {[
                    t('aboutBullet1'),
                    t('aboutBullet2'),
                    t('aboutBullet3')
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-lg text-accent font-bold">
                      <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-8 bg-secondary/20 rounded-3xl border border-primary/20 space-y-4">
                <h3 className="text-2xl font-headline font-bold text-accent">{t('aboutH3_1')}</h3>
                <p className="text-lg text-muted-foreground italic">
                  {t('aboutP3')}
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="text-center py-8">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 rounded-full h-16 text-xl font-bold shadow-xl">
              <Link href="/register">{t('getStarted')}</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t py-12 bg-secondary/10">
        <div className="container flex flex-col items-center justify-between gap-6 md:flex-row px-4 mx-auto">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="font-headline text-2xl font-bold text-accent">{t('appName')}</span>
            <p className="text-sm text-muted-foreground">© 2024 Nevta Digital.</p>
          </div>
          <div className="flex gap-8">
            <Link href="/" className="text-sm hover:text-primary">{t('backToHome')}</Link>
            <Link href="/login" className="text-sm hover:text-primary">{t('login')}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
