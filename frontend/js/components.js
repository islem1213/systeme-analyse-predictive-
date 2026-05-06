const Components = {
    /**
     * Renders a premium dashboard card
     */
    StatCard(title, value, icon, trend = null) {
        return `
            <div class="glass-card stat-card">
                <div class="stat-icon flex-center">
                    <i class="fas fa-${icon}"></i>
                </div>
                <div class="stat-info">
                    <h3>${title}</h3>
                    <div class="value">${value}</div>
                    ${trend ? `<span class="trend ${trend > 0 ? 'up' : 'down'}">${trend > 0 ? '+' : ''}${trend}%</span>` : ''}
                </div>
            </div>
        `;
    },

    /**
     * Renders a premium data table
     */
    DataTable(columns, data, actions = []) {
        const headers = columns.map(col => `<th>${col.label}</th>`).join('') + (actions.length ? '<th>Actions</th>' : '');
        
        const rows = data.map(item => {
            const cells = columns.map(col => {
                const value = col.key.split('.').reduce((obj, key) => obj?.[key], item);
                return `<td>${this.formatValue(value, col.type)}</td>`;
            }).join('');
            
            const actionBtns = actions.map(act => `
                <button class="btn-icon" onclick="${act.handler}('${item.id}')" title="${act.label}">
                    <i class="fas fa-${act.icon}"></i>
                </button>
            `).join('');
            
            return `<tr>${cells}${actions.length ? `<td>${actionBtns}</td>` : ''}</tr>`;
        }).join('');

        return `
            <div class="table-container">
                <table>
                    <thead><tr>${headers}</tr></thead>
                    <tbody>${rows || '<tr><td colspan="100%" style="text-align:center; padding: 2rem; color: var(--slate-500);">Aucune donnée disponible</td></tr>'}</tbody>
                </table>
            </div>
        `;
    },

    /**
     * Formats values for display
     */
    formatValue(val, type) {
        if (val === null || val === undefined) return '-';
        switch (type) {
            case 'currency': return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(val);
            case 'date': return new Date(val).toLocaleDateString('fr-FR');
            case 'status': {
                const sc = val ? val.toLowerCase().replace(/_/g, '-') : 'unknown';
                return `<span class="badge status-${sc}">${val || '-'}</span>`;
            }
            default: return val;
        }
    },

    /**
     * Renders the Multi-Step Indicator
     */
    StepIndicator(steps, currentStep) {
        return `
            <div class="step-indicator">
                ${steps.map((step, index) => {
                    const status = index < currentStep ? 'completed' : (index === currentStep ? 'active' : '');
                    return `
                        <div class="step ${status}">
                            <div class="step-circle">${index + 1}</div>
                            <span class="step-label">${step}</span>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    },

    /**
     * Renders an AI Score Gauge (placeholder for Chart.js)
     */
    ScoreGauge(score) {
        return `
            <div class="glass-card p-8 flex-center flex-direction-column">
                <h3 class="font-premium mb-4">Score de Crédit AI</h3>
                <div class="gauge-container">
                    <canvas id="scoreGaugeCanvas"></canvas>
                    <div id="scoreText">${score}</div>
                </div>
                <p class="text-center color-slate-400 mt-4">
                    Basé sur une analyse prédictive des revenus, de la stabilité et des antécédents.
                </p>
            </div>
        `;
    }
};
