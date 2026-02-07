
"use client";

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, IndianRupee, MapPin, User, Plus, Search, FileText, Trash2, Calendar, FileSpreadsheet } from 'lucide-react';
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

// Mocked Data
const INITIAL_ENTRIES = [
  { id: '1', guestName: 'Ramesh Sharma', location: 'Jaipur', amount: 501, timestamp: '2024-05-15 10:30 AM' },
  { id: '2', guestName: 'Sunita Devi', location: 'Delhi', amount: 1100, timestamp: '2024-05-15 11:15 AM' },
  { id: '3', guestName: 'Amit Verma', location: 'Agra', amount: 2100, timestamp: '2024-05-15 11:45 AM' },
];

export default function EventPage() {
  const { id } = useParams();
  const router = useRouter();
  const [entries, setEntries] = useState(INITIAL_ENTRIES);
  const [guestName, setGuestName] = useState("");
  const [location, setLocation] = useState("");
  const [amount, setAmount] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [reportGeneratedAt, setReportGeneratedAt] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setReportGeneratedAt(new Date().toLocaleString());
  }, []);

  const totalAmount = useMemo(() => entries.reduce((acc, curr) => acc + curr.amount, 0), [entries]);
  const guestCount = entries.length;

  const uniqueLocations = useMemo(() => {
    const locs = entries.map(e => e.location).filter(Boolean);
    return Array.from(new Set(locs)).sort();
  }, [entries]);

  const filteredEntries = entries.filter(e => 
    e.guestName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    e.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !amount) {
      toast({ title: "Validation Error", description: "Name and Amount are required!", variant: "destructive" });
      return;
    }

    const newEntry = {
      id: Date.now().toString(),
      guestName,
      location,
      amount: parseFloat(amount),
      timestamp: new Date().toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    };

    setEntries([newEntry, ...entries]);
    setGuestName("");
    setLocation("");
    setAmount("");
    toast({ title: "Entry Saved", description: `Added ₹${amount} for ${guestName}` });
  };

  const handleDeleteEntry = (entryId: string) => {
    setEntries(entries.filter(e => e.id !== entryId));
    toast({ title: "Entry Deleted", description: "The record has been removed." });
  };

  const exportCSV = () => {
    const headers = ["Guest Name", "Location", "Amount", "Date & Time"];
    const rows = entries.map(e => [e.guestName, e.location, e.amount, e.timestamp]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(r => r.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Nevta_Report_${id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPDF = () => {
    window.print();
  };

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
          <span className="font-headline text-xl font-bold text-accent">Rahul & Priya Wedding</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Badge variant="outline" className="font-body hidden sm:flex border-primary text-primary bg-primary/5 px-3 py-1">
            <Calendar className="w-3 h-3 mr-2" /> May 15, 2024
          </Badge>
          <div className="h-4 w-px bg-muted mx-2 hidden sm:block"></div>
          <Button variant="outline" size="sm" onClick={exportCSV} className="text-accent border-accent hover:bg-accent hover:text-white">
            <FileSpreadsheet className="w-4 h-4 mr-2" /> CSV
          </Button>
          <Button size="sm" onClick={exportPDF} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <FileText className="w-4 h-4 mr-2" /> PDF
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="shadow-sm border-muted overflow-hidden">
            <CardContent className="p-4 bg-primary/5">
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Guest Count</p>
              <h2 className="text-3xl font-headline font-bold text-accent">{guestCount}</h2>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-muted overflow-hidden">
            <CardContent className="p-4 bg-accent/5">
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Total Collection</p>
              <h2 className="text-3xl font-headline font-bold text-accent" suppressHydrationWarning>
                ₹{isMounted ? totalAmount.toLocaleString() : totalAmount}
              </h2>
            </CardContent>
          </Card>
          <div className="hidden lg:block col-span-2">
             <div className="h-full flex items-center px-6 rounded-xl border-2 border-dashed border-muted text-muted-foreground font-body italic text-sm">
                Organizer: Suresh Kumar • Last synced just now
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 print:hidden">
            <Card className="shadow-lg border-primary/20 sticky top-24">
              <CardHeader className="bg-primary/10">
                <CardTitle className="font-headline text-xl text-accent">Add New Entry</CardTitle>
                <CardDescription className="font-body text-sm">Recording in real-time</CardDescription>
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
                      value={location} 
                      onChange={e => setLocation(e.target.value)} 
                      className="rounded-lg h-11" 
                      suppressHydrationWarning
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount" className="font-body font-bold flex items-center gap-2">
                      <IndianRupee className="w-4 h-4 text-primary" /> Amount (₹)
                    </Label>
                    <Input id="amount" type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} className="rounded-lg h-11 text-lg font-bold" required suppressHydrationWarning />
                  </div>
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6 text-lg rounded-xl shadow-md">
                    <Plus className="w-5 h-5 mr-2" /> Add Entry
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-8">
            <Card className="shadow-sm border-muted print:border-none print:shadow-none">
              <CardHeader className="flex flex-row items-center justify-between print:hidden">
                <div>
                  <CardTitle className="font-headline text-xl text-accent">Recent Entries</CardTitle>
                </div>
                <div className="relative w-1/2 max-w-[250px]">
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
                      <TableHead className="font-bold text-accent font-headline text-right">Amount (₹)</TableHead>
                      <TableHead className="font-bold text-accent font-headline text-right print:table-cell hidden sm:table-cell">Time</TableHead>
                      <TableHead className="print:hidden w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEntries.length > 0 ? filteredEntries.map((entry) => (
                      <TableRow key={entry.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="font-bold font-body">{entry.guestName}</TableCell>
                        <TableCell className="text-muted-foreground font-body">{entry.location || '-'}</TableCell>
                        <TableCell className="text-right font-headline font-bold text-accent text-lg" suppressHydrationWarning>
                          ₹{isMounted ? entry.amount.toLocaleString() : entry.amount}
                        </TableCell>
                        <TableCell className="text-right text-xs text-muted-foreground font-body print:table-cell hidden sm:table-cell" suppressHydrationWarning>
                          {entry.timestamp}
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
               <div className="grid grid-cols-2 text-sm text-gray-500 font-body">
                  <div>Report Generated by: <b>Nevta Digital</b></div>
                  <div className="text-right" suppressHydrationWarning>Generated on: {reportGeneratedAt || '...'}</div>
               </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stable Datalist for Location Suggestions */}
      {isMounted && (
        <datalist id="registered-locations">
          {uniqueLocations.map((loc) => (
            <option key={`suggestion-${loc}`} value={loc} />
          ))}
        </datalist>
      )}
    </div>
  );
}
