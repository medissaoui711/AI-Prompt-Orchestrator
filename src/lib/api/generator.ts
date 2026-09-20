import { Lang, Step } from '../../types';

/**
 * Generates unique custom AI content matching the seed text beautifully in EN or AR.
 * Calls our secure server-side Express endpoint to interface with Gemini.
 */
export const generateStepOutput = async (
  nameKey: 'strategic' | 'copywriting' | 'visual' | 'quality' | 'competitor' | 'financial',
  seedText: string,
  lang: Lang,
  previousSteps?: Step[],
  formattingPreset?: string,
  userApiKey?: string
): Promise<string> => {
  const response = await fetch('/api/run-step', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      nameKey,
      seedText,
      lang,
      formattingPreset,
      userApiKey,
      previousSteps: previousSteps?.map(s => ({
        id: s.id,
        nameKey: s.nameKey,
        status: s.status,
        output: s.output
      }))
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    let parsedError = errorText;
    try {
      const parsed = JSON.parse(errorText);
      parsedError = parsed.error || errorText;
    } catch {
      // Not JSON, use raw text
    }
    throw new Error(parsedError || 'Failed to run step on server');
  }

  const data = await response.json();
  return data.output;
};
