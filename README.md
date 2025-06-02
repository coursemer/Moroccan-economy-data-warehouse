# Punk Eco - Tableau de Bord Économique

## Description
Punk Eco est une application web de tableau de bord économique qui agrège et visualise des données économiques provenant de diverses sources officielles. L'application garantit l'intégrité des données en s'appuyant sur des APIs externes et propose une interface utilisateur intuitive pour explorer les indicateurs économiques du Maroc.

## Fonctionnalités

- Affichage des indicateurs macro-économiques clés (PIB, inflation, chômage, dette publique)
- Visualisation des données sectorielles de l'économie
- Analyse de la répartition régionale de l'activité économique
- Suivi des taux de change et indicateurs monétaires
- Traçabilité des sources de données avec indication claire de leur provenance
- Système de secours pour garantir la disponibilité des données même en cas de panne des APIs

## Architecture

### Backend
- **Framework** : Flask (Python)
- **Base de données** : SQLite (pour le stockage local de secours)
- **APIs externes** :
  - Banque Mondiale (World Bank)
  - Banque Centrale Européenne (ECB)
  - Ministère de l'Économie et des Finances (MEF)

### Frontend
- **Technologies** : HTML5, CSS3, JavaScript
- **Bibliothèques** : 
  - Chart.js pour les visualisations
  - jQuery pour les interactions AJAX
  - Bootstrap pour la mise en page responsive

## Installation

1. Cloner le dépôt
```bash
git clone https://github.com/coursemer/punk_eco.git
cd punk_eco
```

2. Créer un environnement virtuel Python et l'activer
```bash
python3 -m venv venv
source venv/bin/activate  # Sur Windows: venv\Scripts\activate
```

3. Installer les dépendances
```bash
pip install -r requirements.txt
```

4. Lancer l'application
```bash
python app.py
```

5. Accéder à l'application dans votre navigateur
```
http://localhost:5002
```

## Structure du Projet

```
punk_eco/
├── api/                    # Modules d'intégration API
│   ├── ecb.py              # API Banque Centrale Européenne
│   ├── mef.py              # API Ministère de l'Économie et des Finances
│   ├── models.py           # Modèles de données
│   ├── update.py           # Logique de mise à jour des données
│   └── world_bank.py       # API Banque Mondiale
├── static/                 # Ressources statiques
│   ├── css/                # Feuilles de style
│   ├── js/                 # Scripts JavaScript
│   └── img/                # Images et icônes
├── templates/              # Templates HTML
│   └── components/         # Composants réutilisables
├── app.py                  # Point d'entrée de l'application
├── economic_data.db        # Base de données SQLite
└── README.md               # Ce fichier
```

## Utilisation

- La page d'accueil présente un tableau de bord avec les principaux indicateurs économiques
- Les données sont automatiquement mises à jour toutes les 5 minutes
- Les sources de données sont clairement indiquées pour chaque indicateur
- En cas d'indisponibilité des APIs, un message d'avertissement s'affiche pour indiquer l'utilisation de données de secours

## Développement

### Ajout d'une nouvelle source de données

1. Créer un nouveau module dans le dossier `api/`
2. Implémenter les méthodes de récupération des données
3. Mettre à jour `api/update.py` pour intégrer la nouvelle source
4. Modifier `app.py` pour traiter et afficher les nouvelles données

### Personnalisation de l'interface

Les styles peuvent être modifiés dans `static/css/style.css` et les comportements JavaScript dans `static/js/script.js`.

## Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

## Contact

Pour toute question ou suggestion, veuillez contacter [rim.nacerddine@emsi-edu.ma](mailto:rim.nacerddine@emsi-edu.ma).
