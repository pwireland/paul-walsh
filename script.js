(() => {
  const data = window.SITE_DATA || {};

  const writingGrid = document.getElementById('writing-grid');
  (data.writing || []).forEach((item) => {
    const el = document.createElement(item.url ? 'a' : 'article');
    el.className = 'article-card reveal';
    if (item.url) {
      el.href = item.url;
      el.target = '_blank';
      el.rel = 'noreferrer';
    }
    el.innerHTML = `
      <div class="article-meta">${item.date || ''}<br>${item.category || ''}</div>
      <h3>${item.title || ''}</h3>
      <p>${item.summary || ''}</p>
      <span class="article-cta">${item.url ? 'Read on LinkedIn ↗' : ''}</span>
      <span class="article-arrow" aria-hidden="true">${item.url ? '↗' : '—'}</span>`;
    writingGrid?.appendChild(el);
  });

  const artGrid = document.getElementById('art-grid');
  (data.art || []).forEach((item) => {
    const card = document.createElement('figure');
    card.className = 'art-card reveal';
    const img = document.createElement('img');
    img.src = item.image || '';
    img.alt = item.title || 'Artwork by Paul Walsh';
    img.loading = 'lazy';
    img.addEventListener('error', () => {
      img.remove();
      const fallback = document.createElement('div');
      fallback.className = 'art-fallback';
      card.prepend(fallback);
    }, { once: true });
    const caption = document.createElement('figcaption');
    caption.className = 'art-caption';
    caption.innerHTML = `<span>${item.title || ''}</span><span>${item.medium || ''}</span>`;
    card.append(img, caption);
    artGrid?.appendChild(card);
  });

  const album = data.album || {};
  const albumTitle = document.getElementById('album-title');
  const albumDescription = document.getElementById('album-description');
  const albumTracks = document.getElementById('album-tracks');
  const albumLink = document.getElementById('album-link');
  const albumArtistLink = document.getElementById('album-artist-link');
  if (albumTitle && album.title) albumTitle.textContent = album.title;
  if (albumDescription && album.description) albumDescription.textContent = album.description;
  (album.tracks || []).forEach((track) => {
    const row = document.createElement('div');
    row.className = 'track';
    row.textContent = track;
    albumTracks?.appendChild(row);
  });
  if (albumLink && album.listenUrl) {
    albumLink.href = album.listenUrl;
    albumLink.classList.remove('is-hidden');
  }
  if (albumArtistLink && album.artistUrl) {
    albumArtistLink.href = album.artistUrl;
    albumArtistLink.classList.remove('is-hidden');
  }

  const awardGrid = document.getElementById('award-grid');
  (data.awards || []).forEach((item) => {
    const el = document.createElement(item.url ? 'a' : 'article');
    el.className = 'award-card reveal';
    if (item.url) {
      el.href = item.url;
      el.target = '_blank';
      el.rel = 'noreferrer';
    }
    el.innerHTML = `
      <span class="record-type">${item.type || 'Award'}</span>
      <div>
        <h3>${item.title || ''}</h3>
        <p>${item.meta || ''}</p>
      </div>
      <span class="record-arrow" aria-hidden="true">${item.url ? '↗' : '—'}</span>`;
    awardGrid?.appendChild(el);
  });

  const credentialList = document.getElementById('credential-list');
  (data.certifications || []).forEach((item) => {
    const el = document.createElement(item.url ? 'a' : 'div');
    el.className = 'credential-row';
    if (item.url) {
      el.href = item.url;
      el.target = '_blank';
      el.rel = 'noreferrer';
    }
    el.innerHTML = `
      <span class="credential-date">${item.date || ''}</span>
      <span><span class="credential-title">${item.title || ''}</span><br><span class="credential-provider">${item.provider || ''}</span></span>
      <span class="credential-id">${item.id ? `Credential ${item.id}` : ''}</span>
      <span class="credential-arrow" aria-hidden="true">${item.url ? '↗' : '—'}</span>`;
    credentialList?.appendChild(el);
  });

  const contacts = document.getElementById('contact-links');
  const decodeEmail = () => {
    // Best-effort anti-harvesting: the address never appears as plain text in HTML or site-data.
    const mask = 23;
    const encoded = [103,118,98,123,57,96,118,123,100,127,57,103,127,115,87,112,122,118,126,123,57,116,120,122];
    return encoded.map((n) => String.fromCharCode(n ^ mask)).join('');
  };
  const contactItems = data.contact || [];
  if (contactItems.length) {
    contactItems.forEach((item) => {
      if (item.kind === 'email') {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'contact-link contact-email';
        button.innerHTML = `${item.label}<span>↗</span>`;
        button.setAttribute('aria-label', 'Email Paul Walsh');
        button.addEventListener('click', () => {
          window.location.href = `mailto:${decodeEmail()}`;
        });
        contacts?.appendChild(button);
        return;
      }
      if (!item.url) return;
      const a = document.createElement('a');
      a.className = 'contact-link';
      a.href = item.url;
      a.target = item.url.endsWith('.pdf') ? '_blank' : '_blank';
      a.rel = 'noreferrer';
      a.innerHTML = `${item.label}<span>↗</span>`;
      contacts?.appendChild(a);
    });
  } else if (contacts) {
    contacts.innerHTML = '<span class="contact-placeholder">Contact details unavailable</span>';
  }

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('site-nav');
  toggle?.addEventListener('click', () => {
    const open = nav?.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(Boolean(open)));
  });
  nav?.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
    nav.classList.remove('is-open');
    toggle?.setAttribute('aria-expanded', 'false');
  }));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

  const canvas = document.getElementById('field');
  const ctx = canvas?.getContext('2d');
  if (!canvas || !ctx || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let w = 0, h = 0, raf = 0;
  const dots = Array.from({ length: 28 }, (_, i) => ({
    x: (i * 83 % 997) / 997,
    y: (i * 149 % 991) / 991,
    r: 0.7 + (i % 4) * 0.32,
    s: 0.000035 + (i % 5) * 0.000008
  }));
  const resize = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    w = innerWidth; h = innerHeight;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  const draw = (t) => {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(21,23,21,.18)';
    dots.forEach((d, i) => {
      const x = (d.x * w + Math.sin(t * d.s + i) * 18 + w) % w;
      const y = (d.y * h + Math.cos(t * d.s * .7 + i) * 14 + h) % h;
      ctx.beginPath(); ctx.arc(x, y, d.r, 0, Math.PI * 2); ctx.fill();
    });
    raf = requestAnimationFrame(draw);
  };
  addEventListener('resize', resize, { passive: true });
  resize(); raf = requestAnimationFrame(draw);
  addEventListener('pagehide', () => cancelAnimationFrame(raf), { once: true });
})();
