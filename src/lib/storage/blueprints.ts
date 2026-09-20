import { Blueprint, Lang } from '../../types';

const STORAGE_KEYS = {
  BLUEPRINTS: 'orchestrator_blueprints',
  LANGUAGE: 'orchestrator_lang',
};

export const storage = {
  getBlueprints(): Blueprint[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BLUEPRINTS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to parse blueprints from localStorage', e);
      return [];
    }
  },

  saveBlueprints(blueprints: Blueprint[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.BLUEPRINTS, JSON.stringify(blueprints));
    } catch (e) {
      console.error('Failed to save blueprints to localStorage', e);
    }
  },

  getLanguage(fallback: Lang = 'ar'): Lang {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LANGUAGE) as Lang;
      if (data === 'en' || data === 'ar') {
        return data;
      }
      return fallback;
    } catch (e) {
      return fallback;
    }
  },

  saveLanguage(lang: Lang): void {
    try {
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
    } catch (e) {
      console.error('Failed to save language to localStorage', e);
    }
  }
};
