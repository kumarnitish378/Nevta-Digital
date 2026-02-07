
"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, IndianRupee, MapPin, User, Plus, Search, FileText, Trash2, Calendar, FileSpreadsheet, Loader2, QrCode, Upload } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
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

export default function EventPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [guestName, setGuestName] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [amount, setAmount] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [reportGeneratedAt, setReportGeneratedAt] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isUserLoading && !user && isMounted) {
      router.push('/login');
    }
  }, [user, isUserLoading, router, isMounted]);

  useEffect(() => {
    if (isMounted) {
      setReportGeneratedAt(new Date().toLocaleString());
    }
  }, [isMounted]);

  const userRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, 'users', user.uid);
  }, [db, user?.uid]);

  const { data: userData } = useDoc(userRef);

  const occasionRef = useMemoFirebase(() => {
    if (!db || !user?.uid || !id) return null;
    return doc(db, 'users', user.uid, 'occasions', id as string);
  }, [db, user?.uid, id]);

  const { data: occasion, isLoading: isOccasionLoading } = useDoc(occasionRef);

  const contributionsRef = useMemoFirebase(() => {
    if (!db || !user?.uid || !id) return null;
    return query(collection(db, 'users', user.uid, 'occasions', id as string, 'contributions'), orderBy('contributionDate', 'desc'));
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
    );
  }, [locationInput, uniqueLocations, showSuggestions]);

  const filteredEntries = useMemo(() => {
    return (entries || []).filter(e => 
      e.guestName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      e.location?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [entries, searchQuery]);

  const handleAddEntry = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !user?.uid || !id || !guestName || !amount) {
      toast({ title: "Validation Error", description: "Name and Amount are required!", variant: "destructive" });
      return;
    }

    const colRef = collection(db, 'users', user.uid, 'occasions', id as string, 'contributions');
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
    toast({ title: "Entry Saved", description: `Added ₹${amount} for ${guestName}` });
  }, [db, user?.uid, id, guestName, locationInput, amount]);

  const handleDeleteEntry = (entryId: string) => {
    if (!db || !user?.uid || !id) return;
    const docRef = doc(db, 'users', user.uid, 'occasions', id as string, 'contributions', entryId);
    deleteDocumentNonBlocking(docRef);
    toast({ title: "Entry Deleted", description: "The record has been removed." });
  };

  const handleQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.uid || !db) return;

    if (!file.type.startsWith('image/')) {
      toast({ title: "Invalid File", description: "Please upload an image file.", variant: "destructive" });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      const userDocRef = doc(db, 'users', user.uid);
      setDocumentNonBlocking(userDocRef, { upiQrCode: base64String }, { merge: true });
      toast({ title: "QR Code Updated", description: "Your UPI QR code has been saved." });
    };
    reader.readAsDataURL(file);
  };

  const exportCSV = () => {
    if (!entries) return;
    const headers = ["Guest Name", "Location", "Amount", "Date"];
    const rows = entries.map(e => [e.guestName, e.location, e.amount, e.contributionDate]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(r => r.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Nevta_Report_${occasion?.name || 'Event'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const demoQr = PlaceHolderImages.find(img => img.id === 'demo-qr');

  if (isUserLoading || isOccasionLoading || isEntriesLoading || !isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!occasion) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <h2 className="text-2xl font-headline font-bold mb-4 text-accent">Occasion not found</h2>
        <Button asChild><Link href="/dashboard">Back to Dashboard</Link></Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="px-6 h-16 flex items-center border-b bg-white shadow-sm sticky top-0 z-50 print:hidden">
        <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')} className="mr-4">
          <ArrowLeft className="w-5 h-5 mr-2" /> Back
        </Button>
        <div className="flex items-center gap-2">
          <div className="bg-primary p-1 rounded-lg">
            <IndianRupee className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-headline text-xl font-bold text-accent truncate max-w-[150px] sm:max-w-md">{occasion.name}</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Badge variant="outline" className="font-body hidden md:flex border-primary text-primary bg-primary/5 px-3 py-1" suppressHydrationWarning>
            <Calendar className="w-3 h-3 mr-2" /> {occasion.eventDate}
          </Badge>
          <div className="h-4 w-px bg-muted mx-2 hidden sm:block"></div>
          <Button variant="outline" size="sm" onClick={exportCSV} className="text-accent border-accent hover:bg-accent hover:text-white hidden sm:flex">
            <FileSpreadsheet className="w-4 h-4 mr-2" /> CSV
          </Button>
          <Button size="sm" onClick={() => window.print()} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <FileText className="w-4 h-4 mr-2" /> PDF
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="shadow-sm border-muted overflow-hidden">
            <CardContent className="p-4 bg-primary/5">
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">Guest Count</p>
              <h2 className="text-3xl font-headline font-bold text-accent">{guestCount}</h2>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-muted overflow-hidden">
            <CardContent className="p-4 bg-accent/5">
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">Total Collection</p>
              <h2 className="text-3xl font-headline font-bold text-accent" suppressHydrationWarning>
                ₹{totalAmount.toLocaleString()}
              </h2>
            </CardContent>
          </Card>
          <div className="hidden lg:block col-span-2">
             <div className="h-full flex items-center px-6 rounded-xl border-2 border-dashed border-muted text-muted-foreground font-body italic text-sm">
                Organizer: {user?.displayName || 'Owner'} • Live Cloud Sync Active
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 print:hidden space-y-6">
            <Card className="shadow-lg border-primary/20">
              <CardHeader className="bg-primary/10">
                <CardTitle className="font-headline text-xl text-accent">New Sagoon Entry</CardTitle>
                <CardDescription className="font-body text-sm">Enter guest details below</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleAddEntry} className="space-y-4" suppressHydrationWarning>
                  <div className="space-y-2">
                    <Label htmlFor="guestName" className="font-body font-bold flex items-center gap-2">
                      <User className="w-4 h-4 text-primary" /> Guest Name
                    </Label>
                    <Input 
                      id="guestName" 
                      placeholder="e.g. Mukesh Jain" 
                      value={guestName} 
                      onChange={e => setGuestName(e.target.value)} 
                      className="rounded-lg h-11" 
                      required 
                      suppressHydrationWarning
                    />
                  </div>
                  <div className="space-y-2 relative">
                    <Label htmlFor="location-input" className="font-body font-bold flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" /> Location / Place
                    </Label>
                    <div className="relative">
                      <Input 
                        id="location-input" 
                        placeholder="e.g. Jodhpur" 
                        value={locationInput} 
                        onChange={e => {
                          setLocationInput(e.target.value);
                          setShowSuggestions(true);
                        }} 
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        className="rounded-lg h-11" 
                        autoComplete="off"
                        suppressHydrationWarning
                      />
                      {showSuggestions && filteredSuggestions.length > 0 && (
                        <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-xl max-h-[210px] overflow-y-auto border-primary/20">
                          {filteredSuggestions.map((suggestion) => (
                            <div
                              key={`suggestion-${suggestion}`}
                              className="px-4 py-2.5 hover:bg-primary/5 cursor-pointer text-sm font-body text-accent border-b last:border-0 border-muted/30"
                              onClick={() => {
                                setLocationInput(suggestion);
                                setShowSuggestions(false);
                              }}
                            >
                              {suggestion}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount" className="font-body font-bold flex items-center gap-2">
                      <IndianRupee className="w-4 h-4 text-primary" /> Amount (₹)
                    </Label>
                    <Input id="amount" type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} className="rounded-lg h-11 text-lg font-bold" required suppressHydrationWarning />
                  </div>
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6 text-lg rounded-xl shadow-md">
                    <Plus className="w-5 h-5 mr-2" /> Add Record
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-accent/20">
              <CardHeader className="bg-accent/5 pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="font-headline text-lg text-accent flex items-center gap-2">
                    <QrCode className="w-5 h-5" /> Receive UPI Payment
                  </CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} className="h-8 w-8 text-primary">
                    <Upload className="w-4 h-4" />
                  </Button>
                </div>
                <CardDescription className="text-xs">Show this QR to guests for digital sagoon</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center pt-4">
                <div className="relative w-48 h-48 border-4 border-accent/10 rounded-2xl overflow-hidden bg-white shadow-inner p-2">
                  <Image 
                    src={userData?.upiQrCode || demoQr?.imageUrl || ""} 
                    alt="UPI QR Code" 
                    fill 
                    className="object-contain p-2"
                    data-ai-hint="qr code"
                  />
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleQrUpload} 
                  className="hidden" 
                  accept="image/*" 
                />
                <p className="mt-3 text-[10px] text-muted-foreground text-center font-body">
                  {userData?.upiQrCode ? "Personal QR Active" : "Showing Demo QR - Click upload to change"}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-8">
            <Card className="shadow-sm border-muted print:border-none print:shadow-none">
              <CardHeader className="flex flex-row items-center justify-between print:hidden">
                <CardTitle className="font-headline text-xl text-accent">Recent Entries</CardTitle>
                <div className="relative w-1/2 max-w-[200px]">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input 
                    placeholder="Search name..." 
                    className="pl-9 h-9 text-xs rounded-lg"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    suppressHydrationWarning
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-secondary/20">
                    <TableRow>
                      <TableHead className="font-bold text-accent font-headline">Guest Name</TableHead>
                      <TableHead className="font-bold text-accent font-headline">Location</TableHead>
                      <TableHead className="font-bold text-accent font-headline text-right">Amount</TableHead>
                      <TableHead className="font-bold text-accent font-headline text-right print:table-cell hidden sm:table-cell">Date</TableHead>
                      <TableHead className="print:hidden w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEntries.length > 0 ? filteredEntries.map((entry) => (
                      <TableRow key={entry.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="font-bold font-body">{entry.guestName}</TableCell>
                        <TableCell className="text-muted-foreground font-body">{entry.location || '-'}</TableCell>
                        <TableCell className="text-right font-headline font-bold text-accent" suppressHydrationWarning>
                          ₹{(Number(entry.amount) || 0).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right text-xs text-muted-foreground font-body print:table-cell hidden sm:table-cell" suppressHydrationWarning>
                          {entry.contributionDate ? new Date(entry.contributionDate).toLocaleDateString() : '-'}
                        </TableCell>
                        <TableCell className="print:hidden text-right">
                           <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-red-500">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Record?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will permanently remove the entry for <strong>{entry.guestName}</strong> (₹{entry.amount}).
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteEntry(entry.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                    Delete Record
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                           </AlertDialog>
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center font-body text-muted-foreground">
                          No records found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            <div className="hidden print:block mt-12 pt-8 border-t border-dotted border-gray-400">
               <div className="grid grid-cols-2 text-xs text-gray-500 font-body">
                  <div>Report Generated by: <b>Nevta Digital</b></div>
                  <div className="text-right" suppressHydrationWarning>Date: {reportGeneratedAt || '...'}</div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
