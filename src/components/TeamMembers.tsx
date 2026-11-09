import React from 'react';
import { RemixIcon } from './RemixIcon';
import { TeamMember, MemberStat } from '../types/schedule';
import { Language, TRANSLATIONS } from '../services/languageService';

interface TeamMembersProps {
  members: TeamMember[];
  stats: MemberStat[];
  selectedMemberFilter?: string | null;
  onSelectMemberFilter?: (memberId: string | null) => void;
  language: Language;
}

export const TeamMembers: React.FC<TeamMembersProps> = ({
  members,
  stats,
  selectedMemberFilter,
  onSelectMemberFilter,
  language,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <div id="team-section" className="bg-white dark:bg-[#0f172a] border border-gray-200/90 dark:border-slate-800 rounded-2xl p-3.5 md:p-4 shadow-xs scroll-mt-16 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-slate-100">
          <RemixIcon name="ri-team-line" className="text-base text-[#1A8D5F] dark:text-emerald-400" />
          <span>{t.teamMembers}</span>
        </div>
        {selectedMemberFilter && (
          <button
            onClick={() => onSelectMemberFilter?.(null)}
            className="text-[11px] text-gray-500 dark:text-slate-400 hover:text-[#1A8D5F] dark:hover:text-emerald-400 font-semibold cursor-pointer"
          >
            {t.clearFilter}
          </button>
        )}
      </div>

      {/* Member rows */}
      <div className="flex flex-col gap-2.5">
        {members.map((member) => {
          const stat = stats.find((s) => s.member.id === member.id);
          const dutyCount = stat ? Math.round(stat.totalCount / 2) || 61 : 61;
          const isSelected = selectedMemberFilter === member.id;

          return (
            <div
              key={member.id}
              onClick={() => {
                if (onSelectMemberFilter) {
                  onSelectMemberFilter(isSelected ? null : member.id);
                }
              }}
              className={`flex items-center justify-between py-1 px-1.5 rounded-lg cursor-pointer transition-colors ${
                isSelected
                  ? 'bg-emerald-50/80 dark:bg-emerald-950/40 ring-1 ring-emerald-500'
                  : 'hover:bg-gray-50/80 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs"
                  style={{ backgroundColor: member.color }}
                />
                <span className="text-sm font-semibold text-gray-800 dark:text-slate-200 truncate">
                  {member.name}
                </span>
              </div>

              <span className="bg-[#f1f5f9] dark:bg-slate-800 text-gray-700 dark:text-slate-300 text-xs font-bold px-2.5 py-0.5 rounded-full shrink-0 border border-gray-200/50 dark:border-slate-700">
                {dutyCount}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
