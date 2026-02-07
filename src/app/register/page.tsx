
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { IndianRupee, Loader2, Phone } from 'lucide-react';
import { useAuth, initiateEmailSignUp, useFirestore, setDocumentNonBlocking } from '@/firebase';
import { updateProfile } from 'firebase/auth';
import { doc } from 'firebase/firestore';
import { toast } from '@/hooks/use-toast';

export default function RegisterPage() {
  const router = useRouter();
  const auth = useAuth();
  const db = useFirestore();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mobile.length < 10) {
      toast({ title: "Invalid Mobile", description: "Please enter a valid 10-digit mobile number.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    
    // Internal mapping of mobile to a unique email-like identifier for Firebase Auth
    const dummyEmail = `${mobile}@nevta.digital`;
    
    try {
      initiateEmailSignUp(auth, dummyEmail, password);
      
      const checkAuthInterval = setInterval(async () => {
        if (auth.currentUser) {
          clearInterval(checkAuthInterval);
          
          await updateProfile(auth.currentUser, { displayName: name });
          
          const userDocRef = doc(db, 'users', auth.currentUser.uid);
          setDocumentNonBlocking(userDocRef, {
            id: auth.currentUser.uid,
            name: name,
            mobileNumber: mobile,
            createdAt: new Date().toISOString()
          }, { merge: true });

          router.push('/dashboard');
        }
      }, 500);

      setTimeout(() => {
        clearInterval(checkAuthInterval);
        setIsLoading(false);
      }, 10000);

    } catch (err: any) {
      setIsLoading(false);
      toast({ title: "Registration Failed", description: err.message, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-xl border-t-4 border-t-primary">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary p-3 rounded-full">
              <IndianRupee className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-3xl font-headline font-bold text-accent">Create Account</CardTitle>
          <CardDescription className="font-body text-base">
            Join Nevta Digital with your mobile number
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="font-body">Full Name</Label>
              <Input 
                id="name" 
                placeholder="Enter your name" 
                required 
                className="rounded-lg h-12"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile" className="font-body">Mobile Number</Label>
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
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Create Password</Label>
              <Input 
                id="password" 
                type="password" 
                required 
                className="rounded-lg h-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6 text-lg rounded-xl shadow-md" disabled={isLoading}>
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Register Now"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center font-body text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline font-bold">
              Login here
            </Link>
          </div>
          <Link href="/" className="text-xs text-center text-muted-foreground hover:text-primary transition-colors">
            ← Back to Home
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
