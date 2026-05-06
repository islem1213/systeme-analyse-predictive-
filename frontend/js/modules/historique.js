// Historique Module - Gestion du tableau avec filtres et tri

const Historique = (() => {
    let allRequests = [];
    let currentPage = 1;
    let itemsPerPage = 10;
    let sortField = 'dateCreation';
    let sortDirection = 'desc';

    /**
     * Initialise la page historique
     */
    async function init() {
        setupEventListeners();
        await loadRequests();
        renderTable();
        updateStatistics();
    }

    /**
     * Configure les écouteurs d'événements
     */
    function setupEventListeners() {
        // Recherche
        document.getElementById('searchInput')?.addEventListener('input', (e) => {
            filterAndRender();
        });

        // Filtre statut
        document.getElementById('statusFilter')?.addEventListener('change', (e) => {
            currentPage = 1;
            filterAndRender();
        });

        // Tri rapide
        document.getElementById('sortSelect')?.addEventListener('change', (e) => {
            applySortOption(e.target.value);
            filterAndRender();
        });

        // Tri sur les colonnes
        document.querySelectorAll('.sortable').forEach(th => {
            th.addEventListener('click', (e) => {
                const field = th.dataset.sort;
                if (sortField === field) {
                    sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
                } else {
                    sortField = field;
                    sortDirection = 'desc';
                }
                currentPage = 1;
                renderTable();
                updateSortIndicators();
            });
        });
    }

    /**
     * Charge les demandes depuis l'API
     */
    async function loadRequests() {
        try {
            allRequests = await ApiClient.getRequests();
        } catch (error) {
            console.error('Erreur lors du chargement des demandes:', error);
            allRequests = [];
        }
    }

    /**
     * Applique les filtres et affiche le tableau
     */
    function filterAndRender() {
        const searchQuery = document.getElementById('searchInput')?.value.toLowerCase() || '';
        const statusFilter = document.getElementById('statusFilter')?.value || '';

        let filtered = allRequests.filter(req => {
            const clientName = req.client && req.client.nom ? req.client.nom : '';
            const matchesSearch = 
                req.id.toString().includes(searchQuery) ||
                clientName.toLowerCase().includes(searchQuery);
            
            const matchesStatus = !statusFilter || req.statut === statusFilter;
            
            return matchesSearch && matchesStatus;
        });

        // Tri
        filtered.sort((a, b) => {
            let aVal = a[sortField];
            let bVal = b[sortField];

            // Nested properties like client.nom and scoreCredit.valeurScore
            if (sortField === 'client') {
                aVal = a.client ? a.client.nom : '';
                bVal = b.client ? b.client.nom : '';
            } else if (sortField === 'scoreCredit') {
                aVal = a.scoreCredit ? a.scoreCredit.valeurScore : 0;
                bVal = b.scoreCredit ? b.scoreCredit.valeurScore : 0;
            }

            if (typeof aVal === 'string') {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }

            const comparison = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
            return sortDirection === 'asc' ? comparison : -comparison;
        });

        currentPage = 1;
        renderTable(filtered);
    }

    /**
     * Affiche le tableau
     */
    function renderTable(filteredRequests = null) {
        const requests = filteredRequests || allRequests;
        const startIdx = (currentPage - 1) * itemsPerPage;
        const paginatedRequests = requests.slice(startIdx, startIdx + itemsPerPage);

        const tbody = document.getElementById('requestsTableBody');
        if (!tbody) return;

        if (requests.length === 0) {
            document.getElementById('emptyState').style.display = 'block';
            tbody.innerHTML = '';
            updatePagination(0);
            return;
        }

        document.getElementById('emptyState').style.display = 'none';

        tbody.innerHTML = paginatedRequests.map(req => {
            const clientName = req.client && req.client.nom ? req.client.nom : 'N/A';
            const score = req.scoreCredit ? req.scoreCredit.valeurScore : 0;
            return `
            <tr class="request-row" data-id="${req.id}">
                <td><span class="id-badge">${req.id}</span></td>
                <td>${clientName}</td>
                <td>${formatCurrency(req.montantDemande)}</td>
                <td>
                    <span class="status-badge status-${req.statut.toLowerCase()}">
                        ${getStatusLabel(req.statut)}
                    </span>
                </td>
                <td>${formatDate(req.dateCreation)}</td>
                <td>
                    <span class="score-indicator">
                        ${score.toFixed(0)}/850
                    </span>
                </td>
                <td class="actions-cell">
                    <button class="btn-action btn-view" onclick="window.openRequestDetail(${req.id})">👁️</button>
                    <button class="btn-action btn-edit" onclick="window.editRequest(${req.id})">✏️</button>
                </td>
            </tr>
        `}).join('');

        updatePagination(requests.length);
        updateStatistics(requests);
    }

    /**
     * Met à jour les statistiques
     */
    function updateStatistics(requests = allRequests) {
        const total = requests.length;
        const totalEl = document.getElementById('totalCount');
        const approvedEl = document.getElementById('approvedCount');
        const pendingEl = document.getElementById('pendingCount');
        const rejectedEl = document.getElementById('rejectedCount');

        if (totalEl) totalEl.textContent = total;
        if (approvedEl) approvedEl.textContent = requests.filter(r => r.statut === 'APPROUVE').length;
        if (pendingEl) pendingEl.textContent = requests.filter(r => r.statut === 'EN_ATTENTE').length;
        if (rejectedEl) rejectedEl.textContent = requests.filter(r => r.statut === 'REFUSE').length;
    }

    /**
     * Met à jour la pagination
     */
    function updatePagination(totalItems) {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const pagination = document.getElementById('pagination');
        const recordsStart = document.getElementById('recordsStart');
        const recordsEnd = document.getElementById('recordsEnd');
        const recordsTotal = document.getElementById('recordsTotal');

        if (recordsTotal) recordsTotal.textContent = totalItems;
        
        if (totalItems === 0) {
            if (recordsStart) recordsStart.textContent = '0';
            if (recordsEnd) recordsEnd.textContent = '0';
            if (pagination) pagination.innerHTML = '';
            return;
        }

        const startIdx = (currentPage - 1) * itemsPerPage + 1;
        const endIdx = Math.min(currentPage * itemsPerPage, totalItems);
        
        recordsStart.textContent = startIdx;
        recordsEnd.textContent = endIdx;

        let paginationHTML = '';
        
        if (currentPage > 1) {
            paginationHTML += `<button class="page-btn" onclick="Historique.goToPage(1)">«</button>`;
            paginationHTML += `<button class="page-btn" onclick="Historique.goToPage(${currentPage - 1})">‹</button>`;
        }

        for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
            paginationHTML += `
                <button class="page-btn ${i === currentPage ? 'active' : ''}" 
                        onclick="Historique.goToPage(${i})">${i}</button>
            `;
        }

        if (currentPage < totalPages) {
            paginationHTML += `<button class="page-btn" onclick="Historique.goToPage(${currentPage + 1})">›</button>`;
            paginationHTML += `<button class="page-btn" onclick="Historique.goToPage(${totalPages})">»</button>`;
        }

        pagination.innerHTML = paginationHTML;
    }

    /**
     * Applique une option de tri rapide
     */
    function applySortOption(option) {
        const options = {
            'date_desc': { field: 'dateCreation', direction: 'desc' },
            'date_asc': { field: 'dateCreation', direction: 'asc' },
            'montant_desc': { field: 'montantDemande', direction: 'desc' },
            'montant_asc': { field: 'montantDemande', direction: 'asc' },
            'score_desc': { field: 'scoreCredit', direction: 'desc' },
            'client_asc': { field: 'client', direction: 'asc' }
        };
        
        const opts = options[option];
        if (opts) {
            sortField = opts.field;
            sortDirection = opts.direction;
        }
    }

    /**
     * Exporte les données (respecte les filtres actuels)
     */
    function exportData() {
        // Obtenir les données filtrées actuelles (si le tableau est filtré)
        const searchQuery = document.getElementById('searchInput')?.value.toLowerCase() || '';
        const statusFilter = document.getElementById('statusFilter')?.value || '';
        
        let requestsToExport = allRequests;
        
        if (searchQuery || statusFilter) {
            requestsToExport = allRequests.filter(req => {
                const clientName = req.client && req.client.nom ? req.client.nom : '';
                const matchesSearch = req.id.toString().includes(searchQuery) || 
                                     clientName.toLowerCase().includes(searchQuery);
                const matchesStatus = !statusFilter || req.statut === statusFilter;
                return matchesSearch && matchesStatus;
            });
        }

        const csv = [
            ['ID', 'Client', 'Montant', 'Statut', 'Date', 'Score'].join(','),
            ...requestsToExport.map(r => {
                const clientName = r.client && r.client.nom ? r.client.nom : '';
                const score = r.scoreCredit ? r.scoreCredit.valeurScore.toFixed(0) + '/850' : '0';
                const dateStr = r.dateCreation ? new Date(r.dateCreation).toLocaleDateString() : 'N/A';
                return [r.id, `"${clientName}"`, r.montantDemande, r.statut, `"${dateStr}"`, score].join(',');
            })
        ].join('\n');

        const blob = new Blob(["\ufeff" + csv], { type: 'text/csv;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `demandes-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    }

    /**
     * Recharge les données du serveur
     */
    async function refresh() {
        await loadRequests();
        filterAndRender();
    }

    // Fonctions publiques
    function goToPage(page) {
        currentPage = page;
        renderTable();
        // Since we are in an SPA and contentArea has overflow-y:auto
        const contentArea = document.getElementById('contentArea');
        if (contentArea) contentArea.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function updateSortIndicators() {
        document.querySelectorAll('.sortable').forEach(th => {
            const field = th.dataset.sort;
            const icon = th.querySelector('.sort-icon');
            if (field === sortField) {
                icon.textContent = sortDirection === 'asc' ? '↑' : '↓';
            } else {
                icon.textContent = '↕️';
            }
        });
    }

    function getStatusLabel(status) {
        const labels = {
            'APPROUVE': 'Approuvée',
            'EN_ATTENTE': 'En Attente',
            'REFUSE': 'Rejetée'
        };
        return labels[status] || status;
    }

    return {
        init,
        goToPage,
        exportData,
        refresh
    };
})();
