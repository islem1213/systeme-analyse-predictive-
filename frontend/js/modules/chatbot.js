/**
 * Chatbot Module - Gère l'interaction avec l'assistant IA
 */
const Chatbot = (() => {
    // Éléments DOM (récupérés à l'init)
    let chatWidget, chatBody, chatInput, chatSend;

    /**
     * Initialise le chatbot
     */
    function init() {
        chatWidget = document.getElementById('chatWidget');
        chatBody = document.getElementById('chatBody');
        chatInput = document.getElementById('chatInput');
        chatSend = document.getElementById('chatSend');

        if (!chatSend || !chatInput) {
            console.error("Chatbot: Éléments DOM manquants");
            return;
        }

        chatSend.addEventListener('click', () => sendMessage());
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });

        console.log("Chatbot initialisé avec succès");
    }

    /**
     * Envoie un message à l'IA
     */
    async function sendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        // Ajouter le message utilisateur à l'interface
        addMessage(text, 'user');
        chatInput.value = '';

        // Indicateur de chargement
        const loadingId = addMessage('...', 'ia', true);

        try {
            // Appel API (Simplified to use the new generic chat endpoint)
            const response = await API.demandes.genericChat(text);
            updateMessage(loadingId, response);
        } catch (error) {
            console.error('Erreur Chatbot:', error);
            updateMessage(loadingId, "Désolé, je rencontre des difficultés pour communiquer avec le serveur. Vérifiez que le backend est bien lancé.");
        }
    }

    /**
     * Ajoute un message à la fenêtre de chat
     */
    function addMessage(text, side, isLoading = false) {
        const id = 'msg-' + Date.now();
        const msgDiv = document.createElement('div');
        msgDiv.id = id;
        msgDiv.className = `msg msg-${side}`;
        if (isLoading) msgDiv.classList.add('loading-msg');
        msgDiv.textContent = text;
        
        chatBody.appendChild(msgDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
        return id;
    }

    /**
     * Met à jour un message existant (ex: remplace les points de suspension par la réponse)
     */
    function updateMessage(id, text) {
        const msgDiv = document.getElementById(id);
        if (msgDiv) {
            msgDiv.textContent = text;
            msgDiv.classList.remove('loading-msg');
            chatBody.scrollTop = chatBody.scrollHeight;
        }
    }

    return {
        init
    };
})();

// Initialisation automatique au chargement
document.addEventListener('DOMContentLoaded', () => Chatbot.init());
