const UI = {
    currentSection: null,
    currentStep: 0,
    currentApplicationId: null,
    loanData: {},

    /**
     * Shows a specific section and hides others
     */
    showSection(sectionId) {
        document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
        const target = document.getElementById(sectionId);
        if (target) target.classList.remove('hidden');
        this.currentSection = sectionId;
    },

    /**
     * Initializes the dashboard based on user role
     */
    initDashboard(role) {
        if (!role) {
            console.error("No role provided to initDashboard");
            return this.logout ? this.logout() : Auth.logout();
        }

        this.showSection('dashboard-shell');
        
        const userName = document.getElementById('user-name');
        const userRole = document.getElementById('user-role');
        if (userName) userName.textContent = Auth.user?.nom || 'Utilisateur';
        if (userRole) userRole.textContent = role.replace('ROLE_', '');

        // Initialiser le système de navigation modulaire
        if (typeof Navigation !== 'undefined') {
            Navigation.init();
        } else {
            this.renderSidebar(role);
            // Fallback view
            if (role === 'ROLE_CLIENT') {
                this.renderClientInfo();
            } else if (role === 'ROLE_BANQUIER') {
                this.renderBankerDashboard();
            } else if (role === 'ROLE_ADMIN') {
                this.renderAdminDashboard();
            }
        }
    },

    renderSidePanel(type, data = {}) {
        const panel = document.getElementById('side-panel');
        if (!panel) return;

        if (type === 'default') {
            panel.innerHTML = `
                <div class="glass-card p-6">
                    <h3 class="text-sm font-bold uppercase color-accent mb-4">Aide & Support</h3>
                    <p class="text-xs color-slate-400 leading-relaxed">
                        Bienvenue dans votre terminal BankScore AI. Utilisez le menu de gauche pour naviguer et le bouton "Nouvelle Demande" pour démarrer une analyse.
                    </p>
                </div>
                <div class="glass-card p-6 mt-4">
                    <h3 class="text-sm font-bold uppercase color-accent mb-4">Statut IA</h3>
                    <div class="flex items-center gap-3">
                        <div class="status-dot online"></div>
                        <span class="text-xs">Llama 3 connecté</span>
                    </div>
                </div>
            `;
        } else if (type === 'wizard') {
            const montant = data.montant || 0;
            const revenus = data.revenu || 1;
            const charges = data.charges || 0;
            const ratio = ((charges / revenus) * 100).toFixed(1);
            const statusColor = ratio > 45 ? 'var(--error)' : (ratio > 33 ? 'var(--warning)' : 'var(--success)');

            panel.innerHTML = `
                <div class="glass-card p-8">
                    <h2 class="font-premium mb-6">Simulation Directe</h2>
                    <div class="space-y-6">
                        <div>
                            <label class="text-xs uppercase font-bold color-slate-500 block mb-2">Taux d'endettement estimé</label>
                            <div class="text-4xl font-bold" style="color: ${statusColor}">${ratio}%</div>
                            <div class="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
                                <div style="width: ${Math.min(ratio, 100)}%; background: ${statusColor}; height: 100%; transition: all 0.5s;"></div>
                            </div>
                        </div>
                        <div class="pt-4 border-top border-glass">
                            <label class="text-xs uppercase font-bold color-slate-500 block mb-2">Revenu Net Mensuel</label>
                            <div class="text-2xl font-bold">${(revenus - charges).toLocaleString()} €</div>
                        </div>
                        <div class="p-4 rounded-lg bg-glass mt-8">
                            <i class="fas fa-info-circle mr-2 color-accent"></i>
                            <span class="text-xs color-slate-400">Ces valeurs sont calculées en temps réel sur la base de vos saisies.</span>
                        </div>
                    </div>
                </div>
            `;
        }
    },

    renderSidebar(role) {
        const nav = document.getElementById('nav-links');
        if (!nav) return;

        let links = '';
        if (role === 'ROLE_ADMIN') {
            links = `
                <li><a href="#" class="active" onclick="UI.renderAdminDashboard(this)"><i class="fas fa-chart-pie"></i> <span>Aperçu Système</span></a></li>
                <li><a href="#" onclick="UI.renderUserManagement(this)"><i class="fas fa-users-cog"></i> <span>Utilisateurs</span></a></li>
                <li><a href="#" onclick="UI.renderScoringParams(this)"><i class="fas fa-sliders-h"></i> <span>Scoring IA</span></a></li>
            `;
        } else if (role === 'ROLE_BANQUIER') {
            links = `
                <li><a href="#" class="active" onclick="UI.renderBankerDashboard(this)"><i class="fas fa-tasks"></i> <span>File d'Attente</span></a></li>
                <li><a href="#" onclick="UI.renderBankerReports(this)"><i class="fas fa-file-contract"></i> <span>Rapports</span></a></li>
            `;
        } else {
            links = `
                <li><a href="#" class="active" onclick="UI.renderClientInfo(this)"><i class="fas fa-info-circle"></i> <span>Comprendre mon Score</span></a></li>
                <li><a href="#" onclick="UI.renderClientDashboard(this)"><i class="fas fa-chart-line"></i> <span>Tableau de Bord</span></a></li>
                <li><a href="#" onclick="UI.startLoanWizard(this)"><i class="fas fa-plus-circle"></i> <span>Nouvelle Demande</span></a></li>
                <li><a href="#" onclick="UI.renderClientHistory(this)"><i class="fas fa-history"></i> <span>Mes Dossiers</span></a></li>
            `;
        }
        nav.innerHTML = links;
    },

    setActiveLink(el) {
        if (!el) return;
        document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
        el.classList.add('active');
    },

    // --- ADMIN DASHBOARD ---
    async renderAdminDashboard(el) {
        this.setActiveLink(el);
        this.setPageTitle('Aperçu Système');
        try {
            const demandes = await API.demandes.getAll();
            const stats = {
                total: demandes.length,
                pending: demandes.filter(d => d.statut === 'EN_ATTENTE').length,
                approved: demandes.filter(d => d.statut === 'APPROUVE').length,
                refused: demandes.filter(d => d.statut === 'REFUSE').length
            };
            const cards =
                Components.StatCard('Total Demandes', stats.total, 'file-invoice') +
                Components.StatCard('En Attente', stats.pending, 'clock') +
                Components.StatCard('Approuvées', stats.approved, 'check-circle') +
                Components.StatCard('Refusées', stats.refused, 'times-circle');

            document.getElementById('main-view').innerHTML = `
                <div class="stats-grid">${cards}</div>
                <div class="glass" style="padding:2rem;margin-top:2rem;border-radius:12px;">
                    <h3 class="font-premium" style="margin-bottom:1.5rem;">Toutes les Demandes</h3>
                    ${Components.DataTable(
                        [
                            {label:'ID',key:'id'},
                            {label:'Client',key:'client.nom'},
                            {label:'Montant',key:'montantDemande',type:'currency'},
                            {label:'Statut',key:'statut',type:'status'},
                            {label:'Date',key:'dateCreation',type:'date'}
                        ],
                        demandes,
                        [{label:'Voir',icon:'eye',handler:'UI.viewApplicationDetails'}]
                    )}
                </div>`;
        } catch (err) {
            document.getElementById('main-view').innerHTML =
                `<div style="padding:2rem;color:var(--error);">Erreur chargement: ${err.message}</div>`;
        }
    },

    // --- CLIENT DASHBOARD ---
    async renderClientDashboard(el) {
        this.setActiveLink(el);
        this.setPageTitle('Tableau de Bord Client');
        
        try {
            const demandes = await API.demandes.getMine();
            const stats = {
                total: demandes.length,
                pending: demandes.filter(d => d.statut === 'EN_ATTENTE').length,
                approved: demandes.filter(d => d.statut === 'APPROUVE').length
            };

            const cards = 
                Components.StatCard("Mes Demandes", stats.total, "folder-open") +
                Components.StatCard("En Attente", stats.pending, "clock") +
                Components.StatCard("Approuvées", stats.approved, "check-circle");

            const columns = [
                { label: "ID", key: "id" },
                { label: "Montant", key: "montantDemande", type: "currency" },
                { label: "Statut", key: "statut", type: "status" },
                { label: "Date", key: "dateCreation", type: "date" }
            ];

            document.getElementById('main-view').innerHTML = `
                <div class="stats-grid">${cards}</div>
                <h2 class="font-premium mb-6">Demandes Récentes</h2>
                ${Components.DataTable(columns, demandes.slice(0, 5), [
                    { label: "Voir Détails", icon: "chevron-right", handler: "UI.viewApplicationDetails" }
                ])}
            `;
        } catch (err) {
            this.showToast(err.message, 'error');
        }
    },

    renderClientHistory(el) {
        this.setActiveLink(el);
        this.renderClientDashboard();
    },

    renderClientInfo(el) {
        if (el) this.setActiveLink(el);
        if (typeof Info !== 'undefined') {
            Info.renderClientInfo();
        }
    },

    renderBankerReports(el) {
        this.setActiveLink(el);
        this.setPageTitle('Rapports');
        document.getElementById('main-view').innerHTML = `<div class="glass" style="padding:3rem;text-align:center;"><i class="fas fa-file-contract" style="font-size:3rem;color:var(--accent);"></i><p style="margin-top:1rem;color:var(--slate-400);">Module rapports en préparation.</p></div>`;
    },

    renderUserManagement(el) {
        this.setActiveLink(el);
        this.setPageTitle('Gestion Utilisateurs');
        document.getElementById('main-view').innerHTML = `<div class="glass" style="padding:3rem;text-align:center;"><i class="fas fa-users-cog" style="font-size:3rem;color:var(--accent);"></i><p style="margin-top:1rem;color:var(--slate-400);">Gestion utilisateurs en préparation.</p></div>`;
    },

    renderScoringParams(el) {
        this.setActiveLink(el);
        this.setPageTitle('Paramètres Scoring IA');
        document.getElementById('main-view').innerHTML = `<div class="glass" style="padding:3rem;text-align:center;"><i class="fas fa-sliders-h" style="font-size:3rem;color:var(--accent);"></i><p style="margin-top:1rem;color:var(--slate-400);">Scoring IA en préparation.</p></div>`;
    },

    renderAdminSettings(el) { this.renderScoringParams(el); },



    // --- 5-STEP LOAN WIZARD ---
    startLoanWizard(el) {
        if (el) this.setActiveLink(el);
        this.currentStep = 0;
        this.loanData = {};
        this.renderWizardStep();
    },

    renderWizardStep() {
        const steps = ["Produit", "Identité", "Projet", "Documents", "Validation"];
        this.setPageTitle(`Nouvelle Demande - Étape ${this.currentStep + 1}`);
        
        let stepContent = '';
        switch(this.currentStep) {
            case 0:
                stepContent = `
                    <div class="grid grid-cols-2 gap-6">
                        <div class="input-group">
                            <label>Montant Souhaité (€)</label>
                            <input type="number" id="w-montant" placeholder="Ex: 15000" value="${this.loanData.montant || ''}">
                        </div>
                        <div class="input-group">
                            <label>Durée du Prêt (Mois)</label>
                            <input type="number" id="w-duree" placeholder="Ex: 36" value="${this.loanData.duree || ''}">
                        </div>
                        <div class="input-group">
                            <label>Type de Crédit</label>
                            <select id="w-typeCredit" class="w-full bg-glass border-none p-3 rounded">
                                <option value="Consommation" ${this.loanData.typeCredit === 'Consommation' ? 'selected' : ''}>Consommation</option>
                                <option value="Immobilier" ${this.loanData.typeCredit === 'Immobilier' ? 'selected' : ''}>Immobilier</option>
                                <option value="Investissement" ${this.loanData.typeCredit === 'Investissement' ? 'selected' : ''}>Investissement</option>
                                <option value="Trésorerie" ${this.loanData.typeCredit === 'Trésorerie' ? 'selected' : ''}>Trésorerie</option>
                            </select>
                        </div>
                        <div class="input-group">
                            <label>Objet du Financement</label>
                            <input type="text" id="w-objet" placeholder="Ex: Achat véhicule" value="${this.loanData.objet || ''}">
                        </div>
                    </div>
                `;
                break;
            case 1:
                stepContent = `
                    <div class="grid grid-cols-2 gap-6">
                        <div class="input-group"><label>CIN / RC</label><input type="text" id="w-cin" value="${this.loanData.cin || ''}"></div>
                        <div class="input-group"><label>Téléphone</label><input type="text" id="w-tel" value="${this.loanData.tel || ''}"></div>
                        <div class="input-group col-span-2"><label>Adresse</label><input type="text" id="w-adresse" value="${this.loanData.adresse || ''}"></div>
                        <div class="input-group"><label>Revenu Mensuel Net (€)</label><input type="number" id="w-revenu" value="${this.loanData.revenu || ''}"></div>
                        <div class="input-group"><label>Charges Fixes (€)</label><input type="number" id="w-charges" value="${this.loanData.charges || ''}"></div>
                        <div class="input-group"><label>Profession</label><input type="text" id="w-profession" value="${this.loanData.profession || ''}"></div>
                        <div class="input-group"><label>Ancienneté Activité (Ans)</label><input type="number" id="w-anciennete" value="${this.loanData.anciennete || ''}"></div>
                    </div>
                `;
                break;
            case 2:
                stepContent = `
                    <div class="space-y-4">
                        <div class="input-group"><label>Description du Projet</label><textarea id="w-desc" rows="2">${this.loanData.desc || ''}</textarea></div>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="input-group"><label>Type de Garantie</label><input type="text" id="w-garantieType" placeholder="Ex: Hypothèque" value="${this.loanData.garantieType || ''}"></div>
                            <div class="input-group"><label>Valeur Estimée (€)</label><input type="number" id="w-garantieValeur" value="${this.loanData.garantieValeur || ''}"></div>
                        </div>
                        <div class="input-group"><label>Détails Garantie</label><textarea id="w-garantieDetails" rows="2">${this.loanData.garantieDetails || ''}</textarea></div>
                    </div>
                `;
                break;
            case 3:
                stepContent = `
                    <div class="glass-card p-12 text-center border-dashed">
                        <i class="fas fa-cloud-upload-alt fa-3x color-accent mb-4"></i>
                        <h3>Documents Justificatifs</h3>
                        <p class="color-slate-400 mb-6">Veuillez préparer votre CIN, vos 3 derniers relevés et justificatifs de revenus.</p>
                        <button class="btn" style="background: rgba(255,255,255,0.05)">Parcourir les fichiers</button>
                    </div>
                `;
                break;
            case 4:
                stepContent = `
                    <div class="glass-card p-8">
                        <h3 class="mb-4">Récapitulatif</h3>
                        <div class="grid grid-cols-2 gap-x-8 gap-y-2">
                            <span>Client:</span> <strong>${Auth.user?.nom}</strong>
                            <span>Montant:</span> <strong>${this.loanData.montant} €</strong>
                            <span>Produit:</span> <strong>${this.loanData.typeCredit}</strong>
                            <span>Mensualité estimée:</span> <strong>${(this.loanData.montant / this.loanData.duree).toFixed(2)} €</strong>
                        </div>
                        <div class="mt-6 p-4 bg-glass rounded text-sm italic">
                            En soumettant cette demande, vous certifiez que les informations fournies sont exactes.
                        </div>
                    </div>
                `;
                break;
        }

        document.getElementById('main-view').innerHTML = `
            <div class="max-w-4xl">
                <h1 class="font-premium mb-2">${steps[this.currentStep]}</h1>
                <p class="color-slate-400 mb-8">Veuillez compléter les informations relatives à votre projet.</p>
                
                <div class="glass-card p-10 animate-slide-up">
                    ${stepContent}
                    <div class="flex justify-between mt-12 pt-8 border-top border-glass">
                        <button class="btn" style="background: rgba(255,255,255,0.05)" onclick="UI.wizardBack()" ${this.currentStep === 0 ? 'disabled' : ''}>Retour</button>
                        <button class="btn btn-primary px-12" onclick="UI.wizardNext()">${this.currentStep === 4 ? 'Confirmer la Demande' : 'Continuer'}</button>
                    </div>
                </div>
            </div>
        `;

        this.renderSidePanel('wizard', this.loanData);

        // Add live listeners for real-time simulation
        const inputs = ['w-montant', 'w-revenu', 'w-charges'];
        inputs.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('input', (e) => {
                    const key = id.replace('w-', '');
                    this.loanData[key] = parseFloat(e.target.value) || 0;
                    this.renderSidePanel('wizard', this.loanData);
                });
            }
        });
    },

    wizardNext() {
        if (this.currentStep === 0) {
            this.loanData.montant = document.getElementById('w-montant').value;
            this.loanData.duree = document.getElementById('w-duree').value;
            this.loanData.typeCredit = document.getElementById('w-typeCredit').value;
            this.loanData.objet = document.getElementById('w-objet').value;
            if (!this.loanData.montant || !this.loanData.duree) return this.showToast('Veuillez remplir les champs obligatoires', 'warning');
        }
        if (this.currentStep === 1) {
            this.loanData.cin = document.getElementById('w-cin').value;
            this.loanData.tel = document.getElementById('w-tel').value;
            this.loanData.adresse = document.getElementById('w-adresse').value;
            this.loanData.revenu = document.getElementById('w-revenu').value;
            this.loanData.charges = document.getElementById('w-charges').value;
            this.loanData.profession = document.getElementById('w-profession').value;
            this.loanData.anciennete = document.getElementById('w-anciennete').value;
        }
        if (this.currentStep === 2) {
            this.loanData.desc = document.getElementById('w-desc').value;
            this.loanData.garantieType = document.getElementById('w-garantieType').value;
            this.loanData.garantieValeur = document.getElementById('w-garantieValeur').value;
            this.loanData.garantieDetails = document.getElementById('w-garantieDetails').value;
        }

        if (this.currentStep < 4) {
            this.currentStep++;
            this.renderWizardStep();
        } else {
            this.submitLoanRequest();
        }
    },

    wizardBack() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.renderWizardStep();
        }
    },

    async submitLoanRequest() {
        try {
            this.setLoading(true);
            const res = await API.demandes.create({
                montantSouhaite: this.loanData.montant,
                dureeMois: this.loanData.duree,
                revenuMensuel: this.loanData.revenu,
                chargesFixes: this.loanData.charges,
                profession: this.loanData.profession,
                cin: this.loanData.cin,
                adresse: this.loanData.adresse,
                telephone: this.loanData.tel,
                activitePrincipale: this.loanData.profession,
                ancienneteActivite: this.loanData.anciennete,
                typeCredit: this.loanData.typeCredit,
                objetFinancement: this.loanData.objet,
                descriptionProjet: this.loanData.desc,
                typeGarantie: this.loanData.garantieType,
                valeurGarantie: this.loanData.garantieValeur,
                detailsGarantie: this.loanData.garantieDetails
            });
            this.showToast('Demande soumise avec succès !', 'success');
            this.viewApplicationDetails(res.id);
        } catch (err) {
            this.showToast(err.message, 'error');
        } finally {
            this.setLoading(false);
        }
    },

    // --- BANKER DASHBOARD ---
    async renderBankerDashboard(el) {
        this.setActiveLink(el);
        this.setPageTitle('File d\'Attente des Décisions');
        
        try {
            const demandes = await API.demandes.getAll();
            const pending = demandes.filter(d => d.statut === 'EN_ATTENTE');
            
            const cards = 
                Components.StatCard("Dossiers en attente", pending.length, "tasks", "warning") +
                Components.StatCard("Risque Moyen", "34%", "exclamation-triangle") +
                Components.StatCard("Traités (Aujourd'hui)", "12", "check-double", "success");

            const columns = [
                { label: "ID", key: "id" },
                { label: "Client", key: "client.nom" },
                { label: "Montant", key: "montantDemande", type: "currency" },
                { label: "Score IA", key: "scoreCredit.valeurScore", type: "status" }
            ];

            document.getElementById('main-view').innerHTML = `
                <div class="stats-grid">${cards}</div>
                ${Components.DataTable(columns, pending, [
                    { label: "Analyser & Décider", icon: "gavel", handler: "UI.viewApplicationDetails" }
                ])}
            `;
        } catch (err) {
            this.showToast(err.message, 'error');
        }
    },

    // --- COMMON VIEWS ---
    async viewApplicationDetails(id) {
        try {
            this.setLoading(true);
            this.currentApplicationId = id;
            const d = await API.demandes.getById(id);
            this.setPageTitle(`Dossier #${id}`);

            document.getElementById('main-view').innerHTML = `
                <div class="max-w-4xl animate-slide-up">
                    <div class="glass-card p-10 mb-8">
                        <div class="flex justify-between items-center mb-10">
                            <h2 class="font-premium">Informations Générales</h2>
                            ${Components.formatValue(d.statut, 'status')}
                        </div>
                        <div class="grid grid-cols-2 gap-y-10 gap-x-12">
                            <div><label class="color-accent text-xs font-bold uppercase tracking-wider block mb-2">Montant du prêt</label><div class="text-3xl font-bold">${Components.formatValue(d.montantDemande, 'currency')}</div></div>
                            <div><label class="color-accent text-xs font-bold uppercase tracking-wider block mb-2">Durée de remboursement</label><div class="text-3xl font-bold">${d.dureeMois} Mois</div></div>
                            <div><label class="color-accent text-xs font-bold uppercase tracking-wider block mb-2">Revenu Mensuel Net</label><div class="text-xl font-medium">${Components.formatValue(d.revenuMensuel, 'currency')}</div></div>
                            <div><label class="color-accent text-xs font-bold uppercase tracking-wider block mb-2">Charges Fixes</label><div class="text-xl font-medium">${Components.formatValue(d.chargesFixes, 'currency')}</div></div>
                        </div>
                    </div>

                    <div class="glass-card p-10">
                        <h3 class="font-premium mb-8 flex items-center"><i class="fas fa-robot mr-3 color-accent"></i> Analyse de votre demande de crédit</h3>
                        
                        <div class="analysis-report color-slate-200 text-sm leading-relaxed space-y-6">
                            <p>Nous avons étudié votre dossier en tenant compte de plusieurs éléments importants afin d’évaluer votre capacité de remboursement et le niveau de risque associé à votre demande.</p>
                            
                            <div class="p-6 bg-glass rounded-xl border border-glass mb-6">
                                <h4 class="color-accent font-bold mb-2">Situation Professionnelle</h4>
                                <p>
                                    En tant que <strong>${d.client?.profession || 'Professionnel'}</strong>, la stabilité de votre emploi, votre ancienneté et la nature de votre activité jouent un rôle essentiel. 
                                    ${this._getProfessionInsight(d.client?.profession)}
                                </p>
                            </div>

                            <div class="p-6 bg-glass rounded-xl border border-glass mb-6">
                                <h4 class="color-accent font-bold mb-2">Nature du Financement</h4>
                                <p>
                                    Votre demande concerne un crédit de type <strong>${d.typeCredit || 'Consommation'}</strong>. 
                                    ${d.typeCredit?.toLowerCase().includes('immo') 
                                        ? "Ce type de financement immobilier est généralement considéré comme stable en raison de sa nature et des garanties associées." 
                                        : "Ce financement à la consommation demande une vigilance particulière sur votre capacité de remboursement à court terme."}
                                </p>
                            </div>

                            <p>Enfin, nous avons pris en compte votre situation financière globale (revenus de ${Components.formatValue(d.revenuMensuel, 'currency')}, charges et historique). Sur la base de ces éléments, votre dossier a obtenu un score qui reflète votre profil de risque.</p>

                            <div class="result-box p-8 rounded-2xl mt-10" style="background: ${d.statut === 'APPROUVE' ? 'rgba(42, 127, 98, 0.1)' : 'rgba(193, 18, 31, 0.1)'}; border: 1px solid ${d.statut === 'APPROUVE' ? 'rgba(42, 127, 98, 0.3)' : 'rgba(193, 18, 31, 0.3)'}">
                                <h3 class="font-premium mb-4" style="color: ${d.statut === 'APPROUVE' ? '#34d399' : '#f87171'}">Résultat de l’analyse :</h3>
                                ${d.statut === 'APPROUVE' ? `
                                    <p class="font-medium">Votre profil présente un niveau de risque maîtrisé, ce qui nous permet de donner une suite favorable à votre demande de crédit.</p>
                                ` : `
                                    <p class="font-medium">Après analyse, le niveau de risque associé à votre dossier est jugé trop élevé pour permettre l’octroi du crédit dans les conditions actuelles. Cette décision est liée à votre situation financière actuelle ou au type de financement sollicité.</p>
                                `}
                            </div>
                        </div>

                        <div class="pt-10 border-t border-glass flex justify-between items-center mt-10">
                            <div>
                                <h4 class="font-bold text-sm color-accent uppercase tracking-widest mb-1">Rapport d'Expertise</h4>
                                <p class="text-xs color-slate-500">Document certifié par l'IA de CreditPredict.</p>
                            </div>
                            <button class="btn btn-outline" style="min-width: 200px;" onclick="UI.downloadReport(${d.id})">
                                <i class="fas fa-file-pdf mr-2" style="color: #e74c3c;"></i> Télécharger le PDF
                            </button>
                        </div>
                    </div>
                </div>
            `;

            this.renderApplicationSidePanel(d);
            
            const score = d.scoreCredit ? Math.round(d.scoreCredit.valeurScore) : null;
            if (score !== null) this.initScoreGauge(score);
        } catch (err) {
            this.showToast(err.message, 'error');
        } finally {
            this.setLoading(false);
        }
    },

    _getProfessionInsight(prof = '') {
        const p = prof.toLowerCase();
        if (p.includes('ingenieur') || p.includes('ingénieur') || p.includes('medecin') || p.includes('médecin')) {
            return "Votre profil de haut niveau offre une visibilité sécurisante sur vos revenus futurs, ce qui renforce votre solvabilité.";
        } else if (p.includes('enseignant') || p.includes('professeur')) {
            return "Votre statut garantit une régularité de revenus très appréciée pour la gestion du risque à long terme.";
        } else if (p.includes('ouvrier')) {
            return "Bien que votre métier soit essentiel, la variabilité potentielle des revenus liés à cette activité nécessite une analyse prudente des garanties.";
        }
        return "La régularité de votre activité est un facteur clé pour estimer vos revenus dans le temps.";
    },

    renderApplicationSidePanel(d) {
        const panel = document.getElementById('side-panel');
        if (!panel) return;

        const score = d.scoreCredit ? Math.round(d.scoreCredit.valeurScore) : null;

        panel.innerHTML = `
            <div class="flex flex-col gap-8">
                ${score !== null ? Components.ScoreGauge(score) : '<div class="glass-card p-8 text-center"><i class="fas fa-robot fa-spin mb-4"></i><p>Analyse en cours...</p></div>'}
                
                ${Auth.isBanker() && d.statut === 'EN_ATTENTE' ? `
                    <div class="glass-card p-6 border-accent-soft">
                        <h3 class="text-xs font-bold uppercase color-accent mb-6">Décision Décisionnaire</h3>
                        <textarea id="decision-obs" placeholder="Notes confidentielles..." class="mb-4 bg-dark border-none p-4 rounded-xl w-full text-sm" rows="4"></textarea>
                        <div class="flex flex-col gap-3">
                            <button class="btn btn-primary w-full" onclick="UI.makeDecision(${d.id}, 'APPROUVE')">Approuver le Dossier</button>
                            <button class="btn w-full" style="background: rgba(193, 18, 31, 0.1); color: #C1121F; border: 1px solid rgba(193, 18, 31, 0.2);" onclick="UI.makeDecision(${d.id}, 'REFUSE')">Refuser</button>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    },

    async makeDecision(id, status) {
        const obs = document.getElementById('decision-obs').value;
        try {
            await API.demandes.updateStatus(id, status, obs);
            this.showToast(`Dossier ${status === 'APPROUVE' ? 'approuvé' : 'refusé'} avec succès`, 'success');
            this.renderBankerDashboard();
        } catch (err) {
            this.showToast(err.message, 'error');
        }
    },

    async downloadReport(id) {
        try {
            this.setLoading(true);
            const blob = await API.reports.getDemande(id);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `rapport_demande_${id}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            this.showToast('Rapport généré avec succès', 'success');
        } catch (err) {
            this.showToast(err.message, 'error');
        } finally {
            this.setLoading(false);
        }
    },

    // --- UTILS ---
    setPageTitle(title) {
        const el = document.getElementById('page-title');
        if (el) el.textContent = title;
    },

    setLoading(isLoading) {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) overlay.style.display = isLoading ? 'flex' : 'none';
    },

    showToast(msg, type = 'info') {
        // Implementation of a simple toast
        const toast = document.createElement('div');
        toast.className = `toast toast-${type} glass animate-slide-up`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : (type === 'error' ? 'exclamation-circle' : 'info-circle')}"></i>
            <span>${msg}</span>
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 4000);
    },

    initScoreGauge(score) {
        const ctx = document.getElementById('scoreGaugeCanvas');
        if (!ctx) return;
        
        // Calibrage pour échelle FICO 300-850
        const percentage = ((score - 300) / (850 - 300)) * 100;
        const color = score >= 750 ? '#2A7F62' : (score >= 650 ? '#d4a574' : (score >= 550 ? '#E67E22' : '#C1121F'));
        
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [Math.max(0, percentage), Math.max(0, 100 - percentage)],
                    backgroundColor: [color, 'rgba(255,255,255,0.05)'],
                    borderWidth: 0,
                    circumference: 180,
                    rotation: 270
                }]
            },
            options: {
                cutout: '85%',
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: { enabled: false } }
            }
        });
    }
};
