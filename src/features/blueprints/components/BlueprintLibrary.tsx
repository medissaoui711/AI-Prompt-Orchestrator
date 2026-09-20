import React from 'react';
import { FolderPlus, Trash2, Inbox, Edit2, Download } from 'lucide-react';
import { Blueprint, Lang } from '../../../types';
import { TRANSLATIONS } from '../../../lib/i18n/translations';

interface BlueprintLibraryProps {
  blueprints: Blueprint[];
  lang: Lang;
  onSaveBlueprint: () => void;
  onDeployBlueprint: (bp: Blueprint) => void;
  onRemoveBlueprint: (id: string, e: React.MouseEvent) => void;
  onRenameBlueprint: (id: string, e: React.MouseEvent) => void;
  onExportBlueprint: (bp: Blueprint, e: React.MouseEvent) => void;
  onImportBlueprint: (file: File) => void;
}

export const BlueprintLibrary: React.FC<BlueprintLibraryProps> = ({
  blueprints,
  lang,
  onSaveBlueprint,
  onDeployBlueprint,
  onRemoveBlueprint,
  onRenameBlueprint,
  onExportBlueprint,
  onImportBlueprint,
}) => {
  return (
    <section className="border-t border-slate-900 pt-10">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 p-2.5 rounded-xl text-slate-400 border border-slate-800">
            <FolderPlus size={18} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-200">
              {TRANSLATIONS[lang].blueprintTitle}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {TRANSLATIONS[lang].blueprintSubtitle}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-center">
          {/* Hidden file input for local JSON upload */}
          <input
            type="file"
            id="import-blueprint-upload"
            accept=".json"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                onImportBlueprint(file);
                e.target.value = ''; // Clear value to allow re-upload
              }
            }}
            className="hidden"
          />
          <button
            onClick={() => document.getElementById('import-blueprint-upload')?.click()}
            className="bg-slate-900 border border-slate-800/80 hover:bg-slate-800/80 hover:text-slate-100 text-slate-400 text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-1.5 active:scale-[0.98] transition-all"
          >
            <Download size={14} className="rotate-180" />
            {TRANSLATIONS[lang].importBp}
          </button>

          <button
            onClick={onSaveBlueprint}
            className="bg-blue-600/10 border border-blue-500/20 hover:bg-blue-600/20 text-blue-400 text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-1.5 active:scale-[0.98] transition-all"
          >
            {TRANSLATIONS[lang].blueprintAdd}
          </button>
        </div>
      </header>

      {/* Library State */}
      {blueprints.length === 0 ? (
        <div className="border border-dashed border-slate-800/80 rounded-2xl p-10 flex flex-col items-center justify-center text-center bg-[#080B14]/20">
          <Inbox size={42} className="text-slate-700 stroke-[1.2] mb-3" />
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
            {TRANSLATIONS[lang].libraryEmpty}
          </h3>
          <p className="text-xs text-slate-600 mt-1 max-w-sm">
            {TRANSLATIONS[lang].libraryEmptyDesc}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {blueprints.map((bp) => {
            const completedStepsCount = bp.steps.filter(
              (s) => s.status === 'completed' || s.status === 'pending_approval'
            ).length;
            return (
              <div
                key={bp.id}
                onClick={() => onDeployBlueprint(bp)}
                className="group bg-[#0D111E]/40 border border-slate-900 hover:border-blue-500/40 hover:bg-[#0F1528]/80 rounded-2xl p-5 cursor-pointer transition-premium hover-lift flex flex-col justify-between gap-4 shadow-md shadow-black/10"
              >
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-slate-900/40">
                    <h4 className="font-bold text-slate-100 text-sm group-hover:text-blue-400 transition-colors line-clamp-1">
                      {bp.name}
                    </h4>
                    <span className="text-[10px] font-semibold text-slate-500 tracking-wider whitespace-nowrap bg-slate-900/80 px-2 py-0.5 rounded-full border border-slate-800/40 self-start sm:self-auto">
                      <span className="text-[9px] text-slate-400 font-normal mr-1">{TRANSLATIONS[lang].savedAtLabel}</span>
                      {bp.timestamp}
                    </span>
                  </div>
                  
                  <div className="mt-3">
                    <span className="text-[9px] font-bold text-blue-500/80 tracking-widest uppercase block mb-1">
                      {TRANSLATIONS[lang].conceptLabel}
                    </span>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed italic">
                      "{bp.seed}"
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-900/60 pt-3 mt-1">
                  <div className="flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold tracking-wider">
                      {completedStepsCount} / 4 {TRANSLATIONS[lang].stepsSaved}
                    </span>
                  </div>

                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => onRenameBlueprint(bp.id, e)}
                      className="p-1.5 text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                      title={TRANSLATIONS[lang].renameBp}
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={(e) => onExportBlueprint(bp, e)}
                      className="p-1.5 text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all"
                      title={TRANSLATIONS[lang].exportJson}
                    >
                      <Download size={13} />
                    </button>
                    <button
                      onClick={(e) => onRemoveBlueprint(bp.id, e)}
                      className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                      title={TRANSLATIONS[lang].deleteBp}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
