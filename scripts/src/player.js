/* ==========================================================================
   TEXT-TO-SPEECH (TTS) ENGINE
   ========================================================================== */
// --- GLOBAL AUDIO STATE & MEMORY ---
let currentAudioFile = null;
let ttsState = 'stopped';
let activeTTSCaseId = null;
let currentTTSRate = 1.0;
const ttsMemory = {}; // Critical: This object persists the audio progress

// User Preferences for new features
let prefHideOnScroll = localStorage.getItem('pref-tts-hide') === 'true';
let prefAutoScroll = localStorage.getItem('pref-tts-autoscroll') === 'true';

// --- GLOBAL SEEK EVENTS & FORMATTERS ---
let isDraggingAudio = false;
let activeAudioProgress = null;
let activeAudioCaseId = null;

function formatAudioTime(seconds) {
    if (!seconds || isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
}

function handleAudioSeek(e) {
    if (!activeAudioProgress) return;
    const rect = activeAudioProgress.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = x / rect.width;
    
    const fill = activeAudioProgress.querySelector('.audio-progress-fill');
    if (fill) fill.style.width = `${percent * 100}%`;
    
    const memKey = activeAudioCaseId + (isRecruiterMode ? '-tech' : '-exec');
    const duration = ttsMemory[memKey + '-duration'] || (currentAudioFile && currentAudioFile.duration ? currentAudioFile.duration : 0);
    
    if (duration > 0) {
        const newTime = percent * duration;
        ttsMemory[memKey] = newTime;
        
        const playerWrapper = activeAudioProgress.closest('.case-audio-player');
        if (playerWrapper) {
            const timeLabel = playerWrapper.querySelector('.audio-time-label');
            if (timeLabel) timeLabel.textContent = `${formatAudioTime(newTime)} / ${formatAudioTime(duration)}`;
        }

        if (currentAudioFile && activeTTSCaseId === activeAudioCaseId) {
            currentAudioFile.currentTime = newTime;
        }
    }
}

window.addEventListener('mousemove', (e) => { if (isDraggingAudio) handleAudioSeek(e); });
window.addEventListener('mouseup', () => { isDraggingAudio = false; activeAudioProgress = null; activeAudioCaseId = null; });
window.addEventListener('touchmove', (e) => { if (isDraggingAudio) handleAudioSeek(e); }, { passive: true });
window.addEventListener('touchend', () => { isDraggingAudio = false; activeAudioProgress = null; activeAudioCaseId = null; });


// --- PLAYER UI INJECTION ---
// --- PLAYER UI INJECTION ---
function attachAudioPlayer(descBody, caseId) {
    const existing = descBody.querySelector('.case-audio-player');
    if (existing) existing.remove();

    const caseData = portfolioCases.find(c => c.id === caseId);
    let audioUrl = (isRecruiterMode && caseData && caseData.audioSrcRecruiter) ? caseData.audioSrcRecruiter : (caseData ? caseData.audioSrc : null);

    const memKey = caseId + (isRecruiterMode ? '-tech' : '-exec');
    const savedTime = ttsMemory[memKey] || 0;
    const savedDuration = ttsMemory[memKey + '-duration'] || 0; 
    const progress = savedDuration > 0 ? (savedTime / savedDuration) * 100 : 0;

    const wrapper = document.createElement('div');
    wrapper.className = 'case-audio-player';
    wrapper.setAttribute('data-case-id', caseId);
    
    // 1. Maintain stickiness constraint if clicked before
    if (ttsMemory[memKey + '-has-played'] || (activeTTSCaseId === caseId && ttsState === 'speaking')) {
        wrapper.classList.add('is-sticky');
    }
    
    // Initialize dismissed state based on prefHideOnScroll
    if (prefHideOnScroll) {
        wrapper.classList.add('is-dismissed');
    }

    // Continuous geometry synchronization hook
    const timeStr = `${formatAudioTime(savedTime)} / ${savedDuration ? formatAudioTime(savedDuration) : '--:--'}`;
    
    // Visually restore play state if this case is currently active
    if (activeTTSCaseId === caseId && ttsState === 'speaking') {
        wrapper.classList.add('is-playing');
    }

    const seekA11y = typeof t === 'function' ? t('audio_seek') : 'Seek audio';
    const playA11y = typeof t === 'function' ? t('tts_play') : 'Play audio';
    const pauseA11y = typeof t === 'function' ? t('tts_pause') : 'Pause audio';
    const speedA11y = typeof t === 'function' ? t('tts_change_speed') : 'Change speed';
    const hideA11y = typeof t === 'function' ? t('tts_hide_scroll') : 'Hide while scrolling';
    const autoA11y = typeof t === 'function' ? t('tts_autoscroll') : 'Auto-scroll with audio';
    const readerLabel = typeof t === 'function' ? t('tts_ai_reader') : 'AI Reader';

    wrapper.innerHTML = `
        <div class="audio-player-header" aria-hidden="true">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3 6 6 3-6 3-3 6-3-6-6-3 6-3z"/></svg>
            <span>${readerLabel}</span>
        </div>
        <div class="audio-player-controls-row">
            <button class="btn-tts-play control-btn" aria-label="${playA11y}">
                <span class="tts-icon-wrapper">
                    <svg class="pause-icon" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                    <svg class="play-icon" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5V19L19 12L8 5Z"/></svg>
                </span>
                <span class="action-tooltip tts-play-tooltip">${playA11y} <kbd>⇧ P</kbd></span>
            </button>
            <div class="audio-progress-container" role="slider" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progress}" tabindex="0" aria-label="${seekA11y}">
                <div class="audio-progress-track">
                    <div class="audio-progress-fill" style="width: ${progress}%"></div>
                </div>
            </div>
            <div class="audio-time-label">${timeStr}</div>
            
            <div class="tts-divider"></div>
            <button class="btn-tts-speed control-btn" aria-label="${speedA11y}">
                <span class="speed-value-text">${currentTTSRate}x</span>
                <span class="action-tooltip">${speedA11y} <kbd>⇧ S</kbd></span>
            </button>
            
            <div class="tts-divider"></div>
            <button class="btn-tts-action btn-tts-hide control-btn ${prefHideOnScroll ? 'is-active' : ''}" aria-label="${hideA11y}">
                <svg class="eye-open-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                <svg class="eye-closed-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                <span class="action-tooltip">${hideA11y} <kbd>⇧ H</kbd></span>
            </button>
            
            <div class="tts-divider"></div>
            <button class="btn-tts-action btn-tts-autoscroll control-btn ${prefAutoScroll ? 'is-active' : ''}" aria-label="${autoA11y}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="7 13 12 18 17 13"></polyline><polyline points="7 6 12 11 17 6"></polyline></svg>
                <span class="action-tooltip">${autoA11y} <kbd>⇧ A</kbd></span>
            </button>
        </div>
    `;

    // Silently fetch metadata to display duration immediately
    if (audioUrl && !savedDuration) {
        const tempAudio = new Audio(audioUrl);
        tempAudio.preload = "metadata";
        tempAudio.addEventListener('loadedmetadata', () => {
            if (tempAudio.duration && tempAudio.duration !== Infinity) {
                ttsMemory[memKey + '-duration'] = tempAudio.duration;
                const timeLabel = wrapper.querySelector('.audio-time-label');
                if (timeLabel) timeLabel.textContent = `${formatAudioTime(ttsMemory[memKey] || 0)} / ${formatAudioTime(tempAudio.duration)}`;
            }
        });
    }

    const playBtn = wrapper.querySelector('.btn-tts-play');
    const speedBtn = wrapper.querySelector('.btn-tts-speed');
    const hideBtn = wrapper.querySelector('.btn-tts-hide');
    const autoBtn = wrapper.querySelector('.btn-tts-autoscroll');
    const progressContainer = wrapper.querySelector('.audio-progress-container');

    playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleTTS(caseId, wrapper, descBody);
    });

    speedBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        cycleTTSRate(wrapper, caseId, descBody);
    });

    hideBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        prefHideOnScroll = !prefHideOnScroll;
        localStorage.setItem('pref-tts-hide', prefHideOnScroll);
        wrapper.classList.toggle('is-dismissed', prefHideOnScroll);
        hideBtn.classList.toggle('is-active', prefHideOnScroll);
    });

    autoBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        prefAutoScroll = !prefAutoScroll;
        localStorage.setItem('pref-tts-autoscroll', prefAutoScroll);
        autoBtn.classList.toggle('is-active', prefAutoScroll);
    });

    progressContainer.addEventListener('mousedown', (e) => {
        isDraggingAudio = true;
        progressContainer.classList.add('is-dragging');
        activeAudioProgress = progressContainer;
        activeAudioCaseId = caseId;
        handleAudioSeek(e);
    });

    window.addEventListener('mouseup', () => {
        if(activeAudioProgress) activeAudioProgress.classList.remove('is-dragging');
        isDraggingAudio = false; 
        activeAudioProgress = null; 
        activeAudioCaseId = null; 
    });
    
    progressContainer.addEventListener('touchstart', (e) => {
        isDraggingAudio = true;
        activeAudioProgress = progressContainer;
        activeAudioCaseId = caseId;
        handleAudioSeek(e);
    }, { passive: true });

    // A11y Keyboard Seeking (5s jumps)
    const a11yAudioSkipStep = 5; 
    progressContainer.addEventListener('keydown', (e) => {
        const duration = ttsMemory[memKey + '-duration'] || (currentAudioFile ? currentAudioFile.duration : 0);
        if (!duration) return;

        let newTime = ttsMemory[memKey] || 0;

        if (e.key === 'ArrowRight') {
            e.preventDefault();
            newTime = Math.min(duration, newTime + a11yAudioSkipStep);
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            newTime = Math.max(0, newTime - a11yAudioSkipStep);
        } else { return; }

        ttsMemory[memKey] = newTime;
        const currentProgress = (newTime / duration) * 100;
        
        const fill = wrapper.querySelector('.audio-progress-fill');
        if (fill) fill.style.width = `${currentProgress}%`;
        
        const timeLabel = wrapper.querySelector('.audio-time-label');
        if (timeLabel) timeLabel.textContent = `${formatAudioTime(newTime)} / ${formatAudioTime(duration)}`;
        
        progressContainer.setAttribute('aria-valuenow', currentProgress);
        if (currentAudioFile && activeTTSCaseId === caseId) currentAudioFile.currentTime = newTime;
    });

    descBody.insertBefore(wrapper, descBody.firstChild);

    // Sync shrink state immediately on DOM placement if mounted mid-scroll
    // Dynamic Universal Sticky Offset Calculation
    requestAnimationFrame(() => {
        if (wrapper.classList.contains('is-sticky')) {
            const playerTop = wrapper.getBoundingClientRect().top;
            const rootVar = getComputedStyle(document.documentElement).getPropertyValue('--player-sticky-anchor').trim();
            const threshold = (parseInt(rootVar, 10) || 30) + 2; 
            
            if (playerTop <= threshold) {
                wrapper.classList.add('is-shrunk');
            }
        }
    });
}

function cycleTTSRate(wrapper, caseId, descBody) {
    // Updated velocity loop: 1.0 -> 1.15 -> 1.2 -> 0.7
    if (currentTTSRate === 1.0) currentTTSRate = 1.15;
    else if (currentTTSRate === 1.15) currentTTSRate = 1.2;
    else if (currentTTSRate === 1.2) currentTTSRate = 0.7;
    else currentTTSRate = 1.0;

    document.querySelectorAll('.btn-tts-speed .speed-value-text').forEach(span => {
        span.textContent = currentTTSRate + 'x';
    });

    // Directly apply the new speed to the native audio element without stopping playback
    if (currentAudioFile) {
        currentAudioFile.playbackRate = currentTTSRate;
    }
}

function toggleTTS(caseId, wrapper, descBody) {
    const caseData = portfolioCases.find(c => c.id === caseId);
    if (!caseData) return;

    const memKey = caseId + (isRecruiterMode ? '-tech' : '-exec');

    if (activeTTSCaseId && activeTTSCaseId !== caseId && ttsState !== 'stopped') {
        if (currentAudioFile) {
            currentAudioFile.pause();
            // Progress is naturally preserved, no reset
        }
        resetTTSStopped();
    }

    activeTTSCaseId = caseId;

    if (ttsState === 'stopped') {
        ttsState = 'speaking';
        resetTTSButtons();

        // Mark as played to open stickiness permissions permanently for this case asset
        ttsMemory[memKey + '-has-played'] = true;
        wrapper.classList.add('is-sticky');
        
        let audioUrl = (isRecruiterMode && caseData.audioSrcRecruiter) ? caseData.audioSrcRecruiter : caseData.audioSrc;
        
        if (!audioUrl) {
            resetTTSStopped();
            return;
        }

        currentAudioFile = new Audio(audioUrl);
        currentAudioFile.playbackRate = currentTTSRate;
        
        // Resume from saved memory
        if (ttsMemory[memKey]) {
            currentAudioFile.currentTime = ttsMemory[memKey];
        }

        currentAudioFile.addEventListener('loadedmetadata', () => {
            ttsMemory[memKey + '-duration'] = currentAudioFile.duration;
            const timeLabel = wrapper.querySelector('.audio-time-label');
            if (timeLabel) timeLabel.textContent = `${formatAudioTime(currentAudioFile.currentTime)} / ${formatAudioTime(currentAudioFile.duration)}`;
        });

        currentAudioFile.addEventListener('timeupdate', () => {
            if (currentAudioFile.duration && !isDraggingAudio) {
                // Track timestamps for our 60fps RAF engine
                currentAudioFile._lastAudioTime = currentAudioFile.currentTime;
                currentAudioFile._lastSysTime = performance.now();

                ttsMemory[memKey] = currentAudioFile.currentTime;
                const pct = currentAudioFile.currentTime / currentAudioFile.duration;
                
                const fill = wrapper.querySelector('.audio-progress-fill');
                if (fill) fill.style.width = `${pct * 100}%`;
                
                const timeLabel = wrapper.querySelector('.audio-time-label');
                if (timeLabel) timeLabel.textContent = `${formatAudioTime(currentAudioFile.currentTime)} / ${formatAudioTime(currentAudioFile.duration)}`;
                
                wrapper.querySelector('.audio-progress-container').setAttribute('aria-valuenow', pct * 100);
            }
        });

        currentAudioFile.addEventListener('ended', () => {
            const fill = wrapper.querySelector('.audio-progress-fill');
            if (fill) fill.style.width = `0%`;
            ttsMemory[memKey] = 0; // Wipe memory cleanly on finish
            const timeLabel = wrapper.querySelector('.audio-time-label');
            if (timeLabel) timeLabel.textContent = `0:00 / ${formatAudioTime(currentAudioFile.duration)}`;
            resetTTSStopped();
        });

        wrapper.classList.add('is-playing');
        currentAudioFile.play().catch(e => {
            console.error("Audio playback failed:", e);
            resetTTSStopped();
        });

    } else if (ttsState === 'speaking') {
        ttsState = 'paused';
        if (currentAudioFile) currentAudioFile.pause();
        wrapper.classList.remove('is-playing');
        wrapper.classList.add('is-paused');
        
        const tt = wrapper.querySelector('.tts-play-tooltip');
        if (tt) tt.innerHTML = `${typeof t === 'function' ? t('tts_play') : 'Play audio'} <kbd>⇧ P</kbd>`;

    } else if (ttsState === 'paused') {
        ttsState = 'speaking';
        if (currentAudioFile) {
            currentAudioFile.playbackRate = currentTTSRate; 
            currentAudioFile.play();
        }
        wrapper.classList.add('is-playing');
        wrapper.classList.remove('is-paused');
        
        const tt = wrapper.querySelector('.tts-play-tooltip');
        if (tt) tt.innerHTML = `${typeof t === 'function' ? t('tts_pause') : 'Pause audio'} <kbd>⇧ P</kbd>`;
    }
}

function resetTTSStopped() {
    resetTTSButtons();
    ttsState = 'stopped';
    activeTTSCaseId = null;
    currentAudioFile = null; 
}

function resetTTSButtons() {
    document.querySelectorAll('.case-audio-player').forEach(b => {
        b.classList.remove('is-playing');
        b.classList.remove('is-paused');
    });
}

/* ==========================================================================
   VIDEO PLAYER ENGINE
   ========================================================================== */
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
            track.label = track.srclang === 'pt' ? 'Português' : 'English';
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
/* --- HIGH PERFORMANCE AUTOSCROLL ENGINE --- */
function renderSmoothAutoScroll() {
    if (ttsState === 'speaking' && prefAutoScroll && currentAudioFile && currentAudioFile.duration) {
        const now = performance.now();
        const sysElapsed = (now - (currentAudioFile._lastSysTime || now)) / 1000;
        
        // Interpolate time smoothly based on system clock scaled by playback velocity
        let estTime = (currentAudioFile._lastAudioTime || 0) + (sysElapsed * currentAudioFile.playbackRate);
        estTime = Math.min(estTime, currentAudioFile.duration);
        
        // Multiplier 1.15 makes the page scroll slightly faster to finish right before the audio ends
        const pct = Math.min((estTime / currentAudioFile.duration) * 1.15, 1.0);
        
        if (activeTTSCaseId && !isDraggingAudio) {
            const wrapper = document.querySelector(`.case-audio-player[data-case-id="${activeTTSCaseId}"]`);
            if (wrapper) {
                const scrollContainer = wrapper.closest('.case-info-scroll');
                if (scrollContainer && !isPreventingClicks) {
                    const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;
                    scrollContainer.scrollTop = pct * maxScroll;
                }
            }
        }
    }
    requestAnimationFrame(renderSmoothAutoScroll);
}

// Boot up the global animation loop
if (!window._autoScrollLoopInit) {
    window._autoScrollLoopInit = true;
    requestAnimationFrame(renderSmoothAutoScroll);
}