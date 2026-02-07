
"use client";

import { useState, useMemo, useEffect, useCallback, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, IndianRupee, Plus, Search, FileText, Trash2, Upload, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
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
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase, addDocumentNonBlocking, deleteDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase';
import { doc, collection, query, orderBy } from 'firebase/firestore';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useLanguage } from '@/components/LanguageContext';
import { LanguageToggle } from '@/components/LanguageToggle';

function EventContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const { t } = useLanguage();
  const db = useFirestore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [guestName, setGuestName] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [amount, setAmount] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router, isMounted]);

  const userRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, 'users', user.uid);
  }, [db, user?.uid]);

  const { data: userData } = useDoc(userRef);

  const occasionRef = useMemoFirebase(() => {
    if (!db || !user?.uid || !id) return null;
    return doc(db, 'users', user.uid, 'occasions', id);
  }, [db, user?.uid, id]);

  const { data: occasion, isLoading: isOccasionLoading } = useDoc(occasionRef);

  const contributionsRef = useMemoFirebase(() => {
    if (!db || !user?.uid || !id) return null;
    return query(collection(db, 'users', user.uid, 'occasions', id, 'contributions'), orderBy('contributionDate', 'desc'));
  }, [db, user?.uid, id]);

  const { data: entries, isLoading: isEntriesLoading } = useCollection(contributionsRef);

  const totalAmount = useMemo(() => (entries || []).reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0), [entries]);
  const guestCount = entries?.length || 0;

  const uniqueLocations = useMemo(() => {
    if (!entries) return [];
    const locs = entries.map(e => e.location).filter(Boolean);
    return Array.from(new Set(locs)).sort();
  }, [entries]);

  const filteredSuggestions = useMemo(() => {
    if (!locationInput || !showSuggestions) return [];
    return uniqueLocations.filter(loc => 
      loc.toLowerCase().includes(locationInput.toLowerCase()) && 
      loc.toLowerCase() !== locationInput.toLowerCase()
    ).slice(0, 5);
  }, [locationInput, uniqueLocations, showSuggestions]);

  const filteredEntries = useMemo(() => {
    return (entries || []).filter(e => 
      e.guestName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      e.location?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [entries, searchQuery]);

  const handleAddEntry = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !user?.uid || !id || !guestName || !amount) return;

    const colRef = collection(db, 'users', user.uid, 'occasions', id, 'contributions');
    addDocumentNonBlocking(colRef, {
      guestName,
      location: locationInput,
      amount: parseFloat(amount),
      contributionDate: new Date().toISOString(),
      occasionId: id
    });

    setGuestName("");
    setLocationInput("");
    setAmount("");
    setShowSuggestions(false);
    toast({ title: "Entry Saved", description: `₹${amount} for ${guestName}` });
  }, [db, user?.uid, id, guestName, locationInput, amount]);

  const handleDeleteEntry = (entryId: string) => {
    if (!db || !user?.uid || !id) return;
    const entryRef = doc(db, 'users', user.uid, 'occasions', id, 'contributions', entryId);
    deleteDocumentNonBlocking(entryRef);
    toast({ title: "Deleted", description: "Entry removed." });
  };

  const handleQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.uid || !db) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      const userDocRef = doc(db, 'users', user.uid);
      setDocumentNonBlocking(userDocRef, { upiQrCode: base64String }, { merge: true });
      toast({ title: "Updated", description: "UPI QR code saved." });
    };
    reader.readAsDataURL(file);
  };

  const demoQr = PlaceHolderImages.find(img => img.id === 'demo-qr');

  if (isUserLoading || !user || isOccasionLoading || isEntriesLoading || !isMounted || !id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="px-6 h-16 flex items-center border-b bg-white shadow-sm sticky top-0 z-50 print:hidden">
        <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')} className="mr-4">
          <ArrowLeft className="w-5 h-5 mr-2" /> {t('back')}
        </Button>
        <span className="font-headline text-xl font-bold text-accent truncate">{occasion?.name}</span>
        <div className="ml-auto flex items-center gap-2">
          <LanguageToggle />
          <Button size="sm" onClick={() => window.print()} className="bg-primary">
            <FileText className="w-4 h-4 mr-2" /> {t('pdfExport')}
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="shadow-sm border-muted">
            <CardContent className="p-4 bg-primary/5">
              <p className="text-[10px] text-muted-foreground font-bold uppercase mb-1">{t('guestCount')}</p>
              <h2 className="text-3xl font-headline font-bold text-accent">{guestCount}</h2>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-muted">
            <CardContent className="p-4 bg-accent/5">
              <p className="text-[10px] text-muted-foreground font-bold uppercase mb-1">{t('totalCollection')}</p>
              <h2 className="text-3xl font-headline font-bold text-accent">₹{totalAmount.toLocaleString()}</h2>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 print:hidden space-y-6">
            <Card className="shadow-lg border-primary/20">
              <CardHeader className="bg-primary/10">
                <CardTitle className="font-headline text-xl text-accent">{t('newSagoonEntry')}</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleAddEntry} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="guestName" className="font-bold">{t('guestName')}</Label>
                    <Input id="guestName" placeholder={t('guestNamePlaceholder')} value={guestName} onChange={e => setGuestName(e.target.value)} required />
                  </div>
                  <div className="space-y-2 relative">
                    <Label htmlFor="location-input" className="font-bold">{t('location')}</Label>
                    <Input 
                      id="location-input" 
                      placeholder={t('locationPlaceholder')} 
                      value={locationInput} 
                      onChange={e => { setLocationInput(e.target.value); setShowSuggestions(true); }} 
                      onFocus={() => setShowSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                      autoComplete="off"
                    />
                    {showSuggestions && filteredSuggestions.length > 0 && (
                      <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-xl max-h-[200px] overflow-y-auto">
                        {filteredSuggestions.map((suggestion) => (
                          <div
                            key={suggestion}
                            className="px-4 py-2 hover:bg-primary/10 cursor-pointer text-sm border-b last:border-0"
                            onClick={() => { setLocationInput(suggestion); setShowSuggestions(false); }}
                          >
                            {suggestion}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount" className="font-bold">{t('amount')}</Label>
                    <Input id="amount" type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} required />
                  </div>
                  <Button type="submit" className="w-full bg-primary font-bold py-6 text-lg rounded-xl">
                    <Plus className="w-5 h-5 mr-2" /> {t('addRecord')}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-accent/20">
              <CardHeader className="bg-accent/5 pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="font-headline text-lg text-accent">{t('receiveUpiTitle')}</CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} className="text-primary">
                    <Upload className="w-4 h-4" />
                  </Button>
                </div>
                <CardDescription className="text-xs">{t('upiDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center pt-4">
                <div className="relative w-40 h-40 border-4 border-accent/10 rounded-2xl overflow-hidden p-2">
                  <Image src={userData?.upiQrCode || demoQr?.imageUrl || ""} alt="QR" fill className="object-contain" />
                </div>
                <input type="file" ref={fileInputRef} onChange={handleQrUpload} className="hidden" accept="image/*" />
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-8">
            <Card className="shadow-sm border-muted">
              <CardHeader className="flex flex-row items-center justify-between print:hidden">
                <CardTitle className="font-headline text-xl text-accent">{t('recentEntries')}</CardTitle>
                <div className="relative w-1/3">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input 
                    placeholder={t('search')} 
                    className="pl-8 h-8 text-xs"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-secondary/20">
                    <TableRow>
                      <TableHead className="font-bold text-accent">{t('tableGuest')}</TableHead>
                      <TableHead className="font-bold text-accent">{t('tableLocation')}</TableHead>
                      <TableHead className="font-bold text-accent text-right">{t('tableAmount')}</TableHead>
                      <TableHead className="print:hidden w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEntries.length > 0 ? filteredEntries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell className="font-bold">{entry.guestName}</TableCell>
                        <TableCell className="text-muted-foreground">{entry.location || '-'}</TableCell>
                        <TableCell className="text-right font-headline font-bold text-accent">
                          ₹{(Number(entry.amount) || 0).toLocaleString()}
                        </TableCell>
                        <TableCell className="print:hidden text-right">
                           <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="hover:text-red-500">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>{t('delete')}?</AlertDialogTitle>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteEntry(entry.id)} className="bg-destructive">
                                    {t('delete')}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                           </AlertDialog>
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                          {t('noEventsFound')}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EventPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
      <EventContent />
    </Suspense>
  );
}
