
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Plus, Calendar, User, Search, IndianRupee, Trash2, ArrowRight } from 'lucide-react';
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

// Mocked Data
const INITIAL_OCCASIONS = [
  { id: '1', title: 'Rahul & Priya Wedding', organizer: 'Suresh Kumar', date: '2024-05-15', guestCount: 154, totalAmount: 254000 },
  { id: '2', title: 'Aman Birthday', organizer: 'Suresh Kumar', date: '2024-03-10', guestCount: 45, totalAmount: 12500 },
];

export default function Dashboard() {
  const [occasions, setOccasions] = useState(INITIAL_OCCASIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [newOccasion, setNewOccasion] = useState({ title: "", organizer: "Suresh Kumar", date: "" });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Defer date initialization to prevent hydration mismatch
  useEffect(() => {
    setNewOccasion(prev => ({
      ...prev,
      date: new Date().toISOString().split('T')[0]
    }));
  }, []);

  const filteredOccasions = occasions.filter(occ => 
    occ.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateOccasion = () => {
    const id = (occasions.length + 1).toString();
    const createdOccasion = {
      id,
      ...newOccasion,
      guestCount: 0,
      totalAmount: 0
    };
    setOccasions([createdOccasion, ...occasions]);
    setIsDialogOpen(false);
    setNewOccasion({ title: "", organizer: "Suresh Kumar", date: new Date().toISOString().split('T')[0] });
  };

  const handleDeleteOccasion = (id: string) => {
    setOccasions(occasions.filter(o => o.id !== id));
  };

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
             <span className="font-body">Suresh Kumar</span>
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
                  <Input id="title" value={newOccasion.title} onChange={e => setNewOccasion({...newOccasion, title: e.target.value})} placeholder="e.g. Rahul Weds Priya" suppressHydrationWarning />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organizer" className="font-body">Organizer Name</Label>
                  <Input id="organizer" value={newOccasion.organizer} onChange={e => setNewOccasion({...newOccasion, organizer: e.target.value})} suppressHydrationWarning />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date" className="font-body">Event Date</Label>
                  <Input id="date" type="date" value={newOccasion.date} onChange={e => setNewOccasion({...newOccasion, date: e.target.value})} suppressHydrationWarning />
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
                  <CardTitle className="font-headline text-2xl text-accent group-hover:text-primary transition-colors">{occ.title}</CardTitle>
                  <div className="bg-white px-3 py-1 rounded-full text-xs font-bold border border-muted text-muted-foreground">
                    ID: #{occ.id}
                  </div>
                </div>
                <CardDescription className="flex items-center gap-4 pt-2 font-body text-base">
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {occ.date}</span>
                  <span className="flex items-center gap-1 text-muted-foreground"><User className="w-4 h-4" /> {occ.organizer}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 flex-1">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Guests</p>
                    <p className="text-2xl font-bold font-headline text-accent">{occ.guestCount}</p>
                  </div>
                  <div className="p-4 bg-accent/5 rounded-xl border border-accent/10">
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Total Amount</p>
                    <p className="text-2xl font-bold font-headline text-accent">₹{occ.totalAmount.toLocaleString()}</p>
                  </div>
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
                        This will permanently delete "<strong>{occ.title}</strong>" and all its associated Nevta records. This action cannot be undone.
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
