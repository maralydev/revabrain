"use client";

import { Button } from "@/shared/components/ui/Button";
import { cn } from "@/shared/utils/cn";

interface AgendaHeaderProps {
  currentDate: Date;
  view: "DAG" | "WEEK";
  onPrevDay: () => void;
  onNextDay: () => void;
  onToday: () => void;
  onViewChange: (view: "DAG" | "WEEK") => void;
  onNieuweAfspraak: () => void;
}

export function AgendaHeader({
  currentDate,
  view,
  onPrevDay,
  onNextDay,
  onToday,
  onViewChange,
  onNieuweAfspraak,
}: AgendaHeaderProps) {
  const formatDate = (date: Date) => {
    if (view === "DAG") {
      return date.toLocaleDateString("nl-BE", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } else {
      const endOfWeek = new Date(date);
      endOfWeek.setDate(endOfWeek.getDate() + 6);
      return `${date.toLocaleDateString("nl-BE", {
        day: "numeric",
        month: "short",
      })} - ${endOfWeek.toLocaleDateString("nl-BE", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}`;
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Left: Title and Date */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agenda</h1>
          <p className="text-gray-600 capitalize">{formatDate(currentDate)}</p>
        </div>

        {/* Center: Navigation */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onPrevDay}>
            <ChevronLeftIcon className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={onToday}>
            Vandaag
          </Button>
          <Button variant="outline" size="sm" onClick={onNextDay}>
            <ChevronRightIcon className="w-4 h-4" />
          </Button>
        </div>

        {/* Right: View Toggle + New Appointment */}
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => onViewChange("DAG")}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md transition-all",
                view === "DAG"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              Dag
            </button>
            <button
              onClick={() => onViewChange("WEEK")}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md transition-all",
                view === "WEEK"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              Week
            </button>
          </div>
          <Button onClick={onNieuweAfspraak} leftIcon={<PlusIcon className="w-4 h-4" />}>
            Nieuwe afspraak
          </Button>
        </div>
      </div>
    </div>
  );
}

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}
