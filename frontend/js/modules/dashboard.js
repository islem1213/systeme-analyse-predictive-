// Dashboard Module - Gestion des KPIs et graphiques

const Dashboard = (() => {
    const CHART_COLORS = {
        primary: '#d4a574',      // Doré
        success: '#4ade80',      // Vert
        danger: '#f87171',       // Rouge
        warning: '#fbbf24',      // Ambre
        info: '#60a5fa',         // Bleu
        dark: '#1e293b'          // Bleu foncé
    };

    let chartInstances = {};

    /**
     * Initialise le dashboard
     */
    async function init() {
        try {
            await loadKPIs();
            initializeCharts();
            loadRecentRequests();
        } catch (error) {
            console.error('Erreur lors de l\'initialisation du dashboard:', error);
        }
    }

    /**
     * Charge et affiche les KPIs
     */
    async function loadKPIs() {
        try {
            // Dans un premier temps, on va chercher toutes les demandes pour calculer les stats
            // car l'endpoint /stats n'existe peut-être pas encore.
            const demandes = await ApiClient.getRequests();
            
            const total = demandes.length;
            const montantTotal = demandes.reduce((sum, d) => sum + (d.montantDemande || 0), 0);
            const approv = demandes.filter(d => d.statut === 'APPROUVE').length;
            const approvalRate = total > 0 ? (approv / total) * 100 : 0;
            
            const demandesAvecScore = demandes.filter(d => d.scoreCredit && d.scoreCredit.valeurScore);
            const scoreTotal = demandesAvecScore.reduce((sum, d) => sum + d.scoreCredit.valeurScore, 0);
            const averageScore = demandesAvecScore.length > 0 ? (scoreTotal / demandesAvecScore.length) : 0;

            document.getElementById('kpiTotalRequests').textContent = formatNumber(total);
            document.getElementById('kpiTotalAmount').textContent = formatCurrency(montantTotal);
            document.getElementById('kpiApprovalRate').textContent = approvalRate.toFixed(1) + '%';
            document.getElementById('kpiAverageScore').textContent = averageScore.toFixed(0) + '/850';
        } catch (error) {
            console.error('Erreur lors du chargement des KPIs:', error);
        }
    }

    /**
     * Initialise tous les graphiques Chart.js
     */
    function initializeCharts() {
        initRequestsChart();
        initStatusChart();
        initScoresChart();
    }

    /**
     * Graphique 1: Évolution des demandes (Ligne)
     */
    function initRequestsChart() {
        const ctx = document.getElementById('requestsChart');
        if (!ctx) return;

        chartInstances.requests = new Chart(ctx, {
            type: 'line',
            data: {
                labels: generateLast30Days(),
                datasets: [{
                    label: 'Demandes',
                    data: generateRandomData(30, 5, 20),
                    borderColor: CHART_COLORS.primary,
                    backgroundColor: 'rgba(212, 165, 116, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 5,
                    pointBackgroundColor: CHART_COLORS.primary,
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    filler: {
                        propagate: true
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#94a3b8',
                            font: { size: 12 }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#94a3b8',
                            font: { size: 12 }
                        }
                    }
                }
            }
        });
    }

    /**
     * Graphique 2: Répartition par statut (Camembert)
     */
    function initStatusChart() {
        const ctx = document.getElementById('statusChart');
        if (!ctx) return;

        chartInstances.status = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Approuvées', 'En Attente', 'Rejetées'],
                datasets: [{
                    data: [65, 25, 10], // Simulated data for now
                    backgroundColor: [
                        CHART_COLORS.success,
                        CHART_COLORS.warning,
                        CHART_COLORS.danger
                    ],
                    borderColor: '#0f172a',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#e2e8f0',
                            font: { size: 13 },
                            padding: 15
                        }
                    }
                }
            }
        });
    }

    /**
     * Graphique 3: Distribution des scores (Histogramme)
     */
    function initScoresChart() {
        const ctx = document.getElementById('scoresChart');
        if (!ctx) return;

        chartInstances.scores = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['0-20', '21-40', '41-60', '61-80', '81-100'],
                datasets: [{
                    label: 'Nombre de demandes',
                    data: [5, 12, 28, 35, 20],
                    backgroundColor: CHART_COLORS.primary,
                    borderRadius: 8,
                    borderColor: 'transparent'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                indexAxis: 'y',
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#94a3b8'
                        }
                    },
                    y: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#94a3b8'
                        }
                    }
                }
            }
        });
    }

    /**
     * Charge et affiche les 5 demandes récentes
     */
    async function loadRecentRequests() {
        try {
            const requests = await ApiClient.getRequests(); // In a real app we would pass { limit: 5 }
            const recent = requests.slice(0, 5);
            const tbody = document.getElementById('recentRequestsBody');
            
            if (!tbody) return;

            tbody.innerHTML = recent.map(req => `
                <tr class="request-row">
                    <td>${req.id}</td>
                    <td>${formatCurrency(req.montantDemande)}</td>
                    <td>
                        <span class="status-badge status-${req.statut.toLowerCase()}">
                            ${getStatusLabel(req.statut)}
                        </span>
                    </td>
                    <td>${formatDate(req.dateCreation)}</td>
                    <td class="score-cell">
                        <span class="score-badge">${req.scoreCredit ? req.scoreCredit.valeurScore.toFixed(0) + '/850' : 'N/A'}</span>
                    </td>
                </tr>
            `).join('');
        } catch (error) {
            console.error('Erreur lors du chargement des demandes récentes:', error);
        }
    }

    // Fonctions utilitaires
    function generateLast30Days() {
        const dates = [];
        const today = new Date();
        for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            dates.push(date.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }));
        }
        return dates;
    }

    function generateRandomData(count, min, max) {
        return Array.from({ length: count }, () => 
            Math.floor(Math.random() * (max - min + 1)) + min
        );
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
        init
    };
})();
