// Navigation Module - Gestion de la navigation et du contenu dynamique

const Navigation = (() => {
    const pages = {
        'dashboard': {
            title: 'Tableau de Bord',
            path: '/pages/dashboard.html',
            init: Dashboard ? Dashboard.init : null
        },
        'nouvelle-demande': {
            title: 'Nouvelle Demande',
            path: '/pages/nouvelle-demande.html',
            init: () => {
                // Initialize the loan wizard from the existing UI logic if it still exists
                if (typeof UI !== 'undefined' && UI.startLoanWizard) {
                    // Slight hack to reuse existing logic: override the target container temporarily
                    document.getElementById('contentArea').innerHTML = '<div class="content-layout"><div id="main-view"></div><aside id="side-panel" class="properties-panel"></aside></div>';
                    UI.startLoanWizard(); 
                } else {
                    document.getElementById('contentArea').innerHTML = '<div style="padding:2rem;">Formulaire de nouvelle demande... (intégration avec UI.js)</div>';
                }
            }
        },
        'historique': {
            title: 'Historique des Demandes',
            path: '/pages/historique.html',
            init: Historique ? Historique.init : null
        }
    };

    /**
     * Initialise la navigation
     */
    function init() {
        setupEventListeners();
        navigateTo('dashboard');
    }

    /**
     * Configure les écouteurs
     */
    function setupEventListeners() {
        // Clic sur les items de navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.dataset.page;
                navigateTo(page);
            });
        });

        // Bouton menu toggle (mobile)
        document.getElementById('menuToggle')?.addEventListener('click', () => {
            document.getElementById('sidebar').classList.toggle('mobile-open');
        });
    }

    /**
     * Navigue vers une page
     */
    async function navigateTo(page) {
        const pageConfig = pages[page];
        if (!pageConfig) {
            console.error(`Page ${page} not found`);
            return;
        }

        // Met à jour le titre
        document.getElementById('pageTitle').textContent = pageConfig.title;

        // Met à jour l'actif dans le menu
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.page === page);
        });

        // Charge le contenu (Updated for local file access via templates)
        try {
            const templateId = `template-${page}`;
            const template = document.getElementById(templateId);
            
            if (template) {
                document.getElementById('contentArea').innerHTML = template.innerHTML;
            } else {
                throw new Error(`Template ${templateId} not found`);
            }

            // Initialise la page
            if (pageConfig.init) {
                await pageConfig.init();
            }

            // Ferme le menu mobile
            const sidebar = document.getElementById('sidebar');
            if(sidebar) sidebar.classList.remove('mobile-open');

            // Scroll vers le haut
            const contentArea = document.getElementById('contentArea');
            if (contentArea) contentArea.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.error(`Erreur lors du chargement de ${page}:`, error);
            document.getElementById('contentArea').innerHTML = 
                '<p class="error-message">Erreur de chargement (Mode Local)</p>';
        }
    }

    return {
        init,
        navigateTo
    };
})();

// Expose globalement pour les clics HTML
function navigateTo(page) {
    Navigation.navigateTo(page);
}
