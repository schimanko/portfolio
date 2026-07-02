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

const PLAYER_STICKY_THRESHOLD = 32; // Matches the 30px visual breadcrumb alignment + 2px safety buffer

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

    if (viewName !== 'case') {
        if (typeof currentAudioFile !== 'undefined' && currentAudioFile) {
            currentAudioFile.pause();
        }
        if (typeof resetTTSStopped === 'function') resetTTSStopped();
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