"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Plus, Calendar, IndianRupee, Trash2, ArrowRight, Loader2, Users, Search } from 'lucide-react';
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
} from "@/components/ui/alert-dialog";
import { useUser, useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking, deleteDocumentNonBlocking, useAuth } from '@/firebase';
import { collection, doc, query, orderBy } from 'firebase/firestore';
import { toast } from '@/hooks/use-toast';
import { signOut } from 'firebase/auth';
import { useLanguage } from '@/components/LanguageContext';
import { LanguageToggle } from '@/components/LanguageToggle';

function OccasionStats({ userId, occasionId }: { userId: string; occasionId: string }) {
  const { t } = useLanguage();
  const db = useFirestore();
  const contributionsRef = useMemoFirebase(() => {
    if (!db || !userId || !occasionId) return null;
    return collection(db, 'users', userId, 'occasions', occasionId, 'contributions');
  }, [db, userId, occasionId]);

  const { data: entries } = useCollection(contributionsRef);

  const stats = useMemo(() => {
    if (!entries) return { count: 0, total: 0 };
    return entries.reduce((acc, curr) => ({
      count: acc.count + 1,
      total: acc.total + (Number(curr.amount) || 0)
    }), { count: 0, total: 0 });
  }, [entries]);

  return (
    <div className="grid grid-cols-2 gap-4 mt-4">
      <div className="p-3 bg-primary/5 rounded-lg border border-primary/10">
        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">{t('entries')}</p>
        <div className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-primary" />
          <span className="font-bold text-accent">{stats.count}</span>
        </div>
      </div>
      <div className="p-3 bg-accent/5 rounded-lg border border-accent/10">
        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">{t('total')}</p>
        <div className="flex items-center gap-1.5" suppressHydrationWarning>
          <IndianRupee className="w-3.5 h-3.5 text-accent" />
          <span className="font-bold text-accent">₹{stats.total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const { t } = useLanguage();
  const db = useFirestore();
  const [searchQuery, setSearchQuery] = useState("");
  const [newOccasion, setNewOccasion] = useState({ name: "", eventDate: "" });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router, isMounted]);

  const occasionsRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return query(collection(db, 'users', user.uid, 'occasions'), orderBy('createdAt', 'desc'));
  }, [db, user?.uid]);

  const { data: occasions, isLoading: isOccasionsLoading } = useCollection(occasionsRef);

  const filteredOccasions = useMemo(() => {
    return (occasions || []).filter(occ => 
      occ.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [occasions, searchQuery]);

  const handleCreateOccasion = () => {
    if (!db || !user?.uid) return;
    if (!newOccasion.name.trim()) return;

    setIsCreating(true);
    const colRef = collection(db, 'users', user.uid, 'occasions');
    
    addDocumentNonBlocking(colRef, {
      name: newOccasion.name,
      eventDate: newOccasion.eventDate || new Date().toISOString().split('T')[0],
      ownerId: user.uid,
      createdAt: new Date().toISOString()
    }).then(() => {
      toast({ title: "Success", description: `${newOccasion.name} added.` });
      setIsDialogOpen(false);
      setIsCreating(false);
      setNewOccasion({ name: "", eventDate: "" });
    }).catch(() => setIsCreating(false));
  };

  const handleDeleteOccasion = (id: string) => {
    if (!db || !user?.uid) return;
    const docRef = doc(db, 'users', user.uid, 'occasions', id);
    deleteDocumentNonBlocking(docRef);
    toast({ title: "Deleted", description: "Event removed." });
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  if (isUserLoading || !user || isOccasionsLoading || !isMounted) {
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
          <span className="font-headline text-2xl font-bold text-accent">{t('appName')}</span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <LanguageToggle />
          <Button onClick={handleLogout} variant="ghost" size="sm" className="font-bold text-red-600">
            {t('logout')}
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-headline font-bold text-accent">{t('yourOccasions')}</h1>
            <p className="text-muted-foreground font-body">{t('manageRecords')}</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6 font-bold shadow-lg h-12">
                <Plus className="w-5 h-5 mr-2" /> {t('newOccasion')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="font-headline text-2xl text-accent">{t('createEventTitle')}</DialogTitle>
                <DialogDescription>{t('createEventDesc')}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">{t('appName')}</Label>
                  <Input id="title" value={newOccasion.name} onChange={e => setNewOccasion({...newOccasion, name: e.target.value})} placeholder={t('occasionTitlePlaceholder')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">{t('eventDate')}</Label>
                  <Input id="date" type="date" value={newOccasion.eventDate} onChange={e => setNewOccasion({...newOccasion, eventDate: e.target.value})} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>{t('cancel')}</Button>
                <Button onClick={handleCreateOccasion} className="bg-primary" disabled={isCreating}>
                  {isCreating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : t('startRecording')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input 
            placeholder={t('searchEventsPlaceholder')} 
            className="pl-12 h-14 rounded-2xl bg-white border-muted shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredOccasions.length > 0 ? filteredOccasions.map((occ) => (
            <Card key={occ.id} className="hover:shadow-md transition-all group border-muted shadow-sm overflow-hidden flex flex-col bg-white">
              <CardHeader className="bg-secondary/10 border-b pb-4">
                <CardTitle className="font-headline text-2xl text-accent group-hover:text-primary transition-colors line-clamp-1">{occ.name}</CardTitle>
                <CardDescription className="flex items-center gap-2 pt-2">
                   <Calendar className="w-4 h-4 text-primary" /> {occ.eventDate}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 flex-1">
                <OccasionStats userId={user.uid} occasionId={occ.id} />
              </CardContent>
              <CardFooter className="bg-white border-t p-4 flex gap-3">
                <Button asChild className="flex-1 bg-primary font-bold h-11">
                  <Link href={`/event/${occ.id}`}>
                    {t('manageRecords')} <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="icon" className="h-11 w-11 text-red-500 border-red-100">
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t('deletingEventTitle')}</AlertDialogTitle>
                      <AlertDialogDescription>{t('deletingEventDesc')}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteOccasion(occ.id)} className="bg-destructive text-destructive-foreground">
                        {t('delete')}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          )) : (
            <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-muted">
              <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
              <h3 className="text-2xl font-headline font-bold text-muted-foreground">{t('noEventsFound')}</h3>
              <p className="text-muted-foreground">{t('createFirstEvent')}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
