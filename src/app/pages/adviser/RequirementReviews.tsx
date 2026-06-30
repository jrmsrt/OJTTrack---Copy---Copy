import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { ClipboardCheck, FileText, Files, Search } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { useOJT } from '../../context/OJTContext';
import { AdviserPreOJTReview } from './PreOJTReview';
import { DuringOJTReview } from './DuringOJTReview';
import { PostOJTReview } from './PostOJTReview';

function getComparableSection(section: string) {
  const normalizedSection = section.trim().toUpperCase();
  const legacyMatch = normalizedSection.match(/\b([34])([AB])$/);

  if (legacyMatch) {
    return `${legacyMatch[1]}-${legacyMatch[2] === 'A' ? '1' : '2'}`;
  }

  return section.trim();
}

export function RequirementReviews() {
  const { students } = useOJT();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [programFilter, setProgramFilter] = React.useState('all');
  const [sectionFilter, setSectionFilter] = React.useState('all');
  const stage = searchParams.get('stage');
  const activeTab = stage === 'during' ? 'during-ojt' : stage === 'post' ? 'post-ojt' : 'pre-ojt';

  const studentMatchesFilters = (student: { program: string; section: string }) =>
    (programFilter === 'all' || student.program.includes(programFilter)) &&
    (sectionFilter === 'all' || getComparableSection(student.section) === sectionFilter);

  const visibleStatuses = ['Submitted', 'Under Review', 'Needs Revision', 'Approved'];
  const counts = {
    pre: students
      .filter(studentMatchesFilters)
      .flatMap(s => s.preOJTRequirements)
      .filter(r => visibleStatuses.includes(r.status)).length,
    during: students
      .filter(studentMatchesFilters)
      .flatMap(s => s.duringOJTRequirements)
      .filter(r => visibleStatuses.includes(r.status)).length,
    post: students
      .filter(studentMatchesFilters)
      .flatMap(s => s.postOJTRequirements)
      .filter(r => visibleStatuses.includes(r.status)).length,
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Review Requirements</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Check and approve student requirement submissions across Pre-OJT, During-OJT, and Post-OJT stages.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 w-full lg:w-auto">
          <div className="rounded-lg border bg-white px-3 py-2 shadow-sm">
            <p className="text-[10px] uppercase font-bold text-slate-400">Pre-OJT</p>
            <p className="text-lg font-bold text-slate-900">{counts.pre}</p>
          </div>
          <div className="rounded-lg border bg-white px-3 py-2 shadow-sm">
            <p className="text-[10px] uppercase font-bold text-slate-400">During</p>
            <p className="text-lg font-bold text-slate-900">{counts.during}</p>
          </div>
          <div className="rounded-lg border bg-white px-3 py-2 shadow-sm">
            <p className="text-[10px] uppercase font-bold text-slate-400">Post</p>
            <p className="text-lg font-bold text-slate-900">{counts.post}</p>
          </div>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) => {
          const nextStage = value === 'during-ojt' ? 'during' : value === 'post-ojt' ? 'post' : 'pre';
          setSearchParams({ stage: nextStage });
        }}
        className="space-y-5"
      >
        <div className="flex flex-col gap-4">
          <TabsList className="w-full sm:w-fit h-auto p-1 bg-white border border-slate-200 rounded-xl shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-1">
            <TabsTrigger value="pre-ojt" className="h-11 px-4 rounded-lg text-xs font-bold justify-center data-[state=active]:bg-[#800000] data-[state=active]:text-white">
              <ClipboardCheck className="h-4 w-4" />
              Pre-OJT
              <Badge className="ml-1 bg-slate-100 text-slate-600 border-slate-200">{counts.pre}</Badge>
            </TabsTrigger>
            <TabsTrigger value="during-ojt" className="h-11 px-4 rounded-lg text-xs font-bold justify-center data-[state=active]:bg-[#800000] data-[state=active]:text-white">
              <Files className="h-4 w-4" />
              During-OJT
              <Badge className="ml-1 bg-slate-100 text-slate-600 border-slate-200">{counts.during}</Badge>
            </TabsTrigger>
            <TabsTrigger value="post-ojt" className="h-11 px-4 rounded-lg text-xs font-bold justify-center data-[state=active]:bg-[#800000] data-[state=active]:text-white">
              <FileText className="h-4 w-4" />
              Post-OJT
              <Badge className="ml-1 bg-slate-100 text-slate-600 border-slate-200">{counts.post}</Badge>
            </TabsTrigger>
          </TabsList>

          <div className="grid grid-cols-1 md:grid-cols-[minmax(220px,1fr)_180px_160px] gap-3 w-full">
            <div className="space-y-1">
              <label htmlFor="requirementSearch" className="text-[10px] uppercase font-bold text-slate-400">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="requirementSearch"
                  type="search"
                  placeholder="Search intern, student number, or requirement..."
                  className="h-9 pl-10 text-xs bg-white border-slate-200 focus-visible:ring-[#800000]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label htmlFor="requirementProgramFilter" className="text-[10px] uppercase font-bold text-slate-400">Program</label>
              <select
                id="requirementProgramFilter"
                value={programFilter}
                onChange={(e) => setProgramFilter(e.target.value)}
                className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-650 focus:border-[#800000] focus:outline-none focus:ring-2 focus:ring-[#800000]/10"
              >
                <option value="all">All Programs</option>
                <option value="BSIT">BSIT</option>
                <option value="BSCpE">BSCpE</option>
                <option value="BSHM">BSHM</option>
                <option value="BSOA">BSOA</option>
              </select>
            </div>
            <div className="space-y-1">
              <label htmlFor="requirementSectionFilter" className="text-[10px] uppercase font-bold text-slate-400">Section</label>
              <select
                id="requirementSectionFilter"
                value={sectionFilter}
                onChange={(e) => setSectionFilter(e.target.value)}
                className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-650 focus:border-[#800000] focus:outline-none focus:ring-2 focus:ring-[#800000]/10"
              >
                <option value="all">All Sections</option>
                <option value="3-1">3-1</option>
                <option value="3-2">3-2</option>
                <option value="4-1">4-1</option>
                <option value="4-2">4-2</option>
              </select>
            </div>
          </div>
        </div>

        <TabsContent value="pre-ojt">
          <AdviserPreOJTReview embedded searchTerm={searchTerm} programFilter={programFilter} sectionFilter={sectionFilter} />
        </TabsContent>
        <TabsContent value="during-ojt">
          <DuringOJTReview embedded searchTerm={searchTerm} programFilter={programFilter} sectionFilter={sectionFilter} />
        </TabsContent>
        <TabsContent value="post-ojt">
          <PostOJTReview embedded searchTerm={searchTerm} programFilter={programFilter} sectionFilter={sectionFilter} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
