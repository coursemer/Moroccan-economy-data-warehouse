/**
 * Matrix Rain Effect - Version améliorée avec katakana et alphabet
 * Pour le tableau de bord économique punk
 */

// Caractères à utiliser pour l'effet de pluie
const katakana = "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン";
const latin = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const nums = "0123456789";
const special = "!@#$%^&*()_+-=[]{}|;:,.<>/?";

// Classe pour gérer l'effet de pluie
class MatrixRain {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.drops = [];
        this.columns = [];
        this.baseFontSize = 14;
        this.initialized = false;
        
        // Initialiser l'effet
        this.init();
    }
    
    init() {
        // Créer le canvas s'il n'existe pas déjà
        if (!document.getElementById('matrix-rain-canvas')) {
            this.canvas = document.createElement('canvas');
            this.canvas.id = 'matrix-rain-canvas';
            this.canvas.className = 'matrix-rain';
            document.body.appendChild(this.canvas);
        } else {
            this.canvas = document.getElementById('matrix-rain-canvas');
        }
        
        this.ctx = this.canvas.getContext('2d');
        
        // Configurer la taille du canvas
        this.resizeCanvas();
        
        // Écouter les événements de redimensionnement
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Démarrer l'animation
        this.animate();
        
        this.initialized = true;
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Réinitialiser les colonnes et les gouttes
        this.initDrops();
    }
    
    initDrops() {
        const columnCount = Math.floor(this.canvas.width / this.baseFontSize);
        this.columns = [];
        this.drops = [];
        
        for (let i = 0; i < columnCount; i++) {
            this.columns.push({
                x: i * this.baseFontSize,
                fontSize: this.baseFontSize + Math.random() * 6,
                speed: 1 + Math.random() * 2,
                opacity: 0.7 + Math.random() * 0.3
            });
            this.drops.push(Math.floor(Math.random() * 5));
        }
    }
    
    draw() {
        // Effet de fondu plus lent pour une meilleure visibilité
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (let i = 0; i < this.columns.length; i++) {
            const col = this.columns[i];
            
            // Sélection du caractère avec distribution pondérée
            let text;
            const rand = Math.random();
            if (rand < 0.7) { // 70% de chance pour katakana
                text = katakana[Math.floor(Math.random() * katakana.length)];
            } else if (rand < 0.9) { // 20% de chance pour les chiffres
                text = nums[Math.floor(Math.random() * nums.length)];
            } else { // 10% de chance pour les lettres latines
                text = latin[Math.floor(Math.random() * latin.length)];
            }
            
            // Effet de tête lumineuse pour la première lettre de chaque colonne
            if (this.drops[i] <= 1) {
                this.ctx.fillStyle = `rgba(180, 255, 180, ${col.opacity + 0.2})`;
            } else {
                // Dégradé de vert pour les autres caractères
                const greenValue = 120 + Math.floor(Math.random() * 135);
                this.ctx.fillStyle = `rgba(0, ${greenValue}, 0, ${col.opacity})`;
            }
            
            // Dessiner le caractère
            this.ctx.font = `${col.fontSize}px monospace`;
            this.ctx.fillText(text, col.x, this.drops[i] * col.fontSize);
            
            // Réinitialiser la goutte ou la faire descendre
            if (this.drops[i] * col.fontSize > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }
            
            this.drops[i] += col.speed / 2;
        }
    }
    
    animate() {
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// Initialiser l'effet au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    const matrixRain = new MatrixRain();
});

// Exporter pour une utilisation externe
window.MatrixRain = MatrixRain;
