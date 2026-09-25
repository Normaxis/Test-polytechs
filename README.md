# Gestion QSE Polytechs

Application de pilotage QSE organisée en trois pôles : Environnement, Sécurité et Qualité.

## Fonctionnalités

- Déchets, analyse environnementale et objectifs RSE.
- Accidents du travail, situations dangereuses, DUERP, dotations EPI et plans de prévention.
- Gestion documentaire par liens, registre réglementaire manuel et constats d’amélioration.
- Audits, plan d’actions transversal, actions liées aux fiches d’origine et échéancier commun.
- Statuts et contrôles adaptés à chaque module, conservation des versions et protection contre les modifications concurrentes.
- Exports CSV et démonstration séparée en lecture seule.
- Comptes individuels : lecteur (consultation/export), contributeur (fiches), administrateur (fiches et utilisateurs). Sessions protégées et changement obligatoire du mot de passe initial.
- Module EVRP dédié : 9 unités de travail, 41 fonctions, 680 situations du classeur 2026 et 10 actions PAPRIPACT, avec cotation F × G × IM × ID, révisions et mode opératoire imprimable. Les plages du classeur sont reprises : vert < 8, jaune 8 à moins de 20, orange 20 à 40, rouge > 40 ; les cotations absentes restent neutres.

## Périmètre

Le suivi des AT est interne et ne transmet pas de déclaration officielle. La veille réglementaire est manuelle. Les documents sont référencés par liens ; leurs fichiers ne sont pas stockés par cette version. Les validations ne sont pas des signatures électroniques. La cotation gravité × fréquence est indicative et doit être adaptée à la méthode interne. L’accès au site reste limité par la liste de visiteurs autorisés sur la plateforme d’hébergement. Les notifications automatiques ne sont pas implémentées.

Les comptes administrateurs initiaux sont créés lors du premier accès à l’application. Leurs mots de passe initiaux doivent être remplacés avant toute consultation des fiches. Ne stockez jamais de mots de passe dans le dépôt ni dans des fiches QSE. Un nouvel utilisateur doit aussi être autorisé à visiter le site par la plateforme d’hébergement.

## Évaluation des risques professionnels

Le menu Sécurité → DUERP ouvre `/duerp`. Les données du classeur transmis sont préparées dans le source **privé** du Site, hors du dépôt GitHub public. À la première ouverture par un administrateur, l’import se lance par blocs sans écraser les fiches déjà modifiées. Il peut être repris depuis la page si nécessaire. Un autre déploiement du code démarre sans les données du classeur. Le contenu confidentiel `private/duerp-source.json` ne doit pas être poussé dans un dépôt public.

L’onglet **PAPRIPACT · toutes unités** reprend les actions importées sans remplir les champs vides à leur place. Il présente une année de programme, le pilote, les conditions d’exécution, les ressources, le coût estimé, un indicateur de résultat, le calendrier et la vérification de l’efficacité. Les mesures proposées dans le DUERP sans action correspondante peuvent être reprises en une action liée à un risque ; les doublons textuels sont regroupés par unité et les correspondances suggérées restent à confirmer. La couleur du risque aide l’arbitrage, mais ne constitue pas une priorité décidée par l’entreprise. Une action clôturée exige la date de fin et une vérification renseignée.

Le registre conserve la valeur issue du classeur et calcule séparément F × G × IM × ID. 89 lignes du fichier demandent une vérification, principalement des cotes de fréquence absentes et des résultats Excel en erreur. Une valeur déduite d’un libellé reste signalée et doit être confirmée par l’équipe QSE avant validation. Les risques de la production restent rattachés à UT1 : le fichier ne permet pas d’attribuer chaque risque à UT1a–UT1f. Les effectifs textuels et partagés ne sont pas additionnés.

Les modifications des évaluations et des actions sont historisées. Exportez une copie datée à chaque validation et organisez la conservation durable des versions complètes ; le suivi applicatif actuel ne constitue pas à lui seul un système d’archivage réglementaire de 40 ans. Le mode opératoire est disponible dans le module et renvoie aux références INRS et Code du travail.

## Développement et vérifications

Application React / TypeScript avec Vinext, API Cloudflare Workers et base D1. Les données réelles sont distinctes du code source et ne sont pas incluses dans ce dépôt. Les migrations `drizzle/` doivent être conservées dans leur ordre. Ne pas réécrire une migration déjà appliquée.

- Installation : `pnpm install --frozen-lockfile`
- Tests des règles métier : `node tests/workflows.mjs`
- Vérification TypeScript : `node node_modules/typescript/bin/tsc --noEmit`
- Compilation : `pnpm build`

Le dépôt GitHub conserve le code ; un push seul ne configure pas une nouvelle base de données ni un hébergement. Pour un hébergement indépendant, configurer les bindings Cloudflare et la protection d’accès avant d’exposer des données. Les instructions du socle sont conservées ci-dessous.

---

# vinext-starter

A clean full-stack starter running on [vinext](https://github.com/cloudflare/vinext), with optional Cloudflare D1 and Drizzle support.

## Prerequisites

- Node.js `>=22.13.0`
- Portable: Windows, macOS, or Linux; no Bash required
- Managed Linux: managed Linux runtime with Bash, `flock`, `curl`, `sha256sum`, and GNU `timeout`
- Git is required only for publishing

## Sites Lifecycle

The Sites initializer copies the shared starter and selects managed-linux only when `SITES_MANAGED_LINUX_CONTAINER=1`; otherwise it selects portable. It saves the selection only in ignored `.sites-runtime/execution-profile.json`. Both profiles copy/configure first, then use the plugin's separate `install-dependencies.mjs` step to measure installation independently. Edit source under `app/` and follow the Sites skill for installation, preview, builds, and publishing.

Run `node <plugin-root>/scripts/configure-execution-profile.mjs` only when the profile is unknown for the current checkout and environment. Profile changes do not alter tracked source or require reinstalling otherwise-valid dependencies; restart an existing preview to use the new selection. Do not commit or upload `.sites-runtime/`.

This starter does not use `wrangler.jsonc`.

`install:ci` runs `npm ci` once against the shared lockfile, disables parent-workspace discovery, and includes required dev/optional dependencies despite production/omit settings. Sharp defaults to prebuilt binaries unless explicitly configured otherwise. Do not overlap installers.

- **Portable:** Preserve host HOME, npm cache, registry, proxy, temporary paths, retry/concurrency settings, and lifecycle-script policy. Use `--prefer-offline --no-audit --no-fund`.
- **Managed Linux:** Use the existing project-local HOME/cache/tmp setup and Linux install lock, tarball preflight, and timeout. Restore the image-seeded npm cache only when its lockfile hash matches; retain network fallback. Builds keep their existing timeout. These helpers are not invoked by the portable profile.

`scripts/sites-env.mjs` preserves the caller's HOME, npm cache, proxy, XDG, and temporary-directory configuration while defaulting Wrangler and Miniflare state to the checkout. If npm reports an unwritable cache, select a writable path with `npm_config_cache` for that install. The `dev` and `start` scripts also keep Wrangler logs inside the checkout. Generated `.sites-runtime/` and `.wrangler/` directories are disposable and ignored by Git.

On portable, `npm run dev` uses `vinext dev` with HMR, starting at port 5173. Vinext records the running server in ignored `.vinext/` state, rejects an ordinary duplicate launch, and recovers stale state after a stopped process; exactly simultaneous starts can race. Pass `--port <port>` or `--hostname <host>` after `npm run dev --` when needed; keep portable previews on loopback.

For browser QA on managed Linux, use `sites-preview start`. The project's dev script runs Vite and accepts the supervisor's `--host 0.0.0.0 --port 4173 --strictPort` arguments. The internal browser uses `http://terminal.local:4173/`; it is not a user-facing URL. The supervisor owns the preview lifecycle. The ignored local profile survives the supervisor's cleared process environment.

The portable profile simulates ChatGPT sign-in only for loopback development requests. Visit `/signin-with-chatgpt?return_to=/` to sign in as `local_seedy` (`seedy@sites.test`, display name `Seedy`) and `/signout-with-chatgpt?return_to=/` to sign out. The development cookie preserves that identity across server restarts. Mock auth is disabled in the managed-linux profile and is not included in production builds; hosted authentication remains dispatch-owned.

The Worker uses `vinext/server/fetch-handler`, including Vinext's config-aware image handling. After building, `npm start` runs that Worker locally through Wrangler on `127.0.0.1`, sharing `.wrangler/state` with dev preview and local D1 migrations; it does not deploy the site or simulate sign-in. Use the URL printed by the server. Pass `npm start -- --port <port>` to select a different built-preview port.

Local previews use Miniflare's placeholder `Request.cf` metadata without a network lookup. Set `CLOUDFLARE_CF_FETCH_ENABLED=true` to opt into fetching preview metadata; this setting does not change hosted request metadata.

Local tool usage metrics are disabled by default. Set `WRANGLER_SEND_METRICS=true` to opt in.

## Included Shape

- edit site code under `app/`
- `app/chatgpt-auth.ts` provides optional dispatch-owned ChatGPT sign-in helpers
- `.openai/hosting.json` declares optional Sites D1 and R2 bindings
- `vite.config.ts` simulates declared bindings for local development
- `db/index.ts` reads the D1 binding from the Cloudflare Worker environment
- `db/schema.ts` starts intentionally empty
- `@cloudflare/workers-types` provides Worker types; `cloudflare-env.d.ts` declares optional `DB`/`BUCKET` bindings—update these declarations if binding names change
- `examples/d1/` contains an optional D1 example surface
- `drizzle.config.ts` supports local migration generation when needed

## Workspace Auth Headers

Signed-in visitors receive both `oai-authenticated-user-id` and `oai-authenticated-user-email`. Private Sites require every visitor to sign in; public Sites may also have anonymous visitors, for whom neither header is present.

The user ID is stable for the same user on the same Site and different across Sites. Use it as the durable user key; use email and name for display or contact purposes.

SIWC-authenticated workspace sites may also receive `oai-authenticated-user-full-name` when the user's SIWC profile has a non-empty `name` claim. The full-name value is percent-encoded UTF-8 and is accompanied by `oai-authenticated-user-full-name-encoding: percent-encoded-utf-8`.

Treat the full name as optional and fall back to email when it is absent:

```tsx
import { headers } from "next/headers";

export default async function Home() {
  const requestHeaders = await headers();
  const userId = requestHeaders.get("oai-authenticated-user-id");
  const email = requestHeaders.get("oai-authenticated-user-email");
  const encodedFullName = requestHeaders.get("oai-authenticated-user-full-name");
  const fullName =
    encodedFullName &&
    requestHeaders.get("oai-authenticated-user-full-name-encoding") ===
      "percent-encoded-utf-8"
      ? decodeURIComponent(encodedFullName)
      : null;

  const displayName = fullName ?? email;
  // ...
}
```

## Optional Dispatch-Owned ChatGPT Sign-In

Import the ready-to-use helpers from `app/chatgpt-auth.ts` when the site needs optional or required ChatGPT sign-in:

- Use `getChatGPTUser()` for optional signed-in UI.
- Use the returned `userId` as the stable user key for user-owned records; do not use email as a durable identifier.
- Use `requireChatGPTUser(returnTo)` for server-rendered pages that should send anonymous visitors through Sign in with ChatGPT.
- In a Server Component, start sign-in with `<a href={chatGPTSignInPath(returnTo)} target="_top">`. The auth helper module is server-only; do not import it into a Client Component.
- Do not use `fetch`, XHR, a client-side router, or a framework link that can prefetch the sign-in route. SIWC must start as a top-level navigation.
- Never request the AuthAPI authorization endpoint directly. The dispatch-owned `/signin-with-chatgpt` route must start the SIWC flow.
- Use `chatGPTSignOutPath(returnTo)` for browser sign-out links or actions.
- Pass a same-origin relative `returnTo` path for the destination after sign-in or sign-out. The helper validates and safely encodes it.
- Mark protected pages with `export const dynamic = "force-dynamic"` because they depend on per-request identity headers.

Dispatch owns `/signin-with-chatgpt`, `/signout-with-chatgpt`, `/callback`, the OAuth cookies, and identity header injection. Do not implement app routes for those reserved paths. Routes that do not import and call the helper remain anonymous-compatible.

SIWC establishes identity only; it does not prove workspace membership. Use the Sites hosting platform's access policy controls for workspace-wide restrictions, or enforce explicit server-side membership or allowlist checks.

Use SIWC for account pages, user-specific dashboards, saved records, and write actions tied to the current ChatGPT user. Leave public content anonymous.

## Local D1 migrations

For a D1-backed local preview, generate SQL with `npm run db:generate`. Build once through the Sites skill's build entrypoint (or `npm run build` for standalone use) to generate `dist/server/wrangler.json`, rebuilding if bindings change. From the project root, apply each pending migration in order:

```sh
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_example.sql
```

Replace the filename with the pending migration and `DB` with your D1 binding name if different. Use `.wrangler/state`, not `.wrangler/state/v3`; Wrangler adds the versioned directories. Do not replay migrations already applied locally. This updates only the preview database; publishing applies production migrations separately.

## Diagnostic Commands

- `npm run install:ci`: perform the one locked dependency install
- `npm run dev`: start the Vite/Vinext development server
- `npm run build`: build the deployable Sites artifact
- `npm run start`: preview the built Worker locally with D1/R2 support
- `npm run db:generate`: generate Drizzle migrations after schema changes

When using the Sites plugin, follow its skill instructions for installation, builds, and publishing. These npm commands remain available for standalone use.

The portable build runs Vinext directly without a host `timeout` command. The managed-linux build uses `scripts/build-verified.sh` and its existing `SITES_BUILD_TIMEOUT` setting.

## Learn More

- [vinext Documentation](https://github.com/cloudflare/vinext)
- [Drizzle D1 Guide](https://orm.drizzle.team/docs/get-started/d1-new)

### Équipes, rangs et tableaux de bord

Le bandeau gauche organise Direction (rang 1) et les services RH, QSSE,
Production et R&D (rang 2). Les administrateurs peuvent ajouter ou modifier
les équipes, leur rang et leur rattachement. Un service de rang 2 doit être
rattaché à une équipe de rang 1 ; une équipe possédant des services ne peut
pas être rétrogradée. Le rang ne modifie jamais les droits d’accès.

Dans `/unites`, **Ouvrir l’équipe** affiche tous ses tableaux. **Nouveau tableau**
crée une configuration indépendante : titre, équipe et périmètre DUERP
(aucun, une unité ou tout le site). **Personnaliser** permet d'ajouter, retirer,
déplacer et agrandir les blocs, renseigner les notes et indicateurs manuels,
renommer le tableau ou le déplacer dans une autre équipe. **Enregistrer le tableau**
conserve les modifications ; **Annuler** revient à la version précédente.
Les lecteurs consultent ; contributeurs et administrateurs créent et modifient
les tableaux. Les modifications concurrentes sont protégées par révision.

Migration 0007 : les tableaux par unité existants sont copiés dans QSSE,
avec contenu, révision et périmètre conservés. Les liens `/unites?unit=UT1`
restent valides. Aucun rattachement d’unité à un service métier n’est déduit.
Les nouveaux tableaux d'équipe commencent avec des notes et un indicateur manuel ;
l’utilisateur choisit explicitement un périmètre pour les blocs automatiques.

Les blocs DUERP utilisent les cotations et couleurs de l'évaluation, avec les
anomalies signalées séparément. Les actions ouvertes couvrent toutes les années ;
le PAPRIPACT est filtré par année. Une échéance du jour n'est pas en retard (date
Europe/Paris). Une action clôturée n'entre plus dans les retards. Les indicateurs
personnalisés restent des saisies manuelles datées, sans comparaison automatique
à l'objectif. Les fiches QSE générales ne sont pas agrégées par unité tant qu'elles
ne disposent pas d'un rattachement explicite à l'unité.

API : `GET /api/dashboards` (arborescence), `GET /api/dashboards?id=…`
(contenu et données du périmètre), `POST /api/dashboards` avec les actions
`team`, `create` ou `save`. Tables `teams` et `team_dashboards`.
