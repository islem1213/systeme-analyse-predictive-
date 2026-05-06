const API_BASE = 'http://localhost:8080/api';

const API = {
    async request(endpoint, options = {}) {
        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers
        };

        try {
            const response = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
            
            if (response.status === 401) {
                // Don't auto-logout on /auth/ calls (wrong password should just show error)
                if (!endpoint.includes('/auth/')) Auth.logout();
                const body = await response.text();
                let msg = 'Email ou mot de passe incorrect.';
                try { msg = JSON.parse(body).message || JSON.parse(body).error || msg; } catch (_) {}
                throw new Error(msg);
            }

            if (!response.ok) {
                const body = await response.text();
                let msg = `Erreur ${response.status}`;
                try {
                    const json = JSON.parse(body);
                    msg = json.message || json.error || msg;
                } catch (_) {}
                throw new Error(msg);
            }

            const contentType = response.headers.get('content-type') || '';
            if (contentType.includes('application/json')) return await response.json();
            return await response.text();
        } catch (error) {
            console.error(`API Error [${endpoint}]:`, error.message);
            throw error;
        }
    },

    auth: {
        login: (credentials) => API.request('/auth/signin', {
            method: 'POST',
            body: JSON.stringify(credentials)
        }),
        register: (userData) => API.request('/auth/signup', {
            method: 'POST',
            body: JSON.stringify(userData)
        })
    },

    demandes: {
        getAll: () => API.request('/demandes'),
        getMine: () => API.request('/demandes/mes-demandes'),
        getById: (id) => API.request(`/demandes/${id}`),
        create: (data) => API.request('/demandes', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        updateStatus: (id, status, observation) => API.request(`/demandes/${id}/statut?statut=${status}&observation=${encodeURIComponent(observation)}`, {
            method: 'PUT'
        }),
        chat: (question, demandeId) => API.request(`/demandes/chat?question=${encodeURIComponent(question)}&demandeId=${demandeId}`, {
            method: 'POST'
        }),
        genericChat: (message) => API.request('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: message
        })
    },

    reports: {
        getDemande: async (id) => {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE}/reports/demande/${id}`, {
                headers: { ...(token && { 'Authorization': `Bearer ${token}` }) }
            });
            if (!response.ok) throw new Error('Erreur lors du téléchargement du rapport');
            return response.blob();
        }
    },

    admin: {
        getStats: () => API.request('/admin/stats'),
        getUsers: () => API.request('/auth/users'), // Hypothetical endpoint
        getScoringParams: () => API.request('/admin/params')
    }
};
