/**
 * Vintage Comic Book / Cartoon Theme Logic
 * Jasorsi Ghosh Personal Website
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initModals();
  initLightbox();
  initCopyActions();
});

/* ==========================================================================
   1. Theme Management (Newsprint Daylight vs Comic Noir)
   ========================================================================== */
function initTheme() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  const savedTheme = localStorage.getItem('comic-theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  toggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('comic-theme', newTheme);
    updateThemeIcon(newTheme);
  });
}

function updateThemeIcon(theme) {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;
  const iconSpan = toggleBtn.querySelector('.theme-icon') || toggleBtn;
  iconSpan.textContent = theme === 'dark' ? '🌙' : '☀️';
  toggleBtn.setAttribute('title', theme === 'dark' ? 'Switch to Newsprint Daylight' : 'Switch to Comic Noir');
}

/* ==========================================================================
   2. Responsive Navigation
   ========================================================================== */
function initNavigation() {
  const mobileBtn = document.getElementById('mobile-menu-toggle');
  const navLinks = document.getElementById('nav-links');

  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      mobileBtn.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileBtn.textContent = '☰';
      });
    });
  }

  // Active state scrollspy
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset + 120;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop;
      const sectionId = current.getAttribute('id');
      const navItem = document.querySelector(`.nav-link[href*="${sectionId}"]`);
      if (navItem) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navItem.classList.add('active');
        } else {
          navItem.classList.remove('active');
        }
      }
    });
  }, { passive: true });
}

/* ==========================================================================
   3. Comic Overlay Modals (Talks, Portfolio, Poster)
   ========================================================================== */
function initModals() {
  document.querySelectorAll('.comic-modal-close-btn, [data-modal-close]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const modal = btn.closest('.comic-modal-backdrop');
      if (modal) closeModal(modal);
    });
  });

  document.querySelectorAll('.comic-modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const openModal = document.querySelector('.comic-modal-backdrop.active');
      if (openModal) closeModal(openModal);
      const openLightbox = document.querySelector('.bd-lightbox-backdrop.active');
      if (openLightbox) closeImageLightbox();
    }
  });
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modal) {
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

window.openTalkModal = function(part) {
  openModal(`talk-modal-part${part}`);
};

window.openPortfolioModal = function(key) {
  openModal(`portfolio-modal-${key}`);
};

window.openPosterModal = function() {
  openModal('poster-modal');
};

/* ==========================================================================
   4. Standalone Image Lightbox Magnifier Modal
   ========================================================================== */
function initLightbox() {
  const lightbox = document.getElementById('image-lightbox-modal');
  if (!lightbox) return;

  // Backdrop click closes
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeImageLightbox();
    }
  });

  // Attach click listeners to all gallery cards & subimages
  document.querySelectorAll('.comic-modal-img-card').forEach(card => {
    card.style.cursor = 'zoom-in';
    card.addEventListener('click', (e) => {
      e.stopPropagation();
      const img = card.querySelector('img');
      const small = card.querySelector('small');
      if (img) {
        const title = card.getAttribute('data-title') || img.getAttribute('alt') || 'Magnified Technical View';
        const desc = card.getAttribute('data-desc') || (small ? small.textContent.trim() : (img.getAttribute('alt') || ''));
        openImageLightbox(img.src, title, desc);
      }
    });
  });

  // Attach click listeners to talk cards images or previews
  document.querySelectorAll('.bd-talk-img-wrap, .bd-portfolio-preview').forEach(wrap => {
    wrap.style.cursor = 'zoom-in';
    wrap.addEventListener('click', (e) => {
      e.stopPropagation();
      const img = wrap.querySelector('img');
      const parent = wrap.closest('article');
      const title = parent ? (parent.querySelector('.bd-talk-title, .bd-portfolio-title')?.textContent.trim() || 'Technical Visualization') : 'Technical Visualization';
      const desc = parent ? (parent.querySelector('.bd-talk-desc, .bd-portfolio-desc')?.textContent.trim() || '') : '';
      if (img) {
        openImageLightbox(img.src, title, desc);
      }
    });
  });
}

window.openImageLightbox = function(src, title, desc) {
  const lightbox = document.getElementById('image-lightbox-modal');
  if (!lightbox) return;

  const imgEl = document.getElementById('lightbox-img');
  const titleEl = document.getElementById('lightbox-title');
  const descEl = document.getElementById('lightbox-desc');

  if (imgEl) {
    imgEl.src = src;
    imgEl.alt = title || 'Magnified Image';
  }
  if (titleEl) {
    titleEl.textContent = title || 'Magnified View';
  }
  if (descEl) {
    descEl.textContent = desc || '';
  }

  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
};

window.closeImageLightbox = function() {
  const lightbox = document.getElementById('image-lightbox-modal');
  if (lightbox) {
    lightbox.classList.remove('active');
    // Only restore scroll if no other modal is active
    if (!document.querySelector('.comic-modal-backdrop.active')) {
      document.body.style.overflow = '';
    }
  }
};

/* ==========================================================================
   5. Copy to Clipboard Utility
   ========================================================================== */
function initCopyActions() {
  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy);
        const originalText = btn.innerHTML;
        btn.innerHTML = '<span>✅</span> Copied!';
        setTimeout(() => {
          btn.innerHTML = originalText;
        }, 2000);
      } catch (err) {
        console.error('Copy failed:', err);
      }
    });
  });
}
