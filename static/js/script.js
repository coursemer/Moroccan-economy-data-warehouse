// Matrix rain effect - amélioration avec variation de couleur et de taille
const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initMatrix(); // Réinitialiser les colonnes lors du redimensionnement
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Katakana rain effect sur le body
function createKatakanaRain() {
    // Créer un conteneur pour les caractères katakana
    const katakanaContainer = document.createElement('div');
    katakanaContainer.className = 'katakana-rain';
    document.body.appendChild(katakanaContainer);
    
    // Style pour le conteneur
    katakanaContainer.style.position = 'fixed';
    katakanaContainer.style.top = '0';
    katakanaContainer.style.left = '0';
    katakanaContainer.style.width = '100%';
    katakanaContainer.style.height = '100%';
    katakanaContainer.style.pointerEvents = 'none';
    katakanaContainer.style.zIndex = '-1';
    katakanaContainer.style.overflow = 'hidden';
    
    // Générer des caractères katakana qui tombent
    const katakanaCount = 100; // Nombre de caractères
    
    for (let i = 0; i < katakanaCount; i++) {
        createKatakanaCharacter(katakanaContainer);
    }
    
    // Ajouter de nouveaux caractères périodiquement
    setInterval(() => {
        if (katakanaContainer.children.length < 300) { // Limite pour éviter la surcharge
            createKatakanaCharacter(katakanaContainer);
        }
    }, 500);
}

function createKatakanaCharacter(container) {
    // Créer un élément pour le caractère
    const character = document.createElement('div');
    
    // Sélectionner un caractère aléatoire (70% katakana, 20% chiffres, 10% latin)
    let char;
    const rand = Math.random();
    if (rand < 0.7) {
        char = katakana[Math.floor(Math.random() * katakana.length)];
    } else if (rand < 0.9) {
        char = nums[Math.floor(Math.random() * nums.length)];
    } else {
        char = latin[Math.floor(Math.random() * latin.length)];
    }
    
    // Définir le contenu et le style
    character.textContent = char;
    character.style.position = 'absolute';
    character.style.left = Math.random() * 100 + 'vw';
    character.style.top = '-20px';
    character.style.fontSize = (12 + Math.random() * 18) + 'px';
    character.style.color = `rgba(0, ${150 + Math.floor(Math.random() * 105)}, 0, ${0.3 + Math.random() * 0.7})`;
    character.style.textShadow = '0 0 5px rgba(0, 255, 0, 0.7)';
    character.style.fontFamily = 'monospace';
    character.style.transition = 'top ' + (3 + Math.random() * 7) + 's linear, opacity 2s';
    
    // Ajouter au conteneur
    container.appendChild(character);
    
    // Déclencher l'animation après un court délai
    setTimeout(() => {
        character.style.top = '105vh';
    }, 10);
    
    // Supprimer le caractère après l'animation
    const duration = 3000 + Math.random() * 7000;
    setTimeout(() => {
        if (container.contains(character)) {
            container.removeChild(character);
        }
    }, duration);
}

const katakana = "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン";
const latin = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const nums = "0123456789";
const special = "!@#$%^&*()_+-=[]{}|;:,.<>/?";
const alphabet = katakana + latin + nums + special;

const baseFontSize = 14;
let columns = [];
let drops = [];

function initMatrix() {
    const columnCount = Math.floor(canvas.width / baseFontSize);
    columns = [];
    drops = [];
    
    for (let i = 0; i < columnCount; i++) {
        columns.push({
            x: i * baseFontSize,
            fontSize: baseFontSize + Math.random() * 4,
            speed: 1 + Math.random() * 1.5,
            opacity: 0.7 + Math.random() * 0.3
        });
        drops.push(1);
    }
}

initMatrix();

function drawMatrix() {
    // Effet de fondu plus lent pour une meilleure visibilité des caractères
    ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < columns.length; i++) {
        const col = columns[i];
        
        // Utiliser plus de caractères katakana que latins pour un effet plus authentique
        let text;
        const rand = Math.random();
        if (rand < 0.7) { // 70% de chance d'obtenir un caractère katakana
            text = katakana[Math.floor(Math.random() * katakana.length)];
        } else if (rand < 0.9) { // 20% de chance d'obtenir un chiffre
            text = nums[Math.floor(Math.random() * nums.length)];
        } else { // 10% de chance d'obtenir un caractère latin
            text = latin[Math.floor(Math.random() * latin.length)];
        }
        
        // Caractère de tête plus lumineux pour un effet de cascade
        if (drops[i] <= 1) {
            ctx.fillStyle = `rgba(180, 255, 180, ${col.opacity + 0.2})`; // Presque blanc pour le premier caractère
        } else {
            // Dégradé de vert plus visible
            const greenValue = 120 + Math.floor(Math.random() * 135);
            ctx.fillStyle = `rgba(0, ${greenValue}, 0, ${col.opacity})`;
        }
        
        ctx.font = `${col.fontSize}px monospace`;
        ctx.fillText(text, col.x, drops[i] * col.fontSize);
        
        // Réinitialiser la goutte avec une probabilité variable
        if (drops[i] * col.fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        
        drops[i] += col.speed / 2;
    }
}

setInterval(drawMatrix, 30);

// Auto-refresh countdown
let timeLeft = 300;
const timerElement = document.getElementById("timer");

setInterval(() => {
    timeLeft--;
    timerElement.textContent = timeLeft;
    if (timeLeft <= 0) {
        window.location.reload();
    }
}, 1000);

// Fonction pour afficher la source des données
function displayDataSources(data) {
    // Créer ou récupérer le conteneur pour les sources de données
    let sourcesContainer = document.getElementById('data-sources');
    if (!sourcesContainer) {
        sourcesContainer = document.createElement('div');
        sourcesContainer.id = 'data-sources';
        sourcesContainer.className = 'data-sources-container';
        document.querySelector('footer').prepend(sourcesContainer);
    }
    
    // Vérifier si les données sont des données de secours
    if (data.is_fallback_data) {
        sourcesContainer.innerHTML = '<div class="data-source fallback">⚠️ ATTENTION: Données de secours utilisées (APIs non disponibles)</div>';
        return;
    }
    
    // Afficher les sources de données
    let sourcesHTML = '<div class="data-sources-title">Sources des données:</div>';
    
    if (data.data_sources) {
        for (const [key, source] of Object.entries(data.data_sources)) {
            sourcesHTML += `<div class="data-source ${key}">${key}: <span>${source}</span></div>`;
        }
    } else {
        sourcesHTML += '<div class="data-source unknown">Sources non spécifiées</div>';
    }
    
    sourcesContainer.innerHTML = sourcesHTML;
}

// Fonction pour charger les données économiques depuis l'API
function loadEconomicData() {
    fetch('/api/data')
        .then(response => response.json())
        .then(result => {
            if (result.status === 'success' && result.data) {
                // Afficher les sources des données
                displayDataSources(result.data);
                
                // Mettre à jour les valeurs affichées si nécessaire
                updateDisplayedValues(result.data);
            } else {
                console.error('Erreur lors du chargement des données:', result.message || 'Réponse invalide');
            }
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des données:', error);
        });
}

// Fonction pour mettre à jour les valeurs affichées
function updateDisplayedValues(data) {
    // Mettre à jour les valeurs économiques si nécessaire
    // Cette fonction peut être étendue selon vos besoins
    
    // Exemple: mettre à jour le PIB
    const gdpElement = document.querySelector('#gdp-value');
    if (gdpElement && data.world_bank && data.world_bank.gdp) {
        gdpElement.textContent = data.world_bank.gdp.toLocaleString();
    }
    
    // Exemple: mettre à jour l'inflation
    const inflationElement = document.querySelector('#inflation-value');
    if (inflationElement && data.world_bank && data.world_bank.inflation_wb) {
        inflationElement.textContent = data.world_bank.inflation_wb.toFixed(1) + '%';
    }
    
    // Ajouter d'autres mises à jour selon les besoins
}

// Effets de survol améliorés
document.addEventListener('DOMContentLoaded', () => {
    // Charger les données économiques
    loadEconomicData();
    
    // Configurer un rechargement périodique des données (toutes les 5 minutes)
    setInterval(loadEconomicData, 5 * 60 * 1000);
    
    // Effet de survol pour les terminaux
    document.querySelectorAll(".terminal").forEach((el) => {
        el.addEventListener("mouseenter", () => {
            el.style.boxShadow = "0 0 25px rgba(0, 255, 0, 0.8)";
            el.style.transform = "scale(1.01)";
            const scanline = el.querySelector(".scanline");
            if (scanline) scanline.style.animationDuration = "2s";
            
            // Ajouter un effet de glitch au titre
            const title = el.querySelector("h2");
            if (title) {
                title.classList.add("glitch");
                title.setAttribute("data-text", title.textContent);
            }
        });
        
        el.addEventListener("mouseleave", () => {
            el.style.boxShadow = "0 0 15px rgba(0, 255, 0, 0.5)";
            el.style.transform = "scale(1)";
            const scanline = el.querySelector(".scanline");
            if (scanline) scanline.style.animationDuration = "8s";
            
            // Retirer l'effet de glitch
            const title = el.querySelector("h2");
            if (title) {
                title.classList.remove("glitch");
                title.removeAttribute("data-text");
            }
        });
    });
    
    // Animation des valeurs numériques
    animateNumbers();
    
    // Initialiser l'effet de pluie katakana
    createKatakanaRain();
    
    // Effet de survol pour les cartes
    document.querySelectorAll(".terminal-card").forEach(card => {
        card.addEventListener("mouseenter", () => {
            card.style.boxShadow = "0 0 15px rgba(0, 255, 0, 0.7)";
            card.style.transform = "translateY(-3px)";
            
            // Faire clignoter les valeurs
            const value = card.querySelector(".value");
            if (value) {
                value.style.animation = "blink-value 0.5s 2";
            }
        });
        
        card.addEventListener("mouseleave", () => {
            card.style.boxShadow = "0 0 5px rgba(0, 255, 0, 0.3)";
            card.style.transform = "translateY(0)";
            
            // Arrêter le clignotement
            const value = card.querySelector(".value");
            if (value) {
                value.style.animation = "none";
            }
        });
    });
});

// Animation des valeurs numériques
function animateNumbers() {
    document.querySelectorAll('.value').forEach(valueElement => {
        const finalValue = valueElement.textContent.trim();
        
        // Vérifier si c'est un nombre
        if (!isNaN(parseFloat(finalValue))) {
            const targetValue = parseFloat(finalValue);
            let startValue = 0;
            const duration = 1500; // ms
            const frameRate = 30; // fps
            const increment = targetValue / (duration / 1000 * frameRate);
            
            // Stocker la valeur finale pour référence
            valueElement.setAttribute('data-final', finalValue);
            valueElement.textContent = '0';
            
            const counter = setInterval(() => {
                startValue += increment;
                if (startValue >= targetValue) {
                    valueElement.textContent = finalValue;
                    clearInterval(counter);
                } else {
                    valueElement.textContent = Math.floor(startValue);
                }
            }, 1000 / frameRate);
        }
    });
}

// Animation pour le clignotement des valeurs
const style = document.createElement('style');
style.innerHTML = `
@keyframes blink-value {
    0% { opacity: 1; }
    50% { opacity: 0.3; }
    100% { opacity: 1; }
}
`;
document.head.appendChild(style);