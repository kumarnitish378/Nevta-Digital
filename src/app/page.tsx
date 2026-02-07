
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { IndianRupee, Users, ShieldCheck, CloudDownload } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary p-1.5 rounded-lg">
            <IndianRupee className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-headline text-2xl font-bold text-accent">Nevta Digital</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
            Login
          </Link>
          <Link href="/register" className="text-sm font-medium hover:text-primary transition-colors">
            Register
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-[url('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center relative">
          <div className="absolute inset-0 bg-background/80" />
          <div className="container px-4 md:px-6 relative z-10 mx-auto text-center">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-accent">
                  Digitalize Your Wedding <br className="hidden md:block" /> Nevta Records
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl font-body">
                  Ditch the paper notebooks. Record, manage, and preserve Sagoon contributions securely in real-time. Accessible anytime, anywhere.
                </p>
              </div>
              <div className="space-x-4">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 rounded-full">
                  <Link href="/register">Get Started</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/10 px-8 rounded-full">
                  <Link href="/login">Login</Link>
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
                  <h3 className="text-xl font-bold font-headline">Secure & Permanent</h3>
                  <p className="text-muted-foreground font-body">
                    Never lose your records due to physical damage. Encrypted cloud storage ensures your data is safe forever.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm bg-secondary/20">
                <CardContent className="pt-6 space-y-4">
                  <div className="p-3 bg-primary/10 w-fit rounded-xl">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold font-headline">Real-time Insights</h3>
                  <p className="text-muted-foreground font-body">
                    Get instant totals of guests and amounts as you enter data. No more manual calculations at the end of the night.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm bg-secondary/20">
                <CardContent className="pt-6 space-y-4">
                  <div className="p-3 bg-primary/10 w-fit rounded-xl">
                    <CloudDownload className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold font-headline">Easy Exports</h3>
                  <p className="text-muted-foreground font-body">
                    Export your reports to PDF or CSV in one click. Share them via WhatsApp or email with your family.
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
            © 2024 Nevta Digital. All rights reserved. Made with ❤️ for Indian Traditions.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-xs text-muted-foreground hover:underline">Privacy Policy</Link>
            <Link href="#" className="text-xs text-muted-foreground hover:underline">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
