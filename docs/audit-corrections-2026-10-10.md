# Corrections après audit — 10 octobre 2026

## Livré

- Tickets : ouverture depuis un raccourci après chargement des droits ; recherche serveur sur tout l’historique autorisé, pagination stable, filtres et tri, compteurs autorisés. Conservation des filtres et de la page pendant la session du navigateur, séparée par compte.
- Communications : recherche serveur, pagination, service émetteur, mémorisation des filtres, confirmation de fermeture et modification limitée aux équipes coordonnées.
- Actions : anciennes occurrences d’audit non terminées incluses, y compris après plus de 500 occurrences ; historique terminé exclu des retards. Attribution personnelle par identifiant. Les anciens noms ne sont rapprochés que lorsqu’un seul compte correspond ; les homonymes restent sans identifiant résolu.
- Permissions visibles : DUERP, EPI, fiches QSE, versions GED, routines et communications alignés plus précisément sur les droits de coordination. Les décisions des relecteurs et approbateurs GED restent distinctes des droits de création.
- Navigation : ouverture directe d’un service sans dashboard ; SMI explicitement transversal, sans faux contexte d’équipe.
- Saisie : confirmation avant abandon des indicateurs et des communications ; alerte de sortie de page pour les indicateurs. Confirmation avant application d’un changement de rôle.
- Profil : fenêtre Radix avec gestion du focus, fermeture clavier et retour au déclencheur.
- Charte : Roboto dans les tickets ; catégories sécurité orange, environnement vert, qualité violet cohérentes entre tickets et dashboard ; libellés secondaires plus contrastés ; curseur des contrôles indisponibles corrigé. Badges ISO inchangés.
- Métadonnée temporaire de développement retirée. Quelques nouveaux libellés traduits dans les cinq langues.

Aucune migration de données, aucun changement d’authentification ou de périmètre de partage. Les permissions serveur restent la référence.

## Validation

TypeScript sans erreur. Treize suites automatisées : evrp, ged, gmao, hub-request, hub, profile, quality-actions, security, smi, transactions, unit-dashboard, waste, workflows.

Régressions ajoutées : recherche au-delà de 500 tickets et communications, accents, pagination sans doublons, totaux sans fuite RH, audits anciens au-delà de 500 occurrences, rapprochement de pilotes sans ambiguïté.

Le contrôle interactif du rendu PC/tablette/mobile n’a pas été exécuté : l’outil de navigateur requis par le workflow Sites est indisponible. Les tests automatisés ne remplacent pas cette recette.

## Suites de l’audit non closes par cette livraison

- Harmonisation complète des anciens écrans QSE et DUERP avec le cadre de navigation commun.
- Remplacement des confirmations natives restantes dans les modules historiques et pagination des listes GMAO.
- Remplacement progressif de tous les pilotes historiques saisis en texte par des identifiants persistants, avec interface de résolution manuelle des homonymes. Le rapprochement actuel ne constitue pas une migration.
- Internationalisation exhaustive : certains textes explicatifs restent en français.
- Consolidation exhaustive des CSS historiques et revue responsive/accessibilité en navigateur.
- Très gros volumes : la recherche liste procède par lots de 500 lignes autorisées côté serveur. Les résultats sont paginés, mais le comptage parcourt les lots ; prévoir un index de recherche normalisé si le volume augmente fortement.
