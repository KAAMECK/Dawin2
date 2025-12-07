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

/* RSVP: validation + envoi */
(function rsvpFormLogic() {
  const form = document.getElementById("rsvpForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const nom = document.getElementById("nom").value.trim();
    const presence = document.querySelector('input[name="presence"]:checked')?.value;
    const errNom = document.getElementById("err-nom");

    // Nettoyage erreurs
    errNom.textContent = "";

    // Validation minimale
    if (!nom || nom.length < 2) {
      errNom.textContent = "Merci d’indiquer votre nom et prénom.";
      document.getElementById("nom").focus();
      return;
    }
    if (!presence) {
      showNotif("⚠️ Merci de choisir Présent(e) ou Absent(e).");
      return;
    }

    // Préparer données
    const formData = new FormData();
    formData.append("nom", nom);
    formData.append("presence", presence);

    // Envoi vers rsvp.php
    fetch("rsvp.php", {
      method: "POST",
      body: formData
    })
      .then(response => response.text())
      .then(message => {
        showNotif(message);
        form.reset();
      })
      .catch(() => {
        showNotif("❌ Une erreur est survenue.");
      });
  });

  /* Bulle de notification */
  function showNotif(message) {
    const notif = document.getElementById("notif");
    notif.textContent = message;
    notif.classList.add("show");

    setTimeout(() => {
      notif.classList.remove("show");
    }, 4000);
  }
})();