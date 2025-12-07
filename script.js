/* Révélation douce au scroll */
(function revealOnScroll() {
  const items = Array.from(document.querySelectorAll('.reveal'));
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // révéler une fois
      }
    }
  }, { threshold: 0.12 });
  items.forEach(el => observer.observe(el));
})();

/* RSVP: validation et stockage local */
(function rsvpFormLogic() {
  const form = document.getElementById('rsvpForm');
  if (!form) return;

  const nom = document.getElementById('nom');
  const errNom = document.getElementById('err-nom');
  const saveDraftBtn = document.getElementById('saveDraft');

  // Charger l’ébauche
  const draft = JSON.parse(localStorage.getItem('rsvpDraft') || '{}');
  if (draft.nom) nom.value = draft.nom;
  if (draft.message) document.getElementById('message').value = draft.message;

  saveDraftBtn.addEventListener('click', () => {
    localStorage.setItem('rsvpDraft', JSON.stringify({
      nom: nom.value.trim(),
      message: document.getElementById('message').value.trim()
    }));
    toast('Brouillon enregistré');
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Nettoyage erreurs
    errNom.textContent = '';

    // Validation minimale
    const name = nom.value.trim();
    if (!name || name.length < 2) {
      errNom.textContent = 'Merci d’indiquer votre nom et prénom.';
      nom.focus();
      return;
    }

    // Simuler la confirmation (à remplacer par une API ou un envoi réel)
    const payload = {
      nom: name,
      message: document.getElementById('message').value.trim(),
      timestamp: new Date().toISOString()
    };

    // Stockage local (fallback)
    const all = JSON.parse(localStorage.getItem('rsvpSubmits') || '[]');
    all.push(payload);
    localStorage.setItem('rsvpSubmits', JSON.stringify(all));

    // Option: envoi via mailto (décommente pour activer)
    // window.location.href = `mailto:contact@dawin.example?subject=RSVP%20BENVINDU&body=${encodeURIComponent(`Nom: ${payload.nom}\nMessage: ${payload.message || '-'}`)}`;

    form.reset();
    toast('Présence confirmée ! À très bientôt.');
  });

  /* Petit toast accessible */
  function toast(message) {
    const el = document.createElement('div');
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    el.className = 'toast';
    el.textContent = message;
    document.body.appendChild(el);
    requestAnimationFrame(() => el.classList.add('show'));
    setTimeout(() => {
      el.classList.remove('show');
      setTimeout(() => el.remove(), 300);
    }, 2200);
  }

  // Styles inline pour le toast (isolé, pas de dépendance CSS supplémentaire)
  const style = document.createElement('style');
  style.textContent = `
    .toast {
      position: fixed; left: 50%; bottom: 24px; transform: translateX(-50%);
      background: #2b2141; color: #fff; padding: 10px 14px; border-radius: 10px;
      box-shadow: 0 10px 24px rgba(34,25,63,0.18); opacity: 0; transition: opacity .25s ease;
      z-index: 1000; font: menu;
    }
    .toast.show { opacity: 1; }
  `;
  document.head.appendChild(style);
})();