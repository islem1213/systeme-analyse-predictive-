const Auth = {
    user: null,

    init() {
        const savedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (savedUser && token) {
            this.user = JSON.parse(savedUser);
            this.handleNavigation();
        } else {
            this.logout();
            UI.showSection('login-section');
        }
    },

    async login(credentials) {
        try {
            this._setLoading(true);
            const response = await API.auth.login(credentials);
            this.user = response;
            localStorage.setItem('token', response.accessToken);
            localStorage.setItem('user', JSON.stringify(response));
            this.handleNavigation();
        } catch (error) {
            console.error('Login error:', error);
            this._showToast(error.message || 'Identifiants incorrects.', 'error');
        } finally {
            this._setLoading(false);
        }
    },

    async register(userData) {
        try {
            this._setLoading(true);
            await API.auth.register(userData);
            this._showToast('Compte créé avec succès ! Connectez-vous.', 'success');
            UI.showSection('login-section');
        } catch (error) {
            console.error('Register error:', error);
            this._showToast(error.message || 'Erreur lors de l\'inscription.', 'error');
        } finally {
            this._setLoading(false);
        }
    },

    /* Safe wrappers in case UI isn't initialized yet */
    _setLoading(state) {
        const el = document.getElementById('loading-overlay');
        if (el) el.style.display = state ? 'flex' : 'none';
    },

    _showToast(msg, type) {
        // Simple fallback notification
        const existing = document.getElementById('toast-msg');
        if (existing) existing.remove();
        const t = document.createElement('div');
        t.id = 'toast-msg';
        const colors = { error: '#C1121F', success: '#2A7F62', info: '#1B4965' };
        t.style.cssText = `position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);background:${colors[type]||colors.info};color:white;padding:1rem 2rem;border-radius:12px;z-index:9999;font-weight:600;box-shadow:0 8px 25px rgba(0,0,0,0.4);`;
        t.textContent = msg;
        document.body.appendChild(t);
        setTimeout(() => t.remove(), 4000);
    },

    handleNavigation() {
        if (!this.user) return this.logout();
        
        const role = this.user.roles[0];
        UI.initDashboard(role);
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.user = null;
        UI.showSection('login-section');
    },

    getRole() {
        return this.user?.roles[0] || null;
    },

    isAuthenticated() { return !!localStorage.getItem('token'); },
    isBanker() { return this.user?.roles?.includes('ROLE_BANQUIER'); },
    isAdmin()  { return this.user?.roles?.includes('ROLE_ADMIN'); },
    isClient() { return this.user?.roles?.includes('ROLE_CLIENT'); }
};
