(() => {
  const form = document.getElementById('customRequestForm');
  if (!form) return;
  const filesInput = document.getElementById('customReferenceFiles');
  const status = document.getElementById('customRequestStatus');
  const maxFiles = 5;
  const maxSize = 4 * 1024 * 1024;
  const allowed = new Set(['image/jpeg', 'image/png', 'image/webp']);

  const copy = {
    en:{tooMany:'Please choose no more than five reference images.',invalid:'References must be JPG, PNG or WEBP and no larger than 4 MB each.',selected:n=>`${n} reference image${n===1?'':'s'} selected.`,preparing:'Preparing your custom request…',success:'Thank you. Your request and reference images have been received securely. We will review the idea before confirming price and production timing.',error:'We could not send the request safely. Any newly uploaded reference images were removed. Please try again.'},
    ro:{tooMany:'Te rugăm să alegi maximum cinci imagini de referință.',invalid:'Referințele trebuie să fie JPG, PNG sau WEBP și să nu depășească 4 MB fiecare.',selected:n=>`${n} ${n===1?'imagine de referință selectată':'imagini de referință selectate'}.`,preparing:'Pregătim cererea ta personalizată…',success:'Mulțumim. Cererea și imaginile de referință au fost primite în siguranță. Vom analiza ideea înainte de a confirma prețul și termenul de realizare.',error:'Cererea nu a putut fi trimisă în siguranță. Imaginile de referință încărcate pentru această încercare au fost eliminate. Te rugăm să încerci din nou.'},
    fr:{tooMany:'Veuillez sélectionner au maximum cinq images de référence.',invalid:'Les références doivent être au format JPG, PNG ou WEBP et ne pas dépasser 4 Mo chacune.',selected:n=>`${n} image${n>1?'s':''} de référence sélectionnée${n>1?'s':''}.`,preparing:'Préparation de votre demande sur mesure…',success:'Merci. Votre demande et vos images de référence ont bien été reçues de manière sécurisée. Nous étudierons votre idée avant de confirmer le prix et le délai de fabrication.',error:'Votre demande n’a pas pu être envoyée en toute sécurité. Les nouvelles images téléversées pour cette tentative ont été supprimées. Veuillez réessayer.'},
    it:{tooMany:'Seleziona al massimo cinque immagini di riferimento.',invalid:'Le immagini di riferimento devono essere JPG, PNG o WEBP e non superare 4 MB ciascuna.',selected:n=>`${n} ${n===1?'immagine di riferimento selezionata':'immagini di riferimento selezionate'}.`,preparing:'Stiamo preparando la tua richiesta su misura…',success:'Grazie. La richiesta e le immagini di riferimento sono state ricevute in modo sicuro. Valuteremo l’idea prima di confermare il prezzo e i tempi di produzione.',error:'Non è stato possibile inviare la richiesta in modo sicuro. Le nuove immagini caricate durante questo tentativo sono state eliminate. Riprova.'},
    de:{tooMany:'Bitte wählen Sie höchstens fünf Referenzbilder aus.',invalid:'Referenzbilder müssen im JPG-, PNG- oder WEBP-Format vorliegen und dürfen jeweils höchstens 4 MB groß sein.',selected:n=>`${n} Referenzbild${n===1?'':'er'} ausgewählt.`,preparing:'Ihre individuelle Anfrage wird vorbereitet…',success:'Vielen Dank. Ihre Anfrage und die Referenzbilder wurden sicher übermittelt. Wir prüfen Ihre Idee, bevor wir Preis und Fertigungszeit bestätigen.',error:'Die Anfrage konnte nicht sicher gesendet werden. Neu hochgeladene Referenzbilder dieses Versuchs wurden entfernt. Bitte versuchen Sie es erneut.'}
  };
  const language=()=>{const l=(window.VELVET_GET_LANGUAGE?.()||document.documentElement.lang||localStorage.getItem('velvet_language_art_gifts')||'en').slice(0,2).toLowerCase();return copy[l]?l:'en';};
  const say=value=>{status.textContent=typeof value==='function'?value(copy[language()]):copy[language()][value];};

  async function cleanupUploaded(uploaded) {
    await Promise.allSettled(uploaded.map(file => fetch('/api/delete-reference', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pathname: file.pathname, key: file.accessKey })
    })));
  }

  filesInput.addEventListener('change', () => {
    const files = [...filesInput.files];
    if (files.length > maxFiles) { filesInput.value=''; say('tooMany'); return; }
    const bad = files.find(file => !allowed.has(file.type) || file.size > maxSize);
    if (bad) { filesInput.value=''; say('invalid'); return; }
    status.textContent = files.length ? copy[language()].selected(files.length) : '';
  });

  form.addEventListener('submit', async event => {
    event.preventDefault();
    const files=[...filesInput.files]; if(files.length>maxFiles) return;
    const submit=form.querySelector('button[type="submit"]'); submit.disabled=true; say('preparing');
    const uploaded=[];
    try {
      for(const file of files){
        const body=new FormData(); body.append('file',file);
        const response=await fetch('/api/upload',{method:'POST',body});
        const result=await response.json().catch(()=>({}));
        if(!response.ok||!result.ok||!result.file?.viewUrl||!result.file?.pathname||!result.file?.accessKey) throw new Error(result.error||'reference upload failed');
        uploaded.push(result.file);
      }
      const data=Object.fromEntries(new FormData(form).entries());
      const referenceLines=uploaded.map((file,index)=>`Reference ${index+1}: ${file.originalName||'image'} — ${new URL(file.viewUrl,window.location.origin).href}`);
      const response=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:data.name,email:data.email,message:['CUSTOM CREATION REQUEST','',`Idea: ${data.idea}`,data.details?`Preferred size / materials / details: ${data.details}`:'',data.preferredDate?`Requested date (not confirmed): ${data.preferredDate}`:'',uploaded.length?`Reference images included: ${uploaded.length}`:'Reference images included: none',...referenceLines].filter(Boolean).join('\n')})});
      const result=await response.json().catch(()=>({}));
      if(!response.ok||!result.ok) throw new Error(result.error||'request failed');
      form.reset(); say('success');
    } catch(error){
      console.error(error); if(uploaded.length) await cleanupUploaded(uploaded); say('error');
    } finally { submit.disabled=false; }
  });
})();