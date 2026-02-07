
"use client";

import { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, IndianRupee, MapPin, User, Plus, Search, FileText, Trash2, Calendar, FileSpreadsheet, Loader2 } from 'lucide-react';
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
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase, addDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase';
import { doc, collection } from 'firebase/firestore';

export default function EventPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  
  const [guestName, setGuestName] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [amount, setAmount] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [reportGeneratedAt, setReportGeneratedAt] = useState<string | null>(null);

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

  const occasionRef = useMemoFirebase(() => {
    if (!db || !user || !id) return null;
    return doc(db, 'users', user.uid, 'occasions', id as string);
  }, [db, user, id]);

  const { data: occasion, isLoading: isOccasionLoading } = useDoc(occasionRef);

  const contributionsRef = useMemoFirebase(() => {
    if (!db || !user || !id) return null;
    return collection(db, 'users', user.uid, 'occasions', id as string, 'contributions');
  }, [db, user, id]);

  const { data: entries, isLoading: isEntriesLoading } = useCollection(contributionsRef);

  const totalAmount = useMemo(() => (entries || []).reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0), [entries]);
  const guestCount = entries?.length || 0;

  const uniqueLocations = useMemo(() => {
    if (!entries) return [];
    const locs = entries.map(e => e.location).filter(Boolean);
    return Array.from(new Set(locs)).sort();
  }, [entries]);

  const filteredEntries = useMemo(() => {
    return (entries || []).filter(e => 
      e.guestName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      e.location?.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a, b) => new Date(b.contributionDate || 0).getTime() - new Date(a.contributionDate || 0).getTime());
  }, [entries, searchQuery]);

  const handleAddEntry = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !user || !id || !guestName || !amount) {
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
    toast({ title: "Entry Saved", description: `Added ₹${amount} for ${guestName}` });
  }, [db, user, id, guestName, locationInput, amount]);

  const handleDeleteEntry = (entryId: string) => {
    if (!db || !user || !id) return;
    const docRef = doc(db, 'users', user.uid, 'occasions', id as string, 'contributions', entryId);
    deleteDocumentNonBlocking(docRef);
    toast({ title: "Entry Deleted", description: "The record has been removed." });
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
        <h2 className="text-2xl font-headline font-bold mb-4">Occasion not found</h2>
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
          <div className="lg:col-span-4 print:hidden">
            <Card className="shadow-lg border-primary/20 sticky top-24">
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
                  <div className="space-y-2">
                    <Label htmlFor="location-input" className="font-body font-bold flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" /> Location / Place
                    </Label>
                    <Input 
                      id="location-input" 
                      list="registered-locations"
                      placeholder="e.g. Jodhpur" 
                      value={locationInput} 
                      onChange={e => setLocationInput(e.target.value)} 
                      className="rounded-lg h-11" 
                      suppressHydrationWarning
                      autoComplete="off"
                    />
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
      
      <datalist id="registered-locations">
        {uniqueLocations.map((loc) => (
          <option key={`suggestion-${loc}`} value={loc} />
        ))}
      </datalist>
    </div>
  );
}
