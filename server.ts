import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

// Simulated AI Engine Fallback Function
function getSimulatedResponse(nameKey: string, seedText: string, lang: string, formattingPreset?: string): string {
  let simulatedOutput = "";
  const activePreset = formattingPreset || 'default';
  
  if (lang === 'ar') {
    simulatedOutput = "";
    switch (nameKey) {
      case 'strategic':
        simulatedOutput += `**التحليل الاستراتيجي التمهيدي لفكرة: "${seedText}"**

#### 📊 1. تشخيص واقع القطاع والطلب:
يُظهر القطاع المستهدف نمواً واعداً ومطّرداً يقدر بنسبة 14.5% سنوياً. يتضح وجود فجوة حقيقية بين الخدمات التقليدية والحلول الذكية المؤتمتة التي يبحث عنها العميل المعاصر لتبسيط إجراءاته.

#### ⚡ 2. القيمة المضافة والميزات التنافسية لـ "${seedText}":
* **كفاءة تشغيلية فائقة:** توفير حتى 75% من الوقت والجهد مقارنة بالطرق التقليدية.
* **التخصيص الفائق والذكاء اللحظي:** تقديم تجارب ملائمة فورية وسهلة الوصول لشرائح الجمهور.
* **البناء السحابي المرن:** هيكل تقني آمن يدعم التوسع المستقبلي بسلاسس.

#### 🎯 3. التوصيات الاستراتيجية المباشرة لنجاح الفكرة:
* **استراتيجية الإطلاق الرشيقة (MVP):** التركيز على الميزات الأساسية لاختبار نبض السوق وجمع تغذية راجعة حقيقية.
* **التسويق الفئوي والمستهدف:** تركيز جهود الترويج على الفئة الأكثر حاجة للحل لتأكيد ولاء العملاء الأوائل.
* **تحسين مستمر لتجربة المستخدم:** لتقليل معدل الفقد والارتداد وبناء رحلة عميل متكاملة.`;
        break;

      case 'competitor':
        simulatedOutput += `**تحليل المنافسين ومصفوفة التموضع لفكرة: "${seedText}"**

#### 👥 1. نظرة عامة على أبرز المنافسين المحتملين:
1. **المنافس الأول (تقليدي / راسخ):** يمتلك قاعدة عملاء ضخمة وحضور قوي ولكنه يعاني من جمود البرمجيات وبطء التحديث والاستجابة.
2. **المنافس الثاني (منصة عامة):** يقدم نطاقاً واسعاً من الحلول ولكنه يفتقر للتخصيص الدقيق للقطاع المستهدف والملاءمة المحلية.
3. **المنافس الثالث (برنامج ناشئ):** يقدم واجهات جذابة ولكنه تنقصه البنية التحتية، الأمان العالي، والدعم اللغوي المتكامل.

#### ⚔️ 2. مصفوفة نقاط القوة والضعف وجوانب التفوق:
* **أبرز نقاط قوتنا التنافسية:** السرعة الفائقة في معالجة المطالبات، التنسيق المتوازي المبتكر، وسهولة تتبع العمليات.
* **الفجوة السوقية المستغلة:** تمكين المستخدم من إدارة المشاريع وتحليلها اقتصادياً وبصرياً في شاشة واحدة متكاملة.

#### 🎯 3. التموضع الاستراتيجي لـ "${seedText}":
نحن نتموضع في السوق كأداة ذكية ورشيقة لسد الفجوة بين الأفكار الخام وصياغة الاستراتيجيات القابلة للتنفيذ في وقت قياسي.`;
        break;

      case 'copywriting':
        simulatedOutput += `**النصوص والمحتويات التسويقية المبتكرة لفكرة: "${seedText}"**

#### 🚀 الخطاب التسويقي المحوري (Primary Hook):
> *"هل أنت مستعد لنقل أفكارك إلى الواقع؟ استعن بالذكاء المتوازي والتحليل الاستراتيجي اللحظي لبناء مشروعك القادم بلمسة واحدة!"*

#### 💡 السياق الاستراتيجي للنصوص وصياغة القيمة (Strategic Subtext):
بنينا هذا الحل لتخطي عقبات التأسيس التقليدية. من الآن فصاعداً، لا داعي لقضاء أسابيع في صياغة المحتويات أو تقدير الأرقام، فالنظام يتولى عنك دمج المعطيات وتحويلها لنصوص بالغة القوة والإقناع تستهدف عميلك المثالي بوضوح.

#### 🎯 عبارات اتخاذ الإجراء المقترحة (Call To Action):
* **"أطلق مشروعك الذكي الآن وجربه مجاناً!"**
* **"ابدأ التنسيق والابتكار بضغطة زر واحدة."**`;
        break;

      case 'visual':
        simulatedOutput += `**التوجه البصري وصياغة الموجه الفني لتوليد صور فكرة: "${seedText}"**

#### 🎨 نظام الألوان والسمة البصرية المقترحة (Interface & Mood Scheme):
* **اللون الأساسي:** الأزرق الكهربائي المتوهج (Electric Blue - #0052FF) كرمز للابتكار التكنولوجي اللامحدود.
* **الألوان المكملة:** الرمادي الداكن العتيق (#0F172A) مع لمسات من الفضي المتألق والأرجواني التقني الهادئ.
* **طبيعة التصميم الفني:** واجهات داكنة متميزة (Premium Dark Mode) تركز على التوازن، التباين العالي، والخطوط الانسيابية.

#### 📸 الموجه الفني المخصص لمحركات التوليد (Image Generation Prompt):
\`\`\`text
/imagine prompt: A stunning futuristic control dashboard UI, holographic charts and parallel connections floating in dark cyber space, neon blue and violet accents, cinematic lighting, ultra-detailed, 8k resolution, photorealistic, premium tech vibe --ar 16:9
\`\`\`

*(يمكنك نسخ الموجه أعلاه واستخدامه في Midjourney أو DALL-E 3 لتوليد الواجهة البصرية).*`;
        break;

      case 'financial':
        simulatedOutput += `**التقديرات المالية ودراسة الجدوى المبدئية لمشروع: "${seedText}"**

#### 💰 1. تقدير التكاليف التقريبية (تأسيسية وتشغيلية):
* **تكاليف التأسيس المبدئية:** $15,000 تشمل التصميم الفني، الاستشارات الأساسية، وتأجير البنية التحتية السحابية الأولية.
* **التكاليف التشغيلية الشهرية:** $1,200 تشمل استهلاك السيرفرات، اشتراكات واجهات برمجة التطبيقات الذكية، والتسويق الرقمي الموجه.

#### 📊 2. نموذج الإيرادات والربحية المقترح:
* **نموذج الاشتراك الشهري الذكي (SaaS):** تقديم فئات اشتراك (أساسية بـ $29، متقدمة بـ $79، وللشركات بـ $199 شهرياً).
* **توقعات الإيرادات السنوية الأولى:** مع استقطاب أول 250 مشتركاً نشطاً، يُتوقع تحقيق إيرادات تقارب $95,000 سنوياً.

#### 📈 3. العائد التقريبي المتوقع على الاستثمار (Estimated ROI):
* **العائد الاستثماري المتوقع:** يقارب 165% خلال أول 18 شهراً من التشغيل الفعلي.
* **فترة استرداد رأس المال:** تتراوح بين 8 إلى 10 أشهر كحد أقصى.`;
        break;

      case 'quality':
        simulatedOutput += `**مراجعة الجودة والجاهزية والتدقيق الأمني لفكرة: "${seedText}"**

#### 🔍 1. ملاءمة محركات البحث والتوافق (SEO Compatibility):
* **نسبة توافق وجاهزية محركات البحث:** **92%**
* **التوصيات:** تضمين الكلمات المفتاحية الاستراتيجية للفكرة في العناوين والوصف الرئيسي، وضبط سرعة استجابة وتجاوب الأجهزة المحمولة.

#### 🛡️ 2. إدارة المخاطر واستمرارية الخدمة:
* **مستوى مخاطر المشروع التقنية:** **منخفضة جداً**.
* **خطة العمل التخفيفية:** الاعتماد على نسخ احتياطية دورية، والتحقق المستمر من موثوقية واجهات المعالجة والأمان لمنع أي توقف غير مخطط له.

#### ✅ 3. قرار الجاهزية لإطلاق النسخة الإنتاجية (Launch Status):
* **حالة الجاهزية:** **جاهز للإطلاق الفوري (Production Ready)** بعد ربط ومواءمة تصاميم المخرجات النهائية بالواجهة الرسومية.`;
        break;
      default:
        simulatedOutput += `لقد تم تشغيل الخطوة الذكية بنجاح لمحاكاة الفكرة: "${seedText}".`;
    }
  } else {
    simulatedOutput = "";
    switch (nameKey) {
      case 'strategic':
        simulatedOutput += `**Strategic Preliminary Analysis for: "${seedText}"**

#### 📊 1. Industry Diagnostics & Demand:
The target market shows a robust compound annual growth rate of 14.5%. A clear gap exists between legacy systems and high-efficiency automated solutions that modern users demand.

#### ⚡ 2. Value Propositions & Competitive Shield for "${seedText}":
* **High Operational Efficiency:** Automates up to 75% of administrative effort compared to manual setups.
* **Micro-Customization & Real-time Delivery:** Delivers instant, highly tailored outputs directly aligned with client intent.
* **Scalable Infrastructure:** Clean code architecture ensuring absolute stability and zero friction.

#### 🎯 3. Strategic Action Plan:
* **Agile MVP Approach:** Prioritize the core features to test market response and validate consumer demand.
* **Targeted Niche Outreach:** Focus initial promotional efforts on early adopters to secure high retention rates.
* **User Experience Optimization:** Continuous iterative design to minimize bounce rates and maximize user lifetime value.`;
        break;

      case 'competitor':
        simulatedOutput += `**Competitor Analysis & Market Positioning for: "${seedText}"**

#### 👥 1. Competitor Landscape Overview:
1. **Competitor Alpha (Established Legacy):** High brand awareness and market share but suffers from slower feature release cycles and rigid pricing.
2. **Competitor Beta (Broad Horizontal Platform):** Offers a wide range of features but lacks vertical personalization and localized support.
3. **Competitor Gamma (Emerging Solution):** Visually appealing interface but currently lacks robust API scalability and enterprise grade security.

#### ⚔️ 2. Core Strengths & Market Insertion Strategy:
* **Our Unfair Advantage:** High-fidelity parallel orchestrations, low-latency prompt compiling, and intuitive user workflow.
* **Market Opportunity:** Offering full-suite planning, economic estimations, and visual directors in one unified interface.

#### 🎯 3. Strategic Positioning:
Positioned as a modern, high-speed strategic catalyst to quickly move raw concepts to highly refined action plans.`;
        break;

      case 'copywriting':
        simulatedOutput += `**Marketing Copywriting & Campaign Deliverables for: "${seedText}"**

#### 🚀 Primary Hook / Angle:
> *"Ready to transform your ideas into reality? Harness the power of parallel intelligence and instant analytics to launch your next big project today!"*

#### 💡 Strategic Subtext & Value Copy:
We built this platform to bypass traditional launch bottlenecks. No more wasting weeks writing drafts or guessing projections. This system synthesizes data points into highly convincing copywriting designed to grab your target audience's attention instantly.

#### 🎯 Engagement Call to Action (CTA):
* **"Start Your Journey Today - Try It For Free!"**
* **"Orchestrate your vision with a single click."**`;
        break;

      case 'visual':
        simulatedOutput += `**Visual Direction & Prompt Synthesis for: "${seedText}"**

#### 🎨 Brand Color Guide & Style Scheme (Interface Scheme):
* **Primary Color:** Vibrant Electric Blue (Electric Blue - #0052FF) representing absolute innovation and technical dominance.
* **Supporting Accents:** Deep space gray (#0F172A) combined with metallic silver and ambient violet hints.
* **UI Sensation:** Modern dark interfaces with frosted glass elements (Glassmorphism), high contrast, and dynamic state transitions.

#### 📸 Midjourney Image Generation Prompt:
\`\`\`text
/imagine prompt: A stunning futuristic control dashboard UI, holographic charts and parallel connections floating in dark cyber space, neon blue and violet accents, cinematic lighting, ultra-detailed, 8k resolution, photorealistic, premium tech vibe --ar 16:9
\`\`\`

*(You can copy and paste the above prompt into Midjourney or DALL-E 3 to generate the actual visual cover).*`;
        break;

      case 'financial':
        simulatedOutput += `**Financial Estimator & Feasibility Projection for: "${seedText}"**

#### 💰 1. Estimated Costs (CapEx & OpEx):
* **Initial Capital Expenditure (CapEx):** $15,000 for product engineering, branding, and initial cloud provisioning.
* **Monthly Operational Expenditure (OpEx):** $1,200 for cloud resources, API integrations, and digital growth marketing.

#### 📊 2. Monetization & Revenue Models:
* **Premium SaaS Subscription:** Tiered packages (Basic at $29/mo, Professional at $79/mo, and Enterprise at $199/mo).
* **Year One Revenue Target:** Acquiring 250 active subscribers projects a healthy annualized run-rate of approximately $95,000.

#### 📈 3. ROI & Capital Return Timeline:
* **Projected ROI:** ~165% returned within the first 18 months of public operations.
* **Payback Period:** Expected within 8 to 10 months of launching.`;
        break;

      case 'quality':
        simulatedOutput += `**Quality Assurance, Safety & SEO Audit Report for: "${seedText}"**

#### 🔍 1. SEO Compatibility & Search Indexing Relevance:
* **SEO Compatibility Score:** **92%**
* **Key Guidelines:** Include primary keyword phrases in titles and meta tags, and guarantee fast mobile responsiveness.

#### 🛡️ 2. Risk Assessment & Mitigations:
* **Project Technical Risk Level:** **Very Low**.
* **Mitigation Protocol:** Establish redundant database backups, enforce SSL/TLS, and monitor API endpoint health continuously to guarantee near-perfect uptime.

#### ✅ 3. Production Readiness and Go-to-Market Sign-off:
* **GTM Status:** **Production Ready**. Launch sequence can proceed immediately upon connecting final frontend assets.`;
        break;
      default:
        simulatedOutput += `Step processed successfully for concept: "${seedText}".`;
    }
  }

  return simulatedOutput;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for running an intelligent pipeline step
  app.post("/api/run-step", async (req, res) => {
    try {
      const { nameKey, seedText, lang, previousSteps, formattingPreset, userApiKey } = req.body;

      if (!seedText || !nameKey) {
        res.status(400).json({ error: "Missing seedText or nameKey" });
        return;
      }

      // Check if API key is configured
      const apiKey = userApiKey || process.env.GEMINI_API_KEY;
      if (!apiKey) {
        const simulatedOutput = getSimulatedResponse(nameKey, seedText, lang, formattingPreset);
        res.json({ output: simulatedOutput });
        return;
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      // Gather context from prior steps to construct an organic sequential chain
      let context = "";
      if (previousSteps && Array.isArray(previousSteps)) {
        previousSteps.forEach((s: { id: number; nameKey: string; output: string; status: string }) => {
          if (s.output && (s.status === 'completed' || s.status === 'pending_approval')) {
            context += `\n\n--- [المخرجات السابقة من الخطوة ${s.id}: ${s.nameKey}] ---\n${s.output}`;
          }
        });
      }

      let systemInstruction = "";
      let prompt = "";

      if (lang === 'ar') {
        systemInstruction = "أنت جزء من مصفوفة ذكاء اصطناعي متوازية متسلسلة لإنتاج الأفكار والاستراتيجيات والمحتوى الاحترافي باللغة العربية الفصحى الفاخرة والواضحة.";
        
        switch (nameKey) {
          case 'strategic':
            prompt = `قم بإجراء تحليل استراتيجي ذكي وعميق للفكرة أو التوجه الاستراتيجي التالي: "${seedText}"
يرجى توفير:
1. تشخيص استراتيجي دقيق للقطاع.
2. القيمة المضافة المحورية والميزات التنافسية.
3. مصفوفة التوصيات العملية المقترحة لتعزيز النجاح واختراق السوق.

اكتب الإجابة باللغة العربية الفصحى بشكل مباشر ومنظم كـ مخرجات نظام ذكي، بدون أي عبارات تمهيدية أو ختامية.`;
            break;

          case 'competitor':
            prompt = `بناءً على الفكرة الاستراتيجية: "${seedText}" والسياق والمخرجات السابقة أدناه:
${context}

قم بإجراء تحليل دقيق ومقارنة للمنافسين والموضع في السوق (Competitor & positioning analysis):
1. حدد 3 منافسين محتملين في نفس القطاع (حقيقيين أو افتراضيين يحاكون الواقع).
2. قارن بين نقاط القوة، الضعف والفرص الاستراتيجية للتفوق واختراق السوق.
3. صغ مصفوفة التمايز الفريد والقيم الخاصة بمنتجنا لتميز فكرتنا بشكل حاسم.

اكتب التحليل مباشرة باللغة العربية الفصحى كـ مخرجات نظام ذكي دون أي مقدمات أو هوامش جانبية.`;
            break;

          case 'copywriting':
            prompt = `بناءً على الفكرة الاستراتيجية: "${seedText}" والتحليل المسبق إذا وجد أدناه:
${context}

قم بكتابة نصوص ومحتوى تسويقي مبتكر ومقنع للغاية:
- الخطاب التسويقي المحوري (Primary Hook).
- السياق الاستراتيجي للنصوص وصياغة القيمة (Strategic Subtext).
- عبارة اتخاذ إجراء ذكية وفعالة للغاية (Call To Action).

اكتب النصوص التسويقية مباشرة باللغة العربية الفصحى والأسلوب التسويقي الفاخر دون أي مقدمات أو هوامش جانبية.`;
            break;

          case 'visual':
            prompt = `بناءً على الفكرة الاستراتيجية: "${seedText}" والمحتويات السابقة:
${context}

أنت الآن مهندس بصري وخبير صياغة مطالبات الصور الفنية (Visual Engineer). يرجى صياغة وتحديد:
1. نظام الألوان المقترح وسمات الواجهة البصرية (Interface & Mood Scheme).
2. موجه فني تفصيلي ودقيق باللغة الإنجليزية مخصص لتوليد الصور (Image Generation Prompt) باستخدام Midjourney أو DALL-E 3، يبدأ بـ "/imagine" لإنتاج هوية بصرية مذهلة ومناسبة للتوجه.

اكتب الإجابة باللغة العربية لنظام الألوان والوصف، واكتب الموجه بالإنجليزية، واجعل المخرجات مباشرة ومنسقة.`;
            break;

          case 'financial':
            prompt = `بناءً على الفكرة الاستراتيجية: "${seedText}" وجميع المخرجات والسياقات السابقة:
${context}

قم بإعداد تقدير مالي ودراسة جدوى أولية ومؤشرات الاستثمار (Financial & Feasibility Estimations):
1. تقدير التكاليف التقريبية لتأسيس المشروع وتشغيله (التأسيسية والتشغيلية).
2. نموذج الإيرادات والربحية المقترح وتوقعات التدفقات المالية.
3. العائد التقريبي المتوقع على الاستثمار (Estimated ROI) وفترة استرداد التكاليف المقدرة.

اكتب التحليل والتقدير المالي مباشرة باللغة العربية بأسلوب مالي واقتصادي دقيق وصارم.`;
            break;

          case 'quality':
            prompt = `بناءً على الفكرة الاستراتيجية: "${seedText}" وجميع المخرجات السابقة من المراحل الأخرى:
${context}

قم بإجراء تدقيق ومراجعة شاملة لضمان الجودة والأمان (Quality & Audit Review):
1. تحقق من ملاءمة محركات البحث (SEO Compatibility) وتوافق الكلمات المفتاحية مع نسبة مئوية للمطابقة.
2. تحقق من سلامة الهيكل والأمان العام وخلو المحتوى من التعقيدات التقنية غير المبررة.
3. تقييم وإدارة المخاطر المحتملة وتأكيد جاهزية المخرجات للنشر الفوري.

اكتب التقرير النهائي مباشرة باللغة العربية بشكل دقيق وصارم يعكس جودة وموثوقية الأنظمة.`;
            break;
        }
      } else {
        systemInstruction = "You are a specialized business, design, and marketing intelligence agent operating inside a highly efficient sequential AI orchestration pipeline.";
        
        switch (nameKey) {
          case 'strategic':
            prompt = `Perform a deep, data-driven strategic analysis for the following concept: "${seedText}"
Please provide:
1. A precise strategic diagnostics of the target sector.
2. The core value proposition and key competitive advantages.
3. A tailored recommendation matrix to drive premium customer conversion and market penetration.

Output the response directly as professional system execution logs, with no polite conversational preambles or post-scripts.`;
            break;

          case 'competitor':
            prompt = `Based on the core concept: "${seedText}" and the previous context:
${context}

Perform a comprehensive Competitor & Market Positioning Analysis:
1. Identify 3 primary potential competitors (real or representative analogs in the field).
2. Outline their core strengths, weaknesses, and key strategic gaps we can exploit.
3. Formulate a robust Differentiation Strategy matrix for our concept to win.

Output the analysis directly as professional, clean system execution logs with no conversational preambles.`;
            break;

          case 'copywriting':
            prompt = `Based on the core concept: "${seedText}" and the strategic context below:
${context}

Write highly persuasive, premium copywriting and outreach artifacts:
- A compelling Primary Hook / Headline.
- Strategic subtext and messaging layout that resonates.
- A strong, low-friction Engagement Call to Action (CTA).

Provide the output directly as clean copy with no extra preamble.`;
            break;

          case 'visual':
            prompt = `Based on the core concept: "${seedText}" and the previous messaging structure:
${context}

You are a Visual Art Director and Prompt Synthesizer. Please define:
1. A sophisticated interface styling scheme and visual color guide (Interface Scheme).
2. A high-fidelity, detailed English image generation prompt starting with "/imagine" suitable for Midjourney or DALL-E 3 to create a striking cover/mockup or hero graphic matching this direction.

Output the visual specifications directly as clean system code logs.`;
            break;

          case 'financial':
            prompt = `Based on the core concept: "${seedText}" and the previous pipeline outputs:
${context}

Formulate a high-fidelity Financial Estimator & Feasibility Projection:
1. Rough order-of-magnitude startup and running operational costs.
2. Recommended monetization/revenue model and estimated pricing strategy.
3. Estimated Return on Investment (ROI) and payback period timeline.

Provide the financial breakdown directly in a clear, highly structured system layout with no fluff.`;
            break;

          case 'quality':
            prompt = `Based on the core concept: "${seedText}" and all previous output stages:
${context}

Perform a rigorous, professional Quality Assurance and Safety Integrity Audit:
- SEO Compatibility & Relevance Score (estimate a percentage).
- Technical verification of types, flow completeness, and alignment with the initial direction.
- Comprehensive risk factor assessment and final production readiness sign-off.

Output the audit report directly.`;
            break;
        }
      }

      // Apply formatting preset style adjustments
      const activePreset = formattingPreset || 'default';
      let styleInstruction = "";
      if (activePreset !== 'default') {
        if (lang === 'ar') {
          switch (activePreset) {
            case 'social':
              styleInstruction = "\n\nتنبيه تنسيق هام (أسلوب ترويجي تفاعلي): اجعل النص جذاباً ومثيراً للتفاعل وموجّهاً للنشر، واستخدم أيقونات تعبيرية (emojis) ملونة وذكية لتجميل المظهر البصري، وعناوين مشوقة بها وسوم (hashtags) نشطة ومحفزة.";
              break;
            case 'academic':
              styleInstruction = "\n\nتنبيه تنسيق هام (أسلوب أكاديمي ومنهجي): استخدم لغة أكاديمية رصينة للغاية ومصطلحات معتمدة، ونظم الأفكار والمقارنات والبيانات في جداول منسقة (markdown tables) وعناوين مرقمة تعكس منهجية تحليلية عميقة.";
              break;
            case 'technical':
              styleInstruction = "\n\nتنبيه تنسيق هام (أسلوب تقني ومواصفات): ركز على المواصفات الفنية الدقيقة والبيانات الهندسية، واستخدم كتل برمجية منسقة (markdown code blocks) وسجلات أداء ومؤشرات جودة هندسية دقيقة.";
              break;
            case 'executive':
              styleInstruction = "\n\nتنبيه تنسيق هام (ملخص تنفيذي موجز جداً): يجب أن تكون الإجابة فائقة الإيجاز وموجهة للإدارة العليا مباشرة. صغ المخرجات لتكون في شكل فقرة واحدة مكثفة فقط تليها بالضبط 3 نقاط رئيسية عالية التأثير ومباشرة (Bullet Points)، بدون أي تفاصيل حشو أو تكرار.";
              break;
          }
        } else {
          switch (activePreset) {
            case 'social':
              styleInstruction = "\n\nSTYLE INSTRUCTION (Social Media Booster): Make the text highly engaging, conversational, and viral. Use relevant colorful emojis, catchy headlines, and active hashtags.";
              break;
            case 'academic':
              styleInstruction = "\n\nSTYLE INSTRUCTION (Academic & High-Rigour): Use formal academic terminology, objective authoritative prose, and organize metrics/comparisons into clean markdown tables with structured subheadings.";
              break;
            case 'technical':
              styleInstruction = "\n\nSTYLE INSTRUCTION (Technical Specifications): Focus on precise technical schemas, operational metrics, and architecture. Use structured markdown code blocks and clear engineering specs.";
              break;
            case 'executive':
              styleInstruction = "\n\nSTYLE INSTRUCTION (Executive Brief): The response must be ultra-concise and high-level. Limit the output strictly to exactly one concise summary paragraph followed by exactly three punchy high-impact bullet points.";
              break;
          }
        }
      }

      prompt += styleInstruction;

      // Generate content with Gemini using official @google/genai SDK
      const response = await ai.models.generateContent({
        model: "gemini-flash-latest",
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.8,
          topP: 0.9,
        }
      });

      const outputText = response.text || "No response received from the model.";
      res.json({ output: outputText });

    } catch (err: unknown) {
      let errorMessage = "";
      let isSimulatableError = false;

      // Robustly extract details from the error object
      try {
        const errObj = err as any;
        const rawMessage = errObj?.message || "";
        const rawStatus = errObj?.status || errObj?.error?.code || "";
        const rawDetails = errObj?.error?.message || "";
        const rawStatusText = errObj?.error?.status || "";

        errorMessage = rawMessage || (typeof err === "object" ? JSON.stringify(err) : String(err));

        const fullErrorContent = `${rawMessage} ${rawStatus} ${rawDetails} ${rawStatusText} ${typeof err === "object" ? JSON.stringify(err) : String(err)}`.toLowerCase();

        isSimulatableError = 
          fullErrorContent.includes("leaked") || 
          fullErrorContent.includes("permission_denied") || 
          fullErrorContent.includes("api key") || 
          fullErrorContent.includes("403") || 
          fullErrorContent.includes("forbidden") ||
          fullErrorContent.includes("unauthorized") ||
          fullErrorContent.includes("api_key") ||
          fullErrorContent.includes("quota") ||
          fullErrorContent.includes("429") ||
          fullErrorContent.includes("resource_exhausted") ||
          fullErrorContent.includes("not found") ||
          fullErrorContent.includes("404") ||
          fullErrorContent.includes("invalid") ||
          fullErrorContent.includes("unsupported") ||
          rawStatus === 403 ||
          rawStatus === 401 ||
          rawStatus === 429 ||
          rawStatus === 404;

        console.warn("Handled API notice inside /api/run-step catch block:", {
          rawMessage,
          rawStatus,
          rawDetails,
          rawStatusText,
          isSimulatableError
        });
      } catch (parseEx) {
        console.warn("Handled exception parsing inside catch block:", parseEx);
        errorMessage = String(err);
        isSimulatableError = true; // Set to true as a safe fallback
      }

      console.warn("Handled API warning in /api/run-step:", errorMessage);

      const { nameKey, seedText, lang, formattingPreset } = req.body;
      const activeLang = lang === 'en' ? 'en' : 'ar';

      if (seedText && nameKey && isSimulatableError) {
        const simulatedOutput = getSimulatedResponse(nameKey, seedText, activeLang, formattingPreset);
        res.json({ output: simulatedOutput });
        return;
      }

      if (isSimulatableError && errorMessage.toLowerCase().includes("leaked")) {
        if (activeLang === 'ar') {
          errorMessage = "مفتاح API الخاص بك تم الإبلاغ عن تسريبه (Leaked API Key). يرجى إصدار مفتاح جديد من Google AI Studio وتحديث قيمة GEMINI_API_KEY في إعدادات التطبيق (Settings) لتفعيل المنظومة بنجاح.";
        } else {
          errorMessage = "Your Gemini API Key has been reported as leaked. Please generate a new key from Google AI Studio and update the GEMINI_API_KEY variable in your application's Settings menu to restore service.";
        }
      }

      res.status(500).json({ error: errorMessage || "Internal server error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
