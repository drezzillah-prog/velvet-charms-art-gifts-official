(() => {
  const form = document.getElementById('customRequestForm');
  if (!form) return;
  const filesInput = document.getElementById('customReferenceFiles');
  const status = document.getElementById('customRequestStatus');
  const maxFiles = 5;
  const maxSize = 4 * 1024 * 1024;
  const allowed = new Set(['image/jpeg', 'image/png', 'image/webp']);

  const isRo = () => document.documentElement.lang === 'ro' || localStorage.getItem('velvetLanguage') === 'ro';
  const say = (en, ro) => { status.textContent = isRo() ? ro : en; };

  filesInput.addEventListener('change', () => {
    const files = [...filesInput.files];
    if (files.length > maxFiles) {
      filesInput.value = '';
      say('Please choose no more than five reference images.', 'Te rugăm să alegi maximum cinci imagini de referință.');
      return;
    }
    const bad = files.find(file => !allowed.has(file.type) || file.size > maxSize);
    if (bad) {
      filesInput.value = '';
      say('References must be JPG, PNG or WEBP and no larger than 4 MB each.', 'Referințele trebuie să fie JPG, PNG sau WEBP și să nu depășească 4 MB fiecare.');
      return;
    }
    say(files.length ? `${files.length} reference image${files.length === 1 ? '' : 's'} selected.` : '', files.length ? `${files.length} ${files.length === 1 ? 'imagine de referință selectată' : 'imagini de referință selectate'}.` : '');
  });

  form.addEventListener('submit', async event => {
    event.preventDefault();
    const files = [...filesInput.files];
    if (files.length > maxFiles) return;
    const submit = form.querySelector('button[type="submit"]');
    submit.disabled = true;
    say('Preparing your custom request…', 'Pregătim cererea ta personalizată…');

    try {
      const uploaded = [];
      for (const file of files) {
        const body = new FormData();
        body.append('file', file);
        const response = await fetch('/api/upload', { method: 'POST', body });
        const result = await response.json().catch(() => ({}));
        if (!response.ok || !result.ok || !result.file?.viewUrl) {
          throw new Error(result.error || 'reference upload failed');
        }
        uploaded.push(result.file);
      }

      const data = Object.fromEntries(new FormData(form).entries());
      const referenceLines = uploaded.map((file, index) => {
        const absoluteUrl = new URL(file.viewUrl, window.location.origin).href;
        return `Reference ${index + 1}: ${file.originalName || 'image'} — ${absoluteUrl}`;
      });

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          message: [
            'CUSTOM CREATION REQUEST',
            '',
            `Idea: ${data.idea}`,
            data.details ? `Preferred size / materials / details: ${data.details}` : '',
            data.preferredDate ? `Requested date (not confirmed): ${data.preferredDate}` : '',
            uploaded.length ? `Reference images included: ${uploaded.length}` : 'Reference images included: none',
            ...referenceLines
          ].filter(Boolean).join('\n')
        })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.ok) throw new Error(result.error || 'request failed');
      form.reset();
      say('Thank you. Your request and reference images have been received securely. We will review the idea before confirming price and production timing.', 'Mulțumim. Cererea și imaginile de referință au fost primite în siguranță. Vom analiza ideea înainte de a confirma prețul și termenul de realizare.');
    } catch (error) {
      console.error(error);
      say('We could not send the request safely. Please try again or contact us without closing this page.', 'Cererea nu a putut fi trimisă în siguranță. Te rugăm să încerci din nou sau să ne contactezi fără să închizi această pagină.');
    } finally {
      submit.disabled = false;
    }
  });
})();
