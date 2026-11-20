/* Page interactions. This static site needs no build step or application backend. */
(() => {
    'use strict';
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const categoryNames = { video: 'AI Videos', image: 'AI-Generated Images', software: 'Software Development' };
    const container = document.getElementById('projects-container');
    const escapeHTML = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
    let revealObserver;

    function registerReveal(element, delay = 0) {
        if (element.dataset.revealBound) return;
        element.dataset.revealBound = 'true';
        element.classList.add('reveal');
        element.style.transitionDelay = `${delay}ms`;
        if (reducedMotion.matches || !revealObserver) element.classList.add('is-visible');
        else revealObserver.observe(element);
    }

    function renderProjectCards(filter = 'all') {
        container.querySelectorAll('[data-reveal-bound]').forEach(element => revealObserver?.unobserve(element));
        container.replaceChildren();
        const selected = projectsData.filter(project => filter === 'all' || project.category === filter);
        for (const [category, label] of Object.entries(categoryNames)) {
            const projects = selected.filter(project => project.category === category);
            if (!projects.length) continue;
            const group = document.createElement('div');
            group.className = 'project-group mb-20 last:mb-0';
            const heading = document.createElement('h3');
            heading.className = 'mb-8 border-b border-line pb-6 font-serif text-3xl text-ink md:text-4xl';
            heading.textContent = label;
            group.appendChild(heading);
            const grid = document.createElement('div');
            grid.className = 'grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3';
            for (const [index, project] of projects.entries()) {
                const card = document.createElement('article');
                card.className = 'project-card group flex flex-col bg-surface p-6 transition-colors hover:bg-surface-alt md:p-8';
                card.dataset.projectId = project.id;
                card.dataset.category = category;
                const thumbnail = project.thumbnail || project.src || project.images[0];
                const action = category === 'video' ? 'Watch Video' : category === 'image' ? 'View Image' : 'View Project';
                const summary = project.description || `${project.images.length} project screenshots`;
                const alt = project.alt || (category === 'video' ? `Frame from ${project.title}` : `${project.title} application screenshot`);
                const tools = project.tools || project.technologies;
                card.innerHTML = `
                    <button type="button" class="project-thumbnail ${category === 'video' ? 'video-thumbnail' : ''}" data-open-project="${escapeHTML(project.id)}" aria-label="${action}: ${escapeHTML(project.title)}">
                        <img src="${escapeHTML(thumbnail)}" alt="${escapeHTML(alt)}" loading="lazy" decoding="async" class="aspect-[4/3] w-full object-${category === 'video' ? 'contain' : 'cover'} object-center transition-transform duration-500 group-hover:scale-105">
                        ${category === 'video' ? '<span class="video-play-icon" aria-hidden="true"><i class="fa fa-play"></i></span>' : ''}
                    </button>
                    <p class="mt-6 text-sm uppercase tracking-[0.15em] text-muted">${escapeHTML(label)}</p>
                    <h4 class="mt-2 font-serif text-2xl leading-snug text-ink">${escapeHTML(project.title)}</h4>
                    <p class="mt-4 text-base leading-relaxed text-muted">${escapeHTML(summary)}</p>
                    ${tools?.length ? `<p class="mt-4 text-sm leading-relaxed text-muted"><span class="font-medium">${project.tools ? 'Tools' : 'Technologies'}:</span> ${tools.map(escapeHTML).join(' · ')}</p>` : ''}
                    <div class="mt-auto flex flex-wrap gap-5 pt-6">
                        <button type="button" data-open-project="${escapeHTML(project.id)}" class="project-action" aria-label="${action}: ${escapeHTML(project.title)}">${action}</button>
                    </div>`;
                for (const [key, text] of [['repository', 'Repository'], ['demo', 'Live Demo']]) {
                    if (!project[key] || !/^https:\/\//.test(project[key])) continue;
                    const link = document.createElement('a');
                    link.href = project[key];
                    link.textContent = text;
                    link.className = 'project-action';
                    link.target = '_blank';
                    link.rel = 'noopener noreferrer';
                    card.lastElementChild.appendChild(link);
                }
                grid.appendChild(card);
                registerReveal(card, (index % 3) * 70);
            }
            group.appendChild(grid);
            container.appendChild(group);
        }
        if (!selected.length) {
            const message = document.createElement('p');
            message.className = 'border border-line p-8 text-base text-muted';
            message.textContent = 'No projects in this category yet.';
            container.appendChild(message);
        }
        document.getElementById('projects-status').textContent = `${selected.length} project${selected.length === 1 ? '' : 's'} · ${filter === 'all' ? 'All Projects' : categoryNames[filter]}`;
        document.querySelectorAll('.project-filter').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === filter)));
    }
    document.querySelector('.project-filters').addEventListener('click', event => {
        const filter = event.target.closest('[data-filter]');
        if (filter) renderProjectCards(filter.dataset.filter);
    });

    // Dialog focus stays in the preview and returns to its trigger.
    let activeModal = null;
    let restoreFocus = null;
    const previousInert = new Map();
    const focusableSelector = 'button:not(:disabled), a[href], input, textarea, select, video[controls], [tabindex="0"]';
    function openModal(modal, trigger) {
        if (activeModal) closeModal();
        activeModal = modal;
        restoreFocus = trigger || document.activeElement;
        modal.classList.remove('hidden');
        modal.querySelector('.project-modal-panel')?.scrollTo(0, 0);
        document.body.classList.add('modal-open');
        for (const child of document.body.children) {
            if (child === modal || child.tagName === 'SCRIPT') continue;
            previousInert.set(child, child.inert);
            child.inert = true;
        }
        modal.querySelector('[aria-label="Close preview"]').focus({ preventScroll: true });
    }
    function closeModal() {
        if (!activeModal) return;
        const modal = activeModal;
        modal.classList.add('hidden');
        if (modal.id === 'project-modal') {
            video.pause();
            video.removeAttribute('src');
            video.removeAttribute('poster');
            video.load();
            video.classList.add('hidden');
            modalImage.onload = null;
            modalImage.removeAttribute('src');
            project = null;
        } else document.getElementById('cert-modal-image').removeAttribute('src');
        for (const [element, value] of previousInert) element.inert = value;
        previousInert.clear();
        document.body.classList.remove('modal-open');
        activeModal = null;
        if (restoreFocus?.isConnected) restoreFocus.focus({ preventScroll: true });
        restoreFocus = null;
    }

    const projectModal = document.getElementById('project-modal');
    const modalTitle = document.getElementById('project-modal-title');
    const modalDetails = document.getElementById('project-modal-details');
    const modalCounter = document.getElementById('project-modal-counter');
    const modalImage = document.getElementById('project-modal-image');
    const video = document.getElementById('project-modal-video');
    const modalFrame = document.getElementById('project-modal-frame');
    const modalStage = document.getElementById('project-modal-stage');
    const modalDots = document.getElementById('project-modal-dots');
    const modalStatus = document.getElementById('project-modal-status');
    const previous = document.getElementById('project-prev');
    const next = document.getElementById('project-next');
    let project = null;
    let currentIndex = 0;

    function updateProjectSlide() {
        const images = project.images || [project.src];
        const isVideo = project.category === 'video';
        modalImage.classList.toggle('hidden', isVideo);
        video.classList.toggle('hidden', !isVideo);
        modalFrame.classList.toggle('is-video', isVideo);
        modalCounter.hidden = images.length <= 1;
        modalCounter.textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(images.length).padStart(2, '0')}`;
        previous.classList.toggle('hidden', images.length <= 1);
        next.classList.toggle('hidden', images.length <= 1);
        previous.disabled = currentIndex === 0;
        next.disabled = currentIndex === images.length - 1;
        modalDots.classList.toggle('hidden', images.length <= 1);
        modalDots.replaceChildren();
        if (isVideo) {
            modalFrame.classList.remove('is-mobile', 'is-desktop');
            modalStage.classList.remove('mobile-view');
            video.poster = project.thumbnail;
            video.src = project.src;
            video.setAttribute('aria-label', project.title);
            video.load();
            return;
        }
        modalImage.classList.add('is-changing');
        modalImage.onload = () => {
            const mobile = project?.mobile || modalImage.naturalHeight > modalImage.naturalWidth * 1.05;
            modalFrame.classList.toggle('is-mobile', mobile);
            modalFrame.classList.toggle('is-desktop', !mobile);
            modalStage.classList.toggle('mobile-view', mobile);
            modalImage.classList.toggle('mobile-screenshot', mobile);
            modalImage.classList.toggle('desktop-screenshot', !mobile);
            modalImage.classList.remove('is-changing');
        };
        modalImage.alt = project.alt || `${project.title} screenshot ${currentIndex + 1} of ${images.length}`;
        modalImage.src = images[currentIndex];
        modalStatus.textContent = images.length > 1 ? `Screenshot ${currentIndex + 1} of ${images.length}. Use the previous and next buttons or left and right arrow keys.` : '';
        images.forEach((_, index) => {
            if (Math.abs(index - currentIndex) > 2 && index !== 0 && index !== images.length - 1) return;
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = `project-dot${index === currentIndex ? ' active' : ''}`;
            dot.dataset.index = index;
            dot.setAttribute('aria-label', `Go to image ${index + 1}`);
            if (index === currentIndex) dot.setAttribute('aria-current', 'true');
            modalDots.appendChild(dot);
        });
    }
    function showSlide(index) {
        if (!project?.images || index < 0 || index >= project.images.length) return;
        currentIndex = index;
        updateProjectSlide();
    }
    function openProject(projectData, trigger) {
        project = projectData;
        currentIndex = 0;
        modalTitle.textContent = project.title;
        modalDetails.replaceChildren();
        for (const text of [project.description, project.tools?.length ? `Tools: ${project.tools.join(' · ')}` : '', project.technologies?.length ? `Technologies: ${project.technologies.join(' · ')}` : '']) {
            if (!text) continue;
            const paragraph = document.createElement('p');
            paragraph.textContent = text;
            modalDetails.appendChild(paragraph);
        }
        modalStatus.textContent = '';
        updateProjectSlide();
        openModal(projectModal, trigger);
    }
    container.addEventListener('click', event => {
        const trigger = event.target.closest('[data-open-project]');
        if (!trigger) return;
        const selected = projectsData.find(item => item.id === trigger.dataset.openProject);
        if (selected) openProject(selected, trigger);
    });
    previous.addEventListener('click', () => showSlide(currentIndex - 1));
    next.addEventListener('click', () => showSlide(currentIndex + 1));
    modalDots.addEventListener('click', event => {
        const dot = event.target.closest('[data-index]');
        if (!dot) return;
        const index = Number(dot.dataset.index);
        showSlide(index);
        modalDots.querySelector(`[data-index="${index}"]`)?.focus();
    });
    modalImage.addEventListener('error', () => {
        if (project) modalStatus.textContent = 'This image could not be loaded. Please try another screenshot or reopen the preview.';
    });
    video.addEventListener('error', () => {
        if (project?.category === 'video' && video.hasAttribute('src')) modalStatus.textContent = 'This video could not be played. Please try a browser that supports MP4 video.';
    });

    const certModal = document.getElementById('cert-modal');
    document.querySelectorAll('.cert-card').forEach(card => {
        card.addEventListener('click', () => {
            document.getElementById('cert-modal-title').textContent = card.dataset.title;
            const image = document.getElementById('cert-modal-image');
            image.src = card.dataset.image;
            image.alt = `${card.dataset.title} certificate`;
            openModal(certModal, card);
        });
    });
    for (const id of ['cert-modal-close', 'cert-modal-backdrop', 'project-modal-close', 'project-modal-backdrop']) document.getElementById(id).addEventListener('click', closeModal);
    document.addEventListener('keydown', event => {
        if (!activeModal) return;
        if (event.key === 'Escape') { event.preventDefault(); closeModal(); return; }
        if (event.key === 'Tab') {
            const controls = [...activeModal.querySelectorAll(focusableSelector)].filter(element => element.getClientRects().length && !element.closest('[hidden], .hidden'));
            const first = controls[0];
            const last = controls.at(-1);
            if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
            else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
        }
        if (activeModal === projectModal && project?.category === 'software') {
            if (event.key === 'ArrowLeft') { event.preventDefault(); showSlide(currentIndex - 1); }
            if (event.key === 'ArrowRight') { event.preventDefault(); showSlide(currentIndex + 1); }
        }
    });

    const menuToggle = document.getElementById('menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    function closeMenu() { mobileNav.classList.add('hidden'); menuToggle.setAttribute('aria-expanded', 'false'); }
    menuToggle.addEventListener('click', () => {
        const expanded = mobileNav.classList.toggle('hidden') === false;
        menuToggle.setAttribute('aria-expanded', String(expanded));
    });
    document.querySelectorAll('#mobile-nav a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') { closeMenu(); menuToggle.focus(); }
    });
    window.matchMedia('(min-width: 768px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    function updateNavigation() {
        let current = 'home';
        for (const section of sections) if (window.scrollY >= section.offsetTop - 160) current = section.id;
        for (const link of navLinks) {
            const active = link.getAttribute('href') === `#${current}`;
            link.classList.toggle('active', active);
            if (active) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
        }
    }
    window.addEventListener('scroll', updateNavigation, { passive: true });
    document.getElementById('contact-form').addEventListener('submit', event => {
        event.preventDefault();
        const fields = new FormData(event.currentTarget);
        const body = `Name: ${fields.get('name')}\nEmail: ${fields.get('email')}\n\n${fields.get('message')}`;
        const recipient = event.currentTarget.getAttribute('action');
        const draft = `${recipient}?subject=${encodeURIComponent(fields.get('subject').trim())}&body=${encodeURIComponent(body)}`;
        document.getElementById('contact-status').textContent = 'Opening your email app. If no draft appears, use the direct email link to get in touch.';
        window.location.href = draft;
    });
    document.addEventListener('DOMContentLoaded', () => {
        if ('IntersectionObserver' in window && !reducedMotion.matches) {
            revealObserver = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add('is-visible');
                    revealObserver.unobserve(entry.target);
                });
            }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
        }
        document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-stagger, .cert-card').forEach((element, index) => registerReveal(element, Number(element.dataset.revealDelay) || (index % 3) * 70));
        renderProjectCards();
        updateNavigation();
        if (window.Typed && !reducedMotion.matches) {
            new window.Typed('.typing', { strings: ['AI Visual Content Creator', 'Creative Designer', 'IT Developer'], typeSpeed: 65, backSpeed: 40, backDelay: 1800, loop: true });
        }
    });
    reducedMotion.addEventListener('change', event => {
        if (event.matches) {
            revealObserver?.disconnect();
            document.querySelectorAll('.reveal').forEach(element => element.classList.add('is-visible'));
        }
    });
})();
