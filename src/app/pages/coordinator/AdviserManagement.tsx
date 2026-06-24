import React, { useState } from 'react';
import { useOJT } from '../../context/OJTContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { Plus, Users, UserPlus, Mail, Phone, BookOpen } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';

export function AdviserManagement() {
  const { students } = useOJT();
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [section, setSection] = useState('BSIT 4A');

  // Static mock advisers list, with calculated workload counts from Student profile list
  const initialAdvisers = [
    { id: '2', name: 'Michael Chen', email: 'michael.chen@techcorp.com', phone: '0917 555 0202', sections: ['BSIT 4A', 'BSIT 4B'] },
    { id: 'adv_gomez', name: 'Raul Gomez', email: 'raul.gomez@university.edu', phone: '0918 333 4455', sections: ['BSCpE 4A'] },
    { id: 'adv_rodriguez', name: 'Emily Rodriguez', email: 'emily.rodriguez@university.edu', phone: '0915 222 9900', sections: ['BSIT 4C'] },
  ];

  const [advisers, setAdvisers] = useState(initialAdvisers);

  const handleAddAdviser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setAdvisers(prev => [
      ...prev,
      {
        id: `adv_${Date.now()}`,
        name,
        email,
        phone: phone || '—',
        sections: [section]
      }
    ]);

    toast.success(`Academic Adviser Prof. ${name} registered!`);
    setAddDialogOpen(false);
    setName('');
    setEmail('');
    setPhone('');
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-sans">Adviser Management</h1>
          <p className="text-slate-500 text-sm mt-0.5 font-light">Manage academic section advisers and audit cohort capacities.</p>
        </div>

        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#800000] hover:bg-[#6b0000] text-white text-xs h-9 flex items-center gap-1.5 cursor-pointer">
              <UserPlus className="h-4 w-4" /> Add Adviser
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md font-sans">
            <form onSubmit={handleAddAdviser}>
              <DialogHeader>
                <DialogTitle>Register Faculty Adviser</DialogTitle>
                <DialogDescription>Input section adviser details to configure student monitoring allocations.</DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-3.5 text-xs">
                <div className="space-y-1">
                  <Label htmlFor="advName">Full Name</Label>
                  <Input id="advName" placeholder="e.g. Francisco, Jose P." value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="advMail">Email Address</Label>
                  <Input id="advMail" type="email" placeholder="adviser@university.edu" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="advPhone">Contact Number</Label>
                  <Input id="advPhone" placeholder="e.g. 0917 555 0000" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="advSec">Assigned Class Section</Label>
                  <select
                    id="advSec"
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="w-full bg-white border border-slate-205 rounded p-2 text-xs"
                  >
                    <option value="BSIT 4A">BSIT 4A</option>
                    <option value="BSIT 4B">BSIT 4B</option>
                    <option value="BSCpE 4A">BSCpE 4A</option>
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setAddDialogOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-[#800000] hover:bg-[#6b0000] text-white">Save Adviser</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Grid Table */}
      <Card className="shadow-sm border-slate-200">
        <CardHeader>
          <CardTitle className="text-base font-bold text-slate-800">Faculty Adviser Workload Registry</CardTitle>
          <CardDescription>Track allocated student capacities per OJT section adviser.</CardDescription>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase">Faculty Adviser</TableHead>
                <TableHead className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase">Contact Email</TableHead>
                <TableHead className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase">Oversight Sections</TableHead>
                <TableHead className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase text-center">Workload (Interns)</TableHead>
                <TableHead className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase">Workload status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {advisers.map((adv) => {
                // Calculate assigned student count
                const workloadCount = students.filter(s => s.adviserName === adv.name).length;

                return (
                  <TableRow key={adv.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell className="py-3.5 px-4 font-sans font-bold text-slate-800 text-xs">
                      Prof. {adv.name}
                    </TableCell>
                    <TableCell className="py-3.5 px-4 text-xs font-semibold text-slate-500">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        {adv.email}
                      </span>
                    </TableCell>
                    <TableCell className="py-3.5 px-4 text-xs font-semibold text-slate-700">
                      <div className="flex gap-1">
                        {adv.sections.map((sec, i) => (
                          <Badge key={i} variant="outline" className="text-[10px]">{sec}</Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="py-3.5 px-4 text-center text-xs font-extrabold text-slate-850">
                      {workloadCount} interns
                    </TableCell>
                    <TableCell className="py-3.5 px-4">
                      {workloadCount > 15 ? (
                        <Badge className="bg-red-100 text-red-800 border-red-200">High Workload</Badge>
                      ) : workloadCount > 0 ? (
                        <Badge className="bg-green-100 text-green-800 border-green-200">Active Load</Badge>
                      ) : (
                        <Badge className="bg-slate-100 text-slate-500 border-slate-200">Empty Load</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
