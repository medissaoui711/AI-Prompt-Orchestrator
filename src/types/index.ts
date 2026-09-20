import React from 'react';

export type StepStatus = 'idle' | 'loading' | 'completed' | 'pending_approval' | 'error';
export type Lang = 'en' | 'ar';

export interface Step {
  id: number;
  nameKey: string;
  icon: any;
  status: StepStatus;
  output: string;
}

export interface WorkflowStepDefinition {
  id: string;
  nameKey: string;
  order: number;
}

export interface WorkflowTemplate {
  id: string;
  name: { ar: string; en: string };
  description: { ar: string; en: string };
  steps: string[];
  defaultContext?: string;
}

export interface AppEvent {
  id: string;
  type: 'step-start' | 'step-end' | 'user-edit' | 'blueprint-save' | 'system-init' | 'error';
  stepId?: string | number;
  timestamp: number;
  payload?: any;
}

export interface AppSetting {
  key: string;
  label: { ar: string; en: string };
  type: 'boolean' | 'select' | 'text';
  defaultValue: any;
  options?: { value: any; label: { ar: string; en: string } }[];
}

export interface Blueprint {
  id: string;
  name: string;
  timestamp: string;
  seed: string;
  steps: { id: number; nameKey: string; output: string; status: StepStatus }[];
  lang: Lang;
}
