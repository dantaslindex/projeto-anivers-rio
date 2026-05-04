const translations = {
    pt: {
        "header-title": "Meu Aniversário de 18 anos",
        "polaroid-1": "Legenda 1",
        "info-title": "Título da Seção",
        "info-text": "Seu texto explicativo aqui.",
        "options-title": "Selecione as opções:",
        "opt-a": "Opção Padrão A"
    },
    en: {
        "header-title": "My 18th Birthday",
        "polaroid-1": "Caption 1",
        "info-title": "Section Title",
        "info-text": "Your explanatory text here.",
        "options-title": "Select the options:",
        "opt-a": "Standard Option A"
    },
    es: {
        "header-title": "Mi Cumpleaños de 18 años",
        "polaroid-1": "Leyenda 1",
        "info-title": "Título de la Sección",
        "info-text": "Tu texto explicativo aquí.",
        "options-title": "Selecciona as opciones:",
        "opt-a": "Opción Estándar A"
    },
    fr: {
        "header-title": "Mon 18ème Anniversaire",
        "polaroid-1": "Légende 1",
        "info-title": "Titre de la Section",
        "info-text": "Votre texte explicatif ici.",
        "options-title": "Sélectionnez les options :",
        "opt-a": "Option Standard A"
    }
};
// 2. Função para trocar o idioma
function changeLanguage(lang) {
    const elements = document.querySelectorAll('[data-i18n]');
    
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            el.innerText = translations[lang][key];
        }
    });
}

// 3. Listener para o seletor
document.getElementById('language-selector').addEventListener('change', (e) => {
    changeLanguage(e.target.value);
});

// --- Mantenha sua lógica de scroll e de bloqueio de boxes abaixo ---
// 1. EFEITO DE SOMBRA NO HEADER AO DAR SCROLL
window.addEventListener('scroll', function() {
    const header = document.getElementById('main-header');
    if (window.scrollY > 50) {
        header.classList.add('header-shadow');
    } else {
        header.classList.remove('header-shadow');
    }
});

// 2. LÓGICA DAS BOXES (CONDIÇÃO)
const blocker = document.getElementById('opt-blocker'); // A "Opção Y"
const allChecks = document.querySelectorAll('.check-item');

blocker.addEventListener('change', function() {
    allChecks.forEach(item => {
        // ALTERE AQUI: Se a Box Y estiver marcada, desativa e desmarca as outras
        if (item !== blocker) {
            item.disabled = blocker.checked;
            if (blocker.checked) item.checked = false;
        }
    });
});