(function () {
  'use strict';

  const pageRequirements = {
    home: ['profile', 'education', 'research', 'site'],
    research: ['profile', 'research', 'projects', 'site'],
    publications: ['profile', 'publications', 'site'],
    experience: ['profile', 'experience', 'awards', 'skills', 'site'],
    cv: ['profile', 'education', 'research', 'publications', 'projects', 'experience', 'awards', 'site'],
    contact: ['profile', 'site'],
    teaching: ['profile', 'experience', 'site']
  };

  const I18N = {
    en: {
      viewResearch: 'View research', downloadCv: 'Download CV', publicOnly: 'Public academic information only; sensitive personal identifiers are not stored in this website repository.',
      gpa: 'GPA', supervisor: 'Supervisor', grade: 'Grade', projectLead: 'Project lead', projectLink: 'Project link →',
      statuses: { accepted: 'Accepted', published: 'Published', published_or_accepted: 'Published/accepted', working_paper: 'Working paper', under_review: 'Under review', conference: 'Conference paper' },
      groups: { journal: 'Journal research', conference: 'Conference papers & presentations' },
      featured: 'Featured', venue: 'Venue:', corresponding: 'Corresponding author reported in source:', publicationLink: 'Publication link', missingBib: 'Empty DOI, URL, volume, issue, page range, or official-English-title fields are intentionally suppressed until verified information is supplied.',
      exp: { research: 'Research', professional: 'Professional', service: 'Academic service', other: 'Other experience' },
      curriculum: 'Curriculum vitae', downloadPdf: 'Download PDF', downloadDocx: 'Download DOCX', print: 'Print this page', degreeListed: 'Degree listed in CV', with: 'With', seeAll: 'See the complete publication and conference-paper list →',
      email: 'Email', institution: 'Institution', location: 'Location', openProfile: 'Open profile →', noLinks: 'No public academic-profile links have been supplied yet. You can add them later from the CMS dashboard.', noTeaching: 'No teaching entries are currently listed.', loadError: 'This section could not be loaded. Please refresh the page or check the content files.',
      links: { google_scholar: 'Google Scholar', orcid: 'ORCID', researchgate: 'ResearchGate', linkedin: 'LinkedIn', github: 'GitHub' },
      langLabel: 'فارسی', portraitAlt: 'Portrait of'
    },
    fa: {
      viewResearch: 'مشاهده پژوهش‌ها', downloadCv: 'دانلود رزومه', publicOnly: 'این وب‌سایت فقط شامل اطلاعات دانشگاهیِ انتخاب‌شده برای انتشار عمومی است و شناسه‌های شخصی حساس در مخزن آن ذخیره نمی‌شوند.',
      gpa: 'معدل', supervisor: 'استاد راهنما', grade: 'نمره', projectLead: 'مسئول طرح', projectLink: 'پیوند طرح ←',
      statuses: { accepted: 'پذیرفته‌شده', published: 'منتشرشده', published_or_accepted: 'منتشرشده/پذیرفته‌شده', working_paper: 'مقاله در دست کار', under_review: 'در حال داوری', conference: 'مقاله کنفرانسی' },
      groups: { journal: 'مقالات علمی', conference: 'مقالات و ارائه‌های کنفرانسی' },
      featured: 'منتخب', venue: 'محل انتشار:', corresponding: 'نویسنده مسئول طبق منبع:', publicationLink: 'پیوند انتشار', missingBib: 'اطلاعات تأییدنشده مانند DOI، پیوند، جلد، شماره، صفحات یا عنوان رسمی انگلیسی تا زمان راستی‌آزمایی نمایش داده نمی‌شوند.',
      exp: { research: 'پژوهشی', professional: 'حرفه‌ای', service: 'خدمات و فعالیت دانشگاهی', other: 'سایر سوابق' },
      curriculum: 'رزومه علمی', downloadPdf: 'دانلود PDF', downloadDocx: 'دانلود Word', print: 'چاپ این صفحه', degreeListed: 'مدرک درج‌شده در رزومه', with: 'با همکاری', seeAll: 'مشاهده فهرست کامل مقالات و ارائه‌ها ←',
      email: 'ایمیل', institution: 'دانشگاه', location: 'محل', openProfile: 'مشاهده پروفایل ←', noLinks: 'هنوز پیوند پروفایل دانشگاهی عمومی ثبت نشده است.', noTeaching: 'در حال حاضر سابقه آموزشی دیگری ثبت نشده است.', loadError: 'بارگذاری این بخش با خطا روبه‌رو شد. صفحه را دوباره بارگذاری کنید یا فایل‌های محتوا را بررسی کنید.',
      links: { google_scholar: 'Google Scholar', orcid: 'ORCID', researchgate: 'ResearchGate', linkedin: 'LinkedIn', github: 'GitHub' },
      langLabel: 'EN', portraitAlt: 'تصویر'
    }
  };

  const locale = document.body.dataset.locale === 'fa' ? 'fa' : 'en';
  const rootPrefix = locale === 'fa' ? '../' : '';
  const t = I18N[locale];
  const designPath = `${rootPrefix}content/settings/design.json`;
  let activeDesign = {};
  let activeSite = {};


  function escapeHtml(value) { return String(value == null ? '' : value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;'); }
  function attr(value) { return escapeHtml(value); }
  function slot(name) { return document.querySelector(`[data-slot="${name}"]`); }
  function setHtml(name, html) { const el = slot(name); if (el) el.innerHTML = html; }
  function setText(name, text) { const el = slot(name); if (el) el.textContent = text || ''; }
  function uiLabel(key, fallback) { return (activeSite.ui && activeSite.ui[key]) || fallback; }
  function joinParts(parts, separator) { return parts.filter(Boolean).join(separator || ' · '); }
  function localAsset(path) { if (!path || /^(https?:|mailto:|tel:|#|data:)/i.test(path) || path.startsWith('/')) return path; return rootPrefix + path.replace(/^\.\//, ''); }
  function sharedAsset(profile, key) {
    const branding = activeDesign.branding || {};
    return branding[key] || (profile && profile[key]) || '';
  }
  function contentPath(key) { return `${rootPrefix}content/${locale}/${key}.json`; }
  async function loadJson(path) { const response = await fetch(path, { cache: 'no-store' }); if (!response.ok) throw new Error(`Unable to load ${path} (${response.status})`); return response.json(); }

  function clampNumber(value, min, max, fallback) {
    const n = Number(value);
    return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
  }

  function fontStack(name, language) {
    const english = {
      'Times New Roman': '"Times New Roman",Times,serif',
      Georgia: 'Georgia,serif', Arial: 'Arial,sans-serif', Helvetica: 'Helvetica,Arial,sans-serif',
      Verdana: 'Verdana,sans-serif', Tahoma: 'Tahoma,sans-serif'
    };
    const persian = {
      'B Nazanin': '"B Nazanin","Nazanin",Tahoma,serif', Nazanin: '"Nazanin",Tahoma,serif',
      Tahoma: 'Tahoma,Arial,sans-serif', Arial: 'Arial,Tahoma,sans-serif', 'Times New Roman': '"Times New Roman",Times,serif'
    };
    const map = language === 'fa' ? persian : english;
    return map[name] || (language === 'fa' ? persian['B Nazanin'] : english['Times New Roman']);
  }

  function ensureMeta(selector, attrs) {
    let el = document.head.querySelector(selector);
    if (!el) {
      el = document.createElement('meta');
      Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
      document.head.appendChild(el);
    }
    return el;
  }

  function updateMetadata(site, design, page) {
    if (!site) return;
    const current = Array.isArray(site.navigation) ? site.navigation.find((item) => item.id === page) : null;
    const title = page === 'home' ? site.site_title : joinParts([current && current.label, site.site_title], ' | ');
    if (title) document.title = title;
    const description = ensureMeta('meta[name="description"]', { name: 'description' });
    if (site.default_description) description.setAttribute('content', site.default_description);
    const keywords = ensureMeta('meta[name="keywords"]', { name: 'keywords' });
    keywords.setAttribute('content', Array.isArray(site.keywords) ? site.keywords.join(', ') : (site.keywords || ''));
    ensureMeta('meta[property="og:title"]', { property: 'og:title' }).setAttribute('content', title || '');
    ensureMeta('meta[property="og:description"]', { property: 'og:description' }).setAttribute('content', site.default_description || '');
    ensureMeta('meta[name="twitter:card"]', { name: 'twitter:card' }).setAttribute('content', 'summary_large_image');
    ensureMeta('meta[name="twitter:title"]', { name: 'twitter:title' }).setAttribute('content', title || '');
    ensureMeta('meta[name="twitter:description"]', { name: 'twitter:description' }).setAttribute('content', site.default_description || '');
    const ogImage = design && design.branding && design.branding.open_graph_image;
    if (ogImage) {
      const resolved = new URL(localAsset(ogImage), window.location.href).href;
      ensureMeta('meta[property="og:image"]', { property: 'og:image' }).setAttribute('content', resolved);
      ensureMeta('meta[name="twitter:image"]', { name: 'twitter:image' }).setAttribute('content', resolved);
    }
    const favicon = design && design.branding && design.branding.favicon;
    if (favicon) {
      let link = document.head.querySelector('link[rel="icon"]');
      if (!link) { link = document.createElement('link'); link.rel = 'icon'; document.head.appendChild(link); }
      link.removeAttribute('type');
      link.href = localAsset(favicon);
    }
  }

  function applyDesignSettings(settings) {
    activeDesign = settings || {};
    const root = document.documentElement;
    const style = root.style;
    const colors = activeDesign.colors || {};
    const colorVars = { background: '--bg', surface: '--surface', text: '--text', muted: '--muted', line: '--line', accent: '--accent', accent_secondary: '--accent-2', soft: '--soft' };
    Object.entries(colorVars).forEach(([key, variable]) => { if (colors[key]) style.setProperty(variable, colors[key]); });
    const type = activeDesign.typography || {};
    style.setProperty('--font-en', fontStack(type.english_font, 'en'));
    style.setProperty('--font-fa', fontStack(type.persian_font, 'fa'));
    const baseFont = clampNumber(type.base_font_size, 13, 24, 16);
    const titleScale = clampNumber(type.hero_title_scale, 0.7, 1.35, 1);
    style.setProperty('--base-font-size', `${baseFont}px`);
    style.setProperty('--font-size-fa', `${baseFont * 1.05}px`);
    style.setProperty('--line-height-en', String(clampNumber(type.english_line_height, 1.2, 2.2, 1.68)));
    style.setProperty('--line-height-fa', String(clampNumber(type.persian_line_height, 1.4, 2.5, 1.9)));
    const titleBase = locale === 'fa' ? { min: 3, fluid: 6.2, max: 4.8 } : { min: 2.7, fluid: 7, max: 5.2 };
    style.setProperty('--hero-title-min', `${titleBase.min * titleScale}rem`);
    style.setProperty('--hero-title-fluid', `${titleBase.fluid * titleScale}vw`);
    style.setProperty('--hero-title-max', `${titleBase.max * titleScale}rem`);
    const layout = activeDesign.layout || {};
    style.setProperty('--max', `${clampNumber(layout.max_width, 760, 1600, 1100)}px`);
    style.setProperty('--section-space', `${clampNumber(layout.section_spacing, 24, 140, 62)}px`);
    style.setProperty('--hero-space-top', `${clampNumber(layout.hero_space_top, 24, 180, locale === 'fa' ? 72 : 88)}px`);
    style.setProperty('--hero-space-bottom', `${clampNumber(layout.hero_space_bottom, 20, 160, locale === 'fa' ? 58 : 66)}px`);
    style.setProperty('--hero-gap', `${clampNumber(layout.hero_gap, 12, 120, locale === 'fa' ? 52 : 64)}px`);
    style.setProperty('--portrait-size', `${clampNumber(layout.portrait_size, 45, 100, 100)}%`);
    style.setProperty('--portrait-radius', `${clampNumber(layout.portrait_radius, 0, 80, 18)}px`);
    style.setProperty('--button-radius', `${clampNumber(layout.button_radius, 0, 40, 8)}px`);
    style.setProperty('--card-radius', `${clampNumber(layout.card_radius, 0, 50, 14)}px`);
    style.setProperty('--nav-gap', `${clampNumber(layout.nav_gap, 6, 48, 20)}px`);
    root.classList.toggle('design-header-static', (activeDesign.controls || {}).sticky_header === false);
    root.classList.toggle('design-no-shadow', (activeDesign.controls || {}).show_shadows === false);
    root.classList.toggle('design-hide-footer', (activeDesign.controls || {}).show_footer === false);
    root.classList.toggle('design-hide-language-switch', (activeDesign.controls || {}).show_language_switch === false);
    root.classList.remove('design-portrait-left', 'design-portrait-right');
    if (layout.portrait_side === 'left') root.classList.add('design-portrait-left');
    if (layout.portrait_side === 'right') root.classList.add('design-portrait-right');
  }

  function applyHomeSections(settings) {
    const main = document.querySelector('main');
    if (!main || !settings || !Array.isArray(settings.home_sections)) return;
    const sections = new Map(Array.from(main.querySelectorAll('[data-home-section]')).map((el) => [el.dataset.homeSection, el]));
    const used = new Set();
    settings.home_sections.forEach((item) => {
      const el = sections.get(item.id); if (!el) return;
      el.hidden = item.enabled === false;
      main.appendChild(el); used.add(item.id);
    });
    sections.forEach((el, id) => { if (!used.has(id)) { el.hidden = false; main.appendChild(el); } });
  }
  function pageFilename(page) { return page === 'home' ? 'index.html' : `${page}.html`; }

  function renderLanguageSwitch(page) {
    const el = slot('language-switch'); if (!el) return;
    if ((activeDesign.controls || {}).show_language_switch === false) { el.innerHTML = ''; return; }
    const file = pageFilename(page);
    const href = locale === 'fa' ? `../${file}` : `fa/${file}`;
    el.innerHTML = `<a class="language-switch" href="${attr(href)}" hreflang="${locale === 'fa' ? 'en' : 'fa'}">${t.langLabel}</a>`;
  }

  function renderGlobal(data, page) {
    const { profile, site } = data;
    activeSite = site || {};
    document.querySelectorAll('[data-ui]').forEach((el) => { const value = activeSite.ui && activeSite.ui[el.dataset.ui]; if (value) el.textContent = value; });
    if (profile) {
      document.querySelectorAll('[data-profile-name]').forEach((el) => { el.textContent = profile.name; });
      const brand = slot('brand');
      if (brand) {
        const logo = (activeDesign.branding || {}).logo;
        const showName = (activeDesign.controls || {}).show_brand_name !== false;
        brand.innerHTML = `${logo ? `<img class="brand-logo" src="${attr(localAsset(logo))}" alt="">` : ''}${showName ? `<span>${escapeHtml(profile.name)}</span>` : ''}` || escapeHtml(profile.name);
      }
    }
    if (site && Array.isArray(site.navigation)) {
      const nav = slot('nav');
      if (nav) nav.innerHTML = site.navigation.filter((item) => item.enabled !== false).map((item) => `<a href="${attr(item.href)}"${item.id === page ? ' aria-current="page"' : ''}>${escapeHtml(item.label)}</a>`).join('');
      const footerLabel = slot('footer-label'); if (footerLabel) footerLabel.textContent = site.footer_label || '';
      if (site.site_title && page === 'home') document.title = site.site_title;
      const description = document.querySelector('meta[name="description"]'); if (description && site.default_description && page === 'home') description.setAttribute('content', site.default_description);
      const announcement = slot('announcement'); if (announcement) { announcement.hidden = !(site.announcement_enabled && site.announcement); announcement.textContent = site.announcement || ''; }
    }
    updateMetadata(site, activeDesign, page);
    renderLanguageSwitch(page);
    document.querySelectorAll('[data-current-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
  }

  function socialLinks(profile, compact) {
    const links = Object.entries(profile.links || {}).filter(([, url]) => url);
    if (!links.length) return '';
    return `<div class="${compact ? 'academic-links compact' : 'academic-links'}">${links.map(([key, url]) => `<a href="${attr(url)}" target="_blank" rel="me noopener">${escapeHtml(t.links[key] || key)}</a>`).join('')}</div>`;
  }

  function renderHome(data) {
    const { profile, research, education } = data;
    if (profile && research) {
      setHtml('profile-hero', `<div><p class="eyebrow">${escapeHtml(profile.eyebrow)}</p><h1>${escapeHtml(profile.name)}</h1><p class="lede">${escapeHtml(profile.short_bio)}</p><div class="hero-meta">${research.interests.map((x) => `<span class="tag">${escapeHtml(x)}</span>`).join('')}</div><div class="actions"><a class="button" href="research.html">${uiLabel('view_research', t.viewResearch)}</a>${sharedAsset(profile, 'cv_pdf') ? `<a class="button secondary" href="${attr(localAsset(sharedAsset(profile, 'cv_pdf')))}">${uiLabel('download_cv', t.downloadCv)}</a>` : ''}</div>${(activeDesign.controls || {}).show_social_links_on_home === false ? '' : socialLinks(profile, true)}</div>${sharedAsset(profile, 'profile_image') ? `<img class="portrait" src="${attr(localAsset(sharedAsset(profile, 'profile_image')))}" alt="${t.portraitAlt} ${attr(profile.name)}">` : ''}`);
      setHtml('about', `<p>${escapeHtml(profile.bio)}</p><p class="muted small">${t.publicOnly}</p>`);
      setHtml('research-themes', research.themes.map((theme) => `<article class="card"><h3>${escapeHtml(theme.title)}</h3><p>${escapeHtml(theme.description)}</p></article>`).join(''));
    }
    if (education) setHtml('education-list', `<ul class="list-clean">${education.items.map((item) => { const details = joinParts([item.institution, item.period, item.gpa ? `${t.gpa} ${item.gpa}` : '']); return `<li><strong>${escapeHtml(item.degree)}</strong><br><span class="muted">${escapeHtml(details)}</span>${item.note ? `<br><span class="small muted">${escapeHtml(item.note)}</span>` : ''}</li>`; }).join('')}</ul>`);
  }

  function renderResearch(data) {
    const { research, projects } = data;
    if (research) {
      setText('research-intro', research.intro);
      setHtml('research-themes', research.themes.map((x) => `<article class="entry"><h2 class="entry-title">${escapeHtml(x.title)}</h2><p>${escapeHtml(x.description)}</p></article>`).join(''));
      const x = research.thesis || {};
      setHtml('thesis', `<article class="entry"><h2 class="entry-title">${escapeHtml(x.title)}</h2><p class="entry-meta">${escapeHtml(joinParts([x.degree, x.institution, x.supervisor ? `${t.supervisor}: ${x.supervisor}` : '', x.grade ? `${t.grade}: ${x.grade}` : '']))}</p>${x.note ? `<p>${escapeHtml(x.note)}</p>` : ''}</article>`);
    }
    if (projects) setHtml('projects', projects.items.map((x) => `<article class="entry"><h2 class="entry-title">${escapeHtml(x.title)}</h2><p class="entry-meta">${escapeHtml(joinParts([x.role, x.lead ? `${t.projectLead}: ${x.lead}` : '']))}</p><p>${escapeHtml(x.description)}</p>${x.url ? `<p><a href="${attr(x.url)}">${t.projectLink}</a></p>` : ''}</article>`).join(''));
  }

  function statusLabel(status) { return t.statuses[status] || status || ''; }
  function renderPublications(data) {
    const p = data.publications; if (!p) return; setText('publications-intro', p.intro);
    const groups = [['journal', t.groups.journal], ['conference', t.groups.conference]];
    setHtml('publication-list', groups.map(([type, label]) => { const items=p.items.filter((x)=>x.type===type); if(!items.length)return ''; return `<section class="publication-group"><p class="eyebrow">${label}</p>${items.map((x)=>`<article class="entry"><div class="entry-heading-row"><h2 class="entry-title">${escapeHtml(x.official_english_title || x.title)}</h2>${x.featured?`<span class="status-pill">${t.featured}</span>`:''}</div><p class="entry-meta">${escapeHtml(joinParts([x.authors.join(locale==='fa' ? '، ' : '; '),x.year,statusLabel(x.status)]))}</p>${x.venue_english_rendering||x.venue?`<p><strong>${t.venue}</strong> ${escapeHtml(x.venue_english_rendering||x.venue)}</p>`:''}${x.corresponding_author?`<p class="small muted">${t.corresponding} ${escapeHtml(x.corresponding_author)}</p>`:''}${x.doi||x.url?`<p class="entry-links">${x.doi?`<a href="https://doi.org/${attr(x.doi)}">DOI</a>`:''}${x.url?`<a href="${attr(x.url)}">${t.publicationLink}</a>`:''}</p>`:''}${x.note?`<p class="small muted">${escapeHtml(x.note)}</p>`:''}</article>`).join('')}</section>`; }).join('')+`<div class="note small">${t.missingBib}</div>`);
  }

  function renderExperience(data) {
    const e=data.experience,a=data.awards,s=data.skills;
    if(e){const cats=['research','professional','service','other'];setHtml('experience-list',cats.map((c)=>{const items=e.items.filter((x)=>x.category===c);if(!items.length)return '';return `<section class="experience-group"><p class="eyebrow">${t.exp[c]}</p>${items.map((x)=>`<article class="entry"><h2 class="entry-title">${escapeHtml(x.title)}</h2><p class="entry-meta">${escapeHtml(joinParts([x.organization,x.period]))}</p>${x.description?`<p>${escapeHtml(x.description)}</p>`:''}</article>`).join('')}</section>`;}).join(''));}
    if(a)setHtml('awards-list',a.items.map((x)=>`<article class="entry"><h2 class="entry-title">${escapeHtml(x.title)}</h2><p class="entry-meta">${escapeHtml(joinParts([x.issuer,x.year]))}</p><p>${escapeHtml(x.description)}</p></article>`).join(''));
    if(s)setHtml('skills-groups',`${s.groups.map((g)=>`<article class="card"><h3>${escapeHtml(g.title)}</h3><p>${g.items.map(escapeHtml).join(' · ')}</p></article>`).join('')}<p class="muted small full-span">${escapeHtml(s.note)}</p>`);
  }

  function renderCv(data) {
    const {profile,education,research,publications,projects,experience,awards}=data;
    if(profile)setHtml('cv-header',`<p class="eyebrow">${t.curriculum}</p><h1>${escapeHtml(profile.name)}</h1><p class="lede">${escapeHtml(profile.headline)} · ${escapeHtml(profile.affiliation)}</p><div class="actions">${sharedAsset(profile,'cv_pdf')?`<a class="button" href="${attr(localAsset(sharedAsset(profile,'cv_pdf')))}">${uiLabel('download_pdf', t.downloadPdf)}</a>`:''}${sharedAsset(profile,'cv_docx')?`<a class="button secondary" href="${attr(localAsset(sharedAsset(profile,'cv_docx')))}">${uiLabel('download_docx', t.downloadDocx)}</a>`:''}<button class="button secondary" type="button" onclick="window.print()">${uiLabel('print', t.print)}</button></div>${socialLinks(profile,true)}`);
    if(education)setHtml('cv-education',education.items.map((x)=>`<div class="cv-row"><div class="cv-year">${escapeHtml(x.period||t.degreeListed)}</div><div><strong>${escapeHtml(x.degree)}</strong><br>${escapeHtml(x.institution)}${x.gpa?` · ${t.gpa} ${escapeHtml(x.gpa)}`:''}${x.note?`<br><span class="muted small">${escapeHtml(x.note)}</span>`:''}</div></div>`).join(''));
    if(research)setHtml('cv-interests',`<p>${research.interests.map(escapeHtml).join(locale==='fa'?'؛ ':'; ')}.</p>`);
    if(publications){const featured=publications.items.filter((x)=>x.featured);setHtml('cv-publications',featured.map((x)=>`<p><strong>${escapeHtml(x.official_english_title||x.title)}.</strong> ${escapeHtml(joinParts([`${t.with} ${x.authors.filter((a)=>a!==profile.name).join(', ')}`,statusLabel(x.status),x.year],'. '))}</p>`).join('')+`<p><a href="publications.html">${t.seeAll}</a></p>`);}
    if(projects)setHtml('cv-projects',projects.items.map((x)=>`<p><strong>${escapeHtml(x.title)}.</strong> ${escapeHtml(x.description)}</p>`).join(''));
    if(experience||awards){const service=(experience?experience.items.filter((x)=>x.category==='service'):[]).slice(0,4);setHtml('cv-service',`${service.map((x)=>`<p><strong>${escapeHtml(x.title)}</strong> — ${escapeHtml(joinParts([x.organization,x.period]))}</p>`).join('')}${awards?awards.items.map((x)=>`<p><strong>${escapeHtml(x.title)}</strong> — ${escapeHtml(joinParts([x.issuer,x.year]))}. ${escapeHtml(x.description)}</p>`).join(''):''}`);}
  }

  function renderContact(data) {
    const p=data.profile;if(!p)return;
    setHtml('contact-grid',`<div class="contact-item"><strong>${t.email}</strong><a href="mailto:${attr(p.email)}">${escapeHtml(p.email)}</a></div><div class="contact-item"><strong>${t.institution}</strong><span>${escapeHtml(p.affiliation)}</span><br><span class="muted">${escapeHtml(p.headline)}</span></div>${p.location?`<div class="contact-item"><strong>${t.location}</strong><span>${escapeHtml(p.location)}</span></div>`:''}`);
    const links=Object.entries(p.links||{}).filter(([,u])=>u);setHtml('profile-links',links.length?links.map(([k,u])=>`<a class="contact-item link-card" href="${attr(u)}" target="_blank" rel="me noopener"><strong>${escapeHtml(t.links[k]||k)}</strong><span>${t.openProfile}</span></a>`).join(''):`<p class="muted">${t.noLinks}</p>`);
  }

  function renderTeaching(data){const items=data.experience?data.experience.items.filter((x)=>/instruction|آموزش/i.test(x.title)):[];setHtml('teaching-list',items.length?items.map((x)=>`<article class="entry"><h2 class="entry-title">${escapeHtml(x.title)}</h2><p class="entry-meta">${escapeHtml(joinParts([x.organization,x.period]))}</p></article>`).join(''):`<p class="muted">${t.noTeaching}</p>`);}
  function showLoadError(error){console.error(error);document.querySelectorAll('[data-slot]').forEach((el)=>{if(!el.innerHTML.trim()&&!['nav','brand','language-switch'].includes(el.dataset.slot))el.innerHTML=`<p class="load-error">${t.loadError}</p>`;});}

  async function init(){
    const page=document.body.dataset.page||'home';
    const keys=pageRequirements[page]||['profile','site'];
    try{
      const [design, values] = await Promise.all([
        loadJson(designPath).catch(() => ({})),
        Promise.all(keys.map(async(key)=>[key,await loadJson(contentPath(key))]))
      ]);
      applyDesignSettings(design);
      const data=Object.fromEntries(values);
      renderGlobal(data,page);
      if(page==='home')renderHome(data);
      if(page==='research')renderResearch(data);
      if(page==='publications')renderPublications(data);
      if(page==='experience')renderExperience(data);
      if(page==='cv')renderCv(data);
      if(page==='contact')renderContact(data);
      if(page==='teaching')renderTeaching(data);
      if(page==='home')applyHomeSections(design);
      document.documentElement.classList.add('content-ready');
    }catch(error){showLoadError(error);}
  }

  window.AcademicSite={loadJson,escapeHtml,applyDesignSettings,applyHomeSections,updateMetadata,init};document.addEventListener('DOMContentLoaded',init);
}());
