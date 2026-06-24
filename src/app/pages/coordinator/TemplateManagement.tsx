import React, { useState } from 'react';
import { useOJT, Template } from '../../context/OJTContext';
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
import { Plus, Link as LinkIcon, Edit, Trash, FileText, ToggleLeft, ToggleRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';

export function TemplateManagement() {
  const { templates, addTemplate, updateTemplate } = useOJT();
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'Pre-OJT' | 'During-OJT' | 'Post-OJT' | 'Portfolio' | 'Evaluation'>('Pre-OJT');
  const [description, setDescription] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  const handleAddTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !linkUrl.trim()) return;

    addTemplate({
      name,
      category,
      description,
      linkUrl,
      status: 'Published'
    });

    toast.success(`Academic template "${name}" published!`);
    setAddDialogOpen(false);
    setName('');
    setDescription('');
    setLinkUrl('');
  };

  const handleToggleStatus = (template: Template) => {
    const nextStatus = template.status === 'Published' ? 'Disabled' : 'Published';
    updateTemplate(template.id, { status: nextStatus });
    toast.success(`Template ${template.name} is now ${nextStatus}`);
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-sans">Template Management</h1>
          <p className="text-slate-500 text-sm mt-0.5 font-light">Publish and maintain official document templates for students to download.</p>
        </div>

        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#800000] hover:bg-[#6b0000] text-white text-xs h-9 flex items-center gap-1.5 cursor-pointer">
              <Plus className="h-4 w-4" /> Add Template
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md font-sans">
            <form onSubmit={handleAddTemplate}>
              <DialogHeader>
                <DialogTitle>Upload Template Link</DialogTitle>
                <DialogDescription>Link official Google Docs or PDF documents for interns.</DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-3.5 text-xs">
                <div className="space-y-1">
                  <Label htmlFor="tName">Template Name</Label>
                  <Input id="tName" placeholder="e.g. Midterm Progress Report" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="tCat">Document Category</Label>
                  <select
                    id="tCat"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-white border border-slate-205 rounded p-2 text-xs"
                  >
                    <option value="Pre-OJT">Pre-OJT</option>
                    <option value="During-OJT">During-OJT</option>
                    <option value="Post-OJT">Post-OJT</option>
                    <option value="Portfolio">Portfolio</option>
                    <option value="Evaluation">Evaluation</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="tDesc">Description</Label>
                  <Input id="tDesc" placeholder="Student-facing descriptions" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="tUrl">Template Download URL</Label>
                  <Input id="tUrl" placeholder="https://docs.google.com/..." value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} required />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setAddDialogOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-[#800000] hover:bg-[#6b0000] text-white">Publish</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Roster list */}
      <Card className="shadow-sm border-slate-200">
        <CardHeader>
          <CardTitle className="text-base font-bold text-slate-800">Academic Templates</CardTitle>
          <CardDescription>Tracing published resources available on student dashboards.</CardDescription>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase">Document Outline</TableHead>
                <TableHead className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase">OJT Category</TableHead>
                <TableHead className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase">Description</TableHead>
                <TableHead className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase w-32">Status</TableHead>
                <TableHead className="py-3 px-4 font-semibold text-xs text-slate-500 uppercase text-center w-28">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.map((t) => (
                <TableRow key={t.id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell className="py-3.5 px-4 font-sans font-bold text-slate-800 text-xs">
                    <div className="flex items-center gap-1.5">
                      <FileText className="h-4 w-4 text-[#800000]" />
                      {t.name}
                    </div>
                  </TableCell>
                  <TableCell className="py-3.5 px-4 text-xs font-semibold text-slate-650">
                    {t.category}
                  </TableCell>
                  <TableCell className="py-3.5 px-4 text-xs text-slate-500 font-light truncate max-w-xs">
                    {t.description || '—'}
                  </TableCell>
                  <TableCell className="py-3.5 px-4">
                    {t.status === 'Published' ? (
                      <Badge className="bg-green-100 text-green-800 border-green-200">Published</Badge>
                    ) : (
                      <Badge className="bg-slate-100 text-slate-500 border-slate-200">Disabled</Badge>
                    )}
                  </TableCell>
                  <TableCell className="py-3.5 px-4 text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleStatus(t)}
                      className="text-[10px] h-8 text-slate-600 hover:text-[#800000] hover:bg-red-50 flex items-center gap-1 cursor-pointer w-full justify-center"
                    >
                      {t.status === 'Published' ? (
                        <>
                          <ToggleLeft className="h-4.5 w-4.5 text-green-600" />
                          Disable
                        </>
                      ) : (
                        <>
                          <ToggleRight className="h-4.5 w-4.5 text-slate-400" />
                          Publish
                        </>
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
