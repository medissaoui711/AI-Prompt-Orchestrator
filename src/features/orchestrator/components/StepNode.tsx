import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Edit3, ArrowRight, ArrowLeft } from 'lucide-react';
import { Step, StepStatus, Lang } from '../../../types';
import { TRANSLATIONS } from '../../../lib/i18n/translations';

interface StepNodeProps {
  step: Step;
  index: number;
  currentStepIndex: number;
  isExecuting: boolean;
  lang: Lang;
  isRtl: boolean;
  onStartStep: (index: number) => void;
  onApproveAndNext: (index: number) => void;
  onOutputChange: (index: number, value: string) => void;
}

export const StepNode: React.FC<StepNodeProps> = ({
  step,
  index,
  currentStepIndex,
  isExecuting,
  lang,
  isRtl,
  onStartStep,
  onApproveAndNext,
  onOutputChange,
}) => {
  const Icon = step.icon;
  const isCurrent = currentStepIndex === index;
  const isEditable = isCurrent && step.status === 'pending_approval';

  const getStepStatusPill = (status: StepStatus) => {
    switch (status) {
      case 'loading':
        return (
          <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-2.5 py-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-blue-400 font-bold text-[10px] tracking-widest uppercase">
              {TRANSLATIONS[lang].executing}
            </span>
          </div>
        );
      case 'completed':
        return (
          <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-1">
            <motion.span 
              initial={{ scale: 0.8 }}
              animate={{ scale: [0.8, 1.2, 1] }}
              className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" 
            />
            <span className="text-emerald-400 font-bold text-[10px] tracking-widest uppercase">
              {TRANSLATIONS[lang].completed}
            </span>
          </div>
        );
      case 'pending_approval':
        return (
          <div className="flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-2.5 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
            <span className="text-yellow-400 font-bold text-[10px] tracking-widest uppercase">
              {TRANSLATIONS[lang].pendingApproval}
            </span>
          </div>
        );
      case 'idle':
        return (
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800/60 rounded-full px-2.5 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
            <span className="text-slate-500 text-[10px] tracking-widest uppercase font-semibold">
              {TRANSLATIONS[lang].idle}
            </span>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 rounded-full px-2.5 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
            <span className="text-red-400 font-bold text-[10px] tracking-widest uppercase">
              {TRANSLATIONS[lang].error}
            </span>
          </div>
        );
    }
  };

  const getStepLocalDetails = (key: string) => {
    return {
      name: TRANSLATIONS[lang][`${key}Name` as keyof typeof TRANSLATIONS['en']] || key,
      desc: TRANSLATIONS[lang][`${key}Desc` as keyof typeof TRANSLATIONS['en']] || '',
    };
  };

  const { name, desc } = getStepLocalDetails(step.nameKey);
  const isLoading = step.status === 'loading';

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.005, transition: { duration: 0.2 } }}
      className={`relative overflow-hidden bg-[#0D111E]/40 border rounded-3xl p-5 transition-all duration-500 backdrop-blur-sm ${
        isLoading
          ? 'border-blue-500 bg-[#0E1528] shadow-2xl shadow-blue-950/30 ring-1 ring-blue-500/30'
          : isCurrent && isExecuting
          ? 'border-blue-500/40 bg-[#0E1528]/80 shadow-xl shadow-blue-950/15'
          : 'border-slate-800/60 hover:border-slate-700/80 hover:bg-slate-900/40'
      }`}
    >
      {/* Top running glow indicator */}
      {isLoading && (
        <motion.div 
          initial={{ left: '-100%' }}
          animate={{ left: '100%' }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          className="absolute top-0 w-1/3 h-[2px] bg-gradient-to-r from-transparent via-blue-400 to-transparent z-20" 
        />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-4">
          <motion.div
            whileHover={{ rotate: 5 }}
            className={`p-3 rounded-2xl border transition-all duration-300 ${
              isLoading
                ? 'bg-blue-600/20 border-blue-400 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                : isCurrent && isExecuting
                ? 'bg-blue-600/10 border-blue-500/30 text-blue-400'
                : 'bg-[#080B14] border-slate-900 text-slate-500'
            }`}
          >
            <Icon size={20} className={isLoading ? 'animate-pulse' : ''} />
          </motion.div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-100 text-sm sm:text-base leading-none tracking-tight">
                {name}
              </h3>
              <span className="text-[10px] text-slate-500 font-mono bg-slate-950/50 px-1.5 py-0.5 rounded border border-white/5">
                {TRANSLATIONS[lang].phase} {step.id}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-medium">{desc}</p>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-4 border-t border-slate-900/50 sm:border-0 pt-3 sm:pt-0">
          <div className="text-right">{getStepStatusPill(step.status)}</div>

          <div>
            {!isExecuting && step.status === 'idle' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onStartStep(index)}
                className="bg-slate-800 hover:bg-slate-700 hover:text-white text-slate-200 text-xs font-bold py-2 px-4 rounded-xl transition-all border border-slate-700/50"
              >
                {TRANSLATIONS[lang].startPhase}
              </motion.button>
            )}

            {step.status === 'pending_approval' && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(16,185,129,0.3)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onApproveAndNext(index)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2 px-4 rounded-xl flex items-center gap-1.5 shadow-lg shadow-emerald-950/20 transition-all border border-emerald-500/30"
              >
                <span>{TRANSLATIONS[lang].approveNext}</span>
                {isRtl ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Simulated Generated Terminal Output */}
      <AnimatePresence>
        {step.output && (
          <motion.div 
            initial={{ opacity: 0, height: 0, y: 10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 sm:pl-16 relative group"
          >
            <div
              className={`absolute top-3 flex items-center gap-1 text-[10px] text-slate-600 font-bold tracking-[0.2em] uppercase select-none pointer-events-none z-10 ${
                isRtl ? 'right-4' : 'left-4 sm:left-20'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />{' '}
              {TRANSLATIONS[lang].terminalOutput}
            </div>
            <textarea
              value={step.output}
              onChange={(e) => onOutputChange(index, e.target.value)}
              readOnly={!isEditable}
              dir={isRtl ? 'rtl' : 'ltr'}
              className={`w-full min-h-[160px] p-4 pt-9 bg-black/45 rounded-2xl text-slate-200 border transition-all h-52 resize-y focus:outline-none focus:ring-4 ${
                isRtl 
                  ? 'font-arabic text-sm leading-relaxed [word-spacing:0.025em]' 
                  : 'font-mono text-xs sm:text-sm leading-relaxed tracking-wide [word-spacing:0.05em]'
              } ${
                isEditable
                  ? 'border-yellow-500/30 focus:border-yellow-500/50 focus:ring-yellow-500/10 shadow-lg shadow-yellow-950/5'
                  : 'border-slate-900 focus:border-blue-500/30 focus:ring-blue-500/5'
              }`}
            />
            {isEditable && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`absolute bottom-3 flex items-center gap-1 text-[10px] text-yellow-500/70 font-bold uppercase bg-yellow-500/10 px-2 py-1 rounded-lg border border-yellow-500/20 backdrop-blur-md ${
                  isRtl ? 'left-3' : 'right-3'
                }`}
              >
                <Edit3 size={11} /> {TRANSLATIONS[lang].editable}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
