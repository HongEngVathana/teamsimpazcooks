import React, { useState } from 'react';
import { RemixIcon } from './RemixIcon';
import { TeamMember } from '../types/schedule';
import { Language, TRANSLATIONS } from '../services/languageService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: TeamMember[];
  onUpdateMembers: (members: TeamMember[]) => void;
  onResetSchedule: () => void;
  language: Language;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  members,
  onUpdateMembers,
  onResetSchedule,
  language,
}) => {
  const t = TRANSLATIONS[language];
  const [localMembers, setLocalMembers] = useState<TeamMember[]>(members);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  if (!isOpen) return null;

  const handleMemberNameChange = (id: string, newName: string) => {
    setLocalMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, name: newName } : m))
    );
  };

  const handleSave = () => {
    onUpdateMembers(localMembers);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#0f172a] rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150 transition-colors">
        {/* Header */}
        <div className="bg-[#ebf7ef] dark:bg-emerald-950/40 px-6 py-4 flex items-center justify-between border-b border-[#d4edd9] dark:border-emerald-800/40">
          <div className="flex items-center gap-2.5">
            <RemixIcon name="ri-settings-3-line" className="text-xl text-[#1A8D5F] dark:text-emerald-400" />
            <div>
              <h3 className="text-base font-bold text-[#113e2e] dark:text-emerald-300">
                {language === 'km' ? 'ការកំណត់កាលវិភាគផ្ទះបាយ' : 'Kitchen Schedule Settings'}
              </h3>
              <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">
                {language === 'km' ? 'កំណត់រចនាសម្ព័ន្ធសមាជិក និងច្បាប់បង្វិលភារកិច្ច' : 'Team configuration & rotation parameters'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-white/60 dark:hover:bg-slate-800 transition-colors"
          >
            <RemixIcon name="ri-close-line" className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Rules Summary */}
          <div className="p-3.5 bg-emerald-50/60 dark:bg-emerald-950/25 border border-emerald-100 dark:border-emerald-800/40 rounded-xl space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 dark:text-emerald-300">
              <RemixIcon name="ri-shield-check-line" className="text-base text-emerald-600 dark:text-emerald-400" />
              <span>{language === 'km' ? 'ច្បាប់បង្វិលភារកិច្ចសកម្ម:' : 'Active Rotation Rules:'}</span>
            </div>
            <ul className="text-[11px] text-emerald-800 dark:text-emerald-200/90 space-y-1 list-disc pl-4 leading-relaxed">
              <li>
                <strong>Hong Eng Vathana</strong>: {language === 'km' ? 'ចម្អិនតែថ្ងៃសៅរ៍ (១ដងក្នុង១សប្តាហ៍)' : 'Assigned cooking on Saturday (1x per week)'}.
              </li>
              <li>
                <strong>{language === 'km' ? 'សមាជិក ៥នាក់ទៀត' : 'Other 5 Members'}</strong>: {language === 'km' ? 'បង្វិលចម្អិនស្មើៗគ្នាពីថ្ងៃអាទិត្យ ដល់សុក្រ' : 'Rotate cooking evenly Sunday through Friday'}.
              </li>
              <li>
                <strong>{language === 'km' ? 'លាងចាន' : 'Dishwashing'}</strong>: {language === 'km' ? 'បង្វិលយុត្តិធម៌ស្មើគ្នាលើសមាជិកទាំង ៦នាក់' : 'Rotated fairly across all 6 members'}.
              </li>
              <li>
                <strong>{language === 'km' ? 'គ្មានជម្លោះភារកិច្ច' : 'Zero Conflict'}</strong>: {language === 'km' ? 'មិនចាត់តាំងមនុស្សម្នាក់ឱ្យចម្អិន និងលាងចានក្នុងថ្ងៃតែមួយឡើយ' : 'Never assigns cook and dishwasher to the same person on any date'}.
              </li>
            </ul>
          </div>

          {/* Team Members Editor */}
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-2">
              Team ({localMembers.length})
            </label>
            <div className="space-y-2">
              {localMembers.map((m, idx) => (
                <div key={m.id} className="flex items-center gap-2">
                  <span
                    className="w-3.5 h-3.5 rounded-full shrink-0"
                    style={{ backgroundColor: m.color }}
                  />
                  <input
                    type="text"
                    value={m.name}
                    onChange={(e) => handleMemberNameChange(m.id, e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-slate-100 rounded-lg focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-[#1A8D5F]"
                  />
                  {m.isSaturdayCookOnly ? (
                    <span className="text-[10px] bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 px-2 py-1 rounded-md font-semibold whitespace-nowrap">
                      {t.saturdaySpecialist}
                    </span>
                  ) : (
                    <span className="text-[10px] bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 px-2 py-1 rounded-md whitespace-nowrap">
                      {language === 'km' ? `សមាជិក #${idx + 1}` : `Member #${idx + 1}`}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Backup Export and Import */}
          <div className="pt-3 border-t border-gray-100 dark:border-slate-800 space-y-2">
            <label className="block text-xs font-bold text-gray-700 dark:text-slate-300">
              {language === 'km' ? 'ការបម្រុងទុក និងនាំចេញទិន្នន័យ' : 'Data Backup & Portability'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  const backup = {
                    version: '2.0',
                    exportedAt: new Date().toISOString(),
                    members: localMembers,
                    localStorageDump: { ...localStorage }
                  };
                  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
                  const downloadAnchor = document.createElement('a');
                  downloadAnchor.setAttribute('href', dataStr);
                  downloadAnchor.setAttribute('download', `OurKitchen_Backup_${new Date().toISOString().split('T')[0]}.json`);
                  document.body.appendChild(downloadAnchor);
                  downloadAnchor.click();
                  downloadAnchor.remove();
                }}
                className="py-2 px-3 text-xs font-semibold bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-200 rounded-xl transition-colors text-center cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RemixIcon name="ri-file-download-line" className="text-sm" />
                <span>{language === 'km' ? 'ទាញយក Backup (JSON)' : 'Export Backup (JSON)'}</span>
              </button>

              <label className="py-2 px-3 text-xs font-semibold bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-200 rounded-xl transition-colors text-center cursor-pointer flex items-center justify-center gap-1.5">
                <RemixIcon name="ri-file-upload-line" className="text-sm" />
                <span>{language === 'km' ? 'បញ្ចូល Backup ឡើងវិញ' : 'Restore Backup'}</span>
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      try {
                        const parsed = JSON.parse(event.target?.result as string);
                        if (parsed.localStorageDump) {
                          Object.entries(parsed.localStorageDump).forEach(([k, v]) => {
                            localStorage.setItem(k, v as string);
                          });
                          alert(language === 'km' ? 'ទិន្នន័យត្រូវបានស្ដារដោយជោគជ័យ! ទំព័រនឹងដំណើរការឡើងវិញ។' : 'Backup restored successfully! The page will now reload.');
                          window.location.reload();
                        } else {
                          alert(language === 'km' ? 'ឯកសារ Backup មិនត្រឹមត្រូវ។' : 'Invalid backup file format.');
                        }
                      } catch (err) {
                        alert(language === 'km' ? 'មិនអាចអានឯកសារ Backup បានឡើយ។' : 'Failed to read backup file.');
                      }
                    };
                    reader.readAsText(file);
                  }}
                />
              </label>
            </div>
          </div>

          {/* Developer Attribution Card */}
          <div className="p-3.5 bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-slate-900 border border-emerald-200/80 dark:border-emerald-800/50 rounded-xl flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#1A8D5F] text-white flex items-center justify-center shadow-xs shrink-0">
                <RemixIcon name="ri-code-s-slash-line" className="text-lg" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-500 dark:text-emerald-300/80 uppercase tracking-wider block">
                  {language === 'km' ? 'អ្នកអភិវឌ្ឍន៍កម្មវិធី' : 'Application Developer'}
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-[#113e2e] dark:text-emerald-300 flex items-center gap-1.5">
                  <span>Developed by HongEngVathana</span>
                  <RemixIcon name="ri-verified-badge-fill" className="text-[#1A8D5F] dark:text-emerald-400 text-sm" />
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 bg-white/80 dark:bg-slate-900/80 px-2.5 py-1 rounded-lg border border-emerald-200/60 dark:border-emerald-800/40 shadow-2xs">
              <RemixIcon name="ri-heart-3-fill" className="text-rose-500 text-xs" />
              <span>Our Kitchen</span>
            </div>
          </div>

          {/* Reset Schedule */}
          <div className="pt-3 border-t border-gray-100 dark:border-slate-800">
            {!showConfirmReset ? (
              <button
                onClick={() => setShowConfirmReset(true)}
                className="flex items-center gap-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 px-3 py-2 rounded-xl transition-colors cursor-pointer"
              >
                <RemixIcon name="ri-restart-line" className="text-sm" />
                <span>{language === 'km' ? 'កំណត់កាលវិភាគឡើងវិញទៅលំនាំដើម' : 'Reset Schedule to Default Reference State'}</span>
              </button>
            ) : (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/50 rounded-xl space-y-2 text-xs">
                <div className="flex items-center gap-1.5 text-rose-800 dark:text-rose-300 font-bold">
                  <RemixIcon name="ri-error-warning-line" className="text-base text-rose-600 dark:text-rose-400" />
                  <span>{language === 'km' ? 'តើអ្នកប្រាកដថាចង់កំណត់ឡើងវិញមែនទេ?' : 'Are you sure you want to reset?'}</span>
                </div>
                <p className="text-rose-700 dark:text-rose-300/80 text-[11px]">
                  {language === 'km'
                    ? 'វានឹងបង្កើតកាលវិភាគឡើងវិញទាំងស្រុង និងលុបចោលរាល់ការកែប្រែដោយដៃ។'
                    : 'This will regenerate the entire schedule and clear any custom manual duty overrides.'}
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => {
                      onResetSchedule();
                      setShowConfirmReset(false);
                      onClose();
                    }}
                    className="px-3 py-1.5 bg-rose-600 text-white rounded-lg font-semibold hover:bg-rose-700 text-xs cursor-pointer"
                  >
                    {language === 'km' ? 'យល់ព្រម, កំណត់ឡើងវិញ' : 'Yes, Reset Schedule'}
                  </button>
                  <button
                    onClick={() => setShowConfirmReset(false)}
                    className="px-3 py-1.5 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-200 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-slate-600 text-xs cursor-pointer"
                  >
                    {t.cancel}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-slate-900 px-6 py-3 flex items-center justify-between border-t border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-slate-400 font-medium truncate pr-2">
            <span>{language === 'km' ? 'អភិវឌ្ឍន៍ដោយ' : 'Developed by'}</span>
            <span className="font-bold text-[#1A8D5F] dark:text-emerald-400 truncate">HongEngVathana</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              {t.cancel}
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#1A8D5F] hover:bg-[#157a51] rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              {language === 'km' ? 'រក្សាទុកការកំណត់' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
