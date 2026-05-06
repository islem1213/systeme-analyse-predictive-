// API Client - Communication avec Spring Boot

const ApiClient = (() => {
    const BASE_URL = 'http://localhost:8080/api';

    /**
     * Récupère les statistiques du dashboard
     */
    async function getStats() {
        // En attendant un vrai endpoint backend, on calcule côté client
        return null;
    }

    /**
     * Récupère toutes les demandes adaptées au rôle
     */
    async function getRequests(params = {}) {
        if (typeof Auth !== 'undefined' && Auth.user) {
            const role = Auth.user.roles[0].name || Auth.user.roles[0];
            if (role === 'ROLE_CLIENT') {
                return fetchJSON(`${BASE_URL}/demandes/mes-demandes`);
            }
        }
        return fetchJSON(`${BASE_URL}/demandes`);
    }

    /**
     * Récupère une demande par ID
     */
    async function getRequest(id) {
        return fetchJSON(`${BASE_URL}/demandes/${id}`);
    }

    /**
     * Crée une demande
     */
    async function createRequest(data) {
        return fetchJSON(`${BASE_URL}/demandes`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    /**
     * Met à jour une demande
     */
    async function updateRequest(id, data) {
        return fetchJSON(`${BASE_URL}/demandes/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    /**
     * Supprime une demande
     */
    async function deleteRequest(id) {
        return fetchJSON(`${BASE_URL}/demandes/${id}`, {
            method: 'DELETE'
        });
    }

    /**
     * Utilitaire pour les appels fetch JSON
     */
    async function fetchJSON(url, options = {}) {
        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const defaults = {
            method: 'GET',
            headers: headers
        };

        const config = { ...defaults, ...options };

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                const error = new Error(`HTTP ${response.status}`);
                error.status = response.status;
                throw error;
            }

            return await response.json();
        } catch (error) {
            console.error(`API Error (${url}):`, error);
            throw error;
        }
    }

    return {
        getStats,
        getRequests,
        getRequest,
        createRequest,
        updateRequest,
        deleteRequest
    };
})();
