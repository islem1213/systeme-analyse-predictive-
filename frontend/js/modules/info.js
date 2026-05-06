/**
 * Module d'information sur le Score de Crédit
 * Contenu traduit et adapté des ressources MyCreditUnion.gov
 */
const Info = {
    renderClientInfo() {
        UI.setPageTitle("Comprendre le Score de Crédit");
        const main = document.getElementById('contentArea');
        
        main.innerHTML = `
            <div class="info-page animate-slide-up">
                <div class="info-hero glass-card p-12 mb-8">
                    <h1 class="font-premium color-accent mb-4">Le Score de Crédit : Votre Clé Financière</h1>
                    <p class="text-xl color-slate-100 max-w-3xl leading-relaxed">
                        Le score de crédit est une représentation numérique de votre solvabilité, basée sur votre historique financier. 
                        Il indique le niveau de risque pour les prêteurs et influence votre accès aux prêts, cartes de crédit et meilleurs taux.
                    </p>
                </div>

                <div class="grid grid-cols-2 gap-8 mb-12">
                    <div class="glass-card p-8">
                        <h2 class="font-premium mb-6"><i class="fas fa-calculator mr-3 color-accent"></i> Comment est-il calculé ?</h2>
                        <div class="calculation-breakdown">
                            <div class="calc-item">
                                <div class="calc-header"><span>Historique de Paiement</span><span class="pct">35%</span></div>
                                <p class="text-xs color-slate-400">Payer vos factures à temps est le facteur le plus critique.</p>
                            </div>
                            <div class="calc-item">
                                <div class="calc-header"><span>Montants Dus</span><span class="pct">30%</span></div>
                                <p class="text-xs color-slate-400">Utilisez moins de 30% de votre limite de crédit disponible.</p>
                            </div>
                            <div class="calc-item">
                                <div class="calc-header"><span>Durée de l'Historique</span><span class="pct">15%</span></div>
                                <p class="text-xs color-slate-400">Plus vos comptes sont anciens, plus votre score est stable.</p>
                            </div>
                            <div class="calc-item">
                                <div class="calc-header"><span>Mixité de Crédit</span><span class="pct">10%</span></div>
                                <p class="text-xs color-slate-400">Avoir différents types de crédits (auto, immo, conso).</p>
                            </div>
                            <div class="calc-item">
                                <div class="calc-header"><span>Nouveau Crédit</span><span class="pct">10%</span></div>
                                <p class="text-xs color-slate-400">Évitez d'ouvrir trop de nouveaux comptes simultanément.</p>
                            </div>
                        </div>
                    </div>

                    <div class="glass-card p-8">
                        <h2 class="font-premium mb-6"><i class="fas fa-chart-line mr-3 color-accent"></i> Les Plages de Score</h2>
                        <div class="score-ranges">
                            <div class="range-item poor"><span>Mauvais</span><span>Moins de 580</span></div>
                            <div class="range-item fair"><span>Moyen / Passable</span><span>580 à 669</span></div>
                            <div class="range-item good"><span>Bon</span><span>670 à 739</span></div>
                            <div class="range-item very-good"><span>Très Bon</span><span>740 à 799</span></div>
                            <div class="range-item excellent"><span>Excellent</span><span>800 et plus</span></div>
                        </div>
                        <div class="mt-8 p-4 bg-glass rounded-lg text-sm color-slate-400">
                            <i class="fas fa-info-circle mr-2 color-accent"></i>
                            Un score élevé vous permet d'accéder à des produits financiers plus avantageux.
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-3 gap-6 mb-12">
                    <div class="glass-card p-6 border-accent-soft">
                        <h3 class="font-premium mb-4 color-accent">Comment l'améliorer ?</h3>
                        <ul class="text-sm color-slate-400 space-y-4 no-bullets">
                            <li><i class="fas fa-check-circle mr-2 color-accent"></i> Automatisez vos paiements.</li>
                            <li><i class="fas fa-check-circle mr-2 color-accent"></i> Réduisez vos soldes de cartes.</li>
                            <li><i class="fas fa-check-circle mr-2 color-accent"></i> Ne fermez pas vos anciens comptes.</li>
                            <li><i class="fas fa-check-circle mr-2 color-accent"></i> Vérifiez régulièrement vos rapports.</li>
                        </ul>
                    </div>
                    <div class="glass-card p-6">
                        <h3 class="font-premium mb-3">Pourquoi varie-t-il ?</h3>
                        <p class="text-sm color-slate-400">
                            Chaque bureau de crédit utilise ses propres données et algorithmes (FICO ou VantageScore), ce qui peut causer de légères variations.
                        </p>
                    </div>
                    <div class="glass-card p-6">
                        <h3 class="font-premium mb-3">Loi FCRA</h3>
                        <p class="text-sm color-slate-400">
                            Depuis 1970, le Fair Credit Reporting Act protège vos droits en régulant la collecte et l'utilisation de vos informations de crédit.
                        </p>
                    </div>
                </div>

                <div class="glass-card p-10 mb-12">
                    <h2 class="font-premium mb-8 text-center">Foire Aux Questions (FAQ)</h2>
                    <div class="faq-container">
                        <div class="faq-item">
                            <div class="faq-trigger" onclick="Info.toggleFaq(this)">
                                <span>Comment contester une information inexacte sur mon rapport ?</span>
                                <i class="fas fa-chevron-down"></i>
                            </div>
                            <div class="faq-content">
                                Vous devez contacter le bureau de crédit par écrit. Ils disposent généralement de 30 jours pour enquêter et corriger toute erreur prouvée.
                            </div>
                        </div>
                        <div class="faq-item">
                            <div class="faq-trigger" onclick="Info.toggleFaq(this)">
                                <span>Combien de temps prend l'analyse par l'IA ?</span>
                                <i class="fas fa-chevron-down"></i>
                            </div>
                            <div class="faq-content">
                                L'analyse est quasi instantanée. Notre algorithme traite vos données financières en moins de 5 secondes pour générer un score prédictif et une recommandation détaillée.
                            </div>
                        </div>
                        <div class="faq-item">
                            <div class="faq-trigger" onclick="Info.toggleFaq(this)">
                                <span>Est-ce qu'une simulation sur CreditPredict impacte mon score réel ?</span>
                                <i class="fas fa-chevron-down"></i>
                            </div>
                            <div class="faq-content">
                                Non. CreditPredict effectue ce qu'on appelle une "demande souple" (soft inquiry) à des fins de simulation. Cela n'affecte en aucun cas votre score FICO officiel auprès des banques.
                            </div>
                        </div>
                        <div class="faq-item">
                            <div class="faq-trigger" onclick="Info.toggleFaq(this)">
                                <span>Pourquoi mon taux d'endettement est-il si important ?</span>
                                <i class="fas fa-chevron-down"></i>
                            </div>
                            <div class="faq-content">
                                Le ratio DTI (Debt-to-Income) est le principal indicateur de votre capacité de remboursement. L'IA considère généralement qu'au-delà de 35% à 40%, le risque de défaut devient trop élevé.
                            </div>
                        </div>
                        <div class="faq-item">
                            <div class="faq-trigger" onclick="Info.toggleFaq(this)">
                                <span>Mes données bancaires sont-elles sécurisées ?</span>
                                <i class="fas fa-chevron-down"></i>
                            </div>
                            <div class="faq-content">
                                Absolument. Nous utilisons un chiffrement de bout en bout (AES-256) et vos données ne sont jamais partagées avec des tiers sans votre consentement explicite.
                            </div>
                        </div>
                        <div class="faq-item">
                            <div class="faq-trigger" onclick="Info.toggleFaq(this)">
                                <span>Combien de temps faut-il pour améliorer mon score ?</span>
                                <i class="fas fa-chevron-down"></i>
                            </div>
                            <div class="faq-content">
                                Cela dépend des facteurs, mais en adoptant de bonnes habitudes (paiements à l'heure, réduction des soldes), on observe généralement une amélioration significative après 3 à 6 mois.
                            </div>
                        </div>
                        <div class="faq-item">
                            <div class="faq-trigger" onclick="Info.toggleFaq(this)">
                                <span>L'union de crédit a-t-elle le droit de consulter mon score ?</span>
                                <i class="fas fa-chevron-down"></i>
                            </div>
                            <div class="faq-content">
                                Oui, lorsque vous faites une demande de prêt, vous donnez tacitement l'autorisation de consulter votre dossier pour évaluer votre risque.
                            </div>
                        </div>
                        <div class="faq-item">
                            <div class="faq-trigger" onclick="Info.toggleFaq(this)">
                                <span>Qu'est-ce qu'une utilisation élevée du crédit ?</span>
                                <i class="fas fa-chevron-down"></i>
                            </div>
                            <div class="faq-content">
                                Cela signifie que vous utilisez une grande partie de vos limites autorisées. Idéalement, restez sous les 30% pour maintenir un score sain.
                            </div>
                        </div>
                        <div class="faq-item">
                            <div class="faq-trigger" onclick="Info.toggleFaq(this)">
                                <span>Quels comptes ne sont pas inclus dans mon score ?</span>
                                <i class="fas fa-chevron-down"></i>
                            </div>
                            <div class="faq-content">
                                Les comptes d'épargne, les cartes de débit et les comptes d'investissement n'influencent généralement pas directement votre score de crédit.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        UI.renderSidePanel('default');
    },

    toggleFaq(el) {
        const item = el.parentElement;
        const isActive = item.classList.contains('active');
        
        // Close others
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
        
        if (!isActive) {
            item.classList.add('active');
        }
    }
};
