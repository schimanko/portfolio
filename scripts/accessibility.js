// Acessibilidade Features
const btnA11y = document.getElementById('btn-a11y');
const btnCloseA11y = document.getElementById('btn-close-a11y');
const modalBackdrop = document.getElementById('a11y-modal-backdrop');
const htmlEl = document.documentElement;

// Toggles
const tglDark = document.getElementById('toggle-dark');
const tglContrast = document.getElementById('toggle-contrast');
const tglMotion = document.getElementById('toggle-motion');
const tglFocus = document.getElementById('toggle-focus');
const tglDyslexia = document.getElementById('toggle-dyslexia');

// Botões de Grupo
const btnFontNormal = document.getElementById('font-normal');
const btnFontLarge = document.getElementById('font-large');

// --- 1. CONFIGURAÇÃO DO FOCUS TRAP (O SEGREDO DO TAB) ---
// Esta string diz ao script exatamente o que ele deve considerar como "focável"
const focusableElementsString = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
let previouslyFocusedElement;

function trapTabKey(e) {
    if (e.key === 'Tab') {
        const focusableElements = modalBackdrop.querySelectorAll(focusableElementsString);
        const focusableArray = Array.from(focusableElements);
        
        // Se por acaso a modal estiver vazia, não faz nada
        if (focusableArray.length === 0) return;

        // Bloqueia o comportamento padrão do navegador
        e.preventDefault(); 

        let currentIndex = focusableArray.indexOf(document.activeElement);

        if (e.shiftKey) {
            // Shift + Tab: Volta para o item anterior
            currentIndex--;
            if (currentIndex < 0) currentIndex = focusableArray.length - 1;
        } else {
            // Tab: Vai para o próximo item
            currentIndex++;
            if (currentIndex >= focusableArray.length) currentIndex = 0;
        }

        focusableArray[currentIndex].focus();
    }
    
    if (e.key === 'Escape') closeA11yModal();
}

// --- 2. ABRIR E FECHAR MODAL ---
function openA11yModal() {
    previouslyFocusedElement = document.activeElement;
    modalBackdrop.classList.remove('hidden');
    
    // Pequeno atraso para garantir que a modal apareça antes de focar
    setTimeout(() => {
        const focusableElements = modalBackdrop.querySelectorAll(focusableElementsString);
        if (focusableElements.length > 0) focusableElements[0].focus();
    }, 50);

    document.addEventListener('keydown', trapTabKey);
}

function closeA11yModal() {
    modalBackdrop.classList.add('hidden');
    document.removeEventListener('keydown', trapTabKey);
    if (previouslyFocusedElement) previouslyFocusedElement.focus();
}

btnA11y.addEventListener('click', openA11yModal);
btnCloseA11y.addEventListener('click', closeA11yModal);
modalBackdrop.addEventListener('click', (e) => { if (e.target === modalBackdrop) closeA11yModal(); });

// --- 3. LÓGICA DOS SWITCHES (COM SUPORTE A ENTER) ---
function setupToggle(inputEl, cssClass, storageKey) {
    const isEnabled = localStorage.getItem(storageKey) === 'true';
    inputEl.checked = isEnabled;
    if (isEnabled) htmlEl.classList.add(cssClass);

    inputEl.addEventListener('change', (e) => {
        if (e.target.checked) {
            htmlEl.classList.add(cssClass);
            localStorage.setItem(storageKey, 'true');
            
            // --- NOVO: Rastreio de ativação de recurso ---
            if (typeof gtag === 'function') {
                gtag('event', 'use_accessibility', {
                    feature: storageKey, // ex: 'pref-dark'
                    status: 'enabled'
                });
            }
            
        } else {
            htmlEl.classList.remove(cssClass);
            localStorage.setItem(storageKey, 'false');
        }
    });

    // Suporte para selecionar com a tecla ENTER
    inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            inputEl.click(); 
        }
    });
}

// Inicializando os switches
setupToggle(tglDark, 'a11y-dark-mode', 'pref-dark');
setupToggle(tglContrast, 'a11y-high-contrast', 'pref-contrast');
setupToggle(tglMotion, 'a11y-reduce-motion', 'pref-motion');
setupToggle(tglFocus, 'a11y-focus-mode', 'pref-focus');
setupToggle(tglDyslexia, 'a11y-dyslexia', 'pref-dyslexia');

// Exclusividade Dark vs Contrast
tglDark.addEventListener('change', (e) => {
    if (e.target.checked && tglContrast.checked) tglContrast.click();
});
tglContrast.addEventListener('change', (e) => {
    if (e.target.checked && tglDark.checked) tglDark.click();
});

// Tamanho de Fonte
const savedFont = localStorage.getItem('pref-font') || 'normal';
if(savedFont === 'large') {
    htmlEl.classList.add('a11y-large-text');
    btnFontLarge.classList.add('active');
    btnFontNormal.classList.remove('active');
}

btnFontNormal.addEventListener('click', () => {
    htmlEl.classList.remove('a11y-large-text');
    btnFontNormal.classList.add('active');
    btnFontLarge.classList.remove('active');
    localStorage.setItem('pref-font', 'normal');
});
btnFontLarge.addEventListener('click', () => {
    htmlEl.classList.add('a11y-large-text');
    btnFontLarge.classList.add('active');
    btnFontNormal.classList.remove('active');
    localStorage.setItem('pref-font', 'large');
});