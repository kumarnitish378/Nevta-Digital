
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { IndianRupee, Loader2 } from 'lucide-react';
import { useAuth, initiateEmailSignUp, useFirestore, setDocumentNonBlocking } from '@/firebase';
import { updateProfile } from 'firebase/auth';
import { doc } from 'firebase/firestore';

export default function RegisterPage() {
  const router = useRouter();
  const auth = useAuth();
  const db = useFirestore();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      initiateEmailSignUp(auth, email, password);
      // Wait for the auth state to catch up
      const checkAuthInterval = setInterval(async () => {
        if (auth.currentUser) {
          clearInterval(checkAuthInterval);
          
          // 1. Update Profile Display Name
          await updateProfile(auth.currentUser, { displayName: name });
          
          // 2. Create User Document in Firestore to satisfy security rules
          const userDocRef = doc(db, 'users', auth.currentUser.uid);
          setDocumentNonBlocking(userDocRef, {
            id: auth.currentUser.uid,
            name: name,
            email: email,
            createdAt: new Date().toISOString()
          }, { merge: true });

          router.push('/dashboard');
        }
      }, 500);

      // Timeout after 10 seconds if it fails
      setTimeout(() => {
        clearInterval(checkAuthInterval);
        setIsLoading(false);
      }, 10000);

    } catch (err) {
      console.error(err);
      setIsLoading(false);
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
            Join Nevta Digital to securely manage your events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="font-body">Full Name (Owner/Operator)</Label>
              <Input 
                id="name" 
                placeholder="John Doe" 
                required 
                className="rounded-lg"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="font-body">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="you@example.com" 
                required 
                className="rounded-lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Create Password</Label>
              <Input 
                id="password" 
                type="password" 
                required 
                className="rounded-lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6 text-lg rounded-lg" disabled={isLoading}>
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Complete Registration"}
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
