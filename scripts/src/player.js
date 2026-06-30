/* ==========================================================================
   TEXT-TO-SPEECH (TTS) ENGINE
   ========================================================================== */
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