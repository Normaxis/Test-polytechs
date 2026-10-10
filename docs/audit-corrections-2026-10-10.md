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

## Deuxième livraison

- Cadre commun de navigation pour les registres QSE et le DUERP, avec conservation des formulaires, historiques, exports et paramètres des comptes.
- Pagination des registres QSE et de l’échéancier. La GMAO avait déjà une pagination de listes : contrôles harmonisés et pagination ajoutée au planning, suppression de sa limite d’affichage à 200 lignes.
- Confirmations de fermeture intégrées dans la GMAO, le DUERP, le plan d’actions, le SMI, les routines et les dotations EPI. La touche Échap ou Annuler conserve les modifications.
- Affectation nominative des responsables QSE et des pilotes DUERP par recherche dans l’annuaire. Identifiant persistant, nom canonique vérifié par le serveur, rejet des comptes inexistants et retrait explicite du rattachement. Aucun remplacement massif des responsables historiques.
- Vue « Affectation à confirmer » dans les actions pour les noms sans compte résolu. Les deux personnes portant le même nom sont distinguées par leur identifiant dans le sélecteur.
- Fermeture d’une fiche QSE : le lien courant est conservé si l’utilisateur annule l’abandon.
- Traductions complémentaires des commandes de confirmation, d’affectation, de maintenance et de prévention dans les cinq langues.

Validation complémentaire : TypeScript, tests de transactions QSE/EVRP (identifiants, homonymes, comptes inexistants, retrait, concurrence, EPI), tests de sécurité et compilation de production. La recette visuelle interactive demeure non exécutée.

## Points restant à valider ou à traiter

- Recette interactive PC/tablette/mobile, clavier et lecteurs d’écran : outil de navigateur requis indisponible dans cet environnement.
- Internationalisation exhaustive des longs textes métier et des messages dynamiques : le catalogue de traduction est enrichi mais reste partiel.
- Consolidation exhaustive des anciennes règles CSS ; la livraison unifie les structures sans supprimer les styles métier encore utilisés.
- Très gros volumes : la recherche liste procède par lots de 500 lignes autorisées côté serveur. Les résultats sont paginés, mais le comptage parcourt les lots ; prévoir un index de recherche normalisé si le volume augmente fortement.
- Attribution des anciens pilotes : décision manuelle depuis les fiches, sans migration arbitraire des homonymes ou des services.
