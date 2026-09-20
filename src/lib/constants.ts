import { 
  Search, 
  Users2, 
  FileSignature, 
  ImageIcon, 
  Coins, 
  ShieldCheck, 
  Zap, 
  Target 
} from 'lucide-react';
import { WorkflowStepDefinition, WorkflowTemplate, AppSetting } from '../types';

export const WORKFLOW_STEPS: WorkflowStepDefinition[] = [
  { id: 'strategic', nameKey: 'strategic', order: 1 },
  { id: 'competitor', nameKey: 'competitor', order: 2 },
  { id: 'copywriting', nameKey: 'copywriting', order: 3 },
  { id: 'visual', nameKey: 'visual', order: 4 },
  { id: 'financial', nameKey: 'financial', order: 5 },
  { id: 'quality', nameKey: 'quality', order: 6 },
];

export const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  {
    id: 'standard',
    name: { ar: 'السلسلة القياسية', en: 'Standard Pipeline' },
    description: { ar: 'المسار الكلاسيكي المكون من 4 مراحل أساسية.', en: 'The classic 4-stage core workflow.' },
    steps: ['strategic', 'copywriting', 'visual', 'quality'],
  },
  {
    id: 'full-cycle',
    name: { ar: 'دورة كاملة (Premium)', en: 'Full Cycle (Premium)' },
    description: { ar: 'تحليل شامل ومحتوى وتصميم وجودة مع تحليل المنافسين والتكاليف.', en: 'Complete analysis, copy, design, and quality audit with competitors and financials.' },
    steps: ['strategic', 'competitor', 'copywriting', 'visual', 'financial', 'quality'],
  },
  {
    id: 'quick-content',
    name: { ar: 'محتوى سريع', en: 'Quick Content' },
    description: { ar: 'تركيز على النصوص والتصاميم فقط لجلسات العصف الذهني.', en: 'Focus solely on copywriting and visual design for brainstorming.' },
    steps: ['copywriting', 'visual'],
  }
];

export const APP_SETTINGS: AppSetting[] = [
  {
    key: 'autoAdvance',
    label: { ar: 'التقديم التلقائي', en: 'Auto Advance' },
    type: 'boolean',
    defaultValue: false
  },
  {
    key: 'themeGlow',
    label: { ar: 'توهج الواجهة (Glow)', en: 'Interface Glow' },
    type: 'boolean',
    defaultValue: true
  }
];

export const ICON_MAP: Record<string, any> = {
  strategic: Search,
  competitor: Users2,
  copywriting: FileSignature,
  visual: ImageIcon,
  financial: Coins,
  quality: ShieldCheck,
  zap: Zap,
  target: Target
};
