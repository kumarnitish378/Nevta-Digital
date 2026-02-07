"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { IndianRupee, Loader2, Phone } from 'lucide-react';
import { useAuth, initiateEmailSignIn, useUser } from '@/firebase';
import { toast } from '@/hooks/use-toast';
import { useLanguage } from '@/components/LanguageContext';
import { LanguageToggle } from '@/components/LanguageToggle';

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router, isMounted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mobile.length < 10) {
      toast({ title: t('mobile'), description: "Please enter a valid 10-digit mobile number.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    const dummyEmail = `${mobile}@nevta.digital`;
    
    try {
      await initiateEmailSignIn(auth, dummyEmail, password);
      toast({ title: "Success", description: t('welcome') });
    } catch (err: any) {
      setIsLoading(false);
      let message = "Please check your mobile number and password.";
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        message = "Invalid mobile number or password.";
      }
      toast({ title: t('login'), description: message, variant: "destructive" });
    }
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute top-4 right-4">
        <LanguageToggle />
      </div>
      <Card className="w-full max-w-md shadow-xl border-t-4 border-t-primary">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary p-3 rounded-full">
              <IndianRupee className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-3xl font-headline font-bold text-accent">{t('welcome')}</CardTitle>
          <CardDescription className="font-body text-base">
            {t('loginWithMobile') || "Login with your mobile number"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4" suppressHydrationWarning>
            <div className="space-y-2">
              <Label htmlFor="mobile" className="font-body">{t('mobile')}</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  id="mobile" 
                  type="tel"
                  placeholder="9876543210" 
                  required 
                  maxLength={10}
                  className="rounded-lg h-12 pl-10"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                  suppressHydrationWarning
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('password')}</Label>
              <Input 
                id="password" 
                type="password" 
                required 
                className="rounded-lg h-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                suppressHydrationWarning
              />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6 text-lg rounded-xl shadow-md" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{t('authenticating')}</span>
                </div>
              ) : t('loginNow') || "Login Now"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center font-body text-muted-foreground">
            {t('dontHaveAccount')}{" "}
            <Link href="/register" className="text-primary hover:underline font-bold">
              {t('registerHere')}
            </Link>
          </div>
          <Link href="/" className="text-xs text-center text-muted-foreground hover:text-primary transition-colors">
            ← {t('backToHome')}
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
