/* ==========================================================================
   DOM VARIABLES & GLOBAL STATE
   ========================================================================== */
const savedScrollPositions = {};
const savedVideoTimes = {}; 
const trackedScrolls = new Set(); 

const gallery = document.getElementById('gallery');
const caseSliderContainer = document.getElementById('case-slider-container');
const header = document.getElementById('main-header');
const footer = document.getElementById('main-footer');
const mainVideo = document.getElementById('main-video');
const videoLoader = document.getElementById('video-loader');
const playerWrapper = document.querySelector('.player-wrapper');
const progressBar = document.getElementById('progress-bar');

const views = {
    home: document.getElementById('view-home'),
    about: document.getElementById('view-about'),
    case: document.getElementById('view-case'),
    player: document.getElementById('view-player')
};

let activeCaseData = null;
let playerIdleTimer;
let isPreventingClicks = false; 
let progressAnimation;
let parsedVttCues = null;
let vttTimeUpdateHandler = null;

/* ==========================================================================
   UTILITY & PERFORMANCE FUNCTIONS
   ========================================================================== */

/**
 * Logs memory usage to console if supported
 */
function logMemoryUsage(context) {
    if (window.performance && window.performance.memory) {
        const memory = window.performance.memory;
        const usedMB = Math.round(memory.usedJSHeapSize / (1024 * 1024));
        const totalMB = Math.round(memory.totalJSHeapSize / (1024 * 1024));
        const limitMB = Math.round(memory.jsHeapSizeLimit / (1024 * 1024));
        console.log(`📊 [Memory | ${context}] Used: ${usedMB}MB / Allocated: ${totalMB}MB (Limit: ${limitMB}MB)`);
    } else {
        console.log("The performance.memory API is not supported in this browser.");
    }
}

/**
 * Prepares visual morphing transition classes
 */
function prepareMorph(elementToMorph, targetMediaId = null, keepMediaActive = true) {
    document.querySelectorAll('.active-morph-element').forEach(el => el.classList.remove('active-morph-element'));
    if (elementToMorph) elementToMorph.classList.add('active-morph-element');
    
    if (keepMediaActive) {
        if (targetMediaId) {
            const targetMedia = document.getElementById(targetMediaId);
            if (targetMedia) targetMedia.classList.add('active-morph-element');
        }
        playerWrapper.classList.add('active-morph-element');
    }
}

/* ==========================================================================
   VIEW NAVIGATION & ROUTING
   ========================================================================== */

/**
 * Handles core view switching logic and GA4 routing events
 */
function switchView(viewName) {
    Object.values(views).forEach(v => { 
        v.classList.remove('active'); 
        v.style.display = 'none'; 
    });

    views[viewName].style.display = viewName === 'player' ? 'flex' : 'block';
    void views[viewName].offsetWidth; // Trigger reflow
    views[viewName].classList.add('active');
    
    // Header and Footer management
    if (['case', 'player', 'about'].includes(viewName)) { 
        header.classList.add('hidden-header'); 
        footer.classList.add('hidden-footer'); // Smoothly hides the footer on inner pages
    } else { 
        header.classList.remove('hidden-header'); 
        footer.classList.remove('hidden-footer'); // Smoothly brings it back on home view
    }
    
    if (viewName !== 'home' && gallery) {
        gallery.classList.remove('has-entrance');
    }

    // Player specific state cleanup
    if (viewName === 'player') { 
        document.body.classList.add('player-active'); 
    } else { 
        document.body.classList.remove('player-active'); 
        mainVideo.pause(); 
        if (progressBar) progressBar.style.width = '0%'; 
    }
    
    // Back button visibility and tab index management
    const backBtn = document.getElementById('back-button');
    if (viewName === 'home') { 
        backBtn.classList.add('hidden'); 
        backBtn.setAttribute('tabindex', '-1'); 
    } else { 
        backBtn.classList.remove('hidden'); 
        backBtn.setAttribute('tabindex', '0'); 
    }
    
    // GA4 Page View tracking
    const customTitle = (viewName === 'case' && activeCaseData) 
        ? `Case: ${activeCaseData.title}` 
        : viewName.charAt(0).toUpperCase() + viewName.slice(1);

    if (typeof gtag === 'function') {
        gtag('event', 'page_view', {
            page_title: customTitle,
            page_location: window.location.href + '#' + viewName,
            page_path: '/' + viewName
        });
    }
    
    logMemoryUsage(`Entered view: ${viewName}`);
}

/**
 * View Transition API wrapper
 */
function transitionTo(viewName, callback) {
    const updateDOM = () => {
        if (views[viewName]) {
            switchView(viewName);
            if (callback) callback();
        } else {
            console.error("View not found:", viewName);
            switchView('home');
        }
    };

    if (document.startViewTransition && !document.documentElement.classList.contains('a11y-reduce-motion')) {
        document.startViewTransition(updateDOM);
    } else {
        updateDOM();
    }
}

/**
 * Transition from Gallery Thumbnail to Case Reader
 */
function openCaseView(caseData, clickedThumbEl, index) {
    activeCaseData = caseData;
    prepareMorph(clickedThumbEl, `media-${caseData.id}`);
    document.documentElement.classList.add('slide-up-transition');
    document.documentElement.classList.remove('slide-down-transition');

    const updateDOMAndScroll = () => {
        switchView('case');
        caseSliderContainer.style.scrollBehavior = 'auto'; 
        const targetSlide = caseSliderContainer.querySelectorAll('.case-slide-wrapper')[index];
        
        if (targetSlide) {
            targetSlide.scrollIntoView({ inline: 'center', block: 'nearest' });
            
            // Restore previous scroll position if exists
            const scrollEl = document.getElementById(`scroll-${caseData.id}`);
            if (scrollEl && savedScrollPositions[caseData.id]) {
                setTimeout(() => {
                    scrollEl.scrollTo({ 
                        top: savedScrollPositions[caseData.id], 
                        behavior: 'instant' 
                    });
                }, 10);
            }
            // Focus accessibility
            const activePlayBtn = targetSlide.querySelector('.btn-play-case');
            if (activePlayBtn) activePlayBtn.focus();
        }

        setTimeout(() => { caseSliderContainer.style.scrollBehavior = 'smooth'; }, 50);
    };

    if (document.startViewTransition && !document.documentElement.classList.contains('a11y-reduce-motion')) {
        document.startViewTransition(updateDOMAndScroll);
    } else { 
        updateDOMAndScroll(); 
    }
}

/* ==========================================================================
   PORTFOLIO ENGINE & DOM CONSTRUCTION
   ========================================================================== */

/**
 * Slide Intersection Observer
 */
const slideObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const actionElements = entry.target.querySelectorAll('.btn-play-case, .btn-secondary-pill');
        
        if (entry.isIntersecting) {
            const visibleCaseId = entry.target.dataset.caseId;
            // Assuming portfolioCases is defined globally elsewhere
            const foundCase = typeof portfolioCases !== 'undefined' ? portfolioCases.find(c => c.id === visibleCaseId) : null;
            if (foundCase) activeCaseData = foundCase;
            
            const slideIndex = Array.from(caseSliderContainer.children).indexOf(entry.target);
            document.querySelectorAll('.slider-dot').forEach((dot, idx) => {
                dot.classList.toggle('active', idx === slideIndex);
            });
            
            actionElements.forEach(el => el.setAttribute('tabindex', '0'));
        } else {
            actionElements.forEach(el => el.setAttribute('tabindex', '-1'));
        }
    });
}, { root: caseSliderContainer, threshold: 0.6 });

/**
 * Configures scroll dynamics and GA4 tracking per case
 */
function setupCaseScrollEffect(id) {
    const scrollContainer = document.getElementById(`scroll-${id}`);
    if (!scrollContainer) return;
    
    const layout = scrollContainer.closest('.case-layout');
    const slideWrapper = scrollContainer.closest('.case-slide-wrapper'); 
    if (!layout) return;

    const handleScroll = (e) => {
        const scrollTop = e.target.scrollTop;

        if (scrollTop > 50) {
            layout.classList.add('is-scrolled');
            
            // GA4 Tracking
            if (!trackedScrolls.has(id) && typeof gtag === 'function') {
                trackedScrolls.add(id); 
                const caseObj = portfolioCases.find(c => c.id === id);
                
                gtag('event', 'read_case_started', {
                    case_id: id,
                    case_title: caseObj ? caseObj.title : id,
                    content_type: 'portfolio_case'
                });
            }
        } else {
            layout.classList.remove('is-scrolled');
        }
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    if (slideWrapper) {
        slideWrapper.addEventListener('scroll', handleScroll);
    }
}

/**
 * Builds the gallery, case slides, and navigation
 */
function initPortfolio() {
    if (typeof portfolioCases === 'undefined') return;

    gallery.innerHTML = '';
    caseSliderContainer.innerHTML = '';
    const dotsContainer = document.getElementById('slider-dots-container');
    if (dotsContainer) dotsContainer.innerHTML = '';

    portfolioCases.forEach((item, index) => {
        // --- 1. HOME GALLERY (STRUCTURAL WRAPPER & METADATA) ---
        const galleryItem = document.createElement('div');
        galleryItem.className = `gallery-item ${item.deviceClass || ''}`;
        if (item.customGap) galleryItem.style.marginRight = item.customGap;

        const thumb = document.createElement('div');
        thumb.className = `case-thumb-wrapper`;
        thumb.dataset.caseId = item.id; 
        thumb.tabIndex = 0; 
        
        const priorityAttr = index === 0 ? 'fetchpriority="high"' : '';
        const thumbLogoHTML = (item.logoUrl && item.logoUrl.trim() !== "") 
            ? `<img src="${item.logoUrl}" class="gallery-item-logo" alt="${item.title} Logo" onerror="this.remove();">`
            : "";
        
        thumb.innerHTML = `
            <img src="${item.thumbSrc}" class="case-thumb-img" alt="Thumbnail ${item.title}" ${priorityAttr}>
            ${thumbLogoHTML}
        `;

        let functionalPillsHTML = '';
        if (item.videoSrc && item.videoSrc.trim() !== "") functionalPillsHTML += `<span class="gallery-pill">Pitch</span>`;
        if (item.repositoryUrl && item.repositoryUrl.trim() !== "") functionalPillsHTML += `<span class="gallery-pill">Repo</span>`;
        if (item.liveUrl && item.liveUrl.trim() !== "") functionalPillsHTML += `<span class="gallery-pill">Demo</span>`;

        const metaContainer = document.createElement('div');
        metaContainer.className = 'gallery-item-meta';
        metaContainer.innerHTML = `
            <div class="gallery-item-header no-logo">
                <div class="gallery-item-text">
                    <span class="gallery-item-year">${item.year}</span>
                    <h4 class="gallery-item-title">${item.title}</h4>
                </div>
            </div>
            <div class="gallery-item-pills">${functionalPillsHTML}</div>
        `;

        galleryItem.appendChild(thumb);
        galleryItem.appendChild(metaContainer);

        // Thumbnail Interactions
        galleryItem.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isPreventingClicks) return;
            
            if (typeof gtag === 'function') {
                gtag('event', 'select_content', {
                    content_type: 'portfolio_case',
                    item_id: item.id,
                    item_name: item.title
                });
            }
            openCaseView(item, thumb, index); 
        });
        
        galleryItem.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                openCaseView(item, thumb, index);
            }
        });
        
        gallery.appendChild(galleryItem);
        
        // --- 2. DETAIL SLIDER (SLIDES) ---
        const slide = document.createElement('div');
        slide.className = `case-slide-wrapper ${item.deviceClass || ''}`;
        slide.dataset.caseId = item.id;
        
        let actionsHTML = '';
        const hasVideo = item.videoSrc && item.videoSrc.trim() !== "";
        const hasRepo = item.repositoryUrl && item.repositoryUrl.trim() !== "";
        const hasLive = item.liveUrl && item.liveUrl.trim() !== "";

        if (hasVideo || hasRepo || hasLive) {
            actionsHTML += `<div class="case-actions-group">`;

            if (hasVideo) {
                actionsHTML += `
                    <button class="btn-play-pill btn-play-case" data-id="${item.id}" tabindex="-1" aria-label="Play final result of ${item.title}">
                        <span class="play-icon-circle">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                                <path d="M8 5V19L19 12L8 5Z" fill="black"/>
                            </svg>
                        </span>
                        <span>Pitch</span>
                    </button>
                `;
            }

            if (hasRepo) {
                actionsHTML += `
                    <a href="${item.repositoryUrl}" target="_blank" class="btn-secondary-pill" tabindex="-1" aria-label="Repository code for ${item.title}">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                        </svg>
                        <span>Repository</span>
                    </a>
                `;
            }

            if (hasLive) {
                actionsHTML += `
                    <a href="${item.liveUrl}" target="_blank" class="btn-secondary-pill" tabindex="-1" aria-label="Live demo for ${item.title}">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M24 22.525H0L12 1.475L24 22.525Z"/>
                        </svg>
                        <span>Demo</span>
                    </a>
                `;
            }

            actionsHTML += `</div>`;
        }
        
        const caseLogoHTML = (item.logoUrl && item.logoUrl.trim() !== "") 
            ? `<img src="${item.logoUrl}" class="case-detail-logo" alt="${item.title} Logo" onerror="this.style.display='none'">`
            : "";

        slide.innerHTML = `
            <div class="case-layout">
                <div class="case-media" id="media-${item.id}">
                    <img src="${item.thumbSrc}" class="case-thumb-img" alt="Thumbnail ${item.title}">
                    ${caseLogoHTML}
                </div>
                <div class="case-info-container">
                    <div class="case-info-scroll" id="scroll-${item.id}">
                        <div class="case-info-content">
                            <div class="case-header-row">
                                <div class="case-title-block">
                                    <h3 class="case-year-label">${item.year}</h3>
                                    <h2>${item.title}</h2>
                                    ${actionsHTML} 
                                </div>
                            </div>
                            <div class="case-description-body">
                                ${item.desc} 
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        caseSliderContainer.appendChild(slide);
        setupCaseScrollEffect(item.id);
        
        if (window.Prism) { window.Prism.highlightAllUnder(slide); }
        slideObserver.observe(slide); 
        
        // --- 3. SLIDER DOTS ---
        if (dotsContainer) {
            const dot = document.createElement('div');
            dot.className = `slider-dot ${index === 0 ? 'active' : ''}`;
            dot.tabIndex = 0; 
            dot.setAttribute('role', 'button');
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);

            const scrollToThisSlide = () => {
                const targetSlide = caseSliderContainer.querySelectorAll('.case-slide-wrapper')[index];
                if (targetSlide) {
                    const reduceMotion = document.documentElement.classList.contains('a11y-reduce-motion');
                    targetSlide.scrollIntoView({ 
                        inline: 'center', 
                        behavior: reduceMotion ? 'auto' : 'smooth' 
                    });
                }
            };

            dot.addEventListener('click', (e) => { e.stopPropagation(); scrollToThisSlide(); });
            dot.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); scrollToThisSlide(); }
            });

            dotsContainer.appendChild(dot);
        }
        
        // --- 4. TABLE OF CONTENTS ---
        const descBody = slide.querySelector('.case-description-body');
        const headings = descBody ? descBody.querySelectorAll('h3') : [];
        
        if (headings.length > 0) {
            const tocContainer = document.createElement('div');
            tocContainer.className = 'case-toc';
            
            const btnTopo = document.createElement('div');
            btnTopo.className = 'toc-item active'; 
            btnTopo.style.marginBottom = '16px'; 
            btnTopo.innerHTML = `
                <div class="toc-text-wrapper">
                    <div class="toc-text">Back to top</div>
                </div>
                <span class="toc-dash" style="width: 6px; height: 6px; border-radius: 50%;"></span>
            `;
            
            btnTopo.addEventListener('click', (e) => {
                e.stopPropagation();
                const scrollContainer = slide.querySelector('.case-info-scroll');
                scrollContainer._isAnimating = false;
                if (scrollContainer._animationFrameId) cancelAnimationFrame(scrollContainer._animationFrameId);
                scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
            });
            
            tocContainer.appendChild(btnTopo);

            headings.forEach((h3, hIndex) => {
                const tocItem = document.createElement('div');
                tocItem.className = 'toc-item'; 
                tocItem.innerHTML = `
                    <div class="toc-text-wrapper">
                        <div class="toc-text">${h3.innerText}</div>
                    </div>
                    <span class="toc-dash"></span>
                `;
                
                tocItem.addEventListener('click', (e) => {
                    e.stopPropagation(); 
                    const scrollContainer = slide.querySelector('.case-info-scroll');
                    scrollContainer._isAnimating = false;
                    if (scrollContainer._animationFrameId) cancelAnimationFrame(scrollContainer._animationFrameId);
                    
                    const containerTop = scrollContainer.getBoundingClientRect().top;
                    const h3Top = h3.getBoundingClientRect().top;
                    const currentScroll = scrollContainer.scrollTop;
                    const targetPos = currentScroll + (h3Top - containerTop) - 80; 
                    
                    scrollContainer.scrollTo({ top: targetPos, behavior: 'smooth' });
                });
                
                tocContainer.appendChild(tocItem);
            });
            
            slide.querySelector('.case-layout').appendChild(tocContainer);
            
            // TOC Scroll Syncing
            const scrollContainer = slide.querySelector('.case-info-scroll');
            scrollContainer.addEventListener('scroll', () => {
                let currentActive = 0; 
                const containerTop = scrollContainer.getBoundingClientRect().top;
                
                headings.forEach((h3, i) => {
                    const h3Top = h3.getBoundingClientRect().top;
                    if ((h3Top - containerTop) <= 120) { currentActive = i + 1; }
                });
                
                const tocItems = tocContainer.querySelectorAll('.toc-item');
                tocItems.forEach(item => item.classList.remove('active'));
                if (tocItems[currentActive]) tocItems[currentActive].classList.add('active');
            });
        }
    });

    // --- 5. PLAY BUTTON LISTENERS ---
    document.querySelectorAll('.btn-play-case').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); playSpecificCase(btn.dataset.id);
        });
        btn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault(); playSpecificCase(btn.dataset.id);
            }
        });
    });
}

/* ==========================================================================
   SCROLL MECHANICS & PHYSICS (Drag & Wheel)
   ========================================================================== */

function setupGalleryDrag(container) {
    let isDown = false;
    let startX, startY, startScrollLeft, lastX;
    let velocity = 0, lastTime, animationFrameId;
    let hasTriggeredVertical = false;

    const handleStart = (e) => {
        if (e.target.closest('button, a, .floating-back-btn, .nav-link')) return;
        isDown = true;
        hasTriggeredVertical = false;
        isPreventingClicks = false;
        
        if (container._animationFrameId) cancelAnimationFrame(container._animationFrameId);
        container._isAnimating = false;
        container._wheelTarget = container.scrollLeft; 
        
        cancelAnimationFrame(animationFrameId); 
        container.classList.add('dragging');
        container.style.scrollBehavior = 'auto';
        startX = e.pageX;
        startY = e.pageY;
        startScrollLeft = container.scrollLeft;
        lastX = e.pageX;
        lastTime = performance.now();
        velocity = 0;
    };

    const handleMove = (e) => {
        if (!isDown || hasTriggeredVertical) return;
        const pageX = e.pageX;
        const walkX = pageX - startX;
        const maxScroll = container.scrollWidth - container.clientWidth;
        const reduceMotion = document.documentElement.classList.contains('a11y-reduce-motion');

        e.preventDefault();
        if (Math.abs(walkX) > 5) isPreventingClicks = true;

        if (reduceMotion) {
            const now = performance.now();
            const dt = now - lastTime;
            if (dt > 0) velocity = (pageX - lastX) / dt;
            lastX = pageX; lastTime = now;
            return; 
        }

        const targetScroll = startScrollLeft - walkX; 
        if (targetScroll < 0) {
            const overscroll = Math.pow(Math.abs(targetScroll), 0.7);
            container.style.transform = `translateX(${overscroll}px)`;
            container.scrollLeft = 0;
        } else if (targetScroll > maxScroll) {
            const overscroll = Math.pow(targetScroll - maxScroll, 0.7);
            container.style.transform = `translateX(${-overscroll}px)`;
            container.scrollLeft = maxScroll;
        } else {
            container.style.transform = `translateX(0px)`;
            container.scrollLeft = targetScroll;
        }

        const now = performance.now();
        const dt = now - lastTime;
        if (dt > 0) velocity = (pageX - lastX) / dt;
        lastX = pageX; lastTime = now;
    };

    const handleEnd = () => {
        if (!isDown || hasTriggeredVertical) return;
        isDown = false;
        container.classList.remove('dragging');
        container.style.transform = `translateX(0px)`;
        const reduceMotion = document.documentElement.classList.contains('a11y-reduce-motion');

        if (reduceMotion) {
            const finalMovement = (lastX - startX) * 1.2; 
            container.scrollLeft = startScrollLeft - finalMovement;
            setTimeout(() => { isPreventingClicks = false; }, 50);
            return;
        }

        if (Math.abs(velocity) > 0.1) {
            const amplitude = velocity * 300; 
            let targetScroll = container.scrollLeft - amplitude;
            targetScroll = Math.max(0, Math.min(targetScroll, container.scrollWidth - container.clientWidth));

            const startAnimScroll = container.scrollLeft;
            const distance = targetScroll - startAnimScroll;
            let startTime = null;
            const animateScroll = (currentTime) => {
                if (!startTime) startTime = currentTime;
                const progress = Math.min((currentTime - startTime) / 800, 1);
                const easeOutQuint = (t) => 1 - Math.pow(1 - t, 5);
                container.scrollLeft = startAnimScroll + (distance * easeOutQuint(progress));
                if (progress < 1) animationFrameId = requestAnimationFrame(animateScroll);
                else setTimeout(() => { isPreventingClicks = false; }, 50);
            };
            animationFrameId = requestAnimationFrame(animateScroll);
        } else { setTimeout(() => { isPreventingClicks = false; }, 50); }
    };

    container.addEventListener('mousedown', handleStart);
    container.addEventListener('mouseleave', handleEnd);
    container.addEventListener('mouseup', handleEnd);
    container.addEventListener('mousemove', handleMove);
}

function setupSliderDrag(container) {
    let isDown = false;
    let startX, startY, startScrollLeft, draggedDistance = 0;
    let animationFrameId, hasTriggeredVertical = false;

    const handleStart = (e) => {
        if (e.target.closest('button, a, .floating-back-btn, .nav-link')) return;
        isDown = true; hasTriggeredVertical = false; isPreventingClicks = false;
        
        if (container._animationFrameId) cancelAnimationFrame(container._animationFrameId);
        container._isAnimating = false;
        
        cancelAnimationFrame(animationFrameId);
        container.style.scrollSnapType = 'none';
        container.style.scrollBehavior = 'auto';
        container.classList.add('dragging'); 
        startX = e.pageX; startY = e.pageY;
        startScrollLeft = container.scrollLeft;
        draggedDistance = 0;
    };

    const handleMove = (e) => {
        if (!isDown || hasTriggeredVertical) return;
        const walkX = e.pageX - startX;
        const reduceMotion = document.documentElement.classList.contains('a11y-reduce-motion');

        e.preventDefault();
        draggedDistance = walkX;
        if (Math.abs(draggedDistance) > 5) isPreventingClicks = true;

        if (reduceMotion) return; 

        const maxScroll = container.scrollWidth - container.clientWidth;
        if (container.scrollLeft <= 0 && draggedDistance > 0) {
            container.style.transform = `translateX(${Math.pow(draggedDistance, 0.75)}px)`;
        } else if (container.scrollLeft >= maxScroll && draggedDistance < 0) {
            container.style.transform = `translateX(${-Math.pow(Math.abs(draggedDistance), 0.75)}px)`;
        } else {
            container.style.transform = `translateX(0px)`;
            container.scrollLeft = startScrollLeft - draggedDistance;
        }
    };

    const handleEnd = () => {
        if (!isDown || hasTriggeredVertical) return;
        isDown = false;
        container.classList.remove('dragging');
        container.style.transform = `translateX(0px)`;
        
        const slideWidth = window.innerWidth;
        const reduceMotion = document.documentElement.classList.contains('a11y-reduce-motion');
        
        const startIndex = Math.round(startScrollLeft / slideWidth);
        let targetIndex;
        const swipeThreshold = slideWidth * 0.15; 

        if (draggedDistance < -swipeThreshold) targetIndex = startIndex + 1;
        else if (draggedDistance > swipeThreshold) targetIndex = startIndex - 1;
        else targetIndex = startIndex;

        const maxIndex = container.children.length - 1;
        targetIndex = Math.max(0, Math.min(targetIndex, maxIndex));
        const targetScrollLeft = targetIndex * slideWidth;

        if (reduceMotion) {
            container.scrollLeft = targetScrollLeft;
            container.style.scrollSnapType = '';
            container.style.scrollBehavior = '';
            setTimeout(() => { isPreventingClicks = false; }, 50);
        } else {
            const startAnimScroll = container.scrollLeft;
            const distance = targetScrollLeft - startAnimScroll;
            let startTime = null;
            const animateScroll = (currentTime) => {
                if (!startTime) startTime = currentTime;
                const progress = Math.min((currentTime - startTime) / 800, 1);
                const easeOutQuint = (t) => 1 - Math.pow(1 - t, 5);
                container.scrollLeft = startAnimScroll + (distance * easeOutQuint(progress));
                if (progress < 1) animationFrameId = requestAnimationFrame(animateScroll);
                else {
                    container.style.scrollSnapType = '';
                    container.style.scrollBehavior = '';
                    setTimeout(() => { isPreventingClicks = false; }, 50);
                }
            };
            animationFrameId = requestAnimationFrame(animateScroll);
        }
    };

    container.addEventListener('mousedown', handleStart);
    container.addEventListener('mouseleave', handleEnd);
    container.addEventListener('mouseup', handleEnd);
    container.addEventListener('mousemove', handleMove);
}

function setupWheelScroll(container, isCaseView = false) {
    container.addEventListener('wheel', (e) => {
        // 1. Reading Mode Vertical Scroll (Case View)
        if (isCaseView && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            const slideWidth = window.innerWidth;
            let currentIndex = Math.round(container.scrollLeft / slideWidth);
            const slides = container.querySelectorAll('.case-slide-wrapper');
            currentIndex = Math.max(0, Math.min(currentIndex, slides.length - 1));
            
            const currentSlide = slides[currentIndex];
            const currentCaseId = currentSlide ? currentSlide.dataset.caseId : null;

            if (currentCaseId) {
                const scrollEl = document.getElementById(`scroll-${currentCaseId}`);
                if (scrollEl) {
                    e.preventDefault(); 
                    
                    if (!scrollEl._isAnimating) {
                        scrollEl._wheelTarget = scrollEl.scrollTop;
                    }
                    scrollEl._wheelTarget += e.deltaY; 
                    
                    const maxScroll = scrollEl.scrollHeight - scrollEl.clientHeight;
                    scrollEl._wheelTarget = Math.max(0, Math.min(scrollEl._wheelTarget, maxScroll));

                    if (!scrollEl._isAnimating) {
                        scrollEl._isAnimating = true;
                        const smoothStep = () => {
                            if (!scrollEl._isAnimating) return;
                            scrollEl.scrollTop += (scrollEl._wheelTarget - scrollEl.scrollTop) * 0.12;
                            if (Math.abs(scrollEl._wheelTarget - scrollEl.scrollTop) > 1.5) {
                                scrollEl._animationFrameId = requestAnimationFrame(smoothStep);
                            } else {
                                scrollEl.scrollTop = scrollEl._wheelTarget;
                                scrollEl._isAnimating = false;
                            }
                        };
                        scrollEl._animationFrameId = requestAnimationFrame(smoothStep);
                    }
                    return; 
                }
            }
        }

        // 2. Horizontal Scroll (Gallery View)
        if (!isCaseView) {
            const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;

            if (delta !== 0) {
                e.preventDefault(); 

                if (!container._isAnimating) {
                    container._wheelTarget = container.scrollLeft;
                }
                container._wheelTarget += delta;
            
                const maxScroll = container.scrollWidth - container.clientWidth;
                container._wheelTarget = Math.max(0, Math.min(container._wheelTarget, maxScroll));

                if (!container._isAnimating) {
                    container._isAnimating = true;
                    const smoothStep = () => {
                        container.scrollLeft += (container._wheelTarget - container.scrollLeft) * 0.12;

                        if (Math.abs(container._wheelTarget - container.scrollLeft) > 1.5) {
                            container._animationFrameId = requestAnimationFrame(smoothStep);
                        } else {
                            container.scrollLeft = container._wheelTarget;
                            container._isAnimating = false;
                        }
                    };
                    container._animationFrameId = requestAnimationFrame(smoothStep);
                }
            }
        }
    }, { passive: false }); 
}

setupGalleryDrag(gallery); 
setupSliderDrag(caseSliderContainer);
setupWheelScroll(gallery, false); // Home: Horizontal Scroll
setupWheelScroll(caseSliderContainer, true); // Case: Vertical Scroll

/* ==========================================================================
   VIDEO PLAYER ENGINE
   ========================================================================== */

function unloadVideo(savePosition = false) {
    if (!mainVideo.src) return; 
    
    if (savePosition && activeCaseData) {
        savedVideoTimes[activeCaseData.id] = mainVideo.currentTime;
    } else if (activeCaseData) {
        delete savedVideoTimes[activeCaseData.id];
    }

    mainVideo.pause();
    // Remove manual VTT timeupdate handler if present
    if (vttTimeUpdateHandler) {
        mainVideo.removeEventListener('timeupdate', vttTimeUpdateHandler);
        vttTimeUpdateHandler = null;
        parsedVttCues = null;
    }
    mainVideo.removeAttribute('src');
    mainVideo.load(); // Force browser to dump buffer (Free RAM)
}

function playSpecificCase(id) {
    if (typeof portfolioCases === 'undefined') return;
    const caseData = portfolioCases.find(c => c.id === id);
    if (!caseData) return;
    
    const scrollEl = document.getElementById(`scroll-${id}`);
    if (scrollEl) savedScrollPositions[id] = scrollEl.scrollTop;

    const currentSrc = mainVideo.src.split('/').pop();
    const newSrc = caseData.videoSrc ? caseData.videoSrc.split('/').pop() : "";
    const isSameVideo = currentSrc === newSrc;

    // --- 1. SOURCE MANAGEMENT ---
    if (!isSameVideo) {
        mainVideo.style.opacity = '0'; 
        mainVideo.src = caseData.videoSrc;
        mainVideo.load();
        
        mainVideo.playbackRate = 1; 
        const speedLabel = document.getElementById('speed-text');
        if (speedLabel) speedLabel.textContent = "1X";
        
        mainVideo.onloadedmetadata = () => {
            if (savedVideoTimes[caseData.id]) {
                mainVideo.currentTime = savedVideoTimes[caseData.id];
            }
        };
        
        // --- 2. SUBTITLES / VTT ---
        const oldTrack = mainVideo.querySelector('track');
        if (oldTrack) oldTrack.remove();
        
        const subtitleBox = document.getElementById('custom-subtitle-container');
        subtitleBox.innerText = ""; 
        subtitleBox.style.display = "none";
        
        if (caseData.vttSrc) {
            const track = document.createElement('track');
            // Use captions (better mobile support) and try to infer language from filename
            track.kind = 'captions';
            track.src = caseData.vttSrc;
            track.srclang = caseData.vttSrc.includes('/en-') ? 'en' : (caseData.vttSrc.includes('/pt-') ? 'pt' : 'en');
            track.label = track.srclang === 'pt' ? 'Português' : 'English';
            // Start with captions off by default
            track.default = false;
            mainVideo.appendChild(track);

            // Some mobile browsers expose the TextTrack asynchronously — poll briefly
            const subtitleBox = document.getElementById('custom-subtitle-container');
            const setupTextTrack = () => {
                const textTrack = mainVideo.textTracks && mainVideo.textTracks[0];
                if (!textTrack) return false;
                const ccIconActive = !document.getElementById('icon-cc-on').classList.contains('hidden');
                try { textTrack.mode = ccIconActive ? 'hidden' : 'disabled'; } catch (e) {}

                textTrack.oncuechange = () => {
                    const activeCue = textTrack.activeCues && textTrack.activeCues[0];
                    if (activeCue && textTrack.mode === 'hidden') {
                        const cleanText = activeCue.text.replace(/<[^>]*>/g, "");
                        subtitleBox.innerText = cleanText;
                        subtitleBox.style.display = 'block';
                    } else {
                        subtitleBox.innerText = '';
                        subtitleBox.style.display = 'none';
                    }
                };
                return true;
            };

            if (!setupTextTrack()) {
                let waited = 0;
                const intervalId = setInterval(() => {
                    if (setupTextTrack() || waited > 3000) {
                        clearInterval(intervalId);
                    }
                    waited += 150;
                }, 150);
            }

            // Manual VTT parsing fallback (helps on browsers that don't fire cuechange)
            try {
                fetch(caseData.vttSrc).then(r => r.text()).then(vttText => {
                    parsedVttCues = parseVtt(vttText);
                    // attach a single timeupdate handler that updates subtitle box
                    const subtitleBox = document.getElementById('custom-subtitle-container');
                    if (vttTimeUpdateHandler) mainVideo.removeEventListener('timeupdate', vttTimeUpdateHandler);
                    vttTimeUpdateHandler = () => {
                        if (!parsedVttCues || parsedVttCues.length === 0) return;
                        const textTrack = mainVideo.textTracks && mainVideo.textTracks[0];
                        const ccEnabled = textTrack ? textTrack.mode === 'hidden' : !document.getElementById('icon-cc-on').classList.contains('hidden');
                        if (!ccEnabled) { subtitleBox.innerText = ''; subtitleBox.style.display = 'none'; return; }
                        const t = mainVideo.currentTime;
                        // find the cue where start <= t < end
                        let found = null;
                        // simple linear search is fine for short files
                        for (let i = 0; i < parsedVttCues.length; i++) {
                            const c = parsedVttCues[i];
                            if (t >= c.start && t < c.end) { found = c; break; }
                        }
                        if (found) {
                            subtitleBox.innerText = found.text;
                            subtitleBox.style.display = 'block';
                        } else {
                            subtitleBox.innerText = '';
                            subtitleBox.style.display = 'none';
                        }
                    };
                    mainVideo.addEventListener('timeupdate', vttTimeUpdateHandler);
                    // Ensure UI matches initial state
                    updateTogglesUI();
                }).catch(() => {
                    parsedVttCues = null;
                });
            } catch (e) { parsedVttCues = null; }
        }
    }

    // --- 3. FRAME AND DEVICE CONFIG ---
    activeCaseData = caseData;
    const frameImg = document.getElementById('player-phone-frame');
    if (frameImg) {
        if (caseData.frameSrc && caseData.frameSrc !== "") {
            frameImg.src = caseData.frameSrc;
            frameImg.style.display = 'block'; 
        } else {
            frameImg.style.display = 'none';  
        }
    }

    playerWrapper.className = 'player-wrapper'; 
    if (caseData.deviceClass) playerWrapper.classList.add(caseData.deviceClass); 

    prepareMorph(null, `media-${caseData.id}`);
    
    // --- 4. LOADER AND TRANSITION ---
    if (videoLoader) videoLoader.classList.remove('hidden');

    transitionTo('player', () => { 
        const startPlay = () => {
            mainVideo.style.opacity = '1';
            if (videoLoader) videoLoader.classList.add('hidden');
            
            mainVideo.play().catch(e => console.log("Error playing:", e));
            
            if (typeof gtag === 'function') {
                gtag('event', 'video_start', {
                    video_title: caseData.title,
                    video_id: caseData.id
                });
            }
            
            resetIdleTimer(); 
            updateTogglesUI();
            mainVideo.oncanplay = null; 
        };

        if (mainVideo.readyState >= 4) { startPlay(); } 
        else { mainVideo.oncanplay = startPlay; }
    });
}

// Media Event Listeners
mainVideo.addEventListener('waiting', () => videoLoader.classList.remove('hidden'));
mainVideo.addEventListener('playing', () => videoLoader.classList.add('hidden'));

function updateSmoothProgress() {
    if (mainVideo.duration && !mainVideo.paused) {
        const progress = (mainVideo.currentTime / mainVideo.duration) * 100;
        progressBar.style.width = `${progress}%`;
        progressAnimation = requestAnimationFrame(updateSmoothProgress);
    }
}

mainVideo.addEventListener('play', () => progressAnimation = requestAnimationFrame(updateSmoothProgress));
mainVideo.addEventListener('pause', () => cancelAnimationFrame(progressAnimation));

mainVideo.addEventListener('ended', () => {
    if (typeof gtag === 'function' && activeCaseData) {
        gtag('event', 'video_complete', { video_title: activeCaseData.title });
    }
    
    cancelAnimationFrame(progressAnimation);
    progressBar.style.width = '100%'; 
    
    setTimeout(() => { 
        progressBar.style.width = '0%';
        document.documentElement.classList.remove('slide-up-transition');
        document.documentElement.classList.add('slide-down-transition');
        unloadVideo(false); 
        if (activeCaseData) prepareMorph(null, `media-${activeCaseData.id}`, true);
        transitionTo('case'); 
    }, 500);
});

// Player Controls
document.getElementById('btn-stop').addEventListener('click', (e) => { 
    e.stopPropagation(); 
    document.documentElement.classList.remove('slide-up-transition');
    document.documentElement.classList.add('slide-down-transition');
    unloadVideo(false); 

    let activeThumbToScroll = null;
    if (activeCaseData) {
        const activeThumb = document.querySelector(`.case-thumb-wrapper[data-case-id="${activeCaseData.id}"]`);
        activeThumbToScroll = activeThumb;
        prepareMorph(activeThumb, null, true);
    }
    
    transitionTo('home', () => {
        if (activeThumbToScroll) {
            gallery.style.scrollBehavior = 'auto';
            const thumbRect = activeThumbToScroll.getBoundingClientRect();
            const galleryRect = gallery.getBoundingClientRect();
            gallery.scrollLeft += (thumbRect.left + thumbRect.width / 2) - (galleryRect.left + galleryRect.width / 2);
            setTimeout(() => { gallery.style.scrollBehavior = ''; }, 50); 
        }
    });
});

document.getElementById('btn-pause').addEventListener('click', (e) => { 
    e.stopPropagation(); 
    document.documentElement.classList.remove('slide-up-transition');
    document.documentElement.classList.add('slide-down-transition');
    unloadVideo(true); 

    if (activeCaseData) prepareMorph(null, `media-${activeCaseData.id}`, true);
    transitionTo('case'); 
});

document.getElementById('btn-cc').addEventListener('click', (e) => {
    e.stopPropagation();
    const track = mainVideo.textTracks && mainVideo.textTracks[0];
    const subtitleBox = document.getElementById('custom-subtitle-container');

    if (track) {
        if (track.mode === 'hidden') {
            track.mode = 'disabled';
            subtitleBox.innerText = "";
            subtitleBox.style.display = "none";
        } else {
            track.mode = 'hidden';
            if (track.activeCues && track.activeCues.length > 0) {
                const cleanText = track.activeCues[0].text.replace(/<[^>]*>/g, "");
                subtitleBox.innerText = cleanText;
                subtitleBox.style.display = "block";
            }
        }
        updateTogglesUI();
    } else {
        // No native TextTrack available (mobile fallback) — toggle icons and let manual handler respect icon state
        const iconOn = document.getElementById('icon-cc-on');
        const iconOff = document.getElementById('icon-cc-off');
        const isOn = !iconOn.classList.contains('hidden');
        if (isOn) {
            iconOn.classList.add('hidden');
            iconOff.classList.remove('hidden');
            subtitleBox.innerText = "";
            subtitleBox.style.display = 'none';
        } else {
            iconOn.classList.remove('hidden');
            iconOff.classList.add('hidden');
            // show current cue if available
            if (parsedVttCues && parsedVttCues.length) {
                const t = mainVideo.currentTime;
                let found = null;
                for (let i = 0; i < parsedVttCues.length; i++) {
                    const c = parsedVttCues[i];
                    if (t >= c.start && t < c.end) { found = c; break; }
                }
                if (found) { subtitleBox.innerText = found.text; subtitleBox.style.display = 'block'; }
            }
        }
    }
});

document.getElementById('btn-speed').addEventListener('click', (e) => {
    e.stopPropagation();
    const speedLabel = document.getElementById('speed-text');
    if (mainVideo.playbackRate === 1) { mainVideo.playbackRate = 1.5; speedLabel.textContent = "1.5X"; } 
    else if (mainVideo.playbackRate === 1.5) { mainVideo.playbackRate = 2; speedLabel.textContent = "2X"; } 
    else { mainVideo.playbackRate = 1; speedLabel.textContent = "1X"; }
    resetIdleTimer();
});

document.getElementById('btn-mute').addEventListener('click', (e) => {
    e.stopPropagation(); mainVideo.muted = !mainVideo.muted; updateTogglesUI();
});

function updateTogglesUI() {
    const track = mainVideo.textTracks[0];
    const isCCOn = track && track.mode === 'hidden';
    document.getElementById('icon-cc-on').classList.toggle('hidden', !isCCOn);
    document.getElementById('icon-cc-off').classList.toggle('hidden', isCCOn);
    
    const isMuted = mainVideo.muted;
    document.getElementById('icon-vol-on').classList.toggle('hidden', isMuted);
    document.getElementById('icon-vol-off').classList.toggle('hidden', !isMuted);
}

function resetIdleTimer() {
    const controls = document.getElementById('player-controls'); 
    if (!controls) return;

    controls.classList.remove('fade-out');
    clearTimeout(playerIdleTimer);

    playerIdleTimer = setTimeout(() => { 
        const isFocusInside = controls.contains(document.activeElement);
        if(!mainVideo.paused && !isFocusInside) controls.classList.add('fade-out'); 
    }, 2500);
}

views.player.addEventListener('mousemove', resetIdleTimer);
document.addEventListener('focusin', (e) => {
    if (views.player.style.display === 'flex' && e.target.closest('#player-controls')) resetIdleTimer();
});


/* ==========================================================================
   GLOBAL NAVIGATION & EVENT LISTENERS
   ========================================================================== */

document.addEventListener('contextmenu', (e) => e.preventDefault());
document.addEventListener('dragstart', (e) => e.preventDefault());

document.getElementById('back-button').addEventListener('click', (e) => {
    e.stopPropagation();
    document.documentElement.classList.remove('slide-up-transition');
    document.documentElement.classList.add('slide-down-transition');

    if (views.player.style.display === 'flex') { 
        unloadVideo(true); 
        prepareMorph(null, `media-${activeCaseData.id}`, true);
        transitionTo('case'); 
    } 
    else if (views.about.classList.contains('active')) {
        transitionTo('home');
    }
    else { 
        const activeId = activeCaseData ? activeCaseData.id : null;
        const activeThumb = activeId ? document.querySelector(`.case-thumb-wrapper[data-case-id="${activeId}"]`) : null;
        
        document.querySelectorAll('.active-morph-element').forEach(el => el.classList.remove('active-morph-element'));
        if (activeThumb) activeThumb.classList.add('active-morph-element');
        
        if (activeId) {
            const targetMedia = document.getElementById(`media-${activeId}`);
            if (targetMedia) targetMedia.classList.add('active-morph-element');
        }
        
        transitionTo('home', () => {
            if (activeThumb) {
                gallery.style.scrollBehavior = 'auto'; 
                const thumbRect = activeThumb.getBoundingClientRect();
                const galleryRect = gallery.getBoundingClientRect();
                gallery.scrollLeft += (thumbRect.left + thumbRect.width / 2) - (galleryRect.left + galleryRect.width / 2);
                setTimeout(() => { gallery.style.scrollBehavior = ''; }, 50);
            }
        }); 
    }
});

// Keydown Logic for App
document.addEventListener('keydown', (e) => {
    const aiChatWindow = document.getElementById('ai-chat-window');
    const isChatActive = aiChatWindow && !aiChatWindow.classList.contains('hidden');

    if (e.key === 'Escape') {
        if (isChatActive && typeof toggleAiChat === 'function') {
            toggleAiChat();
            return;
        }
        const activeLightbox = document.querySelector('.lightbox-overlay.active');
        if (activeLightbox) {
            activeLightbox.classList.remove('active');
            return; 
        }
        if (!views.home.classList.contains('active')) {
            document.getElementById('back-button').click();
        }
    }

    if (views.case.classList.contains('active')) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            if (isChatActive) return; 
            e.preventDefault(); 
            
            const slideWidth = window.innerWidth;
            const slides = caseSliderContainer.querySelectorAll('.case-slide-wrapper');
            if (slides.length === 0) return;

            let currentIndex = Math.round(caseSliderContainer.scrollLeft / slideWidth);
            let nextIndex = e.key === 'ArrowRight' ? currentIndex + 1 : currentIndex - 1;
            nextIndex = Math.max(0, Math.min(nextIndex, slides.length - 1));

            const reduceMotion = document.documentElement.classList.contains('a11y-reduce-motion');
            slides[nextIndex].scrollIntoView({
                inline: 'center',
                block: 'nearest',
                behavior: reduceMotion ? 'auto' : 'smooth'
            });

            const nextPlayBtn = slides[nextIndex].querySelector('.btn-play-case');
            if (nextPlayBtn) nextPlayBtn.focus({ preventScroll: true }); 
        } 
        else if (e.key === 'Enter') {
            if (isChatActive) return; 
            const activeEl = document.activeElement;
            const isInteractiveFocused = activeEl.tagName === 'BUTTON' || 
                                         activeEl.id === 'back-button' || 
                                         activeEl.classList.contains('slider-dot');
            
            if (!isInteractiveFocused && activeCaseData && activeCaseData.videoSrc) {
                e.preventDefault();
                playSpecificCase(activeCaseData.id);
            }
        }
    }
});

const backBtnEl = document.getElementById('back-button'); 
if (backBtnEl) {
    backBtnEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); backBtnEl.click(); }
    });
}

// Global Click Protection & Analytics Tracking
document.body.addEventListener('click', (e) => {
    const aiChatWindow = document.getElementById('ai-chat-window');
    const isChatActive = aiChatWindow && !aiChatWindow.classList.contains('hidden');

    if (isChatActive) {
        const clickedInsideChat = e.target.closest('#ai-chat-window');
        const clickedAiToggle = e.target.closest('#btn-ai-toggle') || e.target.closest('#ai-greeting-bubble');
        
        if (!clickedInsideChat && !clickedAiToggle && typeof toggleAiChat === 'function') {
            e.stopPropagation(); e.preventDefault(); toggleAiChat(); return; 
        }
        if (clickedInsideChat) return; 
    }

    if (isPreventingClicks) return; 
    
    // Contact Analytics Tracking
    if (typeof gtag === 'function') {
        const link = e.target.closest('a');
        if (link) {
            if (link.href.includes('mailto:')) gtag('event', 'generate_lead', { method: 'email' });
            else if (link.href.includes('linkedin.com')) gtag('event', 'contact_click', { method: 'linkedin' });
            else if (link.href.includes('github.com')) gtag('event', 'contact_click', { method: 'github' });
        }
    }
    
    const isClickable = e.target.closest('.case-thumb-wrapper, button, a, .nav-link, .player-overlay, .case-info-container, .about-content, .case-toc, .lightbox-overlay');
    
    if (!isClickable && !views.home.classList.contains('active')) { 
        document.documentElement.classList.remove('slide-up-transition');
        document.documentElement.classList.add('slide-down-transition');
        
        if (views.player.style.display === 'flex') unloadVideo(false); 

        let activeThumbToScroll = null;
        if (views.case.classList.contains('active') && activeCaseData) {
            const activeThumb = document.querySelector(`.case-thumb-wrapper[data-case-id="${activeCaseData.id}"]`);
            activeThumbToScroll = activeThumb; 
            
            document.querySelectorAll('.active-morph-element').forEach(el => el.classList.remove('active-morph-element'));
            if (activeThumb) activeThumb.classList.add('active-morph-element');
            
            const targetMedia = document.getElementById(`media-${activeCaseData.id}`);
            if (targetMedia) targetMedia.classList.add('active-morph-element');
        } else {
            prepareMorph(null, false);
        }

        transitionTo('home', () => {
            if (activeThumbToScroll) {
                gallery.style.scrollBehavior = 'auto';
                const thumbRect = activeThumbToScroll.getBoundingClientRect();
                const galleryRect = gallery.getBoundingClientRect();
                gallery.scrollLeft += (thumbRect.left + thumbRect.width / 2) - (galleryRect.left + galleryRect.width / 2);
                setTimeout(() => { gallery.style.scrollBehavior = ''; }, 50); 
            }
        }); 
    } 
}); 

document.getElementById('nav-about').addEventListener('click', (e) => {
    e.stopPropagation(); prepareMorph(null, false); transitionTo('about');
});
document.getElementById('nav-about').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); prepareMorph(null, false); transitionTo('about'); }
});


/* ==========================================================================
   STANDALONE MODULES (Lightbox, AI Chat, Viewport Sync)
   ========================================================================== */

// --- LIGHTBOX MODULE ---
const lightbox = document.createElement('div');
lightbox.className = 'lightbox-overlay';
lightbox.innerHTML = `<img class="lightbox-img" src="" alt="Zoomed Image">`;
document.body.appendChild(lightbox);
const lightboxImg = lightbox.querySelector('.lightbox-img');

document.addEventListener('click', (e) => {
    const clickedImage = e.target.closest('.case-asset-box.is-image img');
    if (clickedImage) {
        e.stopPropagation(); 
        lightboxImg.src = clickedImage.src; 
        lightbox.classList.add('active'); 
    }
});

lightbox.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevents click bleeding to background
    lightbox.classList.remove('active');
    setTimeout(() => { lightboxImg.src = ''; }, 300);
});

// --- AI CHAT WIDGET MODULE ---
const aiToggleBtn = document.getElementById('btn-ai-toggle');
const aiCloseBtn = document.getElementById('btn-close-ai');
const aiChatWindow = document.getElementById('ai-chat-window');
const aiChatMessages = document.getElementById('ai-chat-messages');
const aiChatInput = document.getElementById('ai-chat-input');
const aiSendBtn = document.getElementById('btn-send-ai');
const aiGreetingBubble = document.getElementById('ai-greeting-bubble');

function toggleAiChat() {
    if (!aiChatWindow) return;
    const isHidden = aiChatWindow.classList.toggle('hidden');
    aiChatWindow.setAttribute('aria-hidden', isHidden);
    document.body.classList.toggle('chat-open', !isHidden);
    
    if (aiGreetingBubble) {
        aiGreetingBubble.style.opacity = '0';
        aiGreetingBubble.style.pointerEvents = 'none';
    }

    if (!isHidden && aiChatInput) {
        aiChatInput.focus();
        if(typeof gtag === 'function') gtag('event', 'ai_chat_opened');
    }
}

function initAiSuggestionChips() {
    const chips = document.querySelectorAll('.suggestion-chip');
    const suggestionsContainer = document.getElementById('ai-chat-suggestions');

    chips.forEach(chip => {
        chip.addEventListener('click', (e) => {
            e.stopPropagation();
            const question = chip.getAttribute('data-question');
            if (question && aiChatInput) {
                aiChatInput.value = question;
                handleAiSubmit(); 
                if (suggestionsContainer) {
                    suggestionsContainer.style.transition = 'opacity 0.2s ease, visibility 0.2s ease';
                    suggestionsContainer.style.opacity = '0';
                    suggestionsContainer.style.visibility = 'hidden';
                    setTimeout(() => { suggestionsContainer.remove(); }, 200);
                }
            }
        });
    });
}

window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (aiGreetingBubble && aiChatWindow && aiChatWindow.classList.contains('hidden')) {
            aiGreetingBubble.style.opacity = '1';
            aiGreetingBubble.style.transform = 'translateX(0)';
        }
    }, 1200);
});

if (aiGreetingBubble) aiGreetingBubble.addEventListener('click', toggleAiChat);

function appendAiMessage(sender, text) {
    if (!aiChatMessages) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = `msg ${sender}-msg`;
    msgDiv.textContent = text; 
    msgDiv.innerHTML = msgDiv.innerHTML.replace(/\n/g, '<br>'); 
    aiChatMessages.appendChild(msgDiv);
    aiChatMessages.scrollTo({ top: aiChatMessages.scrollHeight, behavior: 'smooth' });
}

function updateSendButtonState() {
    if (aiSendBtn && aiChatInput) {
        aiSendBtn.disabled = aiChatInput.value.trim().length === 0;
    }
}

if (aiToggleBtn) aiToggleBtn.addEventListener('click', toggleAiChat);
if (aiCloseBtn) aiCloseBtn.addEventListener('click', toggleAiChat);
if (aiSendBtn) aiSendBtn.addEventListener('click', handleAiSubmit);
if (aiChatInput) {
    aiChatInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleAiSubmit(); });
    aiChatInput.addEventListener('input', updateSendButtonState);
}
updateSendButtonState();

async function handleAiSubmit() {
    if (!aiChatInput) return;
    const query = aiChatInput.value.trim();
    if (!query) return;

    appendAiMessage('user', query);
    aiChatInput.value = '';
    updateSendButtonState();
    
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'msg bot-msg ai-loading';
    loadingDiv.setAttribute('data-dots', '0');
    aiChatMessages.appendChild(loadingDiv);
    
    // Animate dots: . → .. → ... → . → ...
    const dotsInterval = setInterval(() => {
        const current = parseInt(loadingDiv.getAttribute('data-dots')) || 0;
        const next = (current + 1) % 3;
        const dotText = '.'.repeat(next + 1);
        loadingDiv.textContent = dotText;
        loadingDiv.setAttribute('data-dots', next.toString());
    }, 400);
    
    // Store interval ID on the loading div for cleanup
    loadingDiv._dotInterval = dotsInterval;

    try {
        const response = await fetch('api/chat.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: query })
        });
        const data = await response.json();
        clearInterval(loadingDiv._dotInterval);
        loadingDiv.remove();
        appendAiMessage('bot', data.reply || "I'm having trouble connecting right now. Let's try that again.");
    } catch (err) {
        clearInterval(loadingDiv._dotInterval);
        loadingDiv.remove();
        appendAiMessage('bot', "Connection timed out. Please try again later.");
        console.error("AI Proxy Err:", err);
    }
}

// --- VIEWPORT ADAPTATION ENGINE ---
let forceViewportRecalc = null; 

if (window.visualViewport) {
    const layoutViewportAdaptation = () => {
        if (window.innerWidth <= 768) {
            // Force document to stay at top absolute zero to prevent header panning off-screen
            if (window.scrollY !== 0 || window.scrollX !== 0) window.scrollTo(0, 0);

            const visibleHeight = window.visualViewport.height;
            const visibleWidth = window.visualViewport.width;
            const visibleTop = window.visualViewport.offsetTop;
            const visibleLeft = window.visualViewport.offsetLeft;

            document.documentElement.style.setProperty('--sv-height', `${visibleHeight}px`);
            document.documentElement.style.setProperty('--sv-width', `${visibleWidth}px`);
            document.documentElement.style.setProperty('--sv-top', `${visibleTop}px`);
            document.documentElement.style.setProperty('--sv-left', `${visibleLeft}px`);

            if (aiChatMessages) aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
        } else {
            document.documentElement.style.removeProperty('--sv-height');
            document.documentElement.style.removeProperty('--sv-width');
            document.documentElement.style.removeProperty('--sv-top');
            document.documentElement.style.removeProperty('--sv-left');
        }
    };

    window.visualViewport.addEventListener('resize', layoutViewportAdaptation);
    window.visualViewport.addEventListener('scroll', layoutViewportAdaptation);
    forceViewportRecalc = layoutViewportAdaptation;
}

// Mobile Keyboard Anti-Panning Focus Locks
if (aiChatInput) {
    aiChatInput.addEventListener('focus', () => {
        if (window.innerWidth <= 768) {
            setTimeout(() => {
                window.scrollTo(0, 0);
                if (aiChatMessages) aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
            }, 40);
        }
    });

    aiChatInput.addEventListener('blur', () => {
        if (window.innerWidth <= 768) window.scrollTo(0, 0);
    });
}

// Background Scroll Lock when Chat Open
window.addEventListener('touchmove', (e) => {
    if (document.body.classList.contains('chat-open')) {
        if (!e.target.closest('#ai-chat-messages') && !e.target.closest('.ai-chat-footer') && !e.target.closest('.ai-chat-header')) {
            e.preventDefault();
        }
    }
}, { passive: false });

// Anti-Scroll Bleeding Engine for Messages Stream
let chatTouchStartY = 0;
if (aiChatMessages) {
    aiChatMessages.addEventListener('touchstart', (e) => {
        chatTouchStartY = e.touches[0].pageY;
    }, { passive: true });

    aiChatMessages.addEventListener('touchmove', (e) => {
        const top = aiChatMessages.scrollTop;
        const totalScroll = aiChatMessages.scrollHeight;
        const currentScroll = top + aiChatMessages.offsetHeight;
        
        const currentY = e.touches[0].pageY;
        const deltaY = currentY - chatTouchStartY; 

        // Block dragging down when at top
        if (top <= 0 && deltaY > 0) e.preventDefault();
        // Block dragging up when at base (with 1.5px tolerance)
        if (currentScroll >= (totalScroll - 1.5) && deltaY < 0) e.preventDefault();
    }, { passive: false }); 
}

/* ==========================================================================
   INITIALIZATION PIPELINE
   ========================================================================== */

initAiSuggestionChips();
initPortfolio();

// One-time Entrance Registration Bypass
if (gallery) {
    setTimeout(() => {
        document.documentElement.classList.add('bypassed-entrance');
        console.log("🚀 Entrance sequence fully settled. Permanent bypass active.");
    }, 2000);

    const triggerImmediateBypass = () => document.documentElement.classList.add('bypassed-entrance');
    gallery.addEventListener('mousedown', triggerImmediateBypass, { passive: true });
    gallery.addEventListener('touchstart', triggerImmediateBypass, { passive: true });
}

// Developer Mode Check
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('admin') === 'true') {
    localStorage.setItem('exclude_traffic', 'true');
    alert('Developer Mode Enabled! Your visits will no longer be tracked in this browser.');
    window.location.href = window.location.pathname; 
}


/* ==========================================================================
   GEMINI PREMIUM ADAPTIVE HALFTONE DOT-MATRIX CORE ENGINE
   ========================================================================== */
(function initPremiumGeminiEngine() {
    const canvas = document.getElementById('gemini-matrix-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let startTime = performance.now();

    function syncCanvasResolution() {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
    }
    syncCanvasResolution();
    window.addEventListener('resize', syncCanvasResolution);

    function renderMatrix(now) {
        if (document.documentElement.classList.contains('a11y-high-contrast')) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            return;
        }

        const width = canvas.width / (window.devicePixelRatio || 1);
        const height = canvas.height / (window.devicePixelRatio || 1);
        ctx.clearRect(0, 0, width, height);

        const isDarkMode = document.documentElement.classList.contains('a11y-dark-mode');
        const isReducedMotion = document.documentElement.classList.contains('a11y-reduce-motion');
        const elapsed = now - startTime;

        // --- 1. DENSITY CONFIGURATION ---
        const dotSpacing = 12;
        const cols = Math.ceil(width / dotSpacing);
        const rows = Math.ceil(height / dotSpacing);

        const originX = width * 0.90;
        const originY = height * 0.90;

        // --- 2. TIMING GUARDRAIL CHOREOGRAPHY ---
        const entranceDelay = 1400; 
        if (elapsed < entranceDelay) {
            animationFrameId = requestAnimationFrame(renderMatrix);
            return;
        }

        const activeTimeline = (elapsed - entranceDelay) * 0.001; 
        const maxDiagonalDistance = Math.hypot(width, height);
        const sweepSpeed = maxDiagonalDistance / 2.2;
        const currentSweepFront = activeTimeline * sweepSpeed;

        for (let c = 0; c < cols; c++) {
            for (let r = 0; r < rows; r++) {
                const x = c * dotSpacing + dotSpacing / 2;
                const y = r * dotSpacing + dotSpacing / 2;

                const distFromCorner = Math.hypot(width - x, height - y);
                const waveDistance = Math.hypot(x - originX, y - originY);

                // --- 3. DIAGONAL FEATHERED REVEAL MATRIX ---
                let revealFactor = (currentSweepFront - distFromCorner) / 180;
                revealFactor = Math.max(0, Math.min(1, revealFactor));

                if (revealFactor === 0) continue; 

                let computedRadius = 0.8; 

                if (isReducedMotion) {
                    let staticDecay = Math.max(0, 1 - waveDistance / (maxDiagonalDistance * 0.8));
                    computedRadius = Math.max(0.7, 1.8 * staticDecay * revealFactor);
                } else {
                    let kineticWave = 0;

                    // Phase A: Organic Multi-Pulse Chain
                    if (activeTimeline < 6.0) {
                        let p1 = Math.sin(waveDistance * 0.022 - activeTimeline * 8.5) * Math.exp(-Math.pow(activeTimeline - 1.2, 2) * 0.8);
                        let p2 = Math.sin(waveDistance * 0.018 - (activeTimeline - 1.4) * 6.0) * Math.exp(-Math.pow(activeTimeline - 2.6, 2) * 0.5);
                        let p3 = Math.sin(waveDistance * 0.014 - (activeTimeline - 2.8) * 4.5) * Math.exp(-Math.pow(activeTimeline - 4.0, 2) * 0.4);
                        kineticWave += (p1 * 1.3) + (p2 * 0.8) + (p3 * 0.4);
                    }

                    // Phase B: Ambient Resting Breathing Engine
                    const idleTimeline = now * 0.001;
                    let ambientGlow = Math.sin(waveDistance * 0.012 - idleTimeline * 1.2) * Math.cos(x * 0.008 + idleTimeline * 0.5);
                    kineticWave += ambientGlow * 0.45;

                    let radialDecay = Math.max(0, 1 - waveDistance / (maxDiagonalDistance * 0.75));
                    computedRadius = Math.max(0.7, (kineticWave * 1.6 + 2.2) * radialDecay * revealFactor);
                }

                // --- 4. LUMINOSITY & TRANSLUCENCY COLORS ---
                let colorOpacity = Math.min(1, computedRadius / 4) * revealFactor;
                let particleColor;

                if (isDarkMode) {
                    if (waveDistance < width * 0.3) particleColor = `rgba(167, 243, 208, ${colorOpacity * 0.28})`; /* Mint Core */
                    else if (waveDistance < width * 0.6) particleColor = `rgba(147, 197, 253, ${colorOpacity * 0.22})`; /* Misty Steel Blue */
                    else particleColor = `rgba(216, 180, 254, ${colorOpacity * 0.14})`; /* Ethereal Dusk Lavender */
                } else {
                    if (waveDistance < width * 0.28) particleColor = `rgba(46, 196, 136, ${colorOpacity * 0.34})`; /* Soft Sage Mint */ 
                    else if (waveDistance < width * 0.55) particleColor = `rgba(43, 113, 240, ${colorOpacity * 0.24})`; /* Slate Corporate Blue */  
                    else particleColor = `rgba(139, 92, 246, ${colorOpacity * 0.15})`; /* Whispering Lavender */ 
                }

                ctx.beginPath();
                ctx.arc(x, y, computedRadius, 0, Math.PI * 2);
                ctx.fillStyle = particleColor;
                ctx.fill();
            }
        }

        if (!isReducedMotion) {
            animationFrameId = requestAnimationFrame(renderMatrix);
        }
    }

    animationFrameId = requestAnimationFrame(renderMatrix);
})();

// --- VTT PARSING UTILITIES ---
function timecodeToSeconds(tc) {
    // formats: hh:mm:ss.mmm or mm:ss.mmm or mm:ss.ms
    const parts = tc.split(':').map(p => p.trim());
    let seconds = 0;
    if (parts.length === 3) {
        seconds += parseFloat(parts[0]) * 3600;
        seconds += parseFloat(parts[1]) * 60;
        seconds += parseFloat(parts[2].replace(',', '.'));
    } else if (parts.length === 2) {
        seconds += parseFloat(parts[0]) * 60;
        seconds += parseFloat(parts[1].replace(',', '.'));
    } else {
        seconds = parseFloat(parts[0].replace(',', '.'));
    }
    return seconds;
}

function parseVtt(vttText) {
    const lines = vttText.replace(/\r/g, '').split('\n');
    const cues = [];
    let i = 0;
    // skip optional header
    if (lines[0] && lines[0].toUpperCase().includes('WEBVTT')) i = 1;
    while (i < lines.length) {
        // skip blank lines
        if (!lines[i].trim()) { i++; continue; }
        // optional cue id
        let possibleTimeLine = lines[i];
        if (possibleTimeLine && !possibleTimeLine.includes('-->')) {
            i++; // skip id
            possibleTimeLine = lines[i];
        }
        if (!possibleTimeLine || !possibleTimeLine.includes('-->')) { i++; continue; }
        const [startTc, endTc] = possibleTimeLine.split('-->').map(s => s.trim());
        i++;
        let textLines = [];
        while (i < lines.length && lines[i].trim()) { textLines.push(lines[i]); i++; }
        const text = textLines.join('\n').replace(/<[^>]*>/g, '').trim();
        cues.push({ start: timecodeToSeconds(startTc), end: timecodeToSeconds(endTc), text });
    }
    return cues;
}