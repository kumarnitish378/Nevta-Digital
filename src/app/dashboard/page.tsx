
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Plus, Calendar, User, Search, IndianRupee, Trash2, ArrowRight, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useUser, useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';

export default function Dashboard() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const [searchQuery, setSearchQuery] = useState("");
  const [newOccasion, setNewOccasion] = useState({ name: "", eventDate: "" });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setNewOccasion(prev => ({
      ...prev,
      eventDate: new Date().toISOString().split('T')[0]
    }));
  }, []);

  const occasionsRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return collection(db, 'users', user.uid, 'occasions');
  }, [db, user]);

  const { data: occasions, isLoading: isOccasionsLoading } = useCollection(occasionsRef);

  const filteredOccasions = (occasions || []).filter(occ => 
    occ.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateOccasion = () => {
    if (!db || !user || !newOccasion.name) return;
    
    const colRef = collection(db, 'users', user.uid, 'occasions');
    addDocumentNonBlocking(colRef, {
      ...newOccasion,
      ownerId: user.uid,
      createdAt: new Date().toISOString()
    });
    
    setIsDialogOpen(false);
    setNewOccasion({ name: "", eventDate: new Date().toISOString().split('T')[0] });
  };

  const handleDeleteOccasion = (id: string) => {
    if (!db || !user) return;
    const docRef = doc(db, 'users', user.uid, 'occasions', id);
    deleteDocumentNonBlocking(docRef);
  };

  if (isUserLoading || isOccasionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="px-6 h-16 flex items-center border-b bg-white shadow-sm sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary p-1.5 rounded-lg">
            <IndianRupee className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-headline text-2xl font-bold text-accent">Nevta Digital</span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mr-4 hidden sm:flex">
             <User className="w-4 h-4" />
             <span className="font-body">{user?.displayName || 'User'}</span>
          </div>
          <Button asChild variant="ghost" size="sm" className="font-bold text-red-600 hover:bg-red-50">
            <Link href="/login">Logout</Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-headline font-bold text-accent">Your Occasions</h1>
            <p className="text-muted-foreground font-body">Select an event to manage Nevta records</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6 font-bold shadow-lg">
                <Plus className="w-5 h-5 mr-2" /> New Occasion
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]" suppressHydrationWarning>
              <DialogHeader>
                <DialogTitle className="font-headline text-2xl text-accent">Create New Event</DialogTitle>
                <DialogDescription className="font-body">
                  Enter details for the new wedding or event record.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="font-body">Occasion Title</Label>
                  <Input id="title" value={newOccasion.name} onChange={e => setNewOccasion({...newOccasion, name: e.target.value})} placeholder="e.g. Rahul Weds Priya" suppressHydrationWarning />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date" className="font-body">Event Date</Label>
                  <Input id="date" type="date" value={newOccasion.eventDate} onChange={e => setNewOccasion({...newOccasion, eventDate: e.target.value})} suppressHydrationWarning />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateOccasion} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">Start Recording</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input 
            placeholder="Search events..." 
            className="pl-10 h-12 rounded-xl bg-white border-muted shadow-sm focus:ring-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            suppressHydrationWarning
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredOccasions.length > 0 ? filteredOccasions.map((occ) => (
            <Card key={occ.id} className="hover:shadow-md transition-all group border-muted shadow-sm overflow-hidden flex flex-col">
              <CardHeader className="bg-secondary/10 border-b pb-4">
                <div className="flex justify-between items-start">
                  <CardTitle className="font-headline text-2xl text-accent group-hover:text-primary transition-colors">{occ.name}</CardTitle>
                </div>
                <CardDescription className="flex items-center gap-4 pt-2 font-body text-base">
                  <span className="flex items-center gap-1" suppressHydrationWarning><Calendar className="w-4 h-4" /> {occ.eventDate}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 flex-1">
                <div className="h-24 flex items-center justify-center bg-primary/5 rounded-xl border border-primary/10 italic text-muted-foreground text-sm">
                   Open event to see collections
                </div>
              </CardContent>
              <CardFooter className="bg-white border-t p-4 flex gap-2">
                <Button asChild className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
                  <Link href={`/event/${occ.id}`}>
                    Manage Records <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Occasion?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete "<strong>{occ.name}</strong>" and all its associated Nevta records. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteOccasion(occ.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Delete Event
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          )) : (
            <div className="col-span-full py-16 text-center bg-white rounded-2xl border-2 border-dashed border-muted">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-30" />
              <h3 className="text-xl font-headline font-bold text-muted-foreground">No events found</h3>
              <p className="text-muted-foreground font-body">Create a new occasion to start recording Nevta</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
