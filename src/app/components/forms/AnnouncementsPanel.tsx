import React from 'react';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Megaphone, Pin } from 'lucide-react';
import { formsAnnouncements } from '../../data/referenceData';

const priorityClass: Record<string, string> = {
  Normal: 'bg-slate-100 text-slate-700 hover:bg-slate-100',
  Important: 'bg-amber-100 text-amber-800 hover:bg-amber-100',
  Urgent: 'bg-red-100 text-red-800 hover:bg-red-100',
};

export function AnnouncementsPanel({ compact = false }: { compact?: boolean }) {
  const announcements = compact ? formsAnnouncements.slice(0, 2) : formsAnnouncements;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Announcements & Advisories</CardTitle>
        <Megaphone className="h-5 w-5 text-indigo-600" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="rounded-lg border border-slate-200 p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    {announcement.pinned && <Pin className="h-4 w-4 text-indigo-600" />}
                    <h3 className="font-medium text-slate-900">{announcement.title}</h3>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{announcement.message}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge className={priorityClass[announcement.priority]}>{announcement.priority}</Badge>
                  <Badge variant="outline">{announcement.category}</Badge>
                </div>
              </div>
              {!compact && (
                <p className="text-xs text-slate-500 mt-3">
                  Published {announcement.publishDate} · Expires {announcement.expirationDate}
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
