"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { IndianRupee, Users, ShieldCheck, CloudDownload, Loader2, Smartphone, CheckCircle2 } from 'lucide-react';
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
          <span className="font-headline text-2xl font-bold text-accent">Nevta Digital</span>
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
        <section className="w-full py-16 md:py-24 lg:py-32 xl:py-48 bg-cover bg-center relative" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop')" }}>
          <div className="absolute inset-0 bg-background/85" />
          <div className="container px-4 md:px-6 relative z-10 mx-auto text-center">
            <div className="flex flex-col items-center space-y-6">
              <div className="space-y-4">
                <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl text-accent max-w-4xl mx-auto">
                  Nevta Digital: The Future of Traditional Event Record Keeping
                </h1>
                <p className="mx-auto max-w-[800px] text-muted-foreground md:text-2xl font-body">
                  Ditch the paper notebooks. Record, manage, and preserve Sagoon contributions for all your social occasions securely with Nevta Digital.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 rounded-full h-16 text-xl font-bold shadow-xl">
                  <Link href="/register">{t('getStarted')}</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/10 px-10 rounded-full h-16 text-xl font-bold shadow-md">
                  <a href={DOWNLOAD_URL} target="_blank" rel="noopener noreferrer">
                    <Smartphone className="w-6 h-6 mr-2" /> {t('downloadApp')}
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-20 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-headline font-bold text-accent mb-4">Why Millions Choose Nevta Digital?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">Simplify your social event management with our modern, tradition-respecting toolkit.</p>
            </div>
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="border-none shadow-sm bg-secondary/20 hover:shadow-md transition-shadow">
                <CardContent className="pt-8 space-y-4">
                  <div className="p-4 bg-primary/20 w-fit rounded-2xl">
                    <ShieldCheck className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold font-headline text-accent">Secure & Permanent Storage</h3>
                  <p className="text-muted-foreground font-body leading-relaxed">
                    Never lose a name or amount again. Nevta Digital uses high-level encryption to ensure your celebratory records are safe for generations.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm bg-secondary/20 hover:shadow-md transition-shadow">
                <CardContent className="pt-8 space-y-4">
                  <div className="p-4 bg-primary/20 w-fit rounded-2xl">
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold font-headline text-accent">Real-time Data Insights</h3>
                  <p className="text-muted-foreground font-body leading-relaxed">
                    Get instant calculations of total contributions and guest counts. Nevta Digital provides live updates so you stay organized during the rush.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm bg-secondary/20 hover:shadow-md transition-shadow">
                <CardContent className="pt-8 space-y-4">
                  <div className="p-4 bg-primary/20 w-fit rounded-2xl">
                    <CloudDownload className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold font-headline text-accent">Effortless Digital Exports</h3>
                  <p className="text-muted-foreground font-body leading-relaxed">
                    Generate professional PDF and CSV reports in seconds. Use Nevta Digital to share records with family members or keep them for your archives.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-20 bg-accent text-accent-foreground">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h3 className="text-3xl md:text-5xl font-headline font-bold">Comprehensive Event Management with Nevta Digital</h3>
                <ul className="space-y-4">
                  {[
                    "Easy guest entry with location tracking",
                    "Custom UPI QR code for digital payments",
                    "Offline mode for remote celebrations",
                    "Multi-language support (English & Hindi)",
                    "Cloud sync across all your devices"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-lg">
                      <CheckCircle2 className="w-6 h-6 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-primary/20">
                <img 
                  src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2074&auto=format&fit=crop" 
                  alt="Traditional Indian Celebration" 
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-12 bg-secondary/10">
        <div className="container flex flex-col items-center justify-between gap-6 md:flex-row px-4 mx-auto">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="font-headline text-2xl font-bold text-accent">Nevta Digital</span>
            <p className="text-sm text-muted-foreground font-body">
              © 2024 Nevta Digital. {t('footerRights')}
            </p>
          </div>
          <div className="flex gap-8">
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline">{t('privacyPolicy')}</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline">{t('termsOfService')}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
