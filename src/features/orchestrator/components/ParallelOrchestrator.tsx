import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Users2, 
  Coins,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  LayoutDashboard,
  Boxes,
  Database,
  Sliders,
  Zap,
  X,
  ShieldCheck,
  FileText,
  HelpCircle,
  MessageSquare,
  Send
} from 'lucide-react';

import { Lang, Step, AppEvent } from '../../../types';
import { TRANSLATIONS } from '../../../lib/i18n/translations';
import { WORKFLOW_TEMPLATES, APP_SETTINGS } from '../../../lib/constants';
import { storage } from '../../../lib/storage/blueprints';
import { useOrchestratorState } from '../../../hooks/useOrchestratorState';
import { useBlueprints } from '../../../hooks/useBlueprints';
import { StepNode } from './StepNode';
import { BlueprintLibrary } from '../../blueprints/components/BlueprintLibrary';

// High-fidelity local translations for the sidebar and interactive options
const LOCAL_TRANSLATIONS = {
  ar: {
    sidebarDashboard: 'لوحة التحكم',
    sidebarProgress: 'مستوى التقدم',
    sidebarWorkflow: 'خطوات السلسلة',
    sidebarBlueprints: 'مكتبة المخططات',
    sidebarSettings: 'إعدادات النظام',
    settingsTitle: 'إعدادات النظام الذكي',
    settingsDesc: 'تحكم في تفاصيل ووحدات السلسلة والنمط العام ومستويات النشر التلقائي ومقاييس البث.',
    collapseSidebar: 'طي القائمة',
    expandSidebar: 'توسيع القائمة',
    close: 'إغلاق',
    activePlugins: 'الوحدات النشطة',
    language: 'اللغة الحالية',
    quickActions: 'إجراءات سريعة وبدائل',
    saveBpShortcut: 'حفظ المخطط الحالي',
    importBpShortcut: 'استيراد مخطط JSON',
    resetMatrixShortcut: 'إعادة تهيئة السلسلة',
    tooltipSettings: 'إعدادات النظام والروابط',
    tooltipCollapse: 'طي القائمة الجانبية',
    tooltipExpand: 'توسيع القائمة الجانبية',
    
    // New Translations
    menuPrivacy: 'سياسة الخصوصية',
    menuTerms: 'شروط الاستخدام',
    menuFaqs: 'الأسئلة الشائعة',
    menuContact: 'اتصل بنا والدعم',
    menuSettings: 'إعدادات النظام',
    contactName: 'الاسم الكامل',
    contactEmail: 'البريد الإلكتروني',
    contactSubject: 'الموضوع',
    contactMessage: 'نص الرسالة',
    contactSubmit: 'إرسال الرسالة',
    contactSuccess: 'تم إرسال رسالتك بنجاح! سيتواصل معك فريق الدعم قريباً.',
    contactSending: 'جاري الإرسال...',
    faqQ1: 'ما هو منسق الذكاء الاصطناعي المتوازي؟',
    faqA1: 'هو نظام ذكي يتيح لك تنفيذ سلاسل من مطالبات الذكاء الاصطناعي (Prompts) بشكل متتابع أو متوازي لإنشاء مخرجات متكاملة للمشاريع.',
    faqQ2: 'كيف تعمل الوحدات الإضافية (Plugins)؟',
    faqA2: 'تضيف الوحدات الإضافية مثل تحليل المنافسين ومخمن التكاليف المالية طبقات ذكاء وتحليل متخصصة لخطوات التنسيق تلقائياً.',
    faqQ3: 'أين يتم حفظ المخططات (Blueprints)؟',
    faqA3: 'يتم تشفير وحفظ المخططات بالكامل في الذاكرة المحلية لمتصفحك، مع إمكانية تصديرها واستيرادها كملفات JSON بأي وقت.',
    privacyTitle: 'سياسة الخصوصية وحماية البيانات',
    privacyText: 'نحن نلتزم بحماية خصوصيتك وأمان بياناتك بالكامل. تتم معالجة جميع المطالبات ومدخلات النظام بأمان عبر خوادمنا السحابية المشفرة، ويتم تخزين المخططات والبيانات محلياً في متصفحك. لا نشارك بياناتك أو مطالباتك مع أي جهات خارجية.',
    termsTitle: 'شروط الخدمة والاستخدام',
    termsText: 'باستخدامك لمنسق الذكاء الاصطناعي، فإنك توافق على الالتزام بشروط الاستخدام المعيارية لخدمات Google Cloud وذراع الذكاء الاصطناعي. يُحظر استخدام النظام لتوليد محتوى ضار أو انتهاك حقوق الملكية الفكرية. يُرجى الالتزام بحدود الاستهلاك اليومية المحددة للخدمة.'
  },
  en: {
    sidebarDashboard: 'Dashboard',
    sidebarProgress: 'Progress Tracker',
    sidebarWorkflow: 'Workflow Steps',
    sidebarBlueprints: 'Saved Blueprints',
    sidebarSettings: 'System Settings',
    settingsTitle: 'System Settings',
    settingsDesc: 'Configure active plugins, formatting presets, automation parameters, and backup snapshots.',
    collapseSidebar: 'Collapse Menu',
    expandSidebar: 'Expand Menu',
    close: 'Close',
    activePlugins: 'Active Plugins',
    language: 'System Language',
    quickActions: 'Quick Actions & Controls',
    saveBpShortcut: 'Save Blueprint',
    importBpShortcut: 'Import JSON Blueprint',
    resetMatrixShortcut: 'Reset Pipeline',
    tooltipSettings: 'System Settings & Links',
    tooltipCollapse: 'Collapse Sidebar',
    tooltipExpand: 'Expand Sidebar',
    
    // New Translations
    menuPrivacy: 'Privacy Policy',
    menuTerms: 'Terms of Use',
    menuFaqs: 'FAQs & Help',
    menuContact: 'Contact & Support',
    menuSettings: 'System Settings',
    contactName: 'Full Name',
    contactEmail: 'Email Address',
    contactSubject: 'Subject',
    contactMessage: 'Message',
    contactSubmit: 'Submit Message',
    contactSuccess: 'Your message has been sent successfully! Support will contact you shortly.',
    contactSending: 'Sending...',
    faqQ1: 'What is the Parallel AI Orchestrator?',
    faqA1: 'It is an advanced platform that runs sequences of AI prompts sequentially or in parallel to construct highly complex, professional outputs.',
    faqQ2: 'How do Active Plugins function?',
    faqA2: 'Plugins like Competitor Analysis or Financial Estimator inject specialized analysis layers and calculations into your orchestration pipeline.',
    faqQ3: 'Where are my Blueprints saved?',
    faqA3: 'All blueprints and templates are safely encrypted and preserved locally within your browser sandbox, and can be exported as JSON.',
    privacyTitle: 'Privacy Policy & Data Shield',
    privacyText: 'We take your data security seriously. All prompts, inputs, and configurations are securely processed through encrypted APIs. No personal data or generated outputs are shared with third parties or used for external model training. Your data remains strictly yours.',
    termsTitle: 'Terms of Service',
    termsText: 'By utilizing the AI Prompt Orchestrator, you agree to comply with standard service guidelines and rate limits. The system must not be used to produce malicious, copyrighted, or inappropriate content. Abuse of automated triggers may result in temporary cooling-off limits.'
  }
};

export const ParallelOrchestrator: React.FC = () => {
  const [lang, setLang] = useState<Lang>('ar'); // Default to Arabic as requested
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Custom API Key state pre-populated with user's provided key
  const [customApiKey, setCustomApiKey] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('custom_gemini_api_key');
      if (!saved) {
        localStorage.setItem('custom_gemini_api_key', 'AIzaSyDhrQtwu9NauboZNZ5XJ6I103Q1PfVaQZ4');
        return 'AIzaSyDhrQtwu9NauboZNZ5XJ6I103Q1PfVaQZ4';
      }
      return saved;
    } catch {
      return 'AIzaSyDhrQtwu9NauboZNZ5XJ6I103Q1PfVaQZ4';
    }
  });

  // Sidebar collapsible state (persisted in local storage)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('orchestrator_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  // System settings drawer state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Report download dropdown state
  const [isReportDropdownOpen, setIsReportDropdownOpen] = useState(false);

  // Interactive modal active state
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | 'faqs' | 'contact' | null>(null);

  // Contact & Support Form interactive fields state
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [contactSending, setContactSending] = useState(false);

  // Interactive FAQs accordion active item
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(null);

  // Active section to highlight in the sidebar
  const [activeSection, setActiveSection] = useState('home');

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000); // Premium fixed duration (4 seconds)
  };

  // State hook for all execution state, stages and step progressions
  const {
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
    setFormattingPreset,
    events,
    applyTemplate,
    themeGlow,
    setThemeGlow,
  } = useOrchestratorState(lang, setLang, showNotification);

  // Hook for library snapshots and backups in localStorage
  const {
    blueprints,
    handleSaveBlueprint,
    handleDeployBlueprint,
    handleRemoveBlueprint,
    handleRenameBlueprint,
    handleExportBlueprint,
    handleImportBlueprint,
  } = useBlueprints(lang, seed, steps, deployBlueprint, showNotification);

  // Calculate pipeline progress percentage based on dynamic step states
  const totalSteps = steps.length;
  const completedCount = steps.filter((s) => s.status === 'completed').length;
  const pendingApprovalCount = steps.filter((s) => s.status === 'pending_approval').length;
  const loadingCount = steps.filter((s) => s.status === 'loading').length;

  const progressPercent = totalSteps > 0 
    ? Math.min(
        100,
        Math.round(((completedCount * 1.0 + pendingApprovalCount * 0.8 + loadingCount * 0.4) / totalSteps) * 100)
      )
    : 0;

  const hasProgress = progressPercent > 0;

  // Load saved language preference on mount
  useEffect(() => {
    const savedLang = storage.getLanguage('ar');
    setLang(savedLang);
  }, []);

  // Handle outside click for dropdowns
  useEffect(() => {
    if (!isReportDropdownOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      if (isReportDropdownOpen && !target.closest('.report-dropdown-trigger') && !target.closest('.report-dropdown-container')) {
        setIsReportDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isReportDropdownOpen]);

  const toggleLanguage = () => {
    const nextLang = lang === 'en' ? 'ar' : 'en';
    setLang(nextLang);
    storage.saveLanguage(nextLang);
    
    showNotification(
      nextLang === 'en' ? 'Language switched to English' : 'تم تغيير اللغة إلى العربية',
      'info'
    );
  };

  const parseMarkdownToHtml = (markdown: string): string => {
    if (!markdown) return '';
    const lines = markdown.split('\n');
    const processedLines = lines.map(line => {
      let processed = line.trim();
      
      if (processed.startsWith('### ')) {
        return `<h4 style="color: #1E3A8A; font-size: 15px; font-weight: 700; margin-top: 18px; margin-bottom: 8px;">${processed.slice(4)}</h4>`;
      }
      if (processed.startsWith('## ')) {
        return `<h3 style="color: #1E3A8A; font-size: 17px; font-weight: 700; margin-top: 22px; margin-bottom: 10px; border-bottom: 1px dashed #BFDBFE; padding-bottom: 4px;">${processed.slice(3)}</h3>`;
      }
      if (processed.startsWith('# ')) {
        return `<h2 style="color: #1E3A8A; font-size: 19px; font-weight: 800; margin-top: 24px; margin-bottom: 12px; border-bottom: 1px solid #93C5FD; padding-bottom: 6px;">${processed.slice(2)}</h2>`;
      }
      
      processed = processed.replace(/\*\*(.*?)\*\//g, '<strong>$1</strong>');
      processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      processed = processed.replace(/\*(.*?)\*/g, '<em>$1</em>');
      processed = processed.replace(/`(.*?)`/g, '<code style="background-color: #F1F5F9; color: #0F172A; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">$1</code>');
      
      if (processed.startsWith('- ') || processed.startsWith('* ') || processed.startsWith('• ')) {
        return `<li style="margin-bottom: 6px; padding-left: 4px; padding-right: 4px;">${processed.slice(2)}</li>`;
      }
      
      if (processed === '') {
        return '<div style="height: 10px;"></div>';
      }
      
      return `<p style="margin: 0 0 10px 0; line-height: 1.75;">${processed}</p>`;
    });

    let finalHtml = '';
    let isInsideUl = false;
    
    for (const item of processedLines) {
      if (item.startsWith('<li')) {
        if (!isInsideUl) {
          finalHtml += '<ul style="margin: 8px 0; padding-left: 20px; padding-right: 20px; list-style-type: disc;">';
          isInsideUl = true;
        }
        finalHtml += item;
      } else {
        if (isInsideUl) {
          finalHtml += '</ul>';
          isInsideUl = false;
        }
        finalHtml += item;
      }
    }
    
    if (isInsideUl) {
      finalHtml += '</ul>';
    }
    
    return finalHtml;
  };

  const exportReportAsPDF = () => {
    const stepsWithOutput = steps.filter(s => s.output);
    if (stepsWithOutput.length === 0) {
      showNotification(
        lang === 'ar' ? 'لا توجد تقارير منشأة لتصديرها بعد. يرجى البدء أولاً.' : 'No generated reports available to export yet. Please run some steps first.',
        'error'
      );
      return;
    }

    showNotification(
      lang === 'ar' ? 'جاري تحضير التقرير الفني الشامل والتصدير لـ PDF...' : 'Preparing comprehensive report for PDF export...',
      'info'
    );

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.width = '0px';
    iframe.style.height = '0px';
    iframe.style.border = 'none';
    iframe.style.bottom = '0px';
    iframe.style.right = '0px';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (!doc) {
      showNotification(lang === 'ar' ? 'فشل بدء محرّك التصدير.' : 'Failed to initialize exporting engine.', 'error');
      return;
    }

    const stepsHtml = stepsWithOutput.map(step => {
      const stepName = TRANSLATIONS[lang][`${step.nameKey}Name` as keyof typeof TRANSLATIONS['en']] || step.nameKey;
      const stepDesc = TRANSLATIONS[lang][`${step.nameKey}Desc` as keyof typeof TRANSLATIONS['en']] || '';
      const formattedOutput = parseMarkdownToHtml(step.output);

      return `
        <div class="step-card">
          <div class="step-header">
            <h2 class="step-title">${stepName}</h2>
            <span class="step-phase">${lang === 'ar' ? 'المرحلة' : 'Phase'} ${step.id}</span>
          </div>
          <p class="step-desc">${stepDesc}</p>
          <div class="step-content">${formattedOutput}</div>
        </div>
      `;
    }).join('');

    const activePluginsNames = [];
    if (plugins.competitor) activePluginsNames.push(lang === 'ar' ? 'تحليل المنافسين' : 'Competitor Analysis');
    if (plugins.financial) activePluginsNames.push(lang === 'ar' ? 'المخمن المالي' : 'Financial Estimator');
    const pluginsStr = activePluginsNames.length > 0 ? activePluginsNames.join('، ') : (lang === 'ar' ? 'لا يوجد' : 'None');

    const presetLabels: Record<string, string> = {
      default: lang === 'ar' ? 'افتراضي متوازن' : 'Balanced Default',
      social: lang === 'ar' ? 'منشورات شبكات اجتماعية' : 'Social Media Snippets',
      academic: lang === 'ar' ? 'أكاديمي تحليلي دقيق' : 'Detailed Academic',
      technical: lang === 'ar' ? 'تقني ومواصفات عميقة' : 'Deep Technical Spec',
      executive: lang === 'ar' ? 'ملخص تنفيذي للمشروع' : 'Executive Pitch Summary'
    };

    const formattedPreset = presetLabels[formattingPreset] || formattingPreset;

    const htmlContent = `
      <!DOCTYPE html>
      <html dir="${isRtl ? 'rtl' : 'ltr'}" lang="${lang}">
      <head>
        <meta charset="utf-8">
        <title>${isRtl ? 'تقرير السلسلة الشامل والنهائي' : 'AI Orchestrator - Comprehensive Report'}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Inter:wght@400;500;600;700;800&display=swap');
          
          * {
            box-sizing: border-box;
          }
          
          body {
            font-family: ${isRtl ? "'Cairo', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" : "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"};
            color: #0F172A;
            background-color: #FFFFFF;
            margin: 0;
            padding: 40px;
            line-height: 1.625;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .header {
            border-bottom: 3px solid #3B82F6;
            padding-bottom: 24px;
            margin-bottom: 32px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
          }

          .header-main {
            flex: 1;
          }

          .brand-badge {
            display: inline-block;
            background-color: #EFF6FF;
            color: #2563EB;
            font-size: 10px;
            font-weight: 800;
            letter-spacing: 0.05em;
            text-transform: uppercase;
            padding: 4px 10px;
            border-radius: 6px;
            margin-bottom: 8px;
            border: 1px solid #DBEAFE;
          }

          .title {
            font-size: 26px;
            font-weight: 800;
            color: #1E3A8A;
            margin: 0;
            line-height: 1.25;
          }

          .subtitle {
            font-size: 13px;
            color: #64748B;
            margin-top: 6px;
            font-weight: 500;
          }

          .date-badge {
            font-size: 11px;
            color: #475569;
            background-color: #F1F5F9;
            padding: 6px 12px;
            border-radius: 8px;
            font-weight: 600;
            white-space: nowrap;
          }

          .meta-container {
            background-color: #F8FAFC;
            border: 1px solid #E2E8F0;
            border-radius: 16px;
            padding: 20px;
            margin-bottom: 32px;
          }

          .meta-title {
            font-size: 12px;
            font-weight: 800;
            color: #475569;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-top: 0;
            margin-bottom: 12px;
            border-bottom: 1px solid #E2E8F0;
            padding-bottom: 6px;
          }

          .meta-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }

          .meta-item {
            display: flex;
            flex-direction: column;
          }

          .meta-label {
            font-weight: 700;
            color: #64748B;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.025em;
          }

          .meta-value {
            color: #0F172A;
            font-size: 13px;
            margin-top: 3px;
            font-weight: 600;
          }

          .seed-card {
            background-color: #F0F7FF;
            border: 1px solid #BFDBFE;
            border-left: 5px solid #3B82F6;
            border-right: ${isRtl ? '5px solid #3B82F6' : '1px solid #BFDBFE'};
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 35px;
          }

          .seed-title {
            font-weight: 800;
            font-size: 13px;
            color: #1E40AF;
            margin-top: 0;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.025em;
          }

          .seed-text {
            font-size: 13.5px;
            color: #1E3A8A;
            margin: 0;
            white-space: pre-wrap;
            line-height: 1.6;
          }

          .step-card {
            background: #FFFFFF;
            border: 1px solid #E2E8F0;
            border-radius: 16px;
            padding: 28px;
            margin-bottom: 28px;
            page-break-inside: avoid;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.01);
          }

          .step-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #F1F5F9;
            padding-bottom: 14px;
            margin-bottom: 14px;
          }

          .step-title {
            font-size: 19px;
            font-weight: 800;
            color: #0F172A;
            margin: 0;
          }

          .step-phase {
            font-size: 11px;
            background-color: #EFF6FF;
            color: #2563EB;
            border: 1px solid #DBEAFE;
            padding: 4px 10px;
            border-radius: 6px;
            font-weight: 700;
            letter-spacing: 0.025em;
          }

          .step-desc {
            font-size: 12px;
            color: #64748B;
            margin-top: 0;
            margin-bottom: 16px;
            font-style: italic;
          }

          .step-content {
            font-size: 13.5px;
            color: #334155;
            white-space: pre-wrap;
            line-height: 1.75;
          }

          .footer {
            text-align: center;
            margin-top: 60px;
            border-top: 1px solid #E2E8F0;
            padding-top: 20px;
            font-size: 11px;
            color: #94A3B8;
            font-weight: 500;
          }

          @media print {
            body {
              padding: 0;
              margin: 1.5cm;
            }
            .step-card {
              border: 1px solid #E2E8F0;
              box-shadow: none;
              page-break-inside: avoid;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="header-main">
            <span class="brand-badge">${isRtl ? 'منصة التنسيق الذكية' : 'Intelligent AI Orchestration'}</span>
            <h1 class="title">${isRtl ? 'التقرير الشامل والنهائي للمشروع' : 'Comprehensive Final Project Report'}</h1>
            <p class="subtitle">${isRtl ? 'مستند مخرجات سلسلة التنسيق المترابطة والمتوازية' : 'Output document generated by the parallel AI orchestration pipeline'}</p>
          </div>
          <div class="date-badge">
            ${new Date().toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

        <div class="meta-container">
          <h3 class="meta-title">${isRtl ? 'إعدادات ومقاييس السلسلة' : 'Pipeline Specifications & Parameters'}</h3>
          <div class="meta-grid">
            <div class="meta-item">
              <span class="meta-label">${isRtl ? 'الوحدات النشطة (Plugins)' : 'Active Plugins'}</span>
              <span class="meta-value">${pluginsStr}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">${isRtl ? 'تنسيق المخرجات' : 'Output Format Preset'}</span>
              <span class="meta-value">${formattedPreset}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">${isRtl ? 'عدد الخطوات المنجزة' : 'Orchestration Stages'}</span>
              <span class="meta-value">${stepsWithOutput.length} ${isRtl ? 'خطوات مكتملة' : 'completed stages'}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">${isRtl ? 'النمط العام للذكاء' : 'AI Model Pipeline'}</span>
              <span class="meta-value">Gemini 1.5 Flash / 2.0</span>
            </div>
          </div>
        </div>

        <div class="seed-card">
          <h4 class="seed-title">${isRtl ? 'الفكرة الأساسية للمشروع (المدخل الرئيسي)' : 'Core Idea Input (Root Seed Prompt)'}</h4>
          <p class="seed-text">${seed}</p>
        </div>

        <div class="steps-container">
          ${stepsHtml}
        </div>

        <div class="footer">
          ${isRtl ? 'تم إنشاؤه وتنسيقه تلقائياً بواسطة منسق الذكاء الاصطناعي المتوازي الذكي' : 'Generated automatically by the Parallel Intelligent AI Prompt Orchestrator'}
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 500);
          };
        </script>
      </body>
      </html>
    `;

    doc.open();
    doc.write(htmlContent);
    doc.close();

    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 15000);
  };

  // Interactive Scroll Observer to sync the sidebar active indicator beautifully
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-15% 0px -55% 0px', // Focused zone in upper-middle of screen
      threshold: 0,
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    const targetSections = ['home', 'progress', 'workflow', 'blueprints'];
    
    targetSections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [steps, hasProgress]);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const isRtl = lang === 'ar';

  return (
    <div 
      dir={isRtl ? 'rtl' : 'ltr'} 
      className={`bg-[#070A13] min-h-screen text-slate-300 font-sans selection:bg-blue-500/30 flex relative overflow-x-hidden ${isRtl ? 'font-arabic' : ''}`}
    >
      {/* Dynamic Animated Background Mesh */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-mesh opacity-30" />
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`fixed top-6 right-6 left-6 md:left-auto md:w-96 z-50 flex items-center gap-3 py-3 px-5 rounded-xl shadow-2xl border transition-all duration-300 ${
              notification.type === 'success' 
                ? 'bg-[#0B1512] border-emerald-500/40 text-emerald-200 shadow-emerald-950/20' 
                : notification.type === 'error'
                ? 'bg-[#180C0C] border-red-500/40 text-red-200 shadow-red-950/20'
                : 'bg-[#0C1220] border-blue-500/40 text-blue-200 shadow-blue-950/20'
            }`}
          >
            {notification.type === 'success' && <CheckCircle2 className="text-emerald-400 shrink-0" size={18} />}
            {notification.type === 'error' && <XCircle className="text-red-400 shrink-0" size={18} />}
            {notification.type === 'info' && <AlertCircle className="text-blue-400 shrink-0" size={18} />}
            <span className="text-xs sm:text-sm font-semibold leading-relaxed">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sleek, Premium Collapsible Sidebar */}
      <aside 
        className={`fixed top-0 bottom-0 z-40 bg-[#090D1A]/95 border-slate-900/80 backdrop-blur-md shadow-2xl flex flex-col justify-between py-6 px-3.5 transition-all duration-300 ease-in-out ${
          isRtl 
            ? `right-0 border-l ${isSidebarCollapsed ? 'w-16 sm:w-20' : 'w-64'}` 
            : `left-0 border-r ${isSidebarCollapsed ? 'w-16 sm:w-20' : 'w-64'}`
        }`}
      >
        {/* Top brand & navigation links */}
        <div className="flex flex-col gap-8">
          
          {/* Brand header */}
          <div className="flex items-center justify-between gap-3 overflow-hidden">
            <div className={`flex items-center gap-3 transition-all duration-300 ${isSidebarCollapsed ? 'mx-auto' : 'px-1'}`}>
              <div 
                onClick={() => {
                  if (isSidebarCollapsed) {
                    setIsSidebarCollapsed(false);
                    localStorage.setItem('orchestrator_sidebar_collapsed', 'false');
                  }
                }}
                className={`bg-blue-600/10 border border-blue-500/20 p-2.5 rounded-xl text-blue-400 ${isSidebarCollapsed ? 'cursor-pointer hover:bg-blue-600/20 active:scale-95 transition-all' : ''}`}
              >
                <Sparkles size={18} className="animate-pulse" />
              </div>
              {!isSidebarCollapsed && (
                <div className="transition-all duration-300 whitespace-nowrap">
                  <h2 className="text-xs font-bold text-white leading-none">
                    {isRtl ? 'منسق الذكاء' : 'AI Orchestrator'}
                  </h2>
                  <span className="text-[9px] text-blue-400 font-bold tracking-widest uppercase block mt-1">
                    v1.2 ACTIVE
                  </span>
                </div>
              )}
            </div>

            {/* Sidebar close trigger for wide state */}
            {!isSidebarCollapsed && (
              <button
                onClick={() => {
                  setIsSidebarCollapsed(true);
                  localStorage.setItem('orchestrator_sidebar_collapsed', 'true');
                }}
                className="p-1.5 rounded-lg bg-[#0F1422] border border-slate-800 hover:border-slate-700 hover:text-white transition-all text-slate-400"
                title={isRtl ? LOCAL_TRANSLATIONS.ar.collapseSidebar : LOCAL_TRANSLATIONS.en.collapseSidebar}
              >
                {isRtl ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
              </button>
            )}
          </div>

          {/* Navigation Items */}
          <nav className="flex flex-col gap-1.5">
            {[
              { id: 'home', label: isRtl ? LOCAL_TRANSLATIONS.ar.sidebarDashboard : LOCAL_TRANSLATIONS.en.sidebarDashboard, icon: LayoutDashboard },
              { id: 'progress', label: isRtl ? LOCAL_TRANSLATIONS.ar.sidebarProgress : LOCAL_TRANSLATIONS.en.sidebarProgress, icon: Sliders },
              { id: 'workflow', label: isRtl ? LOCAL_TRANSLATIONS.ar.sidebarWorkflow : LOCAL_TRANSLATIONS.en.sidebarWorkflow, icon: Boxes },
              { id: 'blueprints', label: isRtl ? LOCAL_TRANSLATIONS.ar.sidebarBlueprints : LOCAL_TRANSLATIONS.en.sidebarBlueprints, icon: Database },
              { id: 'settings', label: isRtl ? LOCAL_TRANSLATIONS.ar.sidebarSettings : LOCAL_TRANSLATIONS.en.sidebarSettings, icon: Settings, action: () => setIsSettingsOpen(true) },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.action) {
                      item.action();
                    } else {
                      scrollToSection(item.id);
                    }
                  }}
                  className={`group relative flex items-center gap-3.5 py-3 px-3.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-blue-600/10 border-blue-500/30 text-blue-400 font-bold'
                      : 'text-slate-400 hover:bg-[#0F1424] hover:text-slate-200'
                  } ${isSidebarCollapsed ? 'justify-center mx-auto w-11 h-11' : 'w-full'}`}
                >
                  <Icon size={16} className={`shrink-0 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                  
                  {!isSidebarCollapsed ? (
                    <span className="truncate transition-all duration-300 whitespace-nowrap">
                      {item.label}
                    </span>
                  ) : (
                    /* Tooltip when collapsed */
                    <div className={`absolute top-1/2 -translate-y-1/2 z-50 bg-[#090D1A] border border-slate-800 text-slate-200 text-[10px] font-bold py-1.5 px-3 rounded-lg shadow-xl opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 whitespace-nowrap ${
                      isRtl ? 'right-16' : 'left-16'
                    }`}>
                      {item.label}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom controls: Manual expand option */}
        <div className="flex flex-col gap-3 relative">
          
          {/* Quick manual expand button visible only when collapsed */}
          {isSidebarCollapsed && (
            <button
              onClick={() => {
                setIsSidebarCollapsed(false);
                localStorage.setItem('orchestrator_sidebar_collapsed', 'false');
              }}
              className="p-2 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800/40 text-slate-400 hover:text-white transition-all mx-auto active:scale-95"
              title={isRtl ? LOCAL_TRANSLATIONS.ar.expandSidebar : LOCAL_TRANSLATIONS.en.expandSidebar}
            >
              {isRtl ? <ChevronLeft size={13} /> : <ChevronRight size={13} />}
            </button>
          )}
        </div>
      </aside>

      {/* Backdrop overlay for Settings drawer */}
      {isSettingsOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-all duration-300"
          onClick={() => setIsSettingsOpen(false)}
        />
      )}

      {/* System Settings Side Popover/Drawer - Slides from the right (Arabic) or left (English) */}
      <div 
        className={`fixed inset-y-0 z-50 w-80 sm:w-96 bg-[#080B14] border-slate-800/80 shadow-[0_0_50px_rgba(0,0,0,0.85)] flex flex-col p-6 transition-all duration-300 ease-in-out ${
          isRtl 
            ? `right-0 border-l ${isSettingsOpen ? 'translate-x-0' : 'translate-x-full'}` 
            : `left-0 border-r ${isSettingsOpen ? 'translate-x-0' : '-translate-x-full'}`
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-900">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl">
              <Settings size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                {isRtl ? LOCAL_TRANSLATIONS.ar.settingsTitle : LOCAL_TRANSLATIONS.en.settingsTitle}
              </h3>
              <p className="text-[10px] text-slate-500 font-semibold uppercase mt-0.5">
                {isRtl ? 'لوحة التحكم والروابط' : 'Control center & links'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="p-1.5 rounded-lg bg-[#0F1422] border border-slate-800 text-slate-400 hover:text-white transition-all active:scale-95"
          >
            <X size={15} />
          </button>
        </div>

        {/* Drawer Scrollable Body containing ALL configuration details & links */}
        <div className="flex-1 overflow-y-auto py-5 space-y-6 scrollbar-thin scrollbar-thumb-slate-800 pr-1">
          <p className="text-xs text-slate-400 leading-relaxed bg-[#0F1424]/40 border border-slate-800/30 p-3.5 rounded-xl">
            {isRtl ? LOCAL_TRANSLATIONS.ar.settingsDesc : LOCAL_TRANSLATIONS.en.settingsDesc}
          </p>

          {/* 1. Language switcher */}
          <div className="space-y-2">
            <label className="text-[10px] text-slate-500 font-bold tracking-widest uppercase block">
              {isRtl ? LOCAL_TRANSLATIONS.ar.language : LOCAL_TRANSLATIONS.en.language}
            </label>
            <div className="grid grid-cols-2 gap-2 bg-[#05070D] border border-slate-800/60 p-1.5 rounded-xl">
              <button
                onClick={() => {
                  setLang('ar');
                  storage.saveLanguage('ar');
                  showNotification('تم تغيير اللغة إلى العربية', 'info');
                }}
                className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
                  lang === 'ar' 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-900/10' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                العربية (AR)
              </button>
              <button
                onClick={() => {
                  setLang('en');
                  storage.saveLanguage('en');
                  showNotification('Language switched to English', 'info');
                }}
                className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
                  lang === 'en' 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-900/10' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                English (EN)
              </button>
            </div>
          </div>

          {/* 1.5 Custom API Key config */}
          <div className="space-y-2 pt-1">
            <label className="text-[10px] text-slate-500 font-bold tracking-widest uppercase block">
              {lang === 'ar' ? 'مفتاح API المخصص (Gemini)' : 'Custom Gemini API Key'}
            </label>
            <div className="relative">
              <input
                type="text"
                value={customApiKey}
                onChange={(e) => {
                  const val = e.target.value.trim();
                  setCustomApiKey(val);
                  localStorage.setItem('custom_gemini_api_key', val);
                }}
                className="w-full bg-[#05070D] border border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold text-slate-300 focus:outline-none focus:border-blue-500/60 transition-all text-start placeholder-slate-700"
                placeholder={lang === 'ar' ? 'أدخل مفتاح Gemini API هنا...' : 'Enter Gemini API key here...'}
              />
            </div>
            <p className="text-[9.5px] text-slate-500 leading-normal">
              {lang === 'ar' 
                ? 'تم حفظ مفتاحك الموفر بأمان محلياً في متصفحك لضمان أعلى أداء ومعالجة ذكية فورية.' 
                : 'Your custom API key is stored securely in your browser to run high-speed parallel generations.'}
            </p>
          </div>

          {/* 2. Auto advance autopilot switch */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 bg-[#0F1424]/40 border border-slate-800/40 rounded-2xl">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-200 block">
                  {TRANSLATIONS[lang].autoAdvance}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  {isRtl ? 'التدفق التلقائي دون انتظار الاعتماد' : 'Run the sequence hands-free'}
                </span>
              </div>
              <button 
                onClick={() => setAutoAdvance(!autoAdvance)} 
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all ${autoAdvance ? 'bg-blue-600' : 'bg-slate-800'}`}
                aria-label="Toggle Auto Advance inside Drawer"
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all shadow-md ${autoAdvance ? (isRtl ? '-translate-x-6' : 'translate-x-6') : 'translate-x-1'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-[#0F1424]/40 border border-slate-800/40 rounded-2xl">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-200 block">
                  {lang === 'ar' ? 'توهج الواجهة (Glow)' : 'Interface Glow FX'}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  {isRtl ? 'تفعيل التأثيرات البصرية المتوهجة' : 'Enable neon glow visual effects'}
                </span>
              </div>
              <button 
                onClick={() => setThemeGlow(!themeGlow)} 
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all ${themeGlow ? 'bg-indigo-600' : 'bg-slate-800'}`}
                aria-label="Toggle Theme Glow"
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all shadow-md ${themeGlow ? (isRtl ? '-translate-x-6' : 'translate-x-6') : 'translate-x-1'}`} />
              </button>
            </div>
          </div>

          {/* 3. Plugins Selection checkboxes */}
          <div className="space-y-3">
            <label className="text-[10px] text-slate-500 font-bold tracking-widest uppercase block">
              {isRtl ? LOCAL_TRANSLATIONS.ar.activePlugins : LOCAL_TRANSLATIONS.en.activePlugins}
            </label>
            <div className="space-y-2">
              {/* Competitor Plugin */}
              <button
                type="button"
                disabled={isExecuting}
                onClick={() => setPlugins(p => ({ ...p, competitor: !p.competitor }))}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-all ${
                  plugins.competitor
                    ? 'bg-blue-600/10 border-blue-500/30 text-blue-400'
                    : 'bg-[#080B14] border-slate-800/80 text-slate-500 hover:text-slate-400 hover:border-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Users2 size={15} />
                  <span>{TRANSLATIONS[lang].competitorName}</span>
                </div>
                <div className={`w-1.5 h-1.5 rounded-full ${plugins.competitor ? 'bg-blue-400 animate-ping' : 'bg-slate-800'}`} />
              </button>

              {/* Financial Estimator Plugin */}
              <button
                type="button"
                disabled={isExecuting}
                onClick={() => setPlugins(p => ({ ...p, financial: !p.financial }))}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-all ${
                  plugins.financial
                    ? 'bg-blue-600/10 border-blue-500/30 text-blue-400'
                    : 'bg-[#080B14] border-slate-800/80 text-slate-500 hover:text-slate-400 hover:border-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Coins size={15} />
                  <span>{TRANSLATIONS[lang].financialName}</span>
                </div>
                <div className={`w-1.5 h-1.5 rounded-full ${plugins.financial ? 'bg-blue-400 animate-ping' : 'bg-slate-800'}`} />
              </button>
            </div>
          </div>

          {/* 4. Formatting output styling presets */}
          <div className="space-y-2">
            <label className="text-[10px] text-slate-500 font-bold tracking-widest uppercase block">
              {lang === 'ar' ? 'تنسيق المخرجات (Output Format)' : 'Output Styling Preset'}
            </label>
            <div className="relative">
              <select
                disabled={isExecuting}
                value={formattingPreset}
                onChange={(e) => setFormattingPreset(e.target.value)}
                className="w-full bg-[#080B14] border border-slate-800/80 rounded-xl px-4 py-3 text-xs font-semibold text-slate-300 focus:outline-none focus:border-blue-500/60 transition-all appearance-none cursor-pointer"
              >
                <option value="default">{TRANSLATIONS[lang].presetDefault}</option>
                <option value="social">{TRANSLATIONS[lang].presetSocial}</option>
                <option value="academic">{TRANSLATIONS[lang].presetAcademic}</option>
                <option value="technical">{TRANSLATIONS[lang].presetTechnical}</option>
                <option value="executive">{TRANSLATIONS[lang].presetExecutive}</option>
              </select>
              <div className={`absolute inset-y-0 flex items-center px-4 pointer-events-none text-slate-500 ${isRtl ? 'left-0' : 'right-0'}`}>
                ▼
              </div>
            </div>
          </div>

          {/* 5. Shortcuts & Direct Actions */}
          <div className="space-y-2 pt-2 border-t border-slate-900">
            <label className="text-[10px] text-slate-500 font-bold tracking-widest uppercase block">
              {isRtl ? LOCAL_TRANSLATIONS.ar.quickActions : LOCAL_TRANSLATIONS.en.quickActions}
            </label>
            
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => {
                  exportReportAsPDF();
                  setIsSettingsOpen(false);
                }}
                className="w-full bg-[#0F1422] border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center gap-2 active:scale-95 transition-all justify-start"
              >
                <FileText size={14} className="text-blue-400" />
                <span>{isRtl ? 'تصدير التقرير النهائي (PDF)' : 'Export Final Report (PDF)'}</span>
              </button>

              <button
                onClick={() => {
                  handleSaveBlueprint();
                  setIsSettingsOpen(false);
                }}
                className="w-full bg-[#0F1422] border border-slate-800 hover:border-blue-500/30 hover:bg-blue-600/10 text-slate-300 hover:text-blue-400 text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center gap-2 active:scale-95 transition-all justify-start"
              >
                <Sparkles size={14} className="text-blue-400 animate-pulse" />
                <span>{isRtl ? LOCAL_TRANSLATIONS.ar.saveBpShortcut : LOCAL_TRANSLATIONS.en.saveBpShortcut}</span>
              </button>

              <button
                onClick={() => {
                  document.getElementById('import-blueprint-upload')?.click();
                  setIsSettingsOpen(false);
                }}
                className="w-full bg-[#0F1422] border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center gap-2 active:scale-95 transition-all justify-start"
              >
                <RotateCcw size={14} className="rotate-180 text-emerald-400" />
                <span>{isRtl ? LOCAL_TRANSLATIONS.ar.importBpShortcut : LOCAL_TRANSLATIONS.en.importBpShortcut}</span>
              </button>

              <button
                onClick={() => {
                  resetMatrix();
                  setIsSettingsOpen(false);
                }}
                className="w-full bg-[#180C0C]/40 border border-red-950/60 hover:border-red-500/40 hover:bg-red-500/10 text-red-300 hover:text-red-200 text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center gap-2 active:scale-95 transition-all justify-start"
              >
                <RotateCcw size={14} className="text-red-400" />
                <span>{isRtl ? LOCAL_TRANSLATIONS.ar.resetMatrixShortcut : LOCAL_TRANSLATIONS.en.resetMatrixShortcut}</span>
              </button>
            </div>
          </div>

          {/* 6. Legal & Support Links */}
          <div className="space-y-2 pt-2 border-t border-slate-900">
            <label className="text-[10px] text-slate-500 font-bold tracking-widest uppercase block">
              {isRtl ? 'الدعم والمعلومات القانونية' : 'Support & Legal Information'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'privacy', label: isRtl ? LOCAL_TRANSLATIONS.ar.menuPrivacy : LOCAL_TRANSLATIONS.en.menuPrivacy, icon: ShieldCheck },
                { id: 'terms', label: isRtl ? LOCAL_TRANSLATIONS.ar.menuTerms : LOCAL_TRANSLATIONS.en.menuTerms, icon: FileText },
                { id: 'faqs', label: isRtl ? LOCAL_TRANSLATIONS.ar.menuFaqs : LOCAL_TRANSLATIONS.en.menuFaqs, icon: HelpCircle },
                { id: 'contact', label: isRtl ? LOCAL_TRANSLATIONS.ar.menuContact : LOCAL_TRANSLATIONS.en.menuContact, icon: MessageSquare },
              ].map((link) => {
                const LinkIcon = link.icon;
                return (
                  <button
                    key={link.id}
                    onClick={() => {
                      setActiveModal(link.id as any);
                      setIsSettingsOpen(false);
                    }}
                    className="flex items-center gap-2 p-2 rounded-lg bg-[#0F1422] border border-slate-800/40 hover:border-slate-700 text-slate-400 hover:text-slate-200 transition-all text-start"
                  >
                    <LinkIcon size={12} className="text-blue-500/60" />
                    <span className="text-[10px] font-bold">{link.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* Main Content Pane with responsive, fluid margins reacting smoothly to sidebar folding/expanding */}
      <main 
        className={`flex-1 min-h-screen p-6 sm:p-12 transition-all duration-300 ease-in-out relative z-10 ${
          isRtl 
            ? (isSidebarCollapsed ? 'mr-16 sm:mr-20' : 'mr-16 sm:mr-64') 
            : (isSidebarCollapsed ? 'ml-16 sm:ml-20' : 'ml-16 sm:ml-64')
        }`}
      >
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto"
        >
          
          {/* Header Block */}
          <header id="home" className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10 pb-8 border-b border-slate-900 scroll-mt-24">
            <div className="flex items-center gap-4">
              <motion.div 
                whileHover={{ rotate: 15, scale: 1.1 }}
                className="bg-blue-600/10 border border-blue-500/20 p-3 rounded-2xl shadow-inner shadow-blue-500/10"
              >
                <Sparkles className="text-blue-400" size={26} />
              </motion.div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className={`text-2xl font-bold text-white tracking-tight ${themeGlow ? 'text-glow' : ''}`}>{TRANSLATIONS[lang].title}</h1>
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
                </div>
                <p className="text-[10px] text-blue-400 font-semibold tracking-widest uppercase mt-0.5">{TRANSLATIONS[lang].subtitle}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 self-stretch sm:self-auto justify-between sm:justify-start">
              {/* Auto Advance Toggle */}
              <div className="flex items-center gap-3 bg-[#0F1422] border border-slate-800/80 rounded-full py-1.5 px-4">
                <span className="text-[10px] sm:text-xs font-semibold text-slate-400 tracking-wider">{TRANSLATIONS[lang].autoAdvance}</span>
                <button 
                  onClick={() => setAutoAdvance(!autoAdvance)} 
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all ${autoAdvance ? 'bg-blue-600' : 'bg-slate-800'}`}
                  aria-label="Toggle Auto Advance"
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all shadow-md ${autoAdvance ? (isRtl ? '-translate-x-6' : 'translate-x-6') : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
          </header>

          {/* Stunning, Glowing API Status Banner */}
          {(() => {
            const isSimulationMode = !customApiKey || customApiKey === 'AIzaSyDhrQtwu9NauboZNZ5XJ6I103Q1PfVaQZ4';
            return (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setIsSettingsOpen(true)}
                className={`group cursor-pointer mb-6 p-4 rounded-2xl border shadow-lg transition-all flex items-center justify-between gap-4 ${
                  isSimulationMode
                    ? 'bg-gradient-to-r from-blue-950/20 via-[#0A0E1A]/60 to-slate-950/30 border-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.04)] hover:border-blue-500/30'
                    : 'bg-gradient-to-r from-emerald-950/25 via-[#0A1A12]/50 to-slate-950/30 border-emerald-500/15 shadow-[0_0_15px_rgba(16,185,129,0.04)] hover:border-emerald-500/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      isSimulationMode ? 'bg-blue-400' : 'bg-emerald-400'
                    }`}></span>
                    <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                      isSimulationMode ? 'bg-blue-500' : 'bg-emerald-500'
                    }`}></span>
                  </span>
                  <div className="text-xs">
                    <span className="font-bold text-slate-100 block sm:inline">
                      {isSimulationMode
                        ? (lang === 'ar' ? 'وضع المحاكاة والمعاينة الذكية' : 'Smart Simulation & Preview Mode')
                        : (lang === 'ar' ? 'مفتاح API المخصص نشط' : 'Custom API Key Active')
                      }
                    </span>
                    <span className={`text-slate-400 text-[11px] sm:mx-2 block sm:inline ${isRtl ? 'sm:before:content-["•_"]' : 'sm:before:content-["•_"]'}`}>
                      {isSimulationMode
                        ? (lang === 'ar' 
                            ? 'النظام يعمل عبر محاكي محلي عالي الدقة لتجربة المزايا مجاناً. انقر لربط مفتاحك.' 
                            : 'Running via high-fidelity local simulator for a premium free experience. Click to connect your key.')
                        : (lang === 'ar' 
                            ? 'أنت متصل الآن بخوادم Gemini باستخدام مفتاحك الموفر لتجربة توليد حية فائقة السرعة.' 
                            : 'Connected to Gemini live servers with your custom key for real-time responsiveness.')
                      }
                    </span>
                  </div>
                </div>
                <div className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg border transition-all shrink-0 ${
                  isSimulationMode
                    ? 'text-blue-400 bg-blue-500/10 border-blue-500/20 group-hover:bg-blue-500/20 group-hover:text-blue-300'
                    : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 group-hover:bg-emerald-500/20 group-hover:text-emerald-300'
                }`}>
                  {lang === 'ar' ? 'تعديل' : 'Edit'}
                </div>
              </motion.div>
            );
          })()}

          {/* Input Matrix Block */}
          <motion.section 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-[#0D111E]/60 border border-slate-800/80 rounded-3xl p-6 mb-10 shadow-xl shadow-black/20 backdrop-blur-xl"
          >
            {/* Workflow Template Selection */}
            <div className="mb-8 p-1">
              <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase block mb-4">
                {lang === 'ar' ? 'اختر سيناريو العمل (Workflow Scenarios)' : 'Select Workflow Scenario'}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {WORKFLOW_TEMPLATES.map((tpl) => (
                  <motion.button
                    key={tpl.id}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => applyTemplate(tpl)}
                    className="flex flex-col items-start text-start p-4 rounded-2xl bg-[#080B14] border border-slate-800/80 hover:border-blue-500/40 hover:bg-blue-500/5 transition-all group"
                  >
                    <div className="flex items-center justify-between w-full mb-2">
                      <span className="text-xs font-bold text-slate-200 group-hover:text-blue-400 transition-colors">
                        {lang === 'ar' ? tpl.name.ar : tpl.name.en}
                      </span>
                      <Zap size={12} className="text-slate-600 group-hover:text-yellow-500 transition-colors" />
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-2 font-medium">
                      {lang === 'ar' ? tpl.description.ar : tpl.description.en}
                    </p>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">{TRANSLATIONS[lang].seedLabel}</span>
            </div>
            <div className="relative">
              <textarea
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                dir={isRtl ? 'rtl' : 'ltr'}
                className={`w-full min-h-[120px] bg-[#080B14] border border-slate-800/80 rounded-2xl p-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/5 text-sm leading-relaxed transition-all resize-none ${
                  isRtl ? 'font-arabic [word-spacing:0.025em]' : 'font-sans tracking-wide'
                }`}
                placeholder={TRANSLATIONS[lang].seedPlaceholder}
                disabled={isExecuting}
              />
            </div>

            {/* Custom Settings: Plugins & Style Presets */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-5 border-t border-slate-900">
              {/* Plugins Selection */}
              <div>
                <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase block mb-3">
                  {lang === 'ar' ? 'الوحدات الإضافية (Plugins)' : 'Active Plugins'}
                </span>
                <div className="flex flex-wrap gap-3">
                  {/* Competitor Analysis Toggle */}
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isExecuting}
                    onClick={() => setPlugins(p => ({ ...p, competitor: !p.competitor }))}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                      plugins.competitor
                        ? 'bg-blue-600/10 border-blue-500/30 text-blue-400'
                        : 'bg-[#080B14] border-slate-800/80 text-slate-500 hover:text-slate-400 hover:border-slate-800'
                    }`}
                  >
                    <Users2 size={14} className="shrink-0" />
                    <span>{TRANSLATIONS[lang].competitorName}</span>
                  </motion.button>

                  {/* Financial Estimator Toggle */}
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isExecuting}
                    onClick={() => setPlugins(p => ({ ...p, financial: !p.financial }))}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                      plugins.financial
                        ? 'bg-blue-600/10 border-blue-500/30 text-blue-400'
                        : 'bg-[#080B14] border-slate-800/80 text-slate-500 hover:text-slate-400 hover:border-slate-800'
                    }`}
                  >
                    <Coins size={14} className="shrink-0" />
                    <span>{TRANSLATIONS[lang].financialName}</span>
                  </motion.button>
                </div>
              </div>

              {/* Output Style Preset */}
              <div>
                <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase block mb-3">
                  {lang === 'ar' ? 'تنسيق المخرجات (Output Format)' : 'Output Styling Preset'}
                </span>
                <div className="relative">
                  <select
                    disabled={isExecuting}
                    value={formattingPreset}
                    onChange={(e) => setFormattingPreset(e.target.value)}
                    className="w-full bg-[#080B14] border border-slate-800/80 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-300 focus:outline-none focus:border-blue-500/60 transition-all appearance-none cursor-pointer"
                  >
                    <option value="default">{TRANSLATIONS[lang].presetDefault}</option>
                    <option value="social">{TRANSLATIONS[lang].presetSocial}</option>
                    <option value="academic">{TRANSLATIONS[lang].presetAcademic}</option>
                    <option value="technical">{TRANSLATIONS[lang].presetTechnical}</option>
                    <option value="executive">{TRANSLATIONS[lang].presetExecutive}</option>
                  </select>
                  <div className={`absolute inset-y-0 flex items-center px-3.5 pointer-events-none text-slate-500 ${isRtl ? 'left-0' : 'right-0'}`}>
                    ▼
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-center justify-center gap-4 mt-6 pt-5 border-t border-slate-900">
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                onClick={launchMatrix} 
                disabled={isExecuting || !seed.trim()} 
                className="w-full sm:w-80 py-3.5 px-8 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold text-sm tracking-wide shadow-lg shadow-blue-900/20 active:scale-[0.98] transition-all disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-2.5"
              >
                <Sparkles size={16} /> {TRANSLATIONS[lang].launchBtn}
              </motion.button>

              <motion.button 
                whileHover={{ opacity: 0.7 }}
                onClick={resetMatrix} 
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
                disabled={isExecuting}
              >
                <RotateCcw size={12} /> {TRANSLATIONS[lang].resetBtn}
              </motion.button>
            </div>
          </motion.section>

          {/* Progress Tracker Bar */}
          <AnimatePresence>
            {hasProgress && (
              <motion.div 
                id="progress"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-[#0D111E]/30 border border-slate-900 rounded-2xl p-4 sm:p-5 mb-6 relative overflow-hidden scroll-mt-24 backdrop-blur-md"
              >
                <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-500" />
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    <span className="text-xs font-bold text-slate-300 tracking-wider uppercase">
                      {TRANSLATIONS[lang].progressLabel}
                    </span>
                  </div>
                  <span className="text-xs font-bold font-mono text-blue-400">
                    {progressPercent}%
                  </span>
                </div>
                
                <div className="w-full bg-[#080B14] rounded-full h-2.5 overflow-hidden border border-slate-950/80">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ type: "spring", bounce: 0, duration: 1 }}
                    className="bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500 h-full rounded-full shadow-[0_0_8px_rgba(59,130,246,0.4)]"
                  />
                </div>

                <div className="flex flex-wrap items-center mt-3 text-[9px] text-slate-500 font-semibold font-mono uppercase tracking-widest gap-x-4 gap-y-1">
                  <span>{lang === 'ar' ? 'البدء' : 'Start'} ➜</span>
                  {steps.map((s, idx) => {
                    const stepName = TRANSLATIONS[lang][`${s.nameKey}Name` as keyof typeof TRANSLATIONS['en']];
                    const isStepDone = s.status === 'completed';
                    return (
                      <span 
                        key={s.id} 
                        className={isStepDone ? 'text-emerald-400' : s.status === 'loading' ? 'text-blue-400 animate-pulse' : 'text-slate-500'}
                      >
                        {stepName} {idx < steps.length - 1 ? '➜' : ''}
                      </span>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Celebration Board on complete orchestration */}
          <AnimatePresence>
            {completedCount === totalSteps && totalSteps > 0 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-gradient-to-r from-emerald-950/30 via-[#0C1B14]/60 to-slate-950/40 border border-emerald-500/20 rounded-3xl p-6 mb-8 shadow-xl shadow-black/30 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden backdrop-blur-xl"
              >
                <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-emerald-500 to-teal-500" />
                <div className="space-y-1.5 text-center md:text-start">
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <span className="p-1.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-lg">
                      ✨
                    </span>
                    <h4 className="font-bold text-emerald-400 text-sm sm:text-base uppercase tracking-wider">
                      {lang === 'ar' ? 'اكتملت السلسلة الذكية بنجاح!' : 'Pipeline Completed Successfully!'}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                    {lang === 'ar' 
                      ? 'تمت معالجة جميع مراحل المشروع بنجاح باستخدام نموذج Gemini الفائق. يمكنك الآن تحميل التقرير التجميعي الشامل كملف PDF منظم وعالي التنسيق بضغطة واحدة.' 
                      : 'All project phases have been fully generated with Gemini model intelligence. You can now download the consolidated comprehensive output report in a beautifully typeset PDF.'}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Section Header */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 mt-8"
          >
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 text-glow">
                <Boxes size={18} className="text-blue-500" />
                {lang === 'ar' ? 'مسار خطوات السلسلة الذكية' : 'Intelligent Workflow Steps'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {lang === 'ar' ? 'تابع مسار التوليد المتوازي، حرر المخرجات محلياً، وصدّر التقرير الشامل.' : 'Monitor execution, modify outputs in real-time, and export the final report.'}
              </p>
            </div>
          </motion.div>

          {/* Step Flow Nodes */}
          <section className="space-y-4 mb-12 scroll-mt-24" id="workflow">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <StepNode
                  step={step}
                  index={index}
                  currentStepIndex={currentStepIndex}
                  isExecuting={isExecuting}
                  lang={lang}
                  isRtl={isRtl}
                  onStartStep={(idx) => {
                    setIsExecuting(true);
                    setCurrentStepIndex(idx);
                  }}
                  onApproveAndNext={approveAndNext}
                  onOutputChange={handleOutputChange}
                />

                {/* Modern & Professional Report Download Button - Placed after Quality Audit step */}
                {step.nameKey === 'quality' && step.output && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-center py-4"
                  >
                    <div className="relative report-dropdown-container w-full max-w-md">
                      <motion.button
                        whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(16, 185, 129, 0.4)" }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsReportDropdownOpen(!isReportDropdownOpen)}
                        className="report-dropdown-trigger w-full flex items-center justify-center gap-3 px-8 py-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-emerald-950/40 transition-all border border-emerald-400/20"
                      >
                        <div className="bg-white/20 p-2 rounded-xl">
                          <FileText size={20} />
                        </div>
                        <div className="flex flex-col items-start text-start">
                          <span className="text-[10px] opacity-80 font-bold uppercase tracking-wider">
                            {lang === 'ar' ? 'المخرجات النهائية جاهزة' : 'Final outputs ready'}
                          </span>
                          <span className="text-base">
                            {lang === 'ar' ? 'تحميل التقرير الاستراتيجي الشامل' : 'Download Comprehensive Strategic Report'}
                          </span>
                        </div>
                        <ChevronDown size={20} className={`ms-auto transition-transform duration-300 ${isReportDropdownOpen ? 'rotate-180' : ''}`} />
                      </motion.button>

                      <AnimatePresence>
                        {isReportDropdownOpen && (
                          <motion.div 
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: -5, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            className="absolute z-30 bottom-full mb-4 w-full bg-[#0F172A]/95 border border-slate-700/50 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl p-2"
                          >
                            <button
                              onClick={() => {
                                exportReportAsPDF();
                                setIsReportDropdownOpen(false);
                              }}
                              className="w-full flex items-center gap-4 px-5 py-4 text-sm font-bold text-slate-200 hover:bg-white/5 hover:text-white transition-all text-start rounded-2xl mb-1"
                            >
                              <div className="p-2.5 rounded-xl bg-red-500/10 text-red-500">
                                <FileText size={18} />
                              </div>
                              <div className="flex flex-col">
                                <span>{lang === 'ar' ? 'تصدير بصيغة PDF' : 'Export as PDF'}</span>
                                <span className="text-[10px] opacity-50 font-medium">{lang === 'ar' ? 'تنسيق سريع للمخرجات' : 'Quick format for outputs'}</span>
                              </div>
                            </button>
                            <button
                              onClick={() => {
                                exportReportAsPDF();
                                setIsReportDropdownOpen(false);
                              }}
                              className="w-full flex items-center gap-4 px-5 py-4 text-sm font-bold text-slate-200 hover:bg-white/5 hover:text-white transition-all text-start rounded-2xl"
                            >
                              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
                                <CheckCircle2 size={18} />
                              </div>
                              <div className="flex flex-col">
                                <span>{lang === 'ar' ? 'تحميل التقرير النهائي' : 'Download Final Report'}</span>
                                <span className="text-[10px] opacity-50 font-medium">{lang === 'ar' ? 'تقرير شامل ومنظم' : 'Comprehensive structured report'}</span>
                              </div>
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </React.Fragment>
            ))}
          </section>

          {/* Workflow Blueprints Persisted Shelf */}
          <div id="blueprints" className="scroll-mt-24">
            <BlueprintLibrary
              blueprints={blueprints}
              lang={lang}
              onSaveBlueprint={handleSaveBlueprint}
              onDeployBlueprint={handleDeployBlueprint}
              onRemoveBlueprint={handleRemoveBlueprint}
              onRenameBlueprint={handleRenameBlueprint}
              onExportBlueprint={handleExportBlueprint}
              onImportBlueprint={handleImportBlueprint}
            />
          </div>

          {/* Real-time Execution Log (Events) */}
          <section className="mt-12 bg-[#080B14]/40 border border-slate-900 rounded-3xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
                  <Database size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    {lang === 'ar' ? 'سجل الأحداث والعمليات الذكي' : 'Execution & Event Intelligence Log'}
                  </h3>
                  <p className="text-[10px] text-slate-500 font-medium">
                    {lang === 'ar' ? 'تتبع فوري لجميع نشاطات النظام والسلسلة' : 'Real-time tracking of system and pipeline activities'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {lang === 'ar' ? 'مباشر' : 'LIVE'}
              </div>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {events.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-xs text-slate-600 italic">
                    {lang === 'ar' ? 'بانتظار بدء العمليات لتسجيل الأحداث...' : 'Waiting for operations to start logging events...'}
                  </p>
                </div>
              ) : (
                events.map((event) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={event.id} 
                    className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/30 border border-slate-900/50 hover:border-slate-800 transition-colors"
                  >
                    <div className="text-[9px] font-mono text-slate-600 mt-0.5 shrink-0">
                      {new Date(event.timestamp).toLocaleTimeString(lang === 'ar' ? 'ar-EG' : 'en-US', { hour12: false })}
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-tighter ${
                          event.type === 'error' ? 'bg-red-500/10 text-red-400' :
                          event.type === 'step-start' ? 'bg-blue-500/10 text-blue-400' :
                          event.type === 'step-end' ? 'bg-emerald-500/10 text-emerald-400' :
                          'bg-slate-800 text-slate-400'
                        }`}>
                          {event.type}
                        </span>
                        {event.stepId && (
                          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">
                            → {event.stepId}
                          </span>
                        )}
                      </div>
                      {event.payload && (
                        <div className="text-[10px] text-slate-500 font-medium font-mono truncate max-w-lg">
                          {JSON.stringify(event.payload)}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </section>

        </motion.div>
      </main>

      {/* Interactive Modal Overlays */}
      <AnimatePresence>
        {activeModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", bounce: 0.3 }}
              className="relative w-full max-w-lg bg-[#0A0D18] border border-slate-800 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.85)] flex flex-col max-h-[85vh]"
            >
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-900">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl">
                  {activeModal === 'privacy' && <ShieldCheck size={18} />}
                  {activeModal === 'terms' && <FileText size={18} />}
                  {activeModal === 'faqs' && <HelpCircle size={18} />}
                  {activeModal === 'contact' && <MessageSquare size={18} />}
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  {activeModal === 'privacy' && LOCAL_TRANSLATIONS[lang].privacyTitle}
                  {activeModal === 'terms' && LOCAL_TRANSLATIONS[lang].termsTitle}
                  {activeModal === 'faqs' && (lang === 'ar' ? 'الأسئلة الشائعة والدعم' : 'Frequently Asked Questions')}
                  {activeModal === 'contact' && (lang === 'ar' ? 'التواصل والدعم الفني' : 'Contact & Technical Support')}
                </h3>
              </div>
              <button
                onClick={() => {
                  setActiveModal(null);
                  setFaqOpenIndex(null);
                }}
                className="p-1.5 rounded-lg bg-[#0F1422] border border-slate-800 text-slate-400 hover:text-white transition-all active:scale-95"
              >
                <X size={15} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs leading-relaxed text-slate-300">
              {activeModal === 'privacy' && (
                <div className="space-y-4">
                  <p className="font-semibold text-slate-200">
                    {LOCAL_TRANSLATIONS[lang].privacyText}
                  </p>
                  <div className="p-3 bg-[#050811] border border-slate-900 rounded-xl space-y-2">
                    <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider block">
                      {lang === 'ar' ? 'نقاط الحماية الرئيسية' : 'Key Shield Highlights'}
                    </span>
                    <ul className="list-disc list-inside space-y-1.5 text-[11px] text-slate-400">
                      <li>{lang === 'ar' ? 'تشفير كامل للبيانات محلياً (AES-256)' : 'End-to-end client-side encryption'}</li>
                      <li>{lang === 'ar' ? 'الربط المباشر ببروتوكولات الأمان السحابية' : 'Zero persistence of raw prompt templates'}</li>
                      <li>{lang === 'ar' ? 'الامتثال لمعايير الخصوصية الصارمة' : 'Fully compliant with standard cloud security frameworks'}</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeModal === 'terms' && (
                <div className="space-y-4">
                  <p className="font-semibold text-slate-200">
                    {LOCAL_TRANSLATIONS[lang].termsText}
                  </p>
                  <div className="p-3 bg-[#050811] border border-slate-900 rounded-xl space-y-2">
                    <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider block">
                      {lang === 'ar' ? 'الشروط القانونية والامتثال' : 'Legal & Compliance highlights'}
                    </span>
                    <ul className="list-disc list-inside space-y-1.5 text-[11px] text-slate-400">
                      <li>{lang === 'ar' ? 'الاستخدام للأغراض القانونية والمصرح بها فقط' : 'Authorized commercial and personal orchestration'}</li>
                      <li>{lang === 'ar' ? 'عدم إساءة استخدام خوادم المطالبات والحدود' : 'Respect API payload and prompt engineering limits'}</li>
                      <li>{lang === 'ar' ? 'حفظ المخططات محلياً يخلي مسؤوليتنا عن الفقدان' : 'Local blueprints backup is the user responsibility'}</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeModal === 'faqs' && (
                <div className="space-y-3">
                  {[
                    { q: LOCAL_TRANSLATIONS[lang].faqQ1, a: LOCAL_TRANSLATIONS[lang].faqA1 },
                    { q: LOCAL_TRANSLATIONS[lang].faqQ2, a: LOCAL_TRANSLATIONS[lang].faqA2 },
                    { q: LOCAL_TRANSLATIONS[lang].faqQ3, a: LOCAL_TRANSLATIONS[lang].faqA3 },
                  ].map((faq, idx) => {
                    const isOpen = faqOpenIndex === idx;
                    return (
                      <div 
                        key={idx} 
                        className="border border-slate-800/60 bg-[#070A12]/40 rounded-xl overflow-hidden transition-all duration-300"
                      >
                        <button
                          onClick={() => setFaqOpenIndex(isOpen ? null : idx)}
                          className="w-full flex items-center justify-between p-3.5 text-start font-bold text-slate-200 text-xs hover:bg-[#0F1424]/40 transition-colors"
                        >
                          <span>{faq.q}</span>
                          <span className="text-blue-400 font-semibold text-[10px]">
                            {isOpen ? '▲' : '▼'}
                          </span>
                        </button>
                        {isOpen && (
                          <div className="p-3.5 bg-[#04060C]/60 text-slate-400 border-t border-slate-900 text-[11px] leading-relaxed">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {activeModal === 'contact' && (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) {
                      showNotification(lang === 'ar' ? 'الرجاء ملء جميع الحقول الإلزامية' : 'Please fill all required fields', 'error');
                      return;
                    }
                    setContactSending(true);
                    setTimeout(() => {
                      setContactSending(false);
                      showNotification(LOCAL_TRANSLATIONS[lang].contactSuccess, 'success');
                      setContactForm({ name: '', email: '', subject: '', message: '' });
                      setActiveModal(null);
                    }, 1200);
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-500 font-bold block">
                        {LOCAL_TRANSLATIONS[lang].contactName} *
                      </label>
                      <input 
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full bg-[#05070D] border border-slate-800 rounded-xl p-2.5 text-xs font-semibold text-slate-200 focus:outline-none focus:border-blue-500/60 transition-all"
                        placeholder="Name"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-500 font-bold block">
                        {LOCAL_TRANSLATIONS[lang].contactEmail} *
                      </label>
                      <input 
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full bg-[#05070D] border border-slate-800 rounded-xl p-2.5 text-xs font-semibold text-slate-200 focus:outline-none focus:border-blue-500/60 transition-all text-start"
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-500 font-bold block">
                      {LOCAL_TRANSLATIONS[lang].contactSubject}
                    </label>
                    <input 
                      type="text"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-full bg-[#05070D] border border-slate-800 rounded-xl p-2.5 text-xs font-semibold text-slate-200 focus:outline-none focus:border-blue-500/60 transition-all"
                      placeholder={lang === 'ar' ? 'الموضوع' : 'Subject'}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-500 font-bold block">
                      {LOCAL_TRANSLATIONS[lang].contactMessage} *
                    </label>
                    <textarea 
                      required
                      rows={4}
                      value={contactForm.message}
                      onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                      className="w-full bg-[#05070D] border border-slate-800 rounded-xl p-2.5 text-xs font-semibold text-slate-200 focus:outline-none focus:border-blue-500/60 transition-all leading-normal"
                      placeholder={lang === 'ar' ? 'اكتب رسالتك هنا...' : 'Write your message...'}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={contactSending}
                    className="w-full py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-bold text-xs active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    {contactSending ? (
                      <span>{LOCAL_TRANSLATIONS[lang].contactSending}</span>
                    ) : (
                      <>
                        <Send size={13} />
                        <span>{LOCAL_TRANSLATIONS[lang].contactSubmit}</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
};
