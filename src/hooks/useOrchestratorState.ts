import { useState, useEffect, useCallback } from 'react';
import { Step, StepStatus, Lang, Blueprint, AppEvent, WorkflowTemplate } from '../types';
import { TRANSLATIONS } from '../lib/i18n/translations';
import { generateStepOutput } from '../lib/api/generator';
import { storage } from '../lib/storage/blueprints';
import { WORKFLOW_STEPS, ICON_MAP } from '../lib/constants';

export function useOrchestratorState(
  lang: Lang,
  setLang: (lang: Lang) => void,
  showNotification: (message: string, type?: 'success' | 'error' | 'info') => void
) {
  const [plugins, setPlugins] = useState<{ competitor: boolean; financial: boolean }>(() => {
    try {
      const saved = localStorage.getItem('orchestrator_plugins');
      return saved ? JSON.parse(saved) : { competitor: false, financial: false };
    } catch {
      return { competitor: false, financial: false };
    }
  });

  const [formattingPreset, setFormattingPreset] = useState<string>(() => {
    return localStorage.getItem('orchestrator_preset') || 'default';
  });

  const [events, setEvents] = useState<AppEvent[]>([]);

  const addEvent = useCallback((type: AppEvent['type'], stepId?: string | number, payload?: any) => {
    const newEvent: AppEvent = {
      id: Math.random().toString(36).substring(7),
      type,
      stepId,
      timestamp: Date.now(),
      payload
    };
    setEvents(prev => [newEvent, ...prev].slice(0, 50)); // Keep last 50 events
  }, []);

  const [steps, setSteps] = useState<Step[]>(() => {
    const desiredKeys = [
      'strategic',
      ...(plugins.competitor ? ['competitor'] : []),
      'copywriting',
      'visual',
      ...(plugins.financial ? ['financial'] : []),
      'quality'
    ];
    let idCounter = 1;
    return desiredKeys.map(key => {
      return {
        id: idCounter++,
        nameKey: key,
        icon: ICON_MAP[key] || ICON_MAP.quality,
        status: 'idle',
        output: '',
      };
    });
  });

  useEffect(() => {
    addEvent('system-init', undefined, { plugins, lang });
  }, []);

  const [seed, setSeed] = useState<string>(TRANSLATIONS.ar.defaultSeed);
  const [autoAdvance, setAutoAdvance] = useState(false);
  const [themeGlow, setThemeGlow] = useState(true);
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);

  useEffect(() => {
    if (seed === (TRANSLATIONS.en.defaultSeed as string) && lang === 'ar') {
      setSeed(TRANSLATIONS.ar.defaultSeed);
    } else if (seed === (TRANSLATIONS.ar.defaultSeed as string) && lang === 'en') {
      setSeed(TRANSLATIONS.en.defaultSeed);
    }
  }, [lang]);

  const handleSetFormattingPreset = (preset: string) => {
    setFormattingPreset(preset);
    localStorage.setItem('orchestrator_preset', preset);
  };

  useEffect(() => {
    const desiredKeys = [
      'strategic',
      ...(plugins.competitor ? ['competitor'] : []),
      'copywriting',
      'visual',
      ...(plugins.financial ? ['financial'] : []),
      'quality'
    ];

    setSteps((prevSteps) => {
      let idCounter = 1;
      return desiredKeys.map((key) => {
        const existing = prevSteps.find((s) => s.nameKey === key);
        return {
          id: idCounter++,
          nameKey: key,
          icon: ICON_MAP[key] || ICON_MAP.quality,
          output: existing ? existing.output : '',
          status: existing ? existing.status : 'idle',
        };
      });
    });
    localStorage.setItem('orchestrator_plugins', JSON.stringify(plugins));
  }, [plugins]);

  const updateStep = useCallback((index: number, updates: Partial<Step>) => {
    setSteps((prev) =>
      prev.map((step, i) => (i === index ? { ...step, ...updates } : step))
    );
  }, []);

  const resetMatrix = () => {
    setSteps((prev) =>
      prev.map((s) => ({ ...s, status: 'idle', output: '' }))
    );
    setCurrentStepIndex(-1);
    setIsExecuting(false);
    addEvent('user-edit', undefined, { action: 'reset' });
    showNotification(TRANSLATIONS[lang].msgReset, 'info');
  };

  const launchMatrix = () => {
    setSteps((prev) => prev.map((s) => ({ ...s, status: 'idle', output: '' })));
    setIsExecuting(true);
    setCurrentStepIndex(0);
    addEvent('step-start', steps[0]?.nameKey);
    showNotification(TRANSLATIONS[lang].msgLaunch);
  };

  const approveAndNext = useCallback(
    (index: number) => {
      updateStep(index, { status: 'completed' });
      addEvent('step-end', steps[index].nameKey);
      if (index + 1 < steps.length) {
        setCurrentStepIndex(index + 1);
        addEvent('step-start', steps[index + 1].nameKey);
      } else {
        setIsExecuting(false);
        showNotification(TRANSLATIONS[lang].msgCompleted, 'success');
      }
    },
    [steps, updateStep, lang, showNotification, addEvent]
  );

  const executeStep = useCallback(
    async (
      index: number,
      nameKey: string
    ) => {
      updateStep(index, { status: 'loading' });

      try {
        const userApiKey = localStorage.getItem('custom_gemini_api_key') || undefined;
        const aiResult = await generateStepOutput(nameKey as any, seed, lang, steps, formattingPreset, userApiKey);

        updateStep(index, {
          output: aiResult,
          status: autoAdvance ? 'completed' : 'pending_approval',
        });

        if (autoAdvance) {
          addEvent('step-end', nameKey);
          if (index + 1 < steps.length) {
            setCurrentStepIndex(index + 1);
            addEvent('step-start', steps[index + 1].nameKey);
          } else {
            setIsExecuting(false);
            showNotification(TRANSLATIONS[lang].msgAutoCompleted, 'success');
          }
        }
      } catch (err: unknown) {
        updateStep(index, { status: 'error' });
        addEvent('error', nameKey, { error: err instanceof Error ? err.message : 'Unknown' });
        const msg = err instanceof Error ? err.message : 'Error during step execution';
        showNotification(msg, 'error');
      }
    },
    [autoAdvance, seed, steps, updateStep, lang, showNotification, formattingPreset, addEvent]
  );

  useEffect(() => {
    if (isExecuting && currentStepIndex >= 0 && currentStepIndex < steps.length) {
      const currentStep = steps[currentStepIndex];
      if (currentStep.status === 'idle') {
        executeStep(currentStepIndex, currentStep.nameKey);
      }
    }
  }, [isExecuting, currentStepIndex, steps, executeStep]);

  const handleOutputChange = (index: number, value: string) => {
    updateStep(index, { output: value });
    addEvent('user-edit', steps[index].nameKey, { field: 'output' });
  };

  const deployBlueprint = (blueprint: Blueprint) => {
    setSeed(blueprint.seed);
    if (blueprint.lang) {
      setLang(blueprint.lang);
      storage.saveLanguage(blueprint.lang);
    }

    const hasCompetitor = blueprint.steps.some(s => s.nameKey === 'competitor');
    const hasFinancial = blueprint.steps.some(s => s.nameKey === 'financial');
    
    const newPlugins = { competitor: hasCompetitor, financial: hasFinancial };
    setPlugins(newPlugins);
    localStorage.setItem('orchestrator_plugins', JSON.stringify(newPlugins));

    let idCounter = 1;
    const reloadedSteps = blueprint.steps.map((savedStep) => {
      return {
        id: idCounter++,
        nameKey: savedStep.nameKey,
        icon: ICON_MAP[savedStep.nameKey] || ICON_MAP.quality,
        output: savedStep.output || '',
        status: (savedStep.status as StepStatus) || 'idle',
      };
    });

    setSteps(reloadedSteps);
    addEvent('blueprint-save', undefined, { id: blueprint.id, name: blueprint.name });

    const lastActiveIndex = blueprint.steps.reduce((acc, s, idx) => {
      if (s.status !== 'idle') return idx;
      return acc;
    }, -1);

    setCurrentStepIndex(lastActiveIndex);
    setIsExecuting(false);
  };

  const applyTemplate = useCallback((template: WorkflowTemplate) => {
    let idCounter = 1;
    const newSteps: Step[] = template.steps.map((key: string) => ({
      id: idCounter++,
      nameKey: key,
      icon: ICON_MAP[key] || ICON_MAP.quality,
      status: 'idle',
      output: '',
    }));
    
    setSteps(newSteps);
    if (template.defaultContext) {
      setSeed(template.defaultContext);
    }
    setCurrentStepIndex(-1);
    setIsExecuting(false);
    addEvent('user-edit', undefined, { action: 'apply-template', templateId: template.id });
    showNotification(lang === 'ar' ? `تم تطبيق قالب: ${template.name.ar}` : `Template applied: ${template.name.en}`, 'info');
  }, [lang, showNotification, addEvent]);

  return {
    steps,
    seed,
    setSeed,
    autoAdvance,
    setAutoAdvance,
    isExecuting,
    setIsExecuting,
    currentStepIndex,
    setCurrentStepIndex,
    resetMatrix,
    launchMatrix,
    approveAndNext,
    handleOutputChange,
    deployBlueprint,
    plugins,
    setPlugins,
    formattingPreset,
    setFormattingPreset: handleSetFormattingPreset,
    events,
    applyTemplate,
    themeGlow,
    setThemeGlow,
  };
}
