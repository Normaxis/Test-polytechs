# Sécurité de Polytechs QSE

## Authentification et accès

Aucune requête HTTP ne crée automatiquement un compte. Les administrateurs existants
créent les comptes dans l'application avec un mot de passe temporaire distinct de
l'identifiant (12 caractères minimum), à changer à la première connexion. Une nouvelle
installation vide exige un provisionnement administrateur hors HTTP, par l'opérateur
de la base. Ne jamais remettre un compte administrateur à mot de passe prévisible.

Les mots de passe sont dérivés avec PBKDF2-HMAC-SHA256 (600 000 itérations, sel aléatoire).
Les anciens hash à 100 000 itérations sont migrés à la connexion réussie. Le repli
@noble/hashes conserve exactement la même dérivation lorsque WebCrypto impose une
limite d'itérations. Les sessions expirent après sept jours. Le changement de mot de
passe et de rôle révoque les sessions et les liaisons d'identité du compte concerné.

`QSE_TRUST_SITES_IDENTITY=1` est réservé au Worker derrière le dispatcher authentifié
Sites, qui retire puis injecte les en-têtes d'identité. Ne pas l'activer sur un serveur
accessible directement ou derrière un proxy qui laisse passer ces en-têtes clients.
L'identité stable ne donne aucun droit à elle seule : elle est liée au compte uniquement
après vérification du mot de passe, avec expiration. L'adresse e-mail ne donne jamais
le rôle administrateur. Le rôle courant vient toujours de la base. Les cookies sont
HttpOnly, Secure, SameSite=None et Partitioned pour l'application intégrée.

Les API sensibles appliquent les droits QSSE. Les accidents du travail et leurs
fiches dérivées exigent un administrateur ou un contributeur de l'application avec
une appartenance explicite QSSE/RH. Un niveau d'équipe « consultation » n'autorise pas
l'écriture. La migration 0018 restreint QSSE si aucun réglage n'existait ; les choix
d'accès explicites existants sont conservés. Vérifier ces choix dans l'administration.

## Documents

Les nouveaux fichiers Office doivent être DOCX/XLSX avec une structure ZIP cohérente.
Les limites de taille et de compression, chemins et parties Office sont contrôlées ;
les parties VBA, ActiveX, objets incorporés et liens externes Excel identifiables dans
le répertoire ZIP sont refusés. Les anciens DOC/XLS restent téléchargeables mais ne
peuvent plus être ajoutés. Ce contrôle ne constitue pas une analyse antivirus ni une
preuve de l'absence de contenu actif (PDF, liens ou contenu XML notamment).

La GED vérifie les droits d'écriture du service d'origine et du service de destination
avant d'enregistrer ou soumettre un brouillon. Les données privées d'import restent
hors du miroir GitHub public ; une installation sans catalogue privé démarre sans
import automatique de ces données.

## Vérification et exploitation

- `pnpm test:security` : authentification réelle, migration des hash, révocation,
  limitation des tentatives, accès QSSE/AT, agrégats et pièces jointes.
- `node tests/ged.mjs` : validation documentaire et déplacement interservices interdit.
- `pnpm exec tsc --noEmit --incremental false` : typage.
- `pnpm audit --prod` : avis connus des dépendances au moment de l'exécution.
- GitHub Actions exécute le typage, toutes les suites et l'audit sur push/PR.
  Aucun secret de production n'est nécessaire aux tests. Dependabot propose des mises à jour.

La migration 0018 ajoute uniquement trois tables et un réglage par défaut absent.
Elle conserve les comptes, sessions, documents et données métier. En cas de retour
arrière, conserver la vérification des hash à 600 000 itérations : un ancien binaire
limité à WebCrypto peut ne plus les accepter sur Workers. Ne pas supprimer les
comptes ni restaurer des mots de passe prévisibles pour résoudre une connexion.

Restent des contrôles d'exploitation à déployer/vérifier séparément : protection de
`main` avec revues et vérifications obligatoires, MFA du fournisseur d'identité,
antivirus/quarantaine, alertes sur `security_events`, politique de conservation des
journaux et test de restauration des sauvegardes. La CI seule ne protège pas la branche.
Un audit du code ne constitue ni un test d'intrusion en production ni une certification.
