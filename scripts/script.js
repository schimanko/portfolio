/* ==========================================================================
   DOM VARIABLES & GLOBAL STATE
   ========================================================================== */
const savedScrollPositions = {};
const savedVideoTimes = {}; 
const trackedScrolls = new Set(); 
let viewHistory = ['home'];

const gallery = document.getElementById('gallery');
const caseSliderContainer = document.getElementById('case-slider-container');
const header = document.getElementById('main-header');
const footer = document.getElementById('main-footer');
const mainVideo = document.getElementById('main-video');
const videoLoader = document.getElementById('video-loader');
const playerWrapper = document.querySelector('.player-wrapper');
const progressBar = document.getElementById('progress-bar');
const progressContainer = document.getElementById('progress-container');
const topBreadcrumb = document.querySelector('.top-breadcrumb');

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
let prePlayerDarkMode = false;
let prePlayerHighContrast = false;

// Reversion Logic Helper for Player Mode
function restorePlayerA11yPrefs() {
    const tglDark = document.getElementById('toggle-dark');
    const tglContrast = document.getElementById('toggle-contrast');
    
    if (!prePlayerDarkMode) {
        document.documentElement.classList.remove('a11y-dark-mode');
        if (tglDark) tglDark.checked = false;
        localStorage.setItem('pref-dark', 'false');
    } else {
        document.documentElement.classList.add('a11y-dark-mode');
        if (tglDark) tglDark.checked = true;
        localStorage.setItem('pref-dark', 'true');
    }
    
    if (!prePlayerHighContrast) {
        document.documentElement.classList.remove('a11y-high-contrast');
        if (tglContrast) tglContrast.checked = false;
        localStorage.setItem('pref-contrast', 'false');
    } else {
        document.documentElement.classList.add('a11y-high-contrast');
        if (tglContrast) tglContrast.checked = true;
        localStorage.setItem('pref-contrast', 'true');
    }
}

// --- A11Y & PRIVACY HELPER ---
function getSafeCaseTitle(c) {
    if (!c) return 'Case';
    const isUnlocked = sessionStorage.getItem(`unlocked_${c.id}`) === 'true';
    if (c.isProtected && !isUnlocked) {
        return c.employer ? t('protected_employer_case').replace('{employer}', c.employer) : t('protected_case');
    }
    return c.title;
}

// --- BREADCRUMB HOVER & SYNC LOGIC ---
function populateBreadcrumbMenu(menuType = 'cases') {
    const menuId = menuType === 'presentations' ? 'breadcrumb-menu-player' : 'breadcrumb-menu';
    const menu = document.getElementById(menuId);
    if (!menu) return;
    menu.innerHTML = '';
    
    portfolioCases.forEach((caseData, idx) => {
        // Exclude current case, or filter out cases with no videos when building presentation list
        if (activeCaseData && caseData.id === activeCaseData.id) return;
        if (menuType === 'presentations' && (!caseData.videoSrc || caseData.videoSrc.trim() === '')) return;

        const btn = document.createElement('button');
        const safeTitle = getSafeCaseTitle(caseData);
        
        // Use i18n translated string dynamically for "Presentation of..." if available
        const presentationPrefix = t('play_video_presentation') || 'Presentation';
        const title = menuType === 'presentations' ? `${presentationPrefix} - ${safeTitle}` : safeTitle;
        
        btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg> ${title}`;
        
        btn.addEventListener('click', () => {
            if (menuType === 'presentations') {
                playSpecificCase(caseData.id);
            } else {
                // If they are inside the video player and want to read a case, close the player first!
                if (document.body.getAttribute('data-active-view') === 'player') {
                    const stopBtn = document.getElementById('btn-stop');
                    if (stopBtn) stopBtn.click();
                    
                    // Wait for the exit morph to trigger before scrolling to the new case
                    setTimeout(() => {
                        const slideWidth = window.innerWidth;
                        caseSliderContainer.scrollTo({ left: idx * slideWidth, behavior: 'instant' });
                    }, 550); 
                } else {
                    const slideWidth = window.innerWidth;
                    const reduceMotion = document.documentElement.classList.contains('a11y-reduce-motion');
                    caseSliderContainer.scrollTo({
                        left: idx * slideWidth,
                        behavior: reduceMotion ? 'auto' : 'smooth'
                    });
                }
            }
            menu.classList.remove('show');
        });
        
        menu.appendChild(btn);
    });
}

// --- DYNAMIC BREADCRUMB HOVER LISTENERS & HOME BUTTON ---
const cCurrent = document.getElementById('crumb-current');
const cPlayer = document.getElementById('crumb-player');
const bMenu = document.getElementById('breadcrumb-menu');
const crumbHome = document.getElementById('crumb-home');

if (cCurrent && bMenu) {
    cCurrent.addEventListener('mouseenter', () => {
        if (document.body.getAttribute('data-active-view') === 'player' || document.body.getAttribute('data-active-view') === 'case') {
            populateBreadcrumbMenu('cases');
            bMenu.style.transform = 'translateX(0)'; // Align underneath Current
        }
    });
}

const cPlayerWrapper = document.getElementById('crumb-current-player-wrapper');
const bMenuPlayer = document.getElementById('breadcrumb-menu-player');

if (cPlayerWrapper && bMenuPlayer) {
    cPlayerWrapper.addEventListener('mouseenter', () => {
        if (document.body.getAttribute('data-active-view') === 'player') {
            populateBreadcrumbMenu('presentations');
            bMenuPlayer.classList.add('show');
        }
    });
    cPlayerWrapper.addEventListener('mouseleave', () => {
        bMenuPlayer.classList.remove('show');
    });
}

// Absolute strict unwinding for the Home Button (Direct to Home Morph)
if (crumbHome) {
    crumbHome.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();
        
        document.documentElement.classList.remove('slide-up-transition');
        document.documentElement.classList.add('slide-down-transition');
        
        if (document.body.getAttribute('data-active-view') === 'player') {
            unloadVideo(false);
            restorePlayerA11yPrefs();
        }
        
        const activeId = activeCaseData ? activeCaseData.id : null;
        const activeThumb = activeId ? document.querySelector(`.case-thumb-wrapper[data-case-id="${activeId}"]`) : null;
        
        if (activeThumb && activeId) {
            prepareMorph(activeThumb, `media-${activeId}`, true);
        }
        
        transitionTo('home', () => {
            if (activeThumb) {
                const galleryEl = document.getElementById('gallery');
                galleryEl.style.scrollBehavior = 'auto'; 
                const thumbRect = activeThumb.getBoundingClientRect();
                const galleryRect = galleryEl.getBoundingClientRect();
                galleryEl.scrollLeft += (thumbRect.left + thumbRect.width / 2) - (galleryRect.left + galleryRect.width / 2);
                setTimeout(() => { galleryEl.style.scrollBehavior = ''; }, 50);
            }
        });
    });
}

// Hook up the hover interactions
const crumbWrapper = document.getElementById('crumb-current-wrapper');
const crumbMenu = document.getElementById('breadcrumb-menu');
if (crumbWrapper && crumbMenu) {
    crumbWrapper.addEventListener('mouseenter', () => {
        if (viewHistory[viewHistory.length - 1] !== 'about') crumbMenu.classList.add('show');
    });
    crumbWrapper.addEventListener('mouseleave', () => {
        crumbMenu.classList.remove('show');
    });
}

// --- RECRUITER MODE TOGGLE ENGINE ---
const modeToggleBtn = document.getElementById('btn-mode-toggle');
let isRecruiterMode = localStorage.getItem('pref-recruiter-mode') === 'true';

function updateToggleSliderPosition() {
    if (!modeToggleBtn) return;
    const isCurrentlyRecruiter = modeToggleBtn.classList.contains('is-recruiter');
    const targetClass = isCurrentlyRecruiter ? '.mode-label.recruiter' : '.mode-label.executive';
    const activeSpan = modeToggleBtn.querySelector(targetClass);
    const slider = modeToggleBtn.querySelector('.mode-toggle-slider');
    
    if (activeSpan && slider) {
        slider.style.width = `${activeSpan.offsetWidth}px`;
        slider.style.transform = `translateX(${activeSpan.offsetLeft}px)`;
    }
}

function syncToggleForCurrentCase() {
    if (!modeToggleBtn) return;
    
    const isUnlocked = activeCaseData ? sessionStorage.getItem(`unlocked_${activeCaseData.id}`) === 'true' : true;
    const isLocked = activeCaseData && activeCaseData.isProtected && !isUnlocked;

    const divider = document.getElementById('mode-toggle-divider');
    if (isLocked) {
        modeToggleBtn.classList.add('is-hidden-locked');
        if (divider) divider.classList.add('is-hidden-locked');
        return;
    } else {
        modeToggleBtn.classList.remove('is-hidden-locked');
        if (divider) divider.classList.remove('is-hidden-locked');
    }

    const hasTech = !!(activeCaseData && activeCaseData.descRecruiter);
    const hasOverview = !!(activeCaseData && activeCaseData.desc);
    
    modeToggleBtn.classList.remove('no-tech-view', 'no-overview');

    if (hasOverview && !hasTech) {
        modeToggleBtn.classList.add('no-tech-view');
        modeToggleBtn.classList.remove('is-recruiter');
    } else if (!hasOverview && hasTech) {
        modeToggleBtn.classList.add('no-overview');
        modeToggleBtn.classList.add('is-recruiter');
    } else {
        modeToggleBtn.classList.toggle('is-recruiter', isRecruiterMode);
    }
}

if (modeToggleBtn) {
    if (isRecruiterMode) modeToggleBtn.classList.add('is-recruiter');
    
    const toggleObserver = new ResizeObserver(() => {
        updateToggleSliderPosition();
    });
    toggleObserver.observe(modeToggleBtn);
    modeToggleBtn.querySelectorAll('.mode-label').forEach(label => toggleObserver.observe(label));
    
    if (document.fonts) {
        document.fonts.ready.then(updateToggleSliderPosition);
    }

    modeToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (modeToggleBtn.classList.contains('no-tech-view') || modeToggleBtn.classList.contains('no-overview')) return; 

        isRecruiterMode = !isRecruiterMode;
        localStorage.setItem('pref-recruiter-mode', isRecruiterMode);
        
        modeToggleBtn.classList.toggle('is-recruiter', isRecruiterMode);
        updateToggleSliderPosition();
        updateAllCasesText(); 

        if (activeCaseData) {
            const scrollEl = document.getElementById(`scroll-${activeCaseData.id}`);
            if (scrollEl) {
                scrollEl._isAnimating = false;
                if (scrollEl._animationFrameId) cancelAnimationFrame(scrollEl._animationFrameId);
                scrollEl.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }

        setTimeout(() => {
            if (window.speechSynthesis) window.speechSynthesis.cancel();
            Object.keys(ttsMemory).forEach(k => delete ttsMemory[k]);
            resetTTSStopped();
        }, 50); 
    });
}

function updateAllCasesText() {
    portfolioCases.forEach(caseData => {
        const slide = document.querySelector(`.case-slide-wrapper[data-case-id="${caseData.id}"]`);
        if (!slide) return;
        
        const descBody = slide.querySelector('.case-description-body');
        const currentToc = slide.querySelector('.case-toc'); 
        if (!descBody) return;

        let newContent = caseData.desc || ""; 
        if (isRecruiterMode && caseData.descRecruiter) {
            newContent = caseData.descRecruiter; 
        } else if (!caseData.desc && caseData.descRecruiter) {
            newContent = caseData.descRecruiter; 
        } else if (!caseData.descRecruiter && caseData.desc) {
            newContent = caseData.desc; 
        }

        if (activeCaseData && caseData.id === activeCaseData.id) {
            descBody.classList.add('is-transitioning');
            if (currentToc) currentToc.classList.add('is-transitioning');
            
            setTimeout(() => {
                descBody.innerHTML = newContent;
                attachTTSButton(descBody, caseData.id);
                
                rebuildTOC(slide); 
                initComboAssets(descBody); 
                
                if (window.Prism) { window.Prism.highlightAllUnder(descBody); }
                
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        descBody.classList.remove('is-transitioning');
                        const newToc = slide.querySelector('.case-toc');
                        if (newToc) newToc.classList.remove('is-transitioning');
                    });
                });
            }, 400); 
        } else {
            descBody.innerHTML = newContent;
            attachTTSButton(descBody, caseData.id); 
            rebuildTOC(slide); 
            initComboAssets(descBody); 
            if (window.Prism) { window.Prism.highlightAllUnder(descBody); }
        }
    });
}

// --- TEXT-TO-SPEECH (TTS) ENGINE ---
let currentUtterance = null;
let ttsState = 'stopped'; 
let activeTTSCaseId = null;
let currentTTSRate = 1.0; 
const ttsMemory = {}; 

if (window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
}

function attachTTSButton(descBody, caseId) {
    const firstParagraph = descBody.querySelector('p');
    if (!firstParagraph || firstParagraph.querySelector('.tts-inline-wrapper')) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'tts-inline-wrapper';
    wrapper.setAttribute('data-case-id', caseId);
    
    const savedProgress = ttsMemory[caseId] && ttsMemory[caseId].fullLength 
        ? (ttsMemory[caseId].charIndex / ttsMemory[caseId].fullLength) * 100 
        : 0;
    wrapper.style.setProperty('--tts-progress', `${savedProgress}%`);

    wrapper.innerHTML = `
        <button class="btn-tts-play" title="${t('tts_play_pause')}">
            <span class="tts-icon-wrapper">
                <svg class="pause-icon" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                <svg class="play-icon" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5V19L19 12L8 5Z"/></svg>
            </span>
            <span class="tts-text">${t('tts_ai_reader')}</span>
        </button>
        <div class="tts-divider"></div>
        <button class="btn-tts-speed" title="${t('tts_change_speed')}">${currentTTSRate}x</button>
    `;

    const playBtn = wrapper.querySelector('.btn-tts-play');
    const speedBtn = wrapper.querySelector('.btn-tts-speed');

    playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleTTS(caseId, wrapper, descBody);
    });

    speedBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        cycleTTSRate(wrapper, caseId, descBody);
    });

    firstParagraph.insertBefore(wrapper, firstParagraph.firstChild);
}

function cycleTTSRate(wrapper, caseId, descBody) {
    if (currentTTSRate === 1.0) currentTTSRate = 1.15;
    else if (currentTTSRate === 1.15) currentTTSRate = 1.25;
    else if (currentTTSRate === 1.25) currentTTSRate = 1.3;
    else currentTTSRate = 1.0;

    document.querySelectorAll('.btn-tts-speed').forEach(btn => {
        btn.textContent = currentTTSRate + 'x';
    });

    if (ttsState === 'speaking' && activeTTSCaseId === caseId) {
        window.speechSynthesis.cancel();
        ttsState = 'stopped';
        wrapper.classList.remove('is-playing');
        setTimeout(() => { toggleTTS(caseId, wrapper, descBody); }, 50);
    }
}

function toggleTTS(caseId, wrapper, descBody) {
    if (!window.speechSynthesis) return alert(t('tts_not_supported'));

    if (activeTTSCaseId && activeTTSCaseId !== caseId && ttsState !== 'stopped') {
        window.speechSynthesis.cancel();
        resetTTSStopped();
    }

    activeTTSCaseId = caseId;

    if (ttsState === 'stopped') {
        ttsState = 'speaking';
        resetTTSButtons();

        const clone = descBody.cloneNode(true);
        clone.querySelectorAll('pre, code, .case-caption, .tts-inline-wrapper, h3').forEach(el => el.remove());
        const fullText = clone.innerText;
        
        if (!ttsMemory[caseId]) ttsMemory[caseId] = { charIndex: 0, fullLength: fullText.length };
        if (ttsMemory[caseId].charIndex >= fullText.length - 5) ttsMemory[caseId].charIndex = 0;

        const textToRead = fullText.substring(ttsMemory[caseId].charIndex);
        currentUtterance = new SpeechSynthesisUtterance(textToRead);
        currentUtterance.rate = currentTTSRate;
        
        const htmlLang = document.documentElement.lang || 'en';
        currentUtterance.lang = htmlLang.includes('pt') ? 'pt-BR' : 'en-US';
        const voices = window.speechSynthesis.getVoices();
        const langPrefix = currentUtterance.lang.substring(0,2);
        
        let bestVoice = voices.find(v => v.lang.includes(langPrefix) && v.name.includes('Google')) ||
                        voices.find(v => v.lang.includes(langPrefix) && (v.name.includes('Premium') || v.name.includes('Enhanced'))) ||
                        voices.find(v => v.lang.includes(langPrefix) && v.name.includes('Natural')) ||
                        voices.find(v => v.lang.includes(langPrefix));
        if (bestVoice) currentUtterance.voice = bestVoice;

        const startIndex = ttsMemory[caseId].charIndex;
        currentUtterance.onboundary = (e) => {
            if (e.name === 'word') {
                const currentGlobalIndex = startIndex + e.charIndex;
                ttsMemory[caseId].charIndex = currentGlobalIndex;
                const progress = (currentGlobalIndex / ttsMemory[caseId].fullLength) * 100;
                wrapper.style.setProperty('--tts-progress', `${progress}%`);
            }
        };

        currentUtterance.onend = () => {
            ttsMemory[caseId].charIndex = 0;
            wrapper.style.setProperty('--tts-progress', `0%`);
            resetTTSStopped();
        };

        wrapper.classList.add('is-playing');
        window.speechSynthesis.speak(currentUtterance);

    } else if (ttsState === 'speaking') {
        ttsState = 'paused';
        window.speechSynthesis.pause();
        wrapper.classList.remove('is-playing');
        wrapper.classList.add('is-paused');

    } else if (ttsState === 'paused') {
        ttsState = 'speaking';
        window.speechSynthesis.resume();
        wrapper.classList.add('is-playing');
        wrapper.classList.remove('is-paused');
    }
}

function resetTTSButtons() {
    document.querySelectorAll('.tts-inline-wrapper').forEach(b => {
        b.classList.remove('is-playing');
        b.classList.remove('is-paused');
    });
}

function resetTTSStopped() {
    resetTTSButtons();
    ttsState = 'stopped';
    activeTTSCaseId = null;
}

// --- COMBO ASSET INTERACTIVITY ENGINE ---
function initComboAssets(container) {
    if (!container) return;

    const renderMermaidSafely = () => {
        if (!window.mermaid) {
            setTimeout(renderMermaidSafely, 100);
            return;
        }

        container.querySelectorAll('.live-mermaid-container').forEach((diagramContainer, elementIndex) => {
            if (diagramContainer.getAttribute('data-processed') === 'true') return;
            
            const rawDiagramMarkup = diagramContainer.textContent.trim();
            if (!rawDiagramMarkup) return;
            
            const a11yTitle = diagramContainer.getAttribute('data-a11y-title') || "System Architecture Diagram";
            const uniqueGraphId = `mermaid-render-vector-${Date.now()}-${elementIndex}`;
            diagramContainer.innerHTML = `<div id="${uniqueGraphId}" class="mermaid-svg-payload" aria-hidden="true"></div>`;
            
            window.mermaid.render(uniqueGraphId, rawDiagramMarkup).then(({ svg }) => {
                diagramContainer.setAttribute('role', 'img');
                diagramContainer.setAttribute('aria-label', a11yTitle);
                diagramContainer.innerHTML = svg;
                diagramContainer.setAttribute('data-processed', 'true');
            }).catch((renderFault) => {
                diagramContainer.innerHTML = `<p class="chart-fault-label">${t('mermaid_error')}</p>`;
            });
        });
    };
    renderMermaidSafely();

    container.querySelectorAll('.before-after-slider').forEach(slider => {
        if (slider._isSetup) return; 
        slider._isSetup = true;
        let isDragging = false;

        const move = (e) => {
            if (!isDragging) return;
            const rect = slider.getBoundingClientRect();
            const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
            let pct = (x / rect.width) * 100;
            pct = Math.max(0, Math.min(pct, 100)); 
            slider.style.setProperty('--expose', `${pct}%`);
        };

        const start = () => { isDragging = true; };
        const end = () => { isDragging = false; };

        slider.addEventListener('mousedown', start);
        slider.addEventListener('touchstart', start, { passive: true });
        window.addEventListener('mousemove', move);
        window.addEventListener('touchmove', move, { passive: true });
        window.addEventListener('mouseup', end);
        window.addEventListener('touchend', end);
    });

    container.querySelectorAll('.telemetry-overlay').forEach(overlay => {
        if (overlay._isSetup) return;
        overlay._isSetup = true;

        const loadPill = overlay.querySelector('[data-metric="load"]');
        const memoryPill = overlay.querySelector('[data-metric="memory"]');

        if (overlay._telemetryInterval) clearInterval(overlay._telemetryInterval);

        overlay._telemetryInterval = setInterval(() => {
            if (loadPill) {
                const randomLoad = Math.floor(Math.random() * 25) + 110;
                loadPill.innerHTML = `<span class="pulse-dot"></span> Load: ${randomLoad}ms`;
            }
            if (memoryPill) {
                const randomMem = (Math.random() * 1.4 + 42.1).toFixed(1);
                memoryPill.innerHTML = `<span class="pulse-dot bg-blue"></span> RAM: ${randomMem}MB`;
            }
        }, 1800); 
    });

    container.querySelectorAll('.combo-asset-card').forEach(card => {
        if (card._tabsSetup) return;
        card._tabsSetup = true;

        const tabs = card.querySelectorAll('.combo-tab');
        const contents = card.querySelectorAll('.combo-content');

        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.stopPropagation();
                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));
                
                tab.classList.add('active');
                const targetId = tab.getAttribute('data-target');
                const targetContent = card.querySelector(`[data-id="${targetId}"]`);
                if (targetContent) targetContent.classList.add('active');
            });
        });
    });
}


/* ==========================================================================
   UTILITY & PERFORMANCE FUNCTIONS
   ========================================================================== */
function logMemoryUsage(context) {
    if (window.performance && window.performance.memory) {
        const memory = window.performance.memory;
        const usedMB = Math.round(memory.usedJSHeapSize / (1024 * 1024));
        const totalMB = Math.round(memory.totalJSHeapSize / (1024 * 1024));
        const limitMB = Math.round(memory.jsHeapSizeLimit / (1024 * 1024));
    }
}

// BULLETPROOF MORPH ENGINE
function prepareMorph(elementToMorph, targetMediaId = null, keepMediaActive = true) {
    document.querySelectorAll('*').forEach(el => {
        if (el.style.viewTransitionName === 'case-media') el.style.viewTransitionName = '';
        el.classList.remove('active-morph-element');
    });
    
    if (elementToMorph) {
        elementToMorph.classList.add('active-morph-element');
        elementToMorph.style.viewTransitionName = 'case-media';
    }
    
    if (keepMediaActive && targetMediaId) {
        const targetMedia = document.getElementById(targetMediaId);
        if (targetMedia) {
            targetMedia.classList.add('active-morph-element');
            targetMedia.style.viewTransitionName = 'case-media';
        }
        
        if (playerWrapper) {
            playerWrapper.classList.add('active-morph-element');
            playerWrapper.style.viewTransitionName = 'case-media';
        }
    }
}


/* ==========================================================================
   VIEW NAVIGATION & ROUTING
   ========================================================================== */
function switchView(viewName) {
    if (viewHistory[viewHistory.length - 1] !== viewName) {
        viewHistory.push(viewName);
    }

   Object.values(views).forEach(v => { 
        v.classList.remove('active'); 
        v.style.display = 'none'; 
    });

    // Restore the inline flex specifically for the player, keeping others clear for CSS classes to take over
    views[viewName].style.display = viewName === 'player' ? 'flex' : ''; 
    void views[viewName].offsetWidth; 
    views[viewName].classList.add('active');
    document.body.setAttribute('data-active-view', viewName);
    
    if (viewName === 'player') {
            document.body.classList.add('player-active');
        } else {
            document.body.classList.remove('player-active');
            setTimeout(() => {
                if (document.body.getAttribute('data-active-view') !== 'player' && typeof progressBar !== 'undefined' && progressBar) {
                    progressBar.style.width = '0%';
                }
            }, 500);
        }

    if (viewName !== 'case' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
    
    if (['case', 'player', 'about'].includes(viewName)) { 
        header.classList.add('hidden-header'); 
        footer.classList.add('hidden-footer'); 
    } else { 
        header.classList.remove('hidden-header'); 
        footer.classList.remove('hidden-footer'); 
    }

    const homeBtn = document.getElementById('home-button');
    const breadcrumb = document.getElementById('top-breadcrumb');
    const separator = document.getElementById('crumb-separator');
    const currentWrapper = document.getElementById('crumb-current-wrapper');
    
    if (homeBtn && breadcrumb) {
        if (viewName === 'home') { 
            homeBtn.classList.add('hidden'); 
            breadcrumb.classList.add('hidden');
            if (separator) separator.classList.add('hidden-default');
            if (currentWrapper) currentWrapper.classList.add('hidden-default');
        } else { 
            homeBtn.classList.remove('hidden'); 
            breadcrumb.classList.remove('hidden');
            if (separator) separator.classList.remove('hidden-default');
            if (currentWrapper) currentWrapper.classList.remove('hidden-default');
            
            const currentCrumb = document.getElementById('crumb-current');
            const separatorPlayer = document.getElementById('crumb-separator-player');
            const currentPlayerCrumb = document.getElementById('crumb-current-player');

            // Ensure breadcrumb doesn't stay hidden when leaving the player
            breadcrumb.classList.remove('fade-out');

            if (viewName === 'case' || viewName === 'player') {
                currentCrumb.textContent = activeCaseData ? getSafeCaseTitle(activeCaseData) : 'Case';
                if (typeof populateBreadcrumbMenu === 'function') populateBreadcrumbMenu(viewName);
                
                const currentPlayerWrapper = document.getElementById('crumb-current-player-wrapper');
                
                if (viewName === 'player') {
                    if (separatorPlayer) separatorPlayer.classList.remove('hidden-default');
                    if (currentPlayerWrapper) currentPlayerWrapper.classList.remove('hidden-default');
                    if (currentPlayerCrumb) {
                        const safePlayerTitle = activeCaseData ? getSafeCaseTitle(activeCaseData) : '';
                        currentPlayerCrumb.textContent = `Presentation of ${safePlayerTitle}`;
                    }
                } else {
                    if (separatorPlayer) separatorPlayer.classList.add('hidden-default');
                    if (currentPlayerWrapper) currentPlayerWrapper.classList.add('hidden-default');
                }
            } else if (viewName === 'about') {
                currentCrumb.textContent = t('nav_about');
                const menu = document.getElementById('breadcrumb-menu');
                if (menu) menu.classList.remove('show');
            }
        }
    }

    const aboutBtn = document.getElementById('about-button');
    if (aboutBtn) {
        if (viewName === 'about') { 
            aboutBtn.classList.add('hidden'); 
            aboutBtn.setAttribute('tabindex', '-1'); 
        } else { 
            aboutBtn.classList.remove('hidden'); 
            aboutBtn.setAttribute('tabindex', '0'); 
        }
    }
}

function transitionTo(viewName, callback) {
    const updateDOM = () => {
        if (views[viewName]) {
            switchView(viewName);
            if (callback) callback();
        } else {
            switchView('home');
        }
    };

    if (document.startViewTransition && !document.documentElement.classList.contains('a11y-reduce-motion')) {
        document.startViewTransition(updateDOM);
    } else {
        updateDOM();
    }
}

function openCaseView(caseData, clickedThumbEl, index) {
    activeCaseData = caseData;
    syncToggleForCurrentCase();
    prepareMorph(clickedThumbEl, `media-${caseData.id}`);
    document.documentElement.classList.add('slide-up-transition');
    document.documentElement.classList.remove('slide-down-transition');

    if (!sessionStorage.getItem('hasSeenTocPeek')) {
        setTimeout(() => {
            const activeToc = document.querySelector(`.case-slide-wrapper[data-case-id="${caseData.id}"] .case-toc`);
            if (activeToc) {
                activeToc.classList.add('is-peeking');
                setTimeout(() => {
                    activeToc.classList.remove('is-peeking');
                    sessionStorage.setItem('hasSeenTocPeek', 'true');
                    
                    if (!sessionStorage.getItem('hasSeenCaseDragTutorial')) {
                        setTimeout(() => {
                            const dragTut = document.getElementById('drag-tutorial');
                            if (dragTut) {
                                dragTut.classList.add('show');
                                setTimeout(() => {
                                    dragTut.classList.remove('show');
                                    sessionStorage.setItem('hasSeenCaseDragTutorial', 'true');
                                }, 4000);
                            }
                        }, 800); 
                    }
                }, 1600); 
            }
        }, 800); 
    } else if (!sessionStorage.getItem('hasSeenCaseDragTutorial')) {
        setTimeout(() => {
            const dragTut = document.getElementById('drag-tutorial');
            if (dragTut) {
                dragTut.classList.add('show');
                setTimeout(() => {
                    dragTut.classList.remove('show');
                    sessionStorage.setItem('hasSeenCaseDragTutorial', 'true');
                }, 4000);
            }
        }, 1500);
    }

    const updateDOMAndScroll = () => {
        switchView('case');
        caseSliderContainer.style.scrollBehavior = 'auto'; 
        const targetSlide = caseSliderContainer.querySelectorAll('.case-slide-wrapper')[index];
        
        if (targetSlide) {
            targetSlide.scrollIntoView({ inline: 'center', block: 'nearest' });
            
            const scrollEl = document.getElementById(`scroll-${caseData.id}`);
            if (scrollEl && savedScrollPositions[caseData.id]) {
                setTimeout(() => {
                    scrollEl.scrollTo({ 
                        top: savedScrollPositions[caseData.id], 
                        behavior: 'instant' 
                    });
                }, 10);
            }
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
window.triggerAiTyping = function(container) {
    const summaryTextEl = container.querySelector('.ai-summary-text');
    const metricsGrid = container.querySelector('.summary-metrics-grid');
    
    if (summaryTextEl && !summaryTextEl.dataset.typed) {
        summaryTextEl.dataset.typed = 'true';

        // Pre-calculate final height to prevent layout trembling
        const fullText = summaryTextEl.dataset.text;
        summaryTextEl.textContent = fullText;
        const precalculatedHeight = summaryTextEl.getBoundingClientRect().height;
        summaryTextEl.style.setProperty('--dynamic-ai-height', `${precalculatedHeight}px`);
        summaryTextEl.textContent = '';
        
        const dots = document.createElement('span');
        dots.className = 'ai-thinking-dots';
        
        // A11y & i18n solution: announce the AI loading state safely
        dots.setAttribute('aria-live', 'polite');
        dots.setAttribute('aria-label', typeof t === 'function' ? t('thinking') : 'Thinking');
        summaryTextEl.appendChild(dots);
        
        let dotCount = 0;
        const thinkInt = setInterval(() => {
            dotCount = (dotCount + 1) % 4;
            dots.textContent = '.'.repeat(dotCount);
        }, 300);

        setTimeout(() => {
            clearInterval(thinkInt);
            if (dots.parentNode) dots.remove();
            summaryTextEl.classList.add('typing');
            
            let charIdx = 0;
            
            function typeChar() {
                if (charIdx < fullText.length) {
                    summaryTextEl.textContent += fullText.charAt(charIdx);
                    charIdx++;
                    setTimeout(typeChar, 15); 
                } else {
                    summaryTextEl.classList.remove('typing');
                    
                    // Release the variable so the container remains fully responsive
                    summaryTextEl.style.removeProperty('--dynamic-ai-height');
                    
                    if (metricsGrid) {
                        metricsGrid.classList.add('show-grid');
                        metricsGrid.querySelectorAll('.summary-metric-card').forEach((c, i) => setTimeout(() => c.classList.add('show'), 50 + (i * 150)));
                        
                        setTimeout(() => {
                            if (!sessionStorage.getItem('hasSeenCaseDragTutorial')) {
                                const dragTut = document.getElementById('drag-tutorial');
                                if (dragTut) {
                                    dragTut.classList.add('show');
                                    setTimeout(() => dragTut.classList.remove('show'), 4000);
                                }
                                sessionStorage.setItem('hasSeenCaseDragTutorial', 'true');
                            }
                        }, 800);
                    }
                }
            }
            typeChar();
        }, 1200); 
    }
};

const slideObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const actionElements = entry.target.querySelectorAll('.btn-play-case, .btn-secondary-pill');
        
        if (entry.isIntersecting) {
            const visibleCaseId = entry.target.dataset.caseId;
            const foundCase = typeof portfolioCases !== 'undefined' ? portfolioCases.find(c => c.id === visibleCaseId) : null;
            if (foundCase) {
                activeCaseData = foundCase;
                const currentCrumb = document.getElementById('crumb-current');
                if (currentCrumb) currentCrumb.textContent = getSafeCaseTitle(foundCase);
            }
            syncToggleForCurrentCase(); 

            if (activeTTSCaseId && activeTTSCaseId !== foundCase.id && ttsState !== 'stopped') {
                window.speechSynthesis.cancel();
                resetTTSStopped();
            }
            
            const slideIndex = Array.from(caseSliderContainer.children).indexOf(entry.target);
            document.querySelectorAll('.slider-dot').forEach((dot, idx) => {
                dot.classList.toggle('active', idx === slideIndex);
            });
            
            actionElements.forEach(el => el.setAttribute('tabindex', '0'));
            
            if (window.triggerAiTyping) window.triggerAiTyping(entry.target);
            
        } else {
            actionElements.forEach(el => el.setAttribute('tabindex', '-1'));
        }
    });
}, { root: caseSliderContainer, threshold: 0.6 });

function setupCaseScrollEffect(id) {
    const scrollContainer = document.getElementById(`scroll-${id}`);
    if (!scrollContainer) return;
    
    const layout = scrollContainer.closest('.case-layout');
    const slideWrapper = scrollContainer.closest('.case-slide-wrapper'); 
    if (!layout) return;

    let scrollTimeout; 

    const handleScroll = (e) => {
        const scrollTop = e.target.scrollTop;

        layout.classList.add('is-scrolling');
        document.body.classList.add('is-scrolling-case'); 

        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            layout.classList.remove('is-scrolling');
            document.body.classList.remove('is-scrolling-case'); 
        }, 1000); 

        if (scrollTop > 50) {
            layout.classList.add('is-scrolled');
            document.body.classList.add('case-is-scrolled');

            if (!sessionStorage.getItem('hasSeenCaseDragTutorial')) {
                setTimeout(() => {
                    const dragTut = document.getElementById('drag-tutorial');
                    if (dragTut) {
                        dragTut.classList.add('show');
                        setTimeout(() => dragTut.classList.remove('show'), 4000);
                    }
                    sessionStorage.setItem('hasSeenCaseDragTutorial', 'true');
                }, 500); 
            }

            localStorage.setItem('resumeCaseId', id);
            localStorage.setItem('resumeScrollTop', scrollTop);
            
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
            document.body.classList.remove('case-is-scrolled');
        }
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    if (slideWrapper) {
        slideWrapper.addEventListener('scroll', handleScroll);
    }
}

const attachShareBtn = (container, item) => {
    const shareBtn = container.querySelector('.summary-share');
    if (shareBtn) {
        shareBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const url = `${window.location.origin}${window.location.pathname}?case=${item.slug || item.id}`;
            if (navigator.share) {
                try { await navigator.share({ title: item.title, text: item.aiSummary, url: url }); } catch(err) {}
            } else {
                navigator.clipboard.writeText(url);
                const original = shareBtn.innerHTML;
                shareBtn.innerHTML = t('copied');
                setTimeout(() => shareBtn.innerHTML = original, 2000);
            }
        });
    }
};

function initPortfolio() {
    if (typeof portfolioCases === 'undefined') return;

    gallery.innerHTML = '';
    caseSliderContainer.innerHTML = '';
    const dotsContainer = document.getElementById('slider-dots-container');
    if (dotsContainer) dotsContainer.innerHTML = '';

    portfolioCases.forEach((item, index) => {
       const isUnlocked = sessionStorage.getItem(`unlocked_${item.id}`) === 'true';
        const isLocked = item.isProtected && !isUnlocked;
        
        const displayTitle = isLocked ? (item.employer ? t('protected_employer_case').replace('{employer}', item.employer) : t('protected_case')) : item.title;

        // --- 1. HOME GALLERY ---
        const galleryItem = document.createElement('div');
        galleryItem.className = `gallery-item ${item.deviceClass || ''}`;
        if (item.customGap) galleryItem.style.marginRight = item.customGap;

        const thumb = document.createElement('div');
        thumb.className = `case-thumb-wrapper`;
        thumb.dataset.caseId = item.id; 
        thumb.tabIndex = 0; 
        
        const priorityAttr = index === 0 ? 'fetchpriority="high"' : '';
        
        const thumbImageHTML = isLocked 
            ? `<img src="${item.thumbSrc}" class="case-thumb-img locked-thumb-img" alt="Protected">`
            : `<img src="${item.thumbSrc}" class="case-thumb-img" alt="Thumbnail ${item.title}" ${priorityAttr}>`;
            
        const thumbLogoHTML = (item.logoUrl && item.logoUrl.trim() !== "" && !isLocked) 
            ? `<img src="${item.logoUrl}" class="gallery-item-logo" alt="${item.title} Logo" onerror="this.remove();">`
            : "";
        
        thumb.innerHTML = `${thumbImageHTML}${thumbLogoHTML}`;

        let functionalPillsHTML = '';
        if (item.videoSrc && item.videoSrc.trim() !== "") functionalPillsHTML += `<span class="gallery-pill">${t('btn_pitch')}</span>`;
        if (item.repositoryUrl && item.repositoryUrl.trim() !== "") functionalPillsHTML += `<span class="gallery-pill">${t('btn_repo')}</span>`;
        if (item.liveUrl && item.liveUrl.trim() !== "") functionalPillsHTML += `<span class="gallery-pill">${t('btn_demo')}</span>`;

        let readTimeHTML = item.readTime ? `
            <span class="gallery-read-time">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                ${item.readTime}
            </span>` : '';

        const shortDescHTML = isLocked 
            ? `<p class="gallery-item-shortdesc locked-shortdesc">Protected content placeholder.</p>` 
            : (item.shortDesc ? `<p class="gallery-item-shortdesc">${item.shortDesc}</p>` : '');
        
        const lockClosedIcon = `<svg class="lock-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`;
        const lockOpenIcon = `<svg class="lock-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path></svg>`;
        
        const lockIconHTML = item.isProtected ? (isUnlocked ? lockOpenIcon : lockClosedIcon) : '';

        const metaContainer = document.createElement('div');
        metaContainer.className = 'gallery-item-meta';
        metaContainer.innerHTML = `
            <div class="gallery-item-header no-logo">
                <div class="gallery-item-text">
                    <div class="gallery-item-title-wrapper">
                        <h4 class="gallery-item-title">${lockIconHTML}${displayTitle}</h4>
                        ${isLocked ? '' : readTimeHTML}
                    </div>
                    ${shortDescHTML}
                </div>
            </div>
            <div class="gallery-item-pills">${isLocked ? '' : functionalPillsHTML}</div>
        `;

        galleryItem.appendChild(thumb);
        galleryItem.appendChild(metaContainer);

        galleryItem.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isPreventingClicks) return;
            if (typeof gtag === 'function') gtag('event', 'select_content', { content_type: 'portfolio_case', item_id: item.id, item_name: item.title });
            openCaseView(item, thumb, index); 
        });
        
        galleryItem.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); openCaseView(item, thumb, index); }
        });
        
        gallery.appendChild(galleryItem);
        
        // --- 2. DETAIL SLIDER ---
        const slide = document.createElement('div');
        slide.className = `case-slide-wrapper ${item.deviceClass || ''}`;
        slide.dataset.caseId = item.id;
        
        let actionsHTML = '';
        const hasVideo = item.videoSrc && item.videoSrc.trim() !== "";
        const hasRepo = item.repositoryUrl && item.repositoryUrl.trim() !== "";
        const hasLive = item.liveUrl && item.liveUrl.trim() !== "";

        if (hasVideo || hasRepo || hasLive) {
            actionsHTML += `<div class="case-actions-group">`;
            if (hasVideo) actionsHTML += `<button class="btn-play-pill btn-play-case" data-id="${item.id}" tabindex="-1" aria-label="${t('play_video')}"><span class="play-icon-circle"><svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M8 5V19L19 12L8 5Z" fill="black"/></svg></span><span>${t('btn_pitch')}</span><span class="action-tooltip">${t('play_video_presentation')}<kbd>Enter</kbd></span></button>`;
            if (hasRepo) actionsHTML += `<a href="${item.repositoryUrl}" target="_blank" class="btn-secondary-pill" tabindex="-1" aria-label="${t('repository_code')}"><span>${t('repository')}</span><span class="action-tooltip">${t('github_directory')}</span></a>`;
            if (hasLive) actionsHTML += `<a href="${item.liveUrl}" target="_blank" class="btn-secondary-pill" tabindex="-1" aria-label="${t('live_demo')}"><span>${t('btn_demo')}</span><span class="action-tooltip">${t('live_demonstration')}</span></a>`;
            actionsHTML += `</div>`;
        }
        
        const caseLogoHTML = (item.logoUrl && item.logoUrl.trim() !== "") 
            ? `<img src="${item.logoUrl}" class="case-detail-logo" alt="${item.title} Logo" onerror="this.style.display='none'">`
            : "";
            
        const caseMediaHTML = isLocked
            ? `<img src="${item.thumbSrc}" class="case-thumb-img locked-main-img" id="locked-img-${item.id}" alt="Protected">`
            : `<img src="${item.thumbSrc}" class="case-thumb-img" alt="Thumbnail ${item.title}"> ${caseLogoHTML}`;

        const caseTitleHTML = isLocked
            ? ``
            : `<h3 class="case-year-label">${item.year}</h3><h2>${item.title}</h2>${actionsHTML}`;
        
        let initialContent = item.desc || "";
        if (isRecruiterMode && item.descRecruiter) initialContent = item.descRecruiter;
        else if (!item.desc && item.descRecruiter) initialContent = item.descRecruiter;
        else if (!item.descRecruiter && item.desc) initialContent = item.desc;
        
        const metricsHTML = (item.keyIndicators && item.keyIndicators.length > 0) ? `<div class="summary-metrics-grid hidden-default">${item.keyIndicators.map(ind => `<div class="summary-metric-card"><span class="metric-value">${ind.value}</span><span class="metric-label">${ind.label}</span></div>`).join('')}</div>` : '';
        const followUpsHTML = (item.aiFollowUps || []).map(q => `<button class="suggestion-chip" onclick="submitInlineAi('${item.id}', \`${q}\`)">${q}</button>`).join('');

        const aiSummaryHTML = item.aiSummary ? `
            <div class="ai-summary-block" data-case-id="${item.id}">
                <div class="ai-summary-header">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3 6 6 3-6 3-3 6-3-6-6-3 6-3z"/></svg>
                    <span>${t('ai_summary')}</span>
                </div>
                <p class="ai-summary-text" data-text="${item.aiSummary.replace(/"/g, '&quot;')}"></p>
                ${metricsHTML}
                <div class="ai-summary-actions" id="ai-actions-${item.id}">
                    <button class="ai-summary-btn summary-ask-ai" onclick="openInlineChat('${item.id}')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg> ${t('ask_ai')}</button>
                    <button class="ai-summary-btn summary-share" data-id="${item.id}"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg> ${t('share')}</button>
                </div>
                <div class="inline-chat-wrapper" id="inline-chat-${item.id}">
                    <div class="inline-chat-header">
                        <span class="inline-chat-title">${t('chat_with_ai')}</span>
                        <button onclick="closeInlineChat('${item.id}')" class="inline-chat-close" title="Close Chat"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
                    </div>

                    <div id="inline-chat-messages-${item.id}" class="inline-chat-messages"></div>
                    
                    <div class="inline-chat-suggestions-container" id="inline-suggestions-${item.id}">${followUpsHTML}</div>
                    
                    <div class="inline-chat-input-row">
                        <input type="text" id="inline-chat-input-${item.id}" class="inline-chat-input" oninput="document.getElementById('btn-send-inline-${item.id}').disabled = !this.value.trim()" onkeydown="if(event.key === 'Enter' && this.value.trim()) submitInlineAi('${item.id}')" placeholder="${t('ask_about_case')}">
                        <button id="btn-send-inline-${item.id}" disabled onclick="submitInlineAi('${item.id}')" class="btn-send-inline">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
                        </button>
                    </div>
                </div>
            </div>
        ` : '';

        let contentToRender = "";

        if (item.isProtected && !isUnlocked) {
            contentToRender = `
                <div class="protected-case-ui">
                    <div class="protected-case-card">
                        <svg class="protected-case-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                        <h3 class="protected-case-title">${displayTitle}</h3>
                        <p class="protected-case-desc">${t('enter_passcode')}</p>
                        <div class="protected-case-form">
                            <input type="text" id="pass-input-${item.id}" class="protected-case-input" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" data-lpignore="true" placeholder="${t('passcode')}">
                            <button id="btn-unlock-${item.id}" class="protected-case-btn">${t('unlock')}</button>
                        </div>
                        <p id="pass-error-${item.id}" class="protected-case-error"></p>
                    </div>
                </div>
            `;
        } else {
            contentToRender = aiSummaryHTML + `<div class="case-description-body">${initialContent}</div>`;
        }

        slide.innerHTML = `
            <div class="case-layout">
                <div class="case-media" id="media-${item.id}">
                    ${caseMediaHTML}
                </div>
                <div class="case-info-container">
                    <div class="case-info-scroll" id="scroll-${item.id}">
                        <div class="case-info-content">
                            <div class="case-header-row">
                                <div class="case-title-block" id="title-block-${item.id}">
                                    ${caseTitleHTML}
                                </div>
                            </div>
                            <div id="dynamic-content-${item.id}">
                                ${contentToRender}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        caseSliderContainer.appendChild(slide);
        setupCaseScrollEffect(item.id);

        if (item.isProtected) {
            const unlockBtn = slide.querySelector(`#btn-unlock-${item.id}`);
            const passInput = slide.querySelector(`#pass-input-${item.id}`);
            const errorMsg = slide.querySelector(`#pass-error-${item.id}`);
            
            if (unlockBtn && passInput) {
                const handleUnlock = () => {
                    if (passInput.value === item.password) {
                        sessionStorage.setItem(`unlocked_${item.id}`, 'true');
                        syncToggleForCurrentCase();
                        
                        const galleryThumb = document.querySelector(`.case-thumb-wrapper[data-case-id="${item.id}"]`);
                        if (galleryThumb) {
                            galleryThumb.innerHTML = `<img src="${item.thumbSrc}" class="case-thumb-img" alt="Thumbnail ${item.title}">${item.logoUrl ? `<img src="${item.logoUrl}" class="gallery-item-logo" alt="${item.title} Logo">` : ''}`;
                            const gTitleWrapper = galleryThumb.nextElementSibling.querySelector('.gallery-item-title-wrapper');
                            
                            if (gTitleWrapper) gTitleWrapper.innerHTML = `<h4 class="gallery-item-title">${lockOpenIcon}${item.title}</h4>${readTimeHTML}`;
                            
                            const pWrapper = galleryThumb.nextElementSibling.querySelector('.gallery-item-pills');
                            if (pWrapper) pWrapper.innerHTML = functionalPillsHTML;
                            const tWrapper = galleryThumb.nextElementSibling.querySelector('.gallery-item-text');
                            const placeholderDesc = tWrapper.querySelector('.gallery-item-shortdesc');
                            if (placeholderDesc) {
                                placeholderDesc.innerHTML = item.shortDesc;
                                placeholderDesc.classList.remove('locked-shortdesc');
                            }
                        }

                        const lockedImg = slide.querySelector(`#locked-img-${item.id}`);
                        if (lockedImg) {
                            lockedImg.classList.remove('locked-main-img');
                            setTimeout(() => lockedImg.insertAdjacentHTML('afterend', caseLogoHTML), 600);
                        }

                        const uiBox = slide.querySelector('.protected-case-ui');
                        if (uiBox) {
                            uiBox.style.opacity = '0';
                            uiBox.style.transform = 'translateY(15px) scale(0.98)';
                        }
                        
                        const dynContainer = slide.querySelector(`#dynamic-content-${item.id}`);
                        const titleBlock = slide.querySelector(`#title-block-${item.id}`);
                        
                        setTimeout(() => {
                            if (titleBlock) {
                                titleBlock.innerHTML = `<div class="reveal-anim reveal-anim-title"><h3 class="case-year-label">${item.year}</h3><h2>${item.title}</h2>${actionsHTML}</div>`;
                                const newPlayBtn = titleBlock.querySelector('.btn-play-case');
                                if (newPlayBtn) {
                                    newPlayBtn.addEventListener('click', (e) => { e.stopPropagation(); playSpecificCase(item.id); });
                                    newPlayBtn.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); playSpecificCase(item.id); }});
                                }
                            }

                            dynContainer.innerHTML = `<div class="reveal-anim reveal-anim-summary">${aiSummaryHTML}</div><div class="reveal-anim reveal-anim-desc case-description-body">${initialContent}</div>`;
                            
                            const newDescBody = dynContainer.querySelector('.case-description-body');
                            if (typeof initComboAssets === 'function') initComboAssets(newDescBody);
                            if (typeof attachTTSButton === 'function') attachTTSButton(newDescBody, item.id);
                            if (typeof rebuildTOC === 'function') rebuildTOC(slide);
                            attachShareBtn(dynContainer, item);
                            if (window.triggerAiTyping) window.triggerAiTyping(dynContainer);

                            requestAnimationFrame(() => {
                                requestAnimationFrame(() => {
                                    const reveals = slide.querySelectorAll('.reveal-anim');
                                    reveals.forEach(el => {
                                        el.style.opacity = '1';
                                        el.style.transform = 'translateY(0)';
                                    });
                                });
                            });
                        }, 350); 
                    } else {
                        errorMsg.innerText = t('incorrect_passcode');
                        errorMsg.style.opacity = '1';
                        passInput.value = "";
                        setTimeout(() => errorMsg.style.opacity = '0', 3000);
                    }
                };

                unlockBtn.addEventListener('click', handleUnlock);
                passInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleUnlock(); });
            }
        } else if (isUnlocked || !item.isProtected) {
            const finalDescBody = slide.querySelector('.case-description-body');
            if (finalDescBody) {
                attachTTSButton(finalDescBody, item.id);
                initComboAssets(finalDescBody); 
            }
            attachShareBtn(slide, item);
        }

        if (window.Prism) { window.Prism.highlightAllUnder(slide); }
        slideObserver.observe(slide); 
        
        // --- 3. SLIDER DOTS & SEARCH UI ---
        if (dotsContainer && index === 0) {
            dotsContainer.innerHTML = `
                <div class="search-autocomplete-results" id="search-autocomplete"></div>
                <div class="drag-tutorial" id="drag-tutorial">${t('swipe_explore')}</div>
                <div class="slider-search-wrapper">
                    <button class="btn-case-search" id="btn-case-search" aria-label="Search cases">
                        <svg class="icon-search" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        <svg class="icon-close" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        <span class="action-tooltip">Search <kbd><span class="os-mod"></span>K</kbd></span>
                    </button>
                    <input type="text" id="case-search-input" class="case-search-input" placeholder="${t('search_cases')}" autocomplete="off">
                </div>
                <div class="slider-dots-wrapper" id="slider-dots-wrapper"></div>
            `;
        }

        if (dotsContainer) {
            const dotsWrapper = document.getElementById('slider-dots-wrapper');
            const dot = document.createElement('div');
            dot.className = `slider-dot ${index === 0 ? 'active' : ''}`;
            dot.tabIndex = 0; 
            dot.setAttribute('role', 'button');

            const scrollToThisSlide = () => {
                const targetSlide = caseSliderContainer.querySelectorAll('.case-slide-wrapper')[index];
                if (targetSlide) {
                    const reduceMotion = document.documentElement.classList.contains('a11y-reduce-motion');
                    targetSlide.scrollIntoView({ inline: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
                }
            };

            dot.addEventListener('click', (e) => { e.stopPropagation(); scrollToThisSlide(); });
            dotsWrapper.appendChild(dot);
        }

        // --- 4. TABLE OF CONTENTS ---
        rebuildTOC(slide);
    });

    const finalDotsContainer = document.getElementById('slider-dots-container');
    if (finalDotsContainer) setupDotsDrag(finalDotsContainer, caseSliderContainer);

    initCaseSearch();

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

function setupDotsDrag(dotsContainer, sliderContainer) {
let isDraggingDots = false;
let startX;

const handleStart = (e) => {
    isDraggingDots = true;
    startX = e.touches ? e.touches[0].clientX : e.clientX;
    sliderContainer.style.scrollBehavior = 'auto'; 
    sliderContainer.style.scrollSnapType = 'none';
    dotsContainer.classList.add('is-scrubbing');
};

const handleMove = (e) => {
    if (!isDraggingDots) return;
    e.preventDefault(); 
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const walk = (startX - x) * 2.5; 
    sliderContainer.scrollLeft += walk;
    startX = x;
};

const handleEnd = () => {
    if (!isDraggingDots) return;
    isDraggingDots = false;
    dotsContainer.classList.remove('is-scrubbing');
    sliderContainer.style.scrollBehavior = 'smooth';
    sliderContainer.style.scrollSnapType = 'x mandatory';
    
    const slideWidth = window.innerWidth;
    const nearestIndex = Math.round(sliderContainer.scrollLeft / slideWidth);
    const maxIndex = sliderContainer.children.length - 1;
    const targetIndex = Math.max(0, Math.min(nearestIndex, maxIndex));
    
    sliderContainer.scrollTo({
        left: targetIndex * slideWidth,
        behavior: 'smooth'
    });
};

dotsContainer.addEventListener('mousedown', handleStart);
window.addEventListener('mousemove', handleMove);
window.addEventListener('mouseup', handleEnd);

dotsContainer.addEventListener('touchstart', handleStart, { passive: false });
window.addEventListener('touchmove', handleMove, { passive: false });
window.addEventListener('touchend', handleEnd);
}

function setupGalleryDrag(container) {
    let isDown = false;
    let startX, startY, startScrollLeft, lastX;
    let velocity = 0, lastTime, animationFrameId;
    let hasTriggeredVertical = false;

    const handleStart = (e) => {
        if (e.target.closest('button, a, .floating-back-btn, .nav-link, .before-after-slider')) return;
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
        if (e.target.closest('button, a, .floating-back-btn, .nav-link, .before-after-slider')) return;
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
setupWheelScroll(gallery, false); 
setupWheelScroll(caseSliderContainer, true); 

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
    if (vttTimeUpdateHandler) {
        mainVideo.removeEventListener('timeupdate', vttTimeUpdateHandler);
        vttTimeUpdateHandler = null;
        parsedVttCues = null;
    }
    mainVideo.removeAttribute('src');
    mainVideo.load(); 
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
        
        const oldTrack = mainVideo.querySelector('track');
        if (oldTrack) oldTrack.remove();
        
        const subtitleBox = document.getElementById('custom-subtitle-container');
        subtitleBox.innerText = ""; 
        subtitleBox.style.display = "none";
        
        if (caseData.vttSrc) {
            const track = document.createElement('track');
            track.kind = 'captions';
            track.src = caseData.vttSrc;
            track.srclang = caseData.vttSrc.includes('/en-') ? 'en' : (caseData.vttSrc.includes('/pt-') ? 'pt' : 'en');
            track.label = track.srclang === 'pt' ? 'PortuguÃªs' : 'English';
            track.default = false;
            mainVideo.appendChild(track);

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

            try {
                fetch(caseData.vttSrc).then(r => r.text()).then(vttText => {
                    parsedVttCues = parseVtt(vttText);
                    const subtitleBox = document.getElementById('custom-subtitle-container');
                    if (vttTimeUpdateHandler) mainVideo.removeEventListener('timeupdate', vttTimeUpdateHandler);
                    vttTimeUpdateHandler = () => {
                        if (!parsedVttCues || parsedVttCues.length === 0) return;
                        const textTrack = mainVideo.textTracks && mainVideo.textTracks[0];
                        const ccEnabled = textTrack ? textTrack.mode === 'hidden' : !document.getElementById('icon-cc-on').classList.contains('hidden');
                        if (!ccEnabled) { subtitleBox.innerText = ''; subtitleBox.style.display = 'none'; return; }
                        const t = mainVideo.currentTime;
                        let found = null;
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
                    updateTogglesUI();
                }).catch(() => {
                    parsedVttCues = null;
                });
            } catch (e) { parsedVttCues = null; }
        }
    }

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
    
    if (videoLoader) videoLoader.classList.remove('hidden');

    // Capture user's previous state ONLY if they aren't already in the player
    if (document.body.getAttribute('data-active-view') !== 'player') {
        prePlayerDarkMode = document.documentElement.classList.contains('a11y-dark-mode');
        prePlayerHighContrast = document.documentElement.classList.contains('a11y-high-contrast');
    }

    transitionTo('player', () => { 
        // Force dark mode or preserve high contrast based on robust native locking
        const tglDark = document.getElementById('toggle-dark');
        const tglContrast = document.getElementById('toggle-contrast');
        
        if (tglContrast && tglContrast.checked) {
            if (tglDark) tglDark.checked = false;
            document.documentElement.classList.remove('a11y-dark-mode');
        } else {
            document.documentElement.classList.add('a11y-dark-mode');
            if (tglDark) tglDark.checked = true;
        }

        const startPlay = () => {
            mainVideo.style.opacity = '1';
            if (videoLoader) videoLoader.classList.add('hidden');
            
            mainVideo.play().catch(e => console.log("Error playing:", e));
            
            if (!sessionStorage.getItem('hasSeenSeekTutorial')) {
                const tutorial = document.getElementById('progress-tutorial');
                if (tutorial) {
                    tutorial.classList.add('show');
                    setTimeout(() => {
                        tutorial.classList.remove('show');
                        sessionStorage.setItem('hasSeenSeekTutorial', 'true');
                    }, 5000); 
                }
            }

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

mainVideo.addEventListener('waiting', () => videoLoader.classList.remove('hidden'));
mainVideo.addEventListener('playing', () => videoLoader.classList.add('hidden'));

function updateSmoothProgress() {
    if (mainVideo.duration && !mainVideo.paused) {
        const progress = (mainVideo.currentTime / mainVideo.duration) * 100;
        progressBar.style.width = `${progress}%`;
        progressAnimation = requestAnimationFrame(updateSmoothProgress);
    }
}

mainVideo.addEventListener('play', () => {
    progressAnimation = requestAnimationFrame(updateSmoothProgress);
    const iconPause = document.getElementById('icon-pause');
    const iconPlay = document.getElementById('icon-play');
    const tooltipPause = document.getElementById('tooltip-pause');
    
    if (iconPause && iconPlay) {
        iconPause.classList.remove('hidden');
        iconPlay.classList.add('hidden');
    }
    if (tooltipPause) tooltipPause.innerHTML = `Pause <kbd>Space</kbd>`;
});

mainVideo.addEventListener('pause', () => {
    cancelAnimationFrame(progressAnimation);
    const iconPause = document.getElementById('icon-pause');
    const iconPlay = document.getElementById('icon-play');
    const tooltipPause = document.getElementById('tooltip-pause');
    
    if (iconPause && iconPlay) {
        iconPause.classList.add('hidden');
        iconPlay.classList.remove('hidden');
    }
    if (tooltipPause) tooltipPause.innerHTML = `Play <kbd>Space</kbd>`;
});

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
        
        // Restore fully original a11y states
        restorePlayerA11yPrefs();
        
        if (activeCaseData) prepareMorph(null, `media-${activeCaseData.id}`, true);
        transitionTo('case'); 
    }, 500);
});

document.getElementById('btn-stop').addEventListener('click', (e) => { 
    e.stopPropagation(); 
    document.documentElement.classList.remove('slide-up-transition');
    document.documentElement.classList.add('slide-down-transition');
    
    unloadVideo(true); 
    
    // Restore fully original a11y states
    restorePlayerA11yPrefs();

    if (activeCaseData) prepareMorph(null, `media-${activeCaseData.id}`, true);
    transitionTo('case'); 
});

document.getElementById('btn-pause').addEventListener('click', (e) => { 
    e.stopPropagation(); 
    if (mainVideo.paused) {
        mainVideo.play();
    } else {
        mainVideo.pause();
    }
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
    const breadcrumb = document.getElementById('top-breadcrumb');
    if (!controls) return;

    controls.classList.remove('fade-out');
    if (breadcrumb && document.body.getAttribute('data-active-view') === 'player') {
        breadcrumb.classList.remove('fade-out');
    }
    clearTimeout(playerIdleTimer);

    playerIdleTimer = setTimeout(() => { 
        const isFocusInside = controls.contains(document.activeElement);
        if(!mainVideo.paused && !isFocusInside) {
            controls.classList.add('fade-out');
            if (breadcrumb && document.body.getAttribute('data-active-view') === 'player') {
                breadcrumb.classList.add('fade-out');
            }
        }
    }, 2500);
}

views.player.addEventListener('mousemove', resetIdleTimer);
document.addEventListener('focusin', (e) => {
    if (views.player.style.display === 'flex' && e.target.closest('#player-controls')) resetIdleTimer();
});

/* ==========================================================================
   VIDEO SEEKING ENGINE
   ========================================================================== */
let isDraggingProgress = false;
let wasPlayingBeforeDrag = false;

function seekVideo(e) {
    if (!mainVideo.duration) return;
    const rect = progressContainer.getBoundingClientRect();
    let clientX = e.touches ? e.touches[0].clientX : e.clientX;
    let x = clientX - rect.left;
    x = Math.max(0, Math.min(x, rect.width)); 
    const percent = x / rect.width;
    
    progressBar.style.width = `${percent * 100}%`;
    mainVideo.currentTime = percent * mainVideo.duration;
}

if (progressContainer) {
    progressContainer.addEventListener('mousemove', (e) => {
        const rect = progressContainer.getBoundingClientRect();
        let clientX = e.touches ? e.touches[0].clientX : e.clientX;
        let x = clientX - rect.left;
        x = Math.max(0, Math.min(x, rect.width));
        const percent = (x / rect.width) * 100;
        
        progressContainer.style.setProperty('--hover-pos', `${percent}%`);
    });
    
    progressContainer.addEventListener('mousedown', (e) => {
        isDraggingProgress = true;
        wasPlayingBeforeDrag = !mainVideo.paused;
        progressContainer.classList.add('is-dragging');
        mainVideo.pause(); 
        seekVideo(e);
    });

    window.addEventListener('mousemove', (e) => {
        if (isDraggingProgress) seekVideo(e);
    });

    window.addEventListener('mouseup', () => {
        if (isDraggingProgress) {
            isDraggingProgress = false;
            progressContainer.classList.remove('is-dragging');
            if (wasPlayingBeforeDrag) mainVideo.play();
        }
    });

    progressContainer.addEventListener('touchstart', (e) => {
        isDraggingProgress = true;
        wasPlayingBeforeDrag = !mainVideo.paused;
        progressContainer.classList.add('is-dragging');
        mainVideo.pause();
        seekVideo(e);
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        if (isDraggingProgress) seekVideo(e);
    }, { passive: true });

    window.addEventListener('touchend', () => {
        if (isDraggingProgress) {
            isDraggingProgress = false;
            progressContainer.classList.remove('is-dragging');
            if (wasPlayingBeforeDrag) mainVideo.play();
        }
    });
}

/* ==========================================================================
   SEARCH & HIGHLIGHT ENGINE
   ========================================================================== */
function initCaseSearch() {
    const searchBtn = document.getElementById('btn-case-search');
    const searchInput = document.getElementById('case-search-input');
    const dotsContainer = document.getElementById('slider-dots-container');
    const autocompleteBox = document.getElementById('search-autocomplete');
    
    if (!searchBtn || !searchInput) return;

    searchBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dotsContainer.classList.toggle('search-active');
        if (dotsContainer.classList.contains('search-active')) {
            searchInput.focus();
        } else {
            searchInput.value = '';
            autocompleteBox.classList.remove('show');
            clearHighlights();
        }
    });

    document.addEventListener('click', (e) => {
        if (!dotsContainer.contains(e.target)) {
            dotsContainer.classList.remove('search-active');
            autocompleteBox.classList.remove('show');
        }
    });

    searchInput.addEventListener('mousedown', (e) => e.stopPropagation());
    searchInput.addEventListener('touchstart', (e) => e.stopPropagation(), {passive: true});

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        autocompleteBox.innerHTML = '';
        
        if (query.length < 2) {
            autocompleteBox.classList.remove('show');
            return;
        }

        let matches = [];
        
        portfolioCases.forEach((caseData, index) => {
            if (caseData.isProtected && sessionStorage.getItem(`unlocked_${caseData.id}`) !== 'true') return;
            const overviewText = `${caseData.title} ${caseData.desc}`.toLowerCase();
            const techText = caseData.descRecruiter ? caseData.descRecruiter.toLowerCase() : "";
            
            const matchOverview = overviewText.indexOf(query);
            const matchTech = techText.indexOf(query);
            
            if (matchOverview !== -1 || matchTech !== -1) {
                const isTechMatch = matchOverview === -1 && matchTech !== -1;
                const sourceText = isTechMatch ? techText : overviewText;
                const matchIndex = isTechMatch ? matchTech : matchOverview;

                const start = Math.max(0, matchIndex - 30);
                const end = Math.min(sourceText.length, matchIndex + 50);
                let snippet = sourceText.substring(start, end).replace(/<[^>]*>?/gm, ''); 
                
                const regex = new RegExp(query, 'gi');
                snippet = snippet.replace(regex, match => `<b>${match}</b>`);

                matches.push({ 
                    data: caseData, 
                    index, 
                    snippet: `...${snippet}...`,
                    isTechMatch
                });
            }
        });

        if (matches.length > 0) {
            matches.slice(0, 3).forEach(match => {
                const item = document.createElement('div');
                item.className = 'autocomplete-item';
                item.innerHTML = `
                    <span class="auto-title">${match.data.title}</span>
                    <span class="auto-snippet">${match.snippet}</span>
                `;
                
                item.addEventListener('click', () => {
                    executeSearchNavigation(match.index, match.data.id, query, match.isTechMatch);
                });
                
                autocompleteBox.appendChild(item);
            });
            autocompleteBox.classList.add('show');
        } else {
            autocompleteBox.classList.remove('show');
        }
    });
}

function clearHighlights() {
    document.querySelectorAll('mark.search-highlight').forEach(mark => {
        const parent = mark.parentNode;
        parent.replaceChild(document.createTextNode(mark.textContent), mark);
        parent.normalize(); 
    });
}

function executeSearchNavigation(slideIndex, caseId, term, isTechMatch) {
    document.getElementById('slider-dots-container').classList.remove('search-active');
    document.getElementById('search-autocomplete').classList.remove('show');
    
    let needsModeSwitch = false;
    if (isTechMatch && !isRecruiterMode) needsModeSwitch = true;
    if (!isTechMatch && isRecruiterMode) {
        const targetCase = portfolioCases.find(c => c.id === caseId);
        if (targetCase && targetCase.descRecruiter) needsModeSwitch = true;
    }

    if (needsModeSwitch) {
        const toggleBtn = document.getElementById('btn-mode-toggle');
        if (toggleBtn && !toggleBtn.classList.contains('no-tech-view') && !toggleBtn.classList.contains('no-overview')) {
            toggleBtn.click();
        }
    }

    const slideWidth = window.innerWidth;
    caseSliderContainer.style.scrollSnapType = 'none';
    caseSliderContainer.scrollTo({ left: slideIndex * slideWidth, behavior: 'smooth' });
    
    setTimeout(() => {
        caseSliderContainer.style.scrollSnapType = 'x mandatory';
        highlightAndScrollToTerm(caseId, term);
    }, 850); 
}

function highlightAndScrollToTerm(caseId, term) {
    clearHighlights();
    const slide = document.querySelector(`.case-slide-wrapper[data-case-id="${caseId}"]`);
    if (!slide) return;
    
    const descBody = slide.querySelector('.case-description-body');
    const scrollContainer = slide.querySelector('.case-info-scroll');
    if (!descBody || !scrollContainer || !term) return;

    const walker = document.createTreeWalker(descBody, NodeFilter.SHOW_TEXT, null, false);
    const nodesToModify = [];
    let node;
    const regex = new RegExp('(' + term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');

    while (node = walker.nextNode()) {
        if (regex.test(node.nodeValue) && !node.parentNode.closest('pre, code, .case-caption')) {
            nodesToModify.push(node);
        }
    }

    let firstHighlight = null;
    nodesToModify.forEach(txtNode => {
        const fragment = document.createDocumentFragment();
        const parts = txtNode.nodeValue.split(regex);
        
        parts.forEach(part => {
            if (part.toLowerCase() === term.toLowerCase()) {
                const mark = document.createElement('mark');
                mark.className = 'search-highlight';
                mark.textContent = part;
                fragment.appendChild(mark);
                if (!firstHighlight) firstHighlight = mark;
            } else {
                fragment.appendChild(document.createTextNode(part));
            }
        });
        txtNode.parentNode.replaceChild(fragment, txtNode);
    });

    if (firstHighlight) {
        setTimeout(() => {
            scrollContainer._isAnimating = false;
            if (scrollContainer._animationFrameId) cancelAnimationFrame(scrollContainer._animationFrameId);
            firstHighlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 50);
    }
}

/* ==========================================================================
   GLOBAL NAVIGATION & EVENT LISTENERS
   ========================================================================== */
document.addEventListener('contextmenu', (e) => e.preventDefault());
document.addEventListener('dragstart', (e) => e.preventDefault());

// --- BREADCRUMB MORPH TRIGGERS ---
const currentCrumbEl = document.getElementById('crumb-current');
if (currentCrumbEl) {
    currentCrumbEl.addEventListener('click', () => {
        // Triggers the morphing transition from Video Player back to the Case Reader
        if (document.body.getAttribute('data-active-view') === 'player') {
            const stopBtn = document.getElementById('btn-stop');
            if (stopBtn) stopBtn.click();
        }
    });
}

const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
const modSymbol = isMac ? '⌥ ' : 'Alt ';
document.querySelectorAll('.os-mod').forEach(el => el.textContent = modSymbol);

const homeBtnEl = document.getElementById('home-button');
if (homeBtnEl) {
    homeBtnEl.addEventListener('click', (e) => {
        e.stopPropagation();
        const currentView = document.body.getAttribute('data-active-view');
        
        if (currentView === 'player') {
            document.getElementById('btn-stop').click();
            return;
        }
        
        document.documentElement.classList.remove('slide-up-transition');
        document.documentElement.classList.add('slide-down-transition');
        if (views.player.style.display === 'flex') unloadVideo(false); 
        
        const activeId = activeCaseData ? activeCaseData.id : null;
        const activeThumb = activeId ? document.querySelector(`.case-thumb-wrapper[data-case-id="${activeId}"]`) : null;
        
        if (activeThumb && activeId) {
            prepareMorph(activeThumb, `media-${activeId}`, true);
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
    });
}

document.getElementById('crumb-home').addEventListener('click', () => {
    const btn = document.getElementById('home-button');
    if(btn) btn.click();
});

const aboutBtnEl = document.getElementById('about-button');
if (aboutBtnEl) {
    aboutBtnEl.addEventListener('click', (e) => {
        e.stopPropagation();
        prepareMorph(null, false);
        transitionTo('about');
    });
    aboutBtnEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); aboutBtnEl.click(); }
    });
}

document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    const isMod = e.altKey;
    const checkKey = (code, letter) => e.code === code || e.key.toLowerCase() === letter;

    if (isMod && checkKey('KeyI', 'i')) {
        e.preventDefault();
        const btn = document.getElementById('about-button');
        if (btn && !btn.classList.contains('hidden')) btn.click();
    }
    
    if (e.key === 'Backspace') {
        const returnBtn = document.getElementById('home-button');
        if (returnBtn && !returnBtn.classList.contains('hidden')) {
            e.preventDefault();
            returnBtn.click();
        }
    }

    if (views.player.classList.contains('active')) {
        if (e.code === 'Space') { 
            e.preventDefault(); 
            const btn = document.getElementById('btn-pause');
            if (btn) btn.click(); 
        }
        if (checkKey('KeyM', 'm')) { 
            e.preventDefault(); 
            const btn = document.getElementById('btn-mute');
            if (btn) btn.click(); 
        }
        if (checkKey('KeyC', 'c')) { 
            e.preventDefault(); 
            const btn = document.getElementById('btn-cc');
            if (btn) btn.click(); 
        }
        if (checkKey('KeyS', 's')) { 
            e.preventDefault(); 
            const btn = document.getElementById('btn-speed');
            if (btn) btn.click(); 
        }
        if (checkKey('KeyX', 'x')) { 
            e.preventDefault(); 
            const btn = document.getElementById('btn-stop');
            if (btn) btn.click(); 
        }
    }
    if (isMod && checkKey('KeyK', 'k')) {
        e.preventDefault();
        const btn = document.getElementById('btn-case-search');
        const searchInput = document.getElementById('case-search-input');
        if (btn && searchInput) {
            if (!document.getElementById('slider-dots-container').classList.contains('search-active')) {
                btn.click();
            } else {
                searchInput.focus();
            }
        }
    }
    

    if (isMod && checkKey('KeyV', 'v')) {
        e.preventDefault();
        const btn = document.getElementById('btn-mode-toggle');
        if (btn && !btn.classList.contains('hidden') && !btn.classList.contains('no-tech-view') && !btn.classList.contains('no-overview')) {
            btn.click();
        }
    }

    if (isMod && checkKey('KeyL', 'l')) {
        e.preventDefault();
        const btn = document.getElementById('btn-lang');
        if (btn) btn.click();
    }

    if (isMod && checkKey('KeyA', 'a')) {
        e.preventDefault();
        const btn = document.getElementById('btn-a11y');
        if (btn) btn.click();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    if (e.key === 'Escape') {
        const activeLightbox = document.querySelector('.lightbox-overlay.active');
        if (activeLightbox) {
            activeLightbox.classList.remove('active');
            return; 
        }
        if (!views.home.classList.contains('active')) {
            document.getElementById('home-button').click(); 
        }
    }

    if (views.case.classList.contains('active')) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
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
            const activeEl = document.activeElement;
            const isInteractiveFocused = activeEl.tagName === 'BUTTON' || 
                                         activeEl.id === 'home-button' || 
                                         activeEl.classList.contains('slider-dot');
            
            if (!isInteractiveFocused && activeCaseData && activeCaseData.videoSrc) {
                e.preventDefault();
                playSpecificCase(activeCaseData.id);
            }
        }
    }
});

const backBtnEl = document.getElementById('home-button'); 
if (backBtnEl) {
    backBtnEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); backBtnEl.click(); }
    });
}

let globalPointerDown = false;
let globalStartX = 0;
let globalStartY = 0;

window.addEventListener('pointerdown', (e) => {
    globalPointerDown = true;
    globalStartX = e.clientX;
    globalStartY = e.clientY;
}, { passive: true });

window.addEventListener('pointermove', (e) => {
    if (!globalPointerDown) return;
    if (Math.abs(e.clientX - globalStartX) > 5 || Math.abs(e.clientY - globalStartY) > 5) {
        isPreventingClicks = true; 
    }
}, { passive: true });

window.addEventListener('pointerup', () => {
    globalPointerDown = false;
    setTimeout(() => { isPreventingClicks = false; }, 50); 
});

document.body.addEventListener('click', (e) => {
    if (isPreventingClicks) return; 
    
    if (typeof gtag === 'function') {
        const link = e.target.closest('a');
        if (link) {
            if (link.href.includes('mailto:')) gtag('event', 'generate_lead', { method: 'email' });
            else if (link.href.includes('linkedin.com')) gtag('event', 'contact_click', { method: 'linkedin' });
            else if (link.href.includes('github.com')) gtag('event', 'contact_click', { method: 'github' });
        }
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
    e.stopPropagation();
    lightbox.classList.remove('active');
    setTimeout(() => { lightboxImg.src = ''; }, 300);
});

let forceViewportRecalc = null; 
if (window.visualViewport) {
    const layoutViewportAdaptation = () => {
        if (window.innerWidth <= 768) {
            if (window.scrollY !== 0 || window.scrollX !== 0) window.scrollTo(0, 0);

            const visibleHeight = window.visualViewport.height;
            const visibleWidth = window.visualViewport.width;
            const visibleTop = window.visualViewport.offsetTop;
            const visibleLeft = window.visualViewport.offsetLeft;

            document.documentElement.style.setProperty('--sv-height', `${visibleHeight}px`);
            document.documentElement.style.setProperty('--sv-width', `${visibleWidth}px`);
            document.documentElement.style.setProperty('--sv-top', `${visibleTop}px`);
            document.documentElement.style.setProperty('--sv-left', `${visibleLeft}px`);
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

/* ==========================================================================
   INITIALIZATION PIPELINE
   ========================================================================== */
initPortfolio();

if (gallery) {
    setTimeout(() => {
        document.documentElement.classList.add('bypassed-entrance');
        console.log("🚀 Entrance sequence fully settled. Permanent bypass active.");
    }, 2000);

    const triggerImmediateBypass = () => document.documentElement.classList.add('bypassed-entrance');
    gallery.addEventListener('mousedown', triggerImmediateBypass, { passive: true });
    gallery.addEventListener('touchstart', triggerImmediateBypass, { passive: true });
}

const adminParams = new URLSearchParams(window.location.search);
if (adminParams.get('admin') === 'true') {
    localStorage.setItem('exclude_traffic', 'true');
    alert('Developer Mode Enabled! Your visits will no longer be tracked in this browser.');
    window.location.href = window.location.pathname; 
}

function timecodeToSeconds(tc) {
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
    if (lines[0] && lines[0].toUpperCase().includes('WEBVTT')) i = 1;
    while (i < lines.length) {
        if (!lines[i].trim()) { i++; continue; }
        let possibleTimeLine = lines[i];
        if (possibleTimeLine && !possibleTimeLine.includes('-->')) {
            i++; 
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

function rebuildTOC(slide) {
    const descBody = slide.querySelector('.case-description-body');
    const scrollContainer = slide.querySelector('.case-info-scroll');
    const layout = slide.querySelector('.case-layout');
    if (!descBody || !scrollContainer || !layout) return;

    const oldToc = layout.querySelector('.case-toc');
    if (oldToc) oldToc.remove();

    const headings = descBody.querySelectorAll('h3');
    if (headings.length === 0) return;

    const tocContainer = document.createElement('div');
    const isActivelyViewed = activeCaseData && slide.dataset.caseId === activeCaseData.id;
    tocContainer.className = isActivelyViewed ? 'case-toc is-transitioning' : 'case-toc';
    
    const btnTopo = document.createElement('div');
    btnTopo.className = 'toc-item active'; 
    btnTopo.classList.add('toc-item-top');
    btnTopo.innerHTML = `
        <div class="toc-text-wrapper"><div class="toc-text">${t('back_to_top')}</div></div>
        <span class="toc-dash toc-dash-dot"></span>
    `;
    btnTopo.addEventListener('click', (e) => {
        e.stopPropagation();
        scrollContainer._isAnimating = false;
        if (scrollContainer._animationFrameId) cancelAnimationFrame(scrollContainer._animationFrameId);
        scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
    });
    tocContainer.appendChild(btnTopo);

    headings.forEach((h3) => {
        const tocItem = document.createElement('div');
        tocItem.className = 'toc-item'; 
        tocItem.innerHTML = `
            <div class="toc-text-wrapper"><div class="toc-text">${h3.innerText}</div></div>
            <span class="toc-dash"></span>
        `;
        tocItem.addEventListener('click', (e) => {
            e.stopPropagation(); 
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
    
    layout.appendChild(tocContainer);
    
    if (!scrollContainer._hasTocListener) {
        scrollContainer.addEventListener('scroll', () => {
            let currentActive = 0; 
            const containerTop = scrollContainer.getBoundingClientRect().top;
            const currentHeadings = slide.querySelectorAll('.case-description-body h3');
            const currentToc = slide.querySelector('.case-toc');
            if (!currentToc) return;

            currentHeadings.forEach((h3, i) => {
                const h3Top = h3.getBoundingClientRect().top;
                if ((h3Top - containerTop) <= 120) { currentActive = i + 1; }
            });
            
            const tocItems = currentToc.querySelectorAll('.toc-item');
            tocItems.forEach(item => item.classList.remove('active'));
            if (tocItems[currentActive]) tocItems[currentActive].classList.add('active');
        });
        scrollContainer._hasTocListener = true;
    }
}

function initDeepLinkingAndResume() {
    const urlParams = new URLSearchParams(window.location.search);
    const targetCaseId = window.location.hash.replace('#', '') || urlParams.get('case');

    if (targetCaseId) {
        const targetIndex = portfolioCases.findIndex(c => c.slug === targetCaseId || c.id === targetCaseId);
        if (targetIndex !== -1) {
            document.documentElement.classList.add('bypassed-entrance');
            setTimeout(() => {
                const thumb = document.querySelector(`.case-thumb-wrapper[data-case-id="${portfolioCases[targetIndex].id}"]`);
                if (thumb) openCaseView(portfolioCases[targetIndex], thumb, targetIndex);
            }, 100);
            return;
        }
    }

    switchView('home');

    const resumeCaseId = localStorage.getItem('resumeCaseId');
    const resumeScrollTop = localStorage.getItem('resumeScrollTop');
    
    if (resumeCaseId && resumeScrollTop) {
        const caseData = portfolioCases.find(c => c.id === resumeCaseId);
        if (caseData) {
            const toast = document.createElement('div');
            toast.className = 'resume-reading-toast';
            toast.innerHTML = `
                <span>${t('resume_reading')} <strong>${caseData.title}</strong></span> 
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            `;
            document.body.appendChild(toast);
            
            setTimeout(() => toast.classList.add('show'), 1500);

            toast.addEventListener('click', () => {
                toast.classList.remove('show');
                document.documentElement.classList.add('bypassed-entrance');
                const targetIndex = portfolioCases.findIndex(c => c.id === caseData.id);
                const thumb = document.querySelector(`.case-thumb-wrapper[data-case-id="${caseData.id}"]`);
                
                openCaseView(caseData, thumb, targetIndex);
                
                setTimeout(() => {
                    const scrollEl = document.getElementById(`scroll-${caseData.id}`);
                    if (scrollEl) scrollEl.scrollTo({ top: parseInt(resumeScrollTop), behavior: 'smooth' });
                }, 800);
            });

            setTimeout(() => {
                if (toast.classList.contains('show')) toast.classList.remove('show');
            }, 8000);
        }
    }
}
initDeepLinkingAndResume();

function initParagraphHover() {
    const hoverTrigger = document.createElement('div');
    hoverTrigger.className = 'paragraph-hover-trigger';
    hoverTrigger.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="5" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="9" cy="19" r="1.5"/><circle cx="15" cy="5" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="15" cy="19" r="1.5"/></svg>`;
    document.body.appendChild(hoverTrigger);

    const hoverMenu = document.createElement('div');
    hoverMenu.className = 'paragraph-hover-menu';
    hoverMenu.innerHTML = `
        <button id="ph-ask-ai"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2" /><circle cx="12" cy="5" r="2" /><path d="M12 7v4" /><line x1="8" y1="16" x2="8.01" y2="16" /><line x1="16" y1="16" x2="16.01" y2="16" /></svg> ${t('ph_ask_ai')}</button>
        <div class="ph-divider"></div>
        <button id="ph-autoscroll"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="7 13 12 18 17 13"></polyline><polyline points="7 6 12 11 17 6"></polyline></svg> ${t('ph_autoscroll')}</button>
        <div class="ph-divider"></div>
        <button id="ph-link"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg> ${t('ph_copy_link')}</button>
        <button id="ph-email"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg> ${t('ph_email_lio')}</button>
        <button id="ph-share"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg> ${t('ph_share')}</button>
    `;
    document.body.appendChild(hoverMenu);

    let activeHoverParagraph = null;
    let hoverHideTimeout;
    let isActivelyScrolling = false;
    let scrollLockTimeout;

    const handleGlobalScroll = () => {
        isActivelyScrolling = true;
        hoverTrigger.classList.remove('show');
        hoverMenu.classList.remove('show');
        clearTimeout(scrollLockTimeout);
        scrollLockTimeout = setTimeout(() => { isActivelyScrolling = false; }, 150);
    };

    document.querySelectorAll('.case-info-scroll').forEach(el => el.addEventListener('scroll', handleGlobalScroll, { passive: true }));
    window.addEventListener('scroll', handleGlobalScroll, { passive: true });

    document.addEventListener('mouseover', (e) => {
        if (window.innerWidth <= 768 || isActivelyScrolling) return; 
        if (hoverMenu.classList.contains('show')) return;
        
        const p = e.target.closest('.case-description-body .p1, .case-description-body .p2');
        
        if (p && !p.classList.contains('combo-observation')) {
            clearTimeout(hoverHideTimeout);
            activeHoverParagraph = p;
            
            const rect = p.getBoundingClientRect();
            const layoutContainer = p.closest('.case-info-container');
            const containerLeft = layoutContainer ? layoutContainer.getBoundingClientRect().left : rect.left;
            
            hoverTrigger.style.top = `${rect.top - 4}px`;
            hoverTrigger.style.left = `${containerLeft - 38}px`; 
            
            if (!hoverMenu.classList.contains('show')) hoverTrigger.classList.add('show');
            
        } else if (!e.target.closest('.paragraph-hover-trigger') && !e.target.closest('.paragraph-hover-menu')) {
            hoverHideTimeout = setTimeout(() => {
                hoverTrigger.classList.remove('show');
                hoverMenu.classList.remove('show');
            }, 150);
        }
    });

    hoverTrigger.addEventListener('mouseenter', () => clearTimeout(hoverHideTimeout));
    hoverMenu.addEventListener('mouseenter', () => clearTimeout(hoverHideTimeout));

    hoverTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        hoverMenu.style.visibility = 'hidden';
        hoverMenu.classList.add('show');
        
        const triggerRect = hoverTrigger.getBoundingClientRect();
        const menuWidth = hoverMenu.offsetWidth;
        
        hoverMenu.style.top = `${triggerRect.top}px`;
        hoverMenu.style.left = `${triggerRect.left - menuWidth - 8}px`;
        hoverMenu.style.visibility = 'visible';
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.paragraph-hover-menu') && !e.target.closest('.paragraph-hover-trigger')) {
            // Actively target and close ALL instances of dropdowns to ensure none are orphaned
            document.querySelectorAll('.paragraph-hover-menu.show').forEach(menu => {
                menu.classList.remove('show');
            });
        }
    });

    document.getElementById('ph-ask-ai').addEventListener('click', (e) => {
        e.stopPropagation();
        if (activeHoverParagraph && activeCaseData) {
            const textSnippet = activeHoverParagraph.innerText.substring(0, 80) + '...';
            hoverMenu.classList.remove('show');
            
            window.openInlineChat(activeCaseData.id);
            setTimeout(() => {
                const chatInput = document.getElementById(`inline-chat-input-${activeCaseData.id}`);
                if (chatInput) {
                    chatInput.value = `${t('explain_part')} "${textSnippet}"`;
                    chatInput.focus();
                }
            }, 50);
        }
    });

    document.getElementById('ph-read-aloud').addEventListener('click', () => {
        if (activeHoverParagraph && window.speechSynthesis) {
            window.speechSynthesis.cancel(); 
            const text = activeHoverParagraph.innerText;
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = typeof currentTTSRate !== 'undefined' ? currentTTSRate : 1.0;
            window.speechSynthesis.speak(utterance);
            hoverMenu.classList.remove('show');
        }
    });

    let autoScrollId;
    document.getElementById('ph-autoscroll').addEventListener('click', () => {
        if (!activeHoverParagraph) return;
        hoverMenu.classList.remove('show');
        
        const scrollContainer = activeHoverParagraph.closest('.case-info-scroll');
        if (!scrollContainer) return;

        activeHoverParagraph.scrollIntoView({ behavior: 'smooth', block: 'start' });

        setTimeout(() => {
            let isAutoScrolling = true;
            
            const scrollStep = () => {
                if (!isAutoScrolling) return;
                scrollContainer.scrollTop += 0.8; 
                autoScrollId = requestAnimationFrame(scrollStep);
            };
            scrollStep();

            const killScroll = () => {
                isAutoScrolling = false;
                cancelAnimationFrame(autoScrollId);
                scrollContainer.removeEventListener('wheel', killScroll);
                scrollContainer.removeEventListener('touchstart', killScroll);
                scrollContainer.removeEventListener('mousedown', killScroll);
            };

            scrollContainer.addEventListener('wheel', killScroll, { passive: true });
            scrollContainer.addEventListener('touchstart', killScroll, { passive: true });
            scrollContainer.addEventListener('mousedown', killScroll, { passive: true });
        }, 600); 
    });

    document.getElementById('ph-link').addEventListener('click', () => {
        if (activeCaseData) {
            const url = `${window.location.origin}${window.location.pathname}?case=${activeCaseData.slug || activeCaseData.id}`;
            navigator.clipboard.writeText(url);
            
            const btn = document.getElementById('ph-link');
            const originalText = btn.innerHTML;
            btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> ${t('copied')}`;
            setTimeout(() => { btn.innerHTML = originalText; hoverMenu.classList.remove('show'); }, 1500);
        }
    });

    document.getElementById('ph-email').addEventListener('click', () => {
        if (activeHoverParagraph && activeCaseData) {
            let text = activeHoverParagraph.innerText.substring(0, 150);
            if (activeHoverParagraph.innerText.length > 150) text += '...';
            window.location.href = `mailto:hello@schimanko.dev?subject=${t('email_subject')} ${activeCaseData.title}&body=${t('email_body')}%0D%0A%0D%0A"${encodeURIComponent(text)}"%0D%0A%0D%0A`;
            hoverMenu.classList.remove('show');
        }
    });

    document.getElementById('ph-share').addEventListener('click', async () => {
        if (activeCaseData && navigator.share) {
            try {
                await navigator.share({
                    title: activeCaseData.title,
                    text: t('share_text'),
                    url: `${window.location.origin}${window.location.pathname}?case=${activeCaseData.id}`
                });
            } catch(err) {}
            hoverMenu.classList.remove('show');
        } else {
            document.getElementById('ph-link').click();
        }
    });
}

initParagraphHover();

/* ==========================================================================
   INLINE AI CHAT GLOBAL METHODS
   ========================================================================== */
window.openInlineChat = function(caseId) {
    const actionsBlock = document.getElementById(`ai-actions-${caseId}`);
    if (actionsBlock) actionsBlock.style.display = 'none';
    const chatUI = document.getElementById(`inline-chat-${caseId}`);
    if (chatUI) {
        chatUI.style.display = 'flex';
        const inputEl = document.getElementById(`inline-chat-input-${caseId}`);
        if (inputEl) inputEl.focus();
    }
};
window.closeInlineChat = function(caseId) {
    const actionsBlock = document.getElementById(`ai-actions-${caseId}`);
    const chatUI = document.getElementById(`inline-chat-${caseId}`);
    if (chatUI) chatUI.style.display = 'none';
    if (actionsBlock) actionsBlock.style.display = 'flex';
};

window.submitInlineAi = async function(caseId, overrideQuery = null) {
    const input = document.getElementById(`inline-chat-input-${caseId}`);
    const messagesBox = document.getElementById(`inline-chat-messages-${caseId}`);
    const suggestionsBox = document.getElementById(`inline-suggestions-${caseId}`);
    const sendBtn = document.getElementById(`btn-send-inline-${caseId}`);
    
    if (!input || !messagesBox) return;
    const query = overrideQuery || input.value.trim();
    if (!query) return;

    if (suggestionsBox) {
        suggestionsBox.style.opacity = '0';
        setTimeout(() => suggestionsBox.style.display = 'none', 300);
    }

    const caseData = portfolioCases.find(c => c.id === caseId);
    const caseContext = `Case Title: ${caseData.title}\nSummary: ${caseData.aiSummary}\nDetails: ${caseData.desc}`;

    if (!overrideQuery) {
        input.value = '';
        if (sendBtn) sendBtn.disabled = true; 
    }
    
    messagesBox.innerHTML += `<div class="inline-user-msg">${query}</div>`;
    messagesBox.scrollTop = messagesBox.scrollHeight;

    const loadingId = 'load-' + Date.now();
    messagesBox.innerHTML += `<div id="${loadingId}" class="inline-loading-msg">${t('thinking')}</div>`;

    try {
        const response = await fetch('api/chat.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: query, context: caseContext })
        });
        const data = await response.json();
        document.getElementById(loadingId).remove();
        messagesBox.innerHTML += `<div class="inline-bot-msg">${data.reply}</div>`;
    } catch (e) {
        const lEl = document.getElementById(loadingId);
        if (lEl) lEl.innerText = t('connection_failed');
    }
    messagesBox.scrollTop = messagesBox.scrollHeight;
};