import React, { useState } from 'react';
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
import { Plus, Edit, Trash, CheckSquare, Award } from 'lucide-react';

export function EvaluationFormManagement() {
  const [selectedProgram, setSelectedProgram] = useState('BSIT');
  
  const initialCriteria = [
    { id: '1', name: 'Quality of Work / Accuracy', max: 20, program: 'BSIT' },
    { id: '2', name: 'Quantity of Work / Productivity', max: 20, program: 'BSIT' },
    { id: '3', name: 'Knowledge and Technical Skills', max: 20, program: 'BSIT' },
    { id: '4', name: 'Attendance and Punctuality', max: 20, program: 'BSIT' },
    { id: '5', name: 'Attitude and Professional Ethics', max: 20, program: 'BSIT' },
    
    { id: '6', name: 'Office Equipment Operations', max: 25, program: 'BSOA' },
    { id: '7', name: 'Records Management & Filing', max: 25, program: 'BSOA' },
    { id: '8', name: 'Business Writing & Communication', max: 25, program: 'BSOA' },
    { id: '9', name: 'Office Relations', max: 25, program: 'BSOA' },
  ];

  const [criteria, setCriteria] = useState(initialCriteria);
  const [newCriteriaName, setNewCriteriaName] = useState('');
  const [newCriteriaMax, setNewCriteriaMax] = useState(20);

  const handleAddCriteria = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCriteriaName.trim()) return;

    setCriteria(prev => [
      ...prev,
      {
        id: `c_${Date.now()}`,
        name: newCriteriaName,
        max: Number(newCriteriaMax),
        program: selectedProgram
      }
    ]);

    toast.success(`Grading metric "${newCriteriaName}" added for ${selectedProgram}!`);
    setNewCriteriaName('');
  };

  const handleDelete = (id: string) => {
    setCriteria(prev => prev.filter(c => c.id !== id));
    toast.success("Grading metric removed.");
  };

  const filteredCriteria = criteria.filter(c => c.program === selectedProgram);
  const totalPoints = filteredCriteria.reduce((acc, curr) => acc + curr.max, 0);

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-sans">Evaluation Form Management</h1>
        <p className="text-slate-500 text-sm mt-0.5 font-light">Structure evaluation forms and adjust grading parameter weights per program.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Config panel */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="border-b border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <CardTitle className="text-base font-bold text-slate-800">Criteria Matrix</CardTitle>
                <CardDescription>Metrics parameters currently mapped for {selectedProgram}.</CardDescription>
              </div>
              <Badge className="bg-[#800000] text-white font-bold text-xs px-2.5 py-1">
                Total Score Sum: {totalPoints} pts
              </Badge>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50">
                    <TableHead className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase">Grading Parameter Description</TableHead>
                    <TableHead className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase w-32">Maximum Points</TableHead>
                    <TableHead className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase text-center w-24">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCriteria.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8 text-slate-400">
                        No custom criteria mapped for this program yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCriteria.map((c) => (
                      <TableRow key={c.id} className="hover:bg-slate-50/50 transition-colors">
                        <TableCell className="py-3.5 px-4 font-sans font-medium text-slate-800 text-xs">
                          {c.name}
                        </TableCell>
                        <TableCell className="py-3.5 px-4 text-xs font-bold text-slate-700">
                          {c.max} points max
                        </TableCell>
                        <TableCell className="py-3.5 px-4 text-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(c.id)}
                            className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Side program and Add controls */}
        <div className="space-y-6">
          <Card className="shadow-sm border-slate-200">
            <CardHeader>
              <CardTitle className="text-base font-bold text-slate-850">Select Program Target</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <Label htmlFor="progSelect">Academic Program</Label>
                <select
                  id="progSelect"
                  value={selectedProgram}
                  onChange={(e) => setSelectedProgram(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-[#800000] focus:border-[#800000]"
                >
                  <option value="BSIT">BSIT - Information Technology</option>
                  <option value="BSCpE">BSCpE - Computer Engineering</option>
                  <option value="BSOA">BSOA - Office Administration</option>
                </select>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                <p className="font-bold text-slate-700">Format Rules:</p>
                <p className="text-slate-500 font-light">We recommend making parameters total exactly 100 points to keep grading calculations simple.</p>
              </div>
            </CardContent>
          </Card>

          {/* Add parameter Card */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-sm font-bold text-slate-800">Add Evaluation Criteria</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <form onSubmit={handleAddCriteria} className="space-y-3 text-xs">
                <div className="space-y-1.5">
                  <Label htmlFor="critName" className="text-xs">Criteria Name</Label>
                  <Input id="critName" placeholder="e.g. Oral Presentations Capability" value={newCriteriaName} onChange={(e) => setNewCriteriaName(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="critMax" className="text-xs">Maximum Points Weight</Label>
                  <Input id="critMax" type="number" value={newCriteriaMax} onChange={(e) => setNewCriteriaMax(Number(e.target.value))} required />
                </div>
                <Button type="submit" className="w-full bg-[#800000] hover:bg-[#6b0000] text-white py-2 text-xs font-bold mt-2 cursor-pointer">
                  Save Grading Parameter
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
