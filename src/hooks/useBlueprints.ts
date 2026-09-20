import React, { useState, useEffect } from 'react';
import { Blueprint, Lang, Step } from '../types';
import { storage } from '../lib/storage/blueprints';
import { TRANSLATIONS } from '../lib/i18n/translations';

export function useBlueprints(
  lang: Lang,
  seed: string,
  steps: Step[],
  onDeploy: (blueprint: Blueprint) => void,
  showNotification: (message: string, type?: 'success' | 'error' | 'info') => void
) {
  const [blueprints, setBlueprints] = useState<Blueprint[]>([]);

  useEffect(() => {
    setBlueprints(storage.getBlueprints());
  }, []);

  const handleSaveBlueprint = () => {
    const isAnyOutput = steps.some((s) => s.output !== '');
    if (!isAnyOutput) {
      showNotification(TRANSLATIONS[lang].msgRunStepFirst, 'info');
      return;
    }

    const name = prompt(
      TRANSLATIONS[lang].promptBpName,
      `Sequence Snapshot #${blueprints.length + 1}`
    );
    if (!name) return;

    const newBlueprint: Blueprint = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
      name: name,
      timestamp:
        new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) +
        ' ' +
        new Date().toLocaleDateString(),
      seed: seed,
      steps: steps.map((s) => ({ id: s.id, nameKey: s.nameKey, output: s.output, status: s.status })),
      lang: lang,
    };

    const updated = [newBlueprint, ...blueprints];
    setBlueprints(updated);
    storage.saveBlueprints(updated);
    showNotification(TRANSLATIONS[lang].msgBpSaved.replace('{name}', name));
  };

  const handleDeployBlueprint = (blueprint: Blueprint) => {
    onDeploy(blueprint);
    showNotification(TRANSLATIONS[lang].msgBpDeployed.replace('{name}', blueprint.name));
  };

  const handleRemoveBlueprint = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = blueprints.filter((b) => b.id !== id);
    setBlueprints(updated);
    storage.saveBlueprints(updated);
    showNotification(TRANSLATIONS[lang].msgBpRemoved);
  };

  const handleRenameBlueprint = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const bp = blueprints.find((b) => b.id === id);
    if (!bp) return;

    const newName = prompt(TRANSLATIONS[lang].promptRename, bp.name);
    if (!newName || newName.trim() === '') return;

    const updated = blueprints.map((b) => {
      if (b.id === id) {
        return { ...b, name: newName.trim() };
      }
      return b;
    });

    setBlueprints(updated);
    storage.saveBlueprints(updated);
    showNotification(TRANSLATIONS[lang].msgBpRenamed.replace('{name}', newName.trim()));
  };

  const handleExportBlueprint = (blueprint: Blueprint, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(blueprint, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `blueprint-${blueprint.name.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'config'}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showNotification(TRANSLATIONS[lang].msgBpExported);
    } catch (err) {
      showNotification(lang === 'ar' ? 'حدث خطأ أثناء تصدير المخطط' : 'Error exporting blueprint', 'error');
    }
  };

  const handleImportBlueprint = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonText = event.target?.result as string;
        const parsed = JSON.parse(jsonText);
        
        // Validate JSON structure
        if (!parsed || typeof parsed.name !== 'string' || typeof parsed.seed !== 'string' || !Array.isArray(parsed.steps)) {
          showNotification(TRANSLATIONS[lang].msgBpImportFailed, 'error');
          return;
        }

        const validatedSteps = parsed.steps.map((s: any, idx: number) => {
          return {
            id: typeof s.id === 'number' ? s.id : idx + 1,
            nameKey: s.nameKey || 'strategic',
            output: typeof s.output === 'string' ? s.output : '',
            status: s.status || 'idle'
          };
        });

        const importedBlueprint: Blueprint = {
          id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
          name: parsed.name.endsWith('(Imported)') || parsed.name.endsWith('(مستورد)') 
            ? parsed.name 
            : `${parsed.name} ${lang === 'ar' ? '(مستورد)' : '(Imported)'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString(),
          seed: parsed.seed,
          steps: validatedSteps,
          lang: parsed.lang || lang,
        };

        const updated = [importedBlueprint, ...blueprints];
        setBlueprints(updated);
        storage.saveBlueprints(updated);
        showNotification(TRANSLATIONS[lang].msgBpImported.replace('{name}', importedBlueprint.name));
      } catch (err) {
        showNotification(TRANSLATIONS[lang].msgBpImportFailed, 'error');
      }
    };
    reader.readAsText(file);
  };

  return {
    blueprints,
    handleSaveBlueprint,
    handleDeployBlueprint,
    handleRemoveBlueprint,
    handleRenameBlueprint,
    handleExportBlueprint,
    handleImportBlueprint,
  };
}
