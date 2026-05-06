// Application Main - Point d'entrée

document.addEventListener('DOMContentLoaded', () => {
    // Initialiser l'authentification (vérifie si déjà connecté)
    if (typeof Auth !== 'undefined') {
        Auth.init();
    }

    // Determine if we are on the new SPA layout or the login page
    if (document.getElementById('sidebar')) {
        // We are inside the app layout
    }

    // Écouteur pour le formulaire de connexion
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const role = document.querySelector('input[name="login-role"]:checked')?.value || 'Client';
            Auth.login({ email, password, role });
        });
    }

    // Écouteur pour le formulaire d'inscription
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const userData = {
                nom: document.getElementById('signup-nom').value,
                email: document.getElementById('signup-email').value,
                password: document.getElementById('signup-password').value,
                role: document.getElementById('signup-role').value,
                profession: document.getElementById('signup-profession').value,
                revenuMensuel: parseFloat(document.getElementById('signup-revenu').value) || 0,
                chargesFixes: parseFloat(document.getElementById('signup-charges').value) || 0
            };
            Auth.register(userData);
        });
    }

    // Setup globaux
    setupGlobalErrorHandling();
});

/**
 * Gestion globale des erreurs
 */
function setupGlobalErrorHandling() {
    window.addEventListener('error', (event) => {
        console.error('Global error:', event.error);
    });

    window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled rejection:', event.reason);
    });
}

// Expose les fonctions globales
if (typeof Navigation !== 'undefined') {
    window.navigateTo = Navigation.navigateTo;
}

window.openRequestDetail = (id) => {
    // Bridge to old UI.js if needed, or implement here
    if (typeof UI !== 'undefined' && UI.viewApplicationDetails) {
        document.getElementById('contentArea').innerHTML = '<div id="main-view"></div><div id="side-panel"></div>';
        UI.viewApplicationDetails(id);
    } else {
        console.log(`Open request ${id}`);
    }
};

window.editRequest = (id) => {
    console.log(`Edit request ${id}`);
    // Implémentation
};
