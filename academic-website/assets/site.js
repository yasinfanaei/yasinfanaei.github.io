(function () {
  'use strict';

  const CONTENT = {
    profile: 'content/profile.json',
    education: 'content/education.json',
    research: 'content/research.json',
    publications: 'content/publications.json',
    projects: 'content/projects.json',
    experience: 'content/experience.json',
    awards: 'content/awards.json',
    skills: 'content/skills.json',
    site: 'content/site.json'
  };

  const pageRequirements = {
    home: ['profile', 'education', 'research', 'site'],
    research: ['profile', 'research', 'projects', 'site'],
    publications: ['profile', 'publications', 'site'],
    experience: ['profile', 'experience', 'awards', 'skills', 'site'],
    cv: ['profile', 'education', 'research', 'publications', 'projects', 'experience', 'awards', 'site'],
    contact: ['profile', 'site'],
    teaching: ['profile', 'experience', 'site']
  };

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function attr(value) {
    return escapeHtml(value);
  }

  async function loadJson(path) {
    const response = await fetch(path, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Unable to load ${path} (${response.status})`);
    }
    return response.json();
  }

  function slot(name) {
    return document.querySelector(`[data-slot="${name}"]`);
  }

  function setHtml(name, html) {
    const element = slot(name);
    if (element) element.innerHTML = html;
  }

  function setText(name, text) {
    const element = slot(name);
    if (element) element.textContent = text || '';
  }

  function joinParts(parts, separator) {
    return parts.filter(Boolean).join(separator || ' · ');
  }

  function renderGlobal(data, page) {
    const { profile, site } = data;
    if (profile) {
      document.querySelectorAll('[data-profile-name]').forEach((el) => {
        el.textContent = profile.name;
      });
      const brand = slot('brand');
      if (brand) brand.textContent = profile.name;
    }
    if (site && Array.isArray(site.navigation)) {
      const nav = slot('nav');
      if (nav) {
        nav.innerHTML = site.navigation.map((item) => {
          const current = item.id === page ? ' aria-current="page"' : '';
          return `<a href="${attr(item.href)}"${current}>${escapeHtml(item.label)}</a>`;
        }).join('');
      }
      const footerLabel = slot('footer-label');
      if (footerLabel) footerLabel.textContent = site.footer_label || '';
      if (site.site_title && page === 'home') document.title = site.site_title;
      const description = document.querySelector('meta[name="description"]');
      if (description && site.default_description && page === 'home') {
        description.setAttribute('content', site.default_description);
      }
      const announcement = slot('announcement');
      if (announcement) {
        announcement.hidden = !site.announcement;
        announcement.textContent = site.announcement || '';
      }
    }
    document.querySelectorAll('[data-current-year]').forEach((el) => {
      el.textContent = new Date().getFullYear();
    });
  }

  function renderHome(data) {
    const { profile, research, education } = data;
    if (profile && research) {
      setHtml('profile-hero', `
        <div>
          <p class="eyebrow">${escapeHtml(profile.eyebrow)}</p>
          <h1>${escapeHtml(profile.name)}</h1>
          <p class="lede">${escapeHtml(profile.short_bio)}</p>
          <div class="hero-meta">${research.interests.map((x) => `<span class="tag">${escapeHtml(x)}</span>`).join('')}</div>
          <div class="actions">
            <a class="button" href="research.html">View research</a>
            ${profile.cv_pdf ? `<a class="button secondary" href="${attr(profile.cv_pdf)}">Download CV</a>` : ''}
          </div>
        </div>
        ${profile.profile_image ? `<img class="portrait" src="${attr(profile.profile_image)}" alt="Portrait of ${attr(profile.name)}">` : ''}
      `);
      setHtml('about', `<p>${escapeHtml(profile.bio)}</p><p class="muted small">Public academic information only; sensitive personal identifiers are not stored in this website repository.</p>`);
      setHtml('research-themes', research.themes.map((theme) => `
        <article class="card"><h3>${escapeHtml(theme.title)}</h3><p>${escapeHtml(theme.description)}</p></article>
      `).join(''));
    }
    if (education) {
      setHtml('education-list', `<ul class="list-clean">${education.items.map((item) => {
        const details = joinParts([item.institution, item.period, item.gpa ? `GPA ${item.gpa}` : '']);
        return `<li><strong>${escapeHtml(item.degree)}</strong><br><span class="muted">${escapeHtml(details)}</span>${item.note ? `<br><span class="small muted">${escapeHtml(item.note)}</span>` : ''}</li>`;
      }).join('')}</ul>`);
    }
  }

  function renderResearch(data) {
    const { research, projects } = data;
    if (research) {
      setText('research-intro', research.intro);
      setHtml('research-themes', research.themes.map((theme) => `
        <article class="entry"><h2 class="entry-title">${escapeHtml(theme.title)}</h2><p>${escapeHtml(theme.description)}</p></article>
      `).join(''));
      const t = research.thesis || {};
      setHtml('thesis', `
        <article class="entry">
          <h2 class="entry-title">${escapeHtml(t.title)}</h2>
          <p class="entry-meta">${escapeHtml(joinParts([t.degree, t.institution, t.supervisor ? `Supervisor: ${t.supervisor}` : '', t.grade ? `Grade: ${t.grade}` : '']))}</p>
          ${t.note ? `<p>${escapeHtml(t.note)}</p>` : ''}
        </article>
      `);
    }
    if (projects) {
      setHtml('projects', projects.items.map((project) => `
        <article class="entry">
          <h2 class="entry-title">${escapeHtml(project.title)}</h2>
          <p class="entry-meta">${escapeHtml(joinParts([project.role, project.lead ? `Project lead: ${project.lead}` : '']))}</p>
          <p>${escapeHtml(project.description)}</p>
          ${project.url ? `<p><a href="${attr(project.url)}">Project link →</a></p>` : ''}
        </article>
      `).join(''));
    }
  }

  function statusLabel(status) {
    const labels = {
      accepted: 'Accepted',
      published: 'Published',
      published_or_accepted: 'Published/accepted',
      working_paper: 'Working paper',
      under_review: 'Under review',
      conference: 'Conference paper'
    };
    return labels[status] || status || '';
  }

  function renderPublications(data) {
    const publications = data.publications;
    if (!publications) return;
    setText('publications-intro', publications.intro);
    const groups = [
      ['journal', 'Journal research'],
      ['conference', 'Conference papers & presentations']
    ];
    setHtml('publication-list', groups.map(([type, label]) => {
      const items = publications.items.filter((item) => item.type === type);
      if (!items.length) return '';
      return `<section class="publication-group"><p class="eyebrow">${escapeHtml(label)}</p>${items.map((item) => `
        <article class="entry">
          <div class="entry-heading-row"><h2 class="entry-title">${escapeHtml(item.official_english_title || item.title)}</h2>${item.featured ? '<span class="status-pill">Featured</span>' : ''}</div>
          <p class="entry-meta">${escapeHtml(joinParts([item.authors.join('; '), item.year, statusLabel(item.status)]))}</p>
          ${item.venue_english_rendering || item.venue ? `<p><strong>Venue:</strong> ${escapeHtml(item.venue_english_rendering || item.venue)}</p>` : ''}
          ${item.corresponding_author ? `<p class="small muted">Corresponding author reported in source: ${escapeHtml(item.corresponding_author)}</p>` : ''}
          ${item.doi || item.url ? `<p class="entry-links">${item.doi ? `<a href="https://doi.org/${attr(item.doi)}">DOI</a>` : ''}${item.url ? `<a href="${attr(item.url)}">Publication link</a>` : ''}</p>` : ''}
          ${item.note ? `<p class="small muted">${escapeHtml(item.note)}</p>` : ''}
        </article>
      `).join('')}</section>`;
    }).join('') + '<div class="note small">Empty DOI, URL, volume, issue, page range, or official-English-title fields are intentionally suppressed until verified information is supplied.</div>');
  }

  function renderExperience(data) {
    const experience = data.experience;
    const awards = data.awards;
    const skills = data.skills;
    if (experience) {
      const labels = { research: 'Research', professional: 'Professional', service: 'Academic service', other: 'Other experience' };
      const categories = ['research', 'professional', 'service', 'other'];
      setHtml('experience-list', categories.map((category) => {
        const items = experience.items.filter((item) => item.category === category);
        if (!items.length) return '';
        return `<section class="experience-group"><p class="eyebrow">${labels[category]}</p>${items.map((item) => `
          <article class="entry"><h2 class="entry-title">${escapeHtml(item.title)}</h2><p class="entry-meta">${escapeHtml(joinParts([item.organization, item.period]))}</p>${item.description ? `<p>${escapeHtml(item.description)}</p>` : ''}</article>
        `).join('')}</section>`;
      }).join(''));
    }
    if (awards) {
      setHtml('awards-list', awards.items.map((item) => `
        <article class="entry"><h2 class="entry-title">${escapeHtml(item.title)}</h2><p class="entry-meta">${escapeHtml(joinParts([item.issuer, item.year]))}</p><p>${escapeHtml(item.description)}</p></article>
      `).join(''));
    }
    if (skills) {
      setHtml('skills-groups', `${skills.groups.map((group) => `
        <article class="card"><h3>${escapeHtml(group.title)}</h3><p>${group.items.map(escapeHtml).join(' · ')}</p></article>
      `).join('')}<p class="muted small full-span">${escapeHtml(skills.note)}</p>`);
    }
  }

  function renderCv(data) {
    const { profile, education, research, publications, projects, experience, awards } = data;
    if (profile) {
      setHtml('cv-header', `
        <p class="eyebrow">Curriculum vitae</p><h1>${escapeHtml(profile.name)}</h1>
        <p class="lede">${escapeHtml(profile.headline)} · ${escapeHtml(profile.affiliation)}</p>
        <div class="actions">${profile.cv_pdf ? `<a class="button" href="${attr(profile.cv_pdf)}">Download PDF</a>` : ''}${profile.cv_docx ? `<a class="button secondary" href="${attr(profile.cv_docx)}">Download DOCX</a>` : ''}<button class="button secondary" type="button" onclick="window.print()">Print this page</button></div>
      `);
    }
    if (education) {
      setHtml('cv-education', education.items.map((item) => `<div class="cv-row"><div class="cv-year">${escapeHtml(item.period || 'Degree listed in CV')}</div><div><strong>${escapeHtml(item.degree)}</strong><br>${escapeHtml(item.institution)}${item.gpa ? ` · GPA ${escapeHtml(item.gpa)}` : ''}${item.note ? `<br><span class="muted small">${escapeHtml(item.note)}</span>` : ''}</div></div>`).join(''));
    }
    if (research) setHtml('cv-interests', `<p>${research.interests.map(escapeHtml).join('; ')}.</p>`);
    if (publications) {
      const featured = publications.items.filter((item) => item.featured);
      setHtml('cv-publications', featured.map((item) => `<p><strong>${escapeHtml(item.official_english_title || item.title)}.</strong> ${escapeHtml(joinParts([`With ${item.authors.filter((a) => a !== profile.name).join(', ')}`, statusLabel(item.status), item.year], '. '))}</p>`).join('') + '<p><a href="publications.html">See the complete publication and conference-paper list →</a></p>');
    }
    if (projects) setHtml('cv-projects', projects.items.map((p) => `<p><strong>${escapeHtml(p.title)}.</strong> ${escapeHtml(p.description)}</p>`).join(''));
    if (experience || awards) {
      const service = (experience ? experience.items.filter((x) => x.category === 'service') : []).slice(0, 4);
      setHtml('cv-service', `${service.map((x) => `<p><strong>${escapeHtml(x.title)}</strong> — ${escapeHtml(joinParts([x.organization, x.period]))}</p>`).join('')}${awards ? awards.items.map((x) => `<p><strong>${escapeHtml(x.title)}</strong> — ${escapeHtml(joinParts([x.issuer, x.year]))}. ${escapeHtml(x.description)}</p>`).join('') : ''}`);
    }
  }

  function renderContact(data) {
    const profile = data.profile;
    if (!profile) return;
    setHtml('contact-grid', `
      <div class="contact-item"><strong>Email</strong><a href="mailto:${attr(profile.email)}">${escapeHtml(profile.email)}</a></div>
      <div class="contact-item"><strong>Institution</strong><span>${escapeHtml(profile.affiliation)}</span><br><span class="muted">${escapeHtml(profile.headline)}</span></div>
      ${profile.location ? `<div class="contact-item"><strong>Location</strong><span>${escapeHtml(profile.location)}</span></div>` : ''}
    `);
    const linkLabels = {
      google_scholar: 'Google Scholar', orcid: 'ORCID', linkedin: 'LinkedIn',
      github: 'GitHub', institutional_profile: 'Institutional profile'
    };
    const links = Object.entries(profile.links || {}).filter(([, url]) => url);
    setHtml('profile-links', links.length ? links.map(([key, url]) => `<a class="contact-item link-card" href="${attr(url)}"><strong>${escapeHtml(linkLabels[key] || key)}</strong><span>Open profile →</span></a>`).join('') : '<p class="muted">No public academic-profile links have been supplied yet. You can add them later from the CMS dashboard.</p>');
  }

  function renderTeaching(data) {
    const items = data.experience ? data.experience.items.filter((item) => /instruction/i.test(item.title)) : [];
    setHtml('teaching-list', items.length ? items.map((item) => `<article class="entry"><h2 class="entry-title">${escapeHtml(item.title)}</h2><p class="entry-meta">${escapeHtml(joinParts([item.organization, item.period]))}</p></article>`).join('') : '<p class="muted">No teaching entries are currently listed.</p>');
  }

  function showLoadError(error) {
    console.error(error);
    document.querySelectorAll('[data-slot]').forEach((element) => {
      if (!element.innerHTML.trim() && element.dataset.slot !== 'nav' && element.dataset.slot !== 'brand') {
        element.innerHTML = '<p class="load-error">This section could not be loaded. Please refresh the page or check the content files.</p>';
      }
    });
  }

  async function init() {
    const page = document.body.dataset.page || 'home';
    const keys = pageRequirements[page] || ['profile', 'site'];
    try {
      const values = await Promise.all(keys.map(async (key) => [key, await loadJson(CONTENT[key])]));
      const data = Object.fromEntries(values);
      renderGlobal(data, page);
      if (page === 'home') renderHome(data);
      if (page === 'research') renderResearch(data);
      if (page === 'publications') renderPublications(data);
      if (page === 'experience') renderExperience(data);
      if (page === 'cv') renderCv(data);
      if (page === 'contact') renderContact(data);
      if (page === 'teaching') renderTeaching(data);
      document.documentElement.classList.add('content-ready');
    } catch (error) {
      showLoadError(error);
    }
  }

  window.AcademicSite = { loadJson, escapeHtml, init };
  document.addEventListener('DOMContentLoaded', init);
}());
