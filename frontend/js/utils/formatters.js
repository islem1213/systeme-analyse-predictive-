// Formatters - Utilitaires de formatage

function formatCurrency(value) {
    if (!value && value !== 0) return '0 €';
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
    }).format(value);
}

function formatNumber(value) {
    if (!value && value !== 0) return '0';
    return new Intl.NumberFormat('fr-FR').format(value);
}

function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(date);
}

function formatDateLong(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
}

function formatPercent(value) {
    if (!value && value !== 0) return '0%';
    return (value * 100).toFixed(1) + '%';
}
