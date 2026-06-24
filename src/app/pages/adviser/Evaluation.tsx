import React, { useState } from 'react';
import { useOJT, StudentOJTProfile, EvaluationForm } from '../../context/OJTContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { toast } from 'sonner';
import { 
  Award, 
  User, 
  CheckCircle2, 
  AlertTriangle,
  ChevronRight,
  Calculator
} from 'lucide-react';

export function Evaluation() {
  const { students, submitStudentEvaluation } = useOJT();
  
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.studentId || '');
  const [evalType, setEvalType] = useState<'midterm' | 'final'>('midterm');

  // Criteria ratings
  const [scores, setScores] = useState<Record<string, number>>({
    '1': 18,
    '2': 18,
    '3': 17,
    '4': 19,
    '5': 20,
  });

  const [comments, setComments] = useState('');

  const student = students.find(s => s.studentId === selectedStudentId);

  const criteria = [
    { id: '1', criteriaName: 'Quality of Work / Accuracy (Precision and diligence)', maxPoints: 20 },
    { id: '2', criteriaName: 'Quantity of Work / Productivity (Deliverables timeline compliance)', maxPoints: 20 },
    { id: '3', criteriaName: 'Knowledge and Technical Skills (Application of course theories)', maxPoints: 20 },
    { id: '4', criteriaName: 'Attendance and Punctuality (Geofence coordinates verification checks)', maxPoints: 20 },
    { id: '5', criteriaName: 'Attitude and Professional Ethics (Ethics compliance and reviews)', maxPoints: 20 },
  ];

  const handleScoreChange = (criteriaId: string, val: number) => {
    setScores(prev => ({
      ...prev,
      [criteriaId]: val
    }));
  };

  const totalScore = Object.values(scores).reduce((acc, curr) => acc + curr, 0);

  const handleSubmitEval = (e: React.FormEvent) => {
    e.preventDefault();
    if (!student) return;

    const evaluation: EvaluationForm = {
      id: `eval_${Date.now()}`,
      program: student.program,
      title: evalType === 'midterm' ? 'Midterm Performance Review' : 'Final Completion Grading',
      criteria: criteria.map(c => ({
        id: c.id,
        criteriaName: c.criteriaName,
        maxPoints: c.maxPoints,
        score: scores[c.id] || 0
      })),
      comments,
      ratingScale: 5,
      status: 'Submitted',
      submittedAt: new Date().toISOString().split('T')[0]
    };

    submitStudentEvaluation(student.studentId, evalType, evaluation);
    toast.success(`Endorsed ${evalType === 'midterm' ? 'Midterm' : 'Final'} Evaluation scorecard for ${student.name}!`, {
      description: `Total score: ${totalScore}/100. Synchronized to student portal.`
    });

    setComments('');
  };

  const getActiveEvaluation = () => {
    if (!student) return null;
    return evalType === 'midterm' ? student.midtermEvaluation : student.finalEvaluation;
  };

  const activeEval = getActiveEvaluation();

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Evaluation Module</h1>
        <p className="text-slate-500 text-sm mt-0.5">Grade intern performance metrics across core parameters for midterm and final terms.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-base font-bold text-slate-800">Grade Scorecard Sheet</CardTitle>
              <CardDescription>Drag the rating selectors from 1 to 20 for each competence criteria.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {activeEval ? (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl space-y-3 text-xs text-green-800">
                  <div className="flex items-center gap-1.5 font-bold text-green-950">
                    <CheckCircle2 className="h-4.5 w-4.5 text-green-600" />
                    Evaluation Already Submitted
                  </div>
                  <p className="font-light">
                    You have already signed off the {evalType} evaluation for <span className="font-bold text-slate-800">{student?.name}</span> on {activeEval.submittedAt}.
                  </p>
                  <div className="bg-white p-3.5 rounded border border-green-100 text-slate-800 space-y-2 mt-2">
                    <div className="flex justify-between border-b pb-1.5 text-[10px] font-bold uppercase text-slate-400">
                      <span>Evaluation Parameters</span>
                      <span>Points</span>
                    </div>
                    {activeEval.criteria.map(c => (
                      <div key={c.id} className="flex justify-between">
                        <span className="font-light">{c.criteriaName.split('(')[0]}</span>
                        <span className="font-bold">{c.score} / {c.maxPoints}</span>
                      </div>
                    ))}
                    <div className="flex justify-between border-t pt-2 font-bold text-[#800000] text-sm">
                      <span>Total Score Sum</span>
                      <span>{activeEval.criteria.reduce((a, b) => a + b.score, 0)} / 100</span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Comments</span>
                      <p className="font-light italic mt-1">"{activeEval.comments}"</p>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitEval} className="space-y-6">
                  {/* Rating list */}
                  <div className="space-y-4">
                    {criteria.map((c) => {
                      const currentVal = scores[c.id] || 0;
                      return (
                        <div key={c.id} className="space-y-1.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200/60 text-xs">
                          <div className="flex justify-between items-start">
                            <span className="font-bold text-slate-800 leading-normal">{c.criteriaName}</span>
                            <span className="text-xs font-extrabold text-[#800000] shrink-0 ml-4">{currentVal} / 20</span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="20"
                            value={currentVal}
                            onChange={(e) => handleScoreChange(c.id, Number(e.target.value))}
                            className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#800000] mt-3"
                          />
                        </div>
                      );
                    })}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="evalComments" className="text-xs">Summary Evaluation Comments</Label>
                    <Textarea 
                      id="evalComments" 
                      placeholder="Comment on technical achievements, areas for improvement, or attendance..."
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      rows={3}
                      className="text-xs"
                      required
                    />
                  </div>

                  <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
                    <div className="flex items-baseline gap-1 text-[#800000]">
                      <span className="text-2xl font-extrabold">{totalScore}</span>
                      <span className="text-xs text-slate-500 font-medium">/ 100 points total</span>
                    </div>
                    <Button 
                      type="submit" 
                      className="bg-[#800000] hover:bg-[#6b0000] text-white font-bold text-xs px-5 cursor-pointer"
                    >
                      Endorse and Sign Evaluation
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Student select side panel */}
        <div className="space-y-6">
          <Card className="shadow-sm border-slate-200">
            <CardHeader>
              <CardTitle className="text-base font-bold text-slate-850">Select Evaluation Target</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <Label htmlFor="studentSelect" className="text-xs">Student Name</Label>
                <select
                  id="studentSelect"
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-[#800000] focus:border-[#800000]"
                >
                  {students.map(s => (
                    <option key={s.studentId} value={s.studentId}>{s.name} ({s.section})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs block">Evaluation Period</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={evalType === 'midterm' ? 'default' : 'outline'}
                    onClick={() => setEvalType('midterm')}
                    className={`flex-1 text-[10px] font-bold h-8 cursor-pointer ${evalType === 'midterm' ? 'bg-[#800000]' : ''}`}
                  >
                    Midterm Review
                  </Button>
                  <Button
                    type="button"
                    variant={evalType === 'final' ? 'default' : 'outline'}
                    onClick={() => setEvalType('final')}
                    className={`flex-1 text-[10px] font-bold h-8 cursor-pointer ${evalType === 'final' ? 'bg-[#800000]' : ''}`}
                  >
                    Final Review
                  </Button>
                </div>
              </div>

              {student && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                  <p className="font-bold text-slate-800">Target Summary:</p>
                  <p className="text-slate-500 font-light">Rendered hours: <span className="font-bold text-slate-700">{student.totalHoursRendered.toFixed(0)} / {student.requiredHours}</span></p>
                  <p className="text-slate-500 font-light">Active flow stage: <span className="font-bold text-slate-700">{student.stage}</span></p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
