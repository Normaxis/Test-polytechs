CREATE TABLE `smi_events` (
	`id` text PRIMARY KEY NOT NULL,
	`entity_id` text NOT NULL,
	`action` text NOT NULL,
	`snapshot` text NOT NULL,
	`actor` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_smi_events_entity` ON `smi_events` (`entity_id`);--> statement-breakpoint
CREATE TABLE `smi_document_links` (
	`document_id` text NOT NULL,
	`requirement_id` text NOT NULL,
	`confirmed` integer DEFAULT 0 NOT NULL,
	`note` text DEFAULT '' NOT NULL,
	`revision` integer DEFAULT 1 NOT NULL,
	`updated_at` text NOT NULL,
	PRIMARY KEY(`document_id`, `requirement_id`),
	FOREIGN KEY (`document_id`) REFERENCES `ged_documents`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`requirement_id`) REFERENCES `smi_requirements`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_smi_links_requirement` ON `smi_document_links` (`requirement_id`);--> statement-breakpoint
CREATE TABLE `smi_evidence_links` (
	`id` text PRIMARY KEY NOT NULL,
	`requirement_id` text NOT NULL,
	`kind` text NOT NULL,
	`target_id` text NOT NULL,
	`note` text NOT NULL,
	`revision` integer NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`requirement_id`) REFERENCES `smi_requirements`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_smi_evidence_target` ON `smi_evidence_links` (`requirement_id`,`kind`,`target_id`);--> statement-breakpoint
CREATE TABLE `smi_requirements` (
	`id` text PRIMARY KEY NOT NULL,
	`standard_id` text NOT NULL,
	`chapter` integer NOT NULL,
	`code` text NOT NULL,
	`data` text NOT NULL,
	`revision` integer DEFAULT 1 NOT NULL,
	FOREIGN KEY (`standard_id`) REFERENCES `smi_standards`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_smi_requirement_code` ON `smi_requirements` (`standard_id`,`code`);--> statement-breakpoint
CREATE INDEX `idx_smi_requirement_chapter` ON `smi_requirements` (`chapter`);--> statement-breakpoint
CREATE TABLE `smi_standards` (
	`id` text PRIMARY KEY NOT NULL,
	`data` text NOT NULL,
	`revision` integer DEFAULT 1 NOT NULL
);

--> statement-breakpoint
INSERT INTO smi_standards(id,data,revision) VALUES('iso9001-2026','{"id":"iso9001-2026","badge":"Q","name":"ISO 9001","edition":"2026","color":"#005eaa","source":"https://www.iso.org/fr/standard/9001","active":true}',1);
--> statement-breakpoint
INSERT INTO smi_standards(id,data,revision) VALUES('iso14001-2026','{"id":"iso14001-2026","badge":"E","name":"ISO 14001","edition":"2026","color":"#238151","source":"https://www.iso.org/fr/standard/14001","active":true}',1);
--> statement-breakpoint
INSERT INTO smi_standards(id,data,revision) VALUES('iso45001-2018','{"id":"iso45001-2018","badge":"S","name":"ISO 45001","edition":"2018 + Amd 1:2024","color":"#c34949","source":"https://www.iso.org/fr/standard/88428.html","active":true}',1);
--> statement-breakpoint
INSERT INTO smi_requirements(id,standard_id,chapter,code,data,revision) VALUES('iso9001-2026:4.1','iso9001-2026',4,'4.1','{"id":"iso9001-2026:4.1","standard_id":"iso9001-2026","chapter":4,"code":"4.1","title":"Compréhension du contexte","topic":"context","guidance":"Analyser les enjeux internes et externes ; examiner la pertinence du changement climatique.","examples":["Analyse du contexte","SWOT","PESTEL","Analyse des enjeux"],"active":true,"revision":1}',1);
--> statement-breakpoint
INSERT INTO smi_requirements(id,standard_id,chapter,code,data,revision) VALUES('iso9001-2026:4.2','iso9001-2026',4,'4.2','{"id":"iso9001-2026:4.2","standard_id":"iso9001-2026","chapter":4,"code":"4.2","title":"Parties intéressées","topic":"stakeholders","guidance":"Identifier les parties concernées et les attentes à prendre en compte, dont celles liées au climat.","examples":["Matrice des parties intéressées"],"active":true,"revision":1}',1);
--> statement-breakpoint
INSERT INTO smi_requirements(id,standard_id,chapter,code,data,revision) VALUES('iso9001-2026:4.3','iso9001-2026',4,'4.3','{"id":"iso9001-2026:4.3","standard_id":"iso9001-2026","chapter":4,"code":"4.3","title":"Périmètre du système","topic":"scope","guidance":"Définir les activités et sites compris dans le système.","examples":["Périmètre du SMI","Cartographie des sites"],"active":true,"revision":1}',1);
--> statement-breakpoint
INSERT INTO smi_requirements(id,standard_id,chapter,code,data,revision) VALUES('iso9001-2026:4.4','iso9001-2026',4,'4.4','{"id":"iso9001-2026:4.4","standard_id":"iso9001-2026","chapter":4,"code":"4.4","title":"Organisation du système","topic":"system","guidance":"Décrire le fonctionnement des processus et leurs interactions.","examples":["Manuel SMI","Cartographie des processus"],"active":true,"revision":1}',1);
--> statement-breakpoint
INSERT INTO smi_requirements(id,standard_id,chapter,code,data,revision) VALUES('iso9001-2026:5.1','iso9001-2026',5,'5.1','{"id":"iso9001-2026:5.1","standard_id":"iso9001-2026","chapter":5,"code":"5.1","title":"Engagement de la direction","topic":"leadership","guidance":"Démontrer le pilotage, les moyens et la mobilisation de la direction.","examples":["Revue de direction","Engagement de la direction"],"active":true,"revision":1}',1);
--> statement-breakpoint
INSERT INTO smi_requirements(id,standard_id,chapter,code,data,revision) VALUES('iso9001-2026:5.2','iso9001-2026',5,'5.2','{"id":"iso9001-2026:5.2","standard_id":"iso9001-2026","chapter":5,"code":"5.2","title":"Politique et orientations","topic":"policy","guidance":"Partager des orientations adaptées au contexte.","examples":["Politique QSSE"],"active":true,"revision":1}',1);
--> statement-breakpoint
INSERT INTO smi_requirements(id,standard_id,chapter,code,data,revision) VALUES('iso9001-2026:5.3','iso9001-2026',5,'5.3','{"id":"iso9001-2026:5.3","standard_id":"iso9001-2026","chapter":5,"code":"5.3","title":"Responsabilités et autorités","topic":"roles","guidance":"Identifier les missions, responsabilités et délégations.","examples":["Organigramme","Fiches de fonction"],"active":true,"revision":1}',1);
--> statement-breakpoint
INSERT INTO smi_requirements(id,standard_id,chapter,code,data,revision) VALUES('iso9001-2026:6.1','iso9001-2026',6,'6.1','{"id":"iso9001-2026:6.1","standard_id":"iso9001-2026","chapter":6,"code":"6.1","title":"Risques et opportunités","topic":"risks","guidance":"Identifier, évaluer et traiter les risques et opportunités propres à chaque référentiel. Distinguer le traitement des risques et des opportunités (§6.1.2 et §6.1.3).","examples":["Matrice risques et opportunités"],"active":true,"revision":1}',1);
--> statement-breakpoint
INSERT INTO smi_requirements(id,standard_id,chapter,code,data,revision) VALUES('iso9001-2026:6.2','iso9001-2026',6,'6.2','{"id":"iso9001-2026:6.2","standard_id":"iso9001-2026","chapter":6,"code":"6.2","title":"Objectifs et programme","topic":"objectives","guidance":"Fixer les objectifs, les moyens, les pilotes et le suivi des résultats.","examples":["Programme QSSE","Plan d’actions"],"active":true,"revision":1}',1);
--> statement-breakpoint
INSERT INTO smi_requirements(id,standard_id,chapter,code,data,revision) VALUES('iso9001-2026:7.1','iso9001-2026',7,'7.1','{"id":"iso9001-2026:7.1","standard_id":"iso9001-2026","chapter":7,"code":"7.1","title":"Moyens disponibles","topic":"resources","guidance":"Justifier les ressources nécessaires au système.","examples":["Budget","Plan de maintenance"],"active":true,"revision":1}',1);
--> statement-breakpoint
INSERT INTO smi_requirements(id,standard_id,chapter,code,data,revision) VALUES('iso9001-2026:7.2','iso9001-2026',7,'7.2','{"id":"iso9001-2026:7.2","standard_id":"iso9001-2026","chapter":7,"code":"7.2","title":"Compétences","topic":"skills","guidance":"Démontrer les compétences nécessaires et l’efficacité des formations.","examples":["Matrice de compétences","Habilitations","Plan de formation"],"active":true,"revision":1}',1);
--> statement-breakpoint
INSERT INTO smi_requirements(id,standard_id,chapter,code,data,revision) VALUES('iso9001-2026:7.3','iso9001-2026',7,'7.3','{"id":"iso9001-2026:7.3","standard_id":"iso9001-2026","chapter":7,"code":"7.3","title":"Sensibilisation des équipes","topic":"awareness","guidance":"S’assurer que chacun comprend sa contribution.","examples":["Accueil QSSE","Supports de sensibilisation"],"active":true,"revision":1}',1);
--> statement-breakpoint
INSERT INTO smi_requirements(id,standard_id,chapter,code,data,revision) VALUES('iso9001-2026:7.4','iso9001-2026',7,'7.4','{"id":"iso9001-2026:7.4","standard_id":"iso9001-2026","chapter":7,"code":"7.4","title":"Communication","topic":"communication","guidance":"Organiser les échanges internes et externes pertinents.","examples":["Plan de communication"],"active":true,"revision":1}',1);
--> statement-breakpoint
INSERT INTO smi_requirements(id,standard_id,chapter,code,data,revision) VALUES('iso9001-2026:7.5','iso9001-2026',7,'7.5','{"id":"iso9001-2026:7.5","standard_id":"iso9001-2026","chapter":7,"code":"7.5","title":"Maîtrise documentaire","topic":"documents","guidance":"Maîtriser la création, l’accès, l’utilisation et la conservation des informations.","examples":["Procédure GED","Liste des documents applicables"],"active":true,"revision":1}',1);
--> statement-breakpoint
INSERT INTO smi_requirements(id,standard_id,chapter,code,data,revision) VALUES('iso9001-2026:8.1','iso9001-2026',8,'8.1','{"id":"iso9001-2026:8.1","standard_id":"iso9001-2026","chapter":8,"code":"8.1","title":"Maîtrise opérationnelle","topic":"operations","guidance":"Organiser et maîtriser les activités, y compris les prestations externes pertinentes.","examples":["Modes opératoires","Plans de contrôle","Plan de prévention"],"active":true,"revision":1}',1);
--> statement-breakpoint
INSERT INTO smi_requirements(id,standard_id,chapter,code,data,revision) VALUES('iso9001-2026:9.1','iso9001-2026',9,'9.1','{"id":"iso9001-2026:9.1","standard_id":"iso9001-2026","chapter":9,"code":"9.1","title":"Mesure des performances","topic":"monitoring","guidance":"Suivre les résultats du système et évaluer les performances.","examples":["Tableau de bord QSSE"],"active":true,"revision":1}',1);
--> statement-breakpoint
INSERT INTO smi_requirements(id,standard_id,chapter,code,data,revision) VALUES('iso9001-2026:9.2','iso9001-2026',9,'9.2','{"id":"iso9001-2026:9.2","standard_id":"iso9001-2026","chapter":9,"code":"9.2","title":"Audits internes","topic":"audits","guidance":"Planifier les audits, restituer les constats et suivre les suites données.","examples":["Programme d’audit","Rapport audit Qualité","Rapport audit Environnement","Rapport audit SST"],"active":true,"revision":1}',1);
--> statement-breakpoint
INSERT INTO smi_requirements(id,standard_id,chapter,code,data,revision) VALUES('iso9001-2026:9.3','iso9001-2026',9,'9.3','{"id":"iso9001-2026:9.3","standard_id":"iso9001-2026","chapter":9,"code":"9.3","title":"Revue de direction","topic":"review","guidance":"Faire le bilan du système et tracer les décisions prises.","examples":["Compte rendu de revue de direction"],"active":true,"revision":1}',1);
--> statement-breakpoint
INSERT INTO smi_requirements(id,standard_id,chapter,code,data,revision) VALUES('iso9001-2026:10.2','iso9001-2026',10,'10.2','{"id":"iso9001-2026:10.2","standard_id":"iso9001-2026","chapter":10,"code":"10.2","title":"Écarts et actions correctives","topic":"corrective","guidance":"Traiter les écarts, rechercher les causes et vérifier les résultats.","examples":["Fiche de non-conformité","5 Pourquoi","Ishikawa"],"active":true,"revision":1}',1);
--> statement-breakpoint
INSERT INTO smi_requirements(id,standard_id,chapter,code,data,revision) VALUES('iso9001-2026:6.3','iso9001-2026',6,'6.3','{"id":"iso9001-2026:6.3","standard_id":"iso9001-2026","chapter":6,"code":"6.3","title":"Changements planifiés","topic":"changes","guidance":"Préparer les évolutions du système.","examples":["Fiche de changement"],"active":true,"revision":1}',1);
--> statement-breakpoint
INSERT INTO smi_requirements(id,standard_id,chapter,code,data,revision) VALUES('iso9001-2026:8.2','iso9001-2026',8,'8.2','{"id":"iso9001-2026:8.2","standard_id":"iso9001-2026","chapter":8,"code":"8.2","title":"Besoins clients","topic":"customer","guidance":"Préciser les engagements et les échanges avec les clients.","examples":["Revue de contrat","Cahier des charges"],"active":true,"revision":1}',1);
--> statement-breakpoint
INSERT INTO smi_requirements(id,standard_id,chapter,code,data,revision) VALUES('iso9001-2026:8.3','iso9001-2026',8,'8.3','{"id":"iso9001-2026:8.3","standard_id":"iso9001-2026","chapter":8,"code":"8.3","title":"Conception","topic":"design","guidance":"Maîtriser les études et développements.","examples":["Dossier de conception"],"active":true,"revision":1}',1);
--> statement-breakpoint
INSERT INTO smi_requirements(id,standard_id,chapter,code,data,revision) VALUES('iso9001-2026:8.4','iso9001-2026',8,'8.4','{"id":"iso9001-2026:8.4","standard_id":"iso9001-2026","chapter":8,"code":"8.4","title":"Fournisseurs et sous-traitants","topic":"suppliers","guidance":"Évaluer et suivre les prestations externes.","examples":["Évaluation fournisseurs"],"active":true,"revision":1}',1);
--> statement-breakpoint
INSERT INTO smi_requirements(id,standard_id,chapter,code,data,revision) VALUES('iso9001-2026:8.5','iso9001-2026',8,'8.5','{"id":"iso9001-2026:8.5","standard_id":"iso9001-2026","chapter":8,"code":"8.5","title":"Production et prestation","topic":"production","guidance":"Maîtriser la réalisation, la traçabilité et les changements.","examples":["Dossier de lot","Instructions de fabrication"],"active":true,"revision":1}',1);
--> statement-breakpoint
INSERT INTO smi_requirements(id,standard_id,chapter,code,data,revision) VALUES('iso9001-2026:8.6','iso9001-2026',8,'8.6','{"id":"iso9001-2026:8.6","standard_id":"iso9001-2026","chapter":8,"code":"8.6","title":"Libération","topic":"release","guidance":"Tracer les contrôles avant mise à disposition.","examples":["Certificat de conformité"],"active":true,"revision":1}',1);
--> statement-breakpoint
INSERT INTO smi_requirements(id,standard_id,chapter,code,data,revision) VALUES('iso9001-2026:8.7','iso9001-2026',8,'8.7','{"id":"iso9001-2026:8.7","standard_id":"iso9001-2026","chapter":8,"code":"8.7","title":"Produits non conformes","topic":"nonconforming-output","guidance":"Identifier les produits ou prestations non conformes et leur traitement.","examples":["Fiche de blocage"],"active":true,"revision":1}',1);
--> statement-breakpoint
INSERT INTO smi_requirements(id,standard_id,chapter,code,data,revision) VALUES('iso9001-2026:10.1','iso9001-2026',10,'10.1','{"id":"iso9001-2026:10.1","standard_id":"iso9001-2026","chapter":10,"code":"10.1","title":"Progrès continus","topic":"improvement","guidance":"Améliorer les résultats du système.","examples":["Plan de progrès"],"active":true,"revision":1}',1);
--> statement-breakpoint
INSERT INTO smi_requirements(id,standard_id,chapter,code,data,revision) VALUES('iso14001-2026:4.1','iso14001-2026',4,'4.1','{"id":"iso14001-2026:4.1","standard_id":"iso14001-2026","chapter":4,"code":"4.1","title":"Compréhension du contexte","topic":"context","guidance":"Analyser les enjeux internes et externes ; examiner la pertinence du changement climatique.","examples":["Analyse du contexte","SWOT","PESTEL","Analyse des enjeux"],"active":true,"revision":1}',1);
--> statement-breakpoint
INSERT INTO smi_requirements(id,standard_id,chapter,code,data,revision) VALUES('iso14001-2026:4.2','iso14001-2026',4,'4.2','{"id":"iso14001-2026:4.2","standard_id":"iso14001-2026","chapter":4,"code":"4.2","title":"Parties intéressées","topic":"stakeholders","guidance":"Identifier les parties concernées et les attentes à prendre en compte, dont celles liées au climat.","examples":["Matrice des parties intéressées"],"active":true,"revision":1}',1);
--> statement-breakpoint
INSERT INTO smi_requirements(id,standard_id,chapter,code,data,revision) VALUES('iso14001-2026:4.3','iso14001-2026',4,'4.3','{"id":"iso14001-2026:4.3","standard_id":"iso14001-2026","chapter":4,"code":"4.3","title":"Périmètre du système","topic":"scope","guidance":"Définir les activités et sites compris dans le système.","examples":["Périmètre du SMI","Cartographie des sites"],"active":true,"revision":1}',1);
--> statement-breakpoint
INSERT INTO smi_requirements(id,standard_id,chapter,code,data,revision) VALUES('iso14001-2026:4.4','iso14001-2026',4,'4.4','{"id":"iso14001-2026:4.4","standard_id":"iso14001-2026","chapter":4,"code":"4.4","title":"Organisation du système","topic":"system","guidance":"Décrire le fonctionnement des processus et leurs interactions.","examples":["Manuel SMI","Cartographie des processus"],"active":true,"revision":1}',1);
--> statement-breakpoint
INSERT INTO smi_requirements(id,standard_id,chapter,code,data,revision) VALUES('iso14001-2026:5.1','iso14001-2026',5,'5.1','{"id":"iso14001-2026:5.1","standard_id":"iso14001-2026","chapter":5,"code":"5.1","title":"Engagement de la direction","topic":"leadership","guidance":"Démontrer le pilotage, les moyens et la mobilisation de la direction.","examples":["Revue de direction","Engagement de la direction"],"active":true,"revision":1}',1);
--> statement-breakpoint
INSERT INTO smi_requirements(id,standard_id,chapter,code,data,revision) VALUES('iso14001-2026:5.2','iso14001-2026',5,'5.2','{"id":"iso14001-2026:5.2","standard_id":"iso14001-2026","chapter":5,"code":"5.2","title":"Politique et orientations","topic":"policy","guidance":"Partager des orientations adaptées au contexte.","examples":["Politique QSSE"],"active":true,"revision":1}',1);
--> statement-breakpoint
INSERT INTO smi_requirements(id,standard_id,chapter,code,data,revision) VALUES('iso14001-2026:5.3','iso14001-2026',5,'5.3','{"id":"iso14001-2026:5.3","standard_id":"iso14001-2026","chapter":5,"code":"5.3","title":"Responsabilités et autorités","topic":"roles","guidance":"Identifier les missions, responsabilités et délégations.","examples":["Organigramme","Fiches de fonction"],"active":true,"revision":1}',1);
--> statement-breakpoint
INSERT INTO smi_requirements(id,standard_id,chapter,code,data,revision) VALUES('iso14001-2026:6.1','iso14001-2026',6,'6.1','{"id":"iso14001-2026:6.1","standard_id":"iso14001-2026","chapter":6,"code":"6.1","title":"Risques et opportunités","topic":"risks","guidance":"Identifier, évaluer et traiter les risques et opportunités propres à chaque référentiel. Inclure les aspects environnementaux, obligations de conformité et plans associés (§6.1.2 à 6.1.5).","examples":["Matrice risques et opportunités","Analyse environnementale"],"active":true,"revision":1}',1);
--> statement-breakpoint
INSERT INTO smi_requirements(id,standard_id,chapter,code,data,revision) VALUES('iso14001-2026:6.2','iso14001-2026',6,'6.2','{"id":"iso14001-2026:6.2","standard_id":"iso14001-2026","chapter":6,"code":"6.2","title":"Objectifs et programme","topic":"objectives","guidance":"Fixer les objectifs, les moyens, les pilotes et le suivi des résultats.","examples":["Programme QSSE","Plan d’actions"],"active":true,"revision":1}',1);
--> statement-breakpoint
INSERT INTO smi_requirements(id,standard_id,chapter,code,data,revision) VALUES('iso14001-2026:7.1','iso14001-2026',7,'7.1','{"id":"iso14001-2026:7.1","standard_id":"iso14001-2026","chapter":7,"code":"7.1","title":"Moyens disponibles","topic":"resources","guidance":"Justifier les ressources nécessaires au système.","examples":["Budget","Plan de maintenance"],"active":true,"revision":1}',1);
--> statement-breakpoint
INSERT INTO smi_requirements(id,standard_id,chapter,code,data,revision) VALUES('iso14001-2026:7.2','iso14001-2026',7,'7.2','{"id":"iso14001-2026:7.2","standard_id":"iso14001-2026","chapter":7,"code":"7.2","title":"Compétences","topic":"skills","guidance":"Démontrer les compétences nécessaires et l’efficacité des formations.","examples":["Matrice de compétences","Habilitations","Plan de formation"],"active":true,"revision":1}',1);
--> statement-breakpoint
INSERT INTO smi_requirements(id,standard_id,chapter,code,data,revision) VALUES('iso14001-2026:7.3','iso14001-2026',7,'7.3','{"id":"iso14001-2026:7.3","standard_id":"iso14001-2026","chapter":7,"code":"7.3","title":"Sensibilisation des équipes","topic":"awareness","guidance":"S’assurer que chacun comprend sa contribution.","examples":["Accueil QSSE","Supports de sensibilisation"],"active":true,"revision":1}',1);
--> statement-breakpoint
INSERT INTO smi_requirements(id,standard_id,chapter,code,data,revision) VALUES('iso14001-2026:7.4','iso14001-2026',7,'7.4','{"id":"iso14001-2026:7.4","standard_id":"iso14001-2026","chapter":7,"code":"7.4","title":"Communication","topic":"communication","guidance":"Organiser les échanges internes et externes pertinents.","examples":["Plan de communication"],"active":true,"revision":1}',1);
--> statement-breakpoint
INSERT INTO smi_requirements(id,standard_id,chapter,code,data,revision) VALUES('iso14001-2026:7.5','iso14001-2026',7,'7.5','{"id":"iso14001-2026:7.5","standard_id":"iso14001-2026","chapter":7,"code":"7.5","title":"Maîtrise documentaire","topic":"documents","guidance":"Maîtriser la création, l’accès, l’utilisation et la conservation des informations.","examples":["Procédure GED","Liste des documents applicables"],"active":true,"revision":1}',1);
--> statement-breakpoint
INSERT INTO smi_requirements(id,standard_id,chapter,code,data,revision) VALUES('iso14001-2026:8.1','iso14001-2026',8,'8.1','{"id":"iso14001-2026:8.1","standard_id":"iso14001-2026","chapter":8,"code":"8.1","title":"Maîtrise opérationnelle","topic":"operations","guidance":"Organiser et maîtriser les activités, y compris les prestations externes pertinentes.","examples":["Modes opératoires","Plans de contrôle","Plan de prévention"],"active":true,"revision":1}',1);
--> statement-breakpoint
INSERT INTO smi_requirements(id,standard_id,chapter,code,data,revision) VALUES('iso14001-2026:9.1','iso14001-2026',9,'9.1','{"id":"iso14001-2026:9.1","standard_id":"iso14001-2026","chapter":9,"code":"9.1","title":"Mesure des performances","topic":"monitoring","guidance":"Suivre les résultats du système et évaluer les performances.","examples":["Tableau de bord QSSE"],"active":true,"revision":1}',1);
--> statement-breakpoint
INSERT INTO smi_requirements(id,standard_id,chapter,code,data,revision) VALUES('iso14001-2026:9.2','iso14001-2026',9,'9.2','{"id":"iso14001-2026:9.2","standard_id":"iso14001-2026","chapter":9,"code":"9.2","title":"Audits internes","topic":"audits","guidance":"Planifier les audits, restituer les constats et suivre les suites données.","examples":["Programme d’audit","Rapport audit Qualité","Rapport audit Environnement","Rapport audit SST"],"active":true,"revision":1}',1);
--> statement-breakpoint
INSERT INTO smi_requirements(id,standard_id,chapter,code,data,revision) VALUES('iso14001-2026:9.3','iso14001-2026',9,'9.3','{"id":"iso14001-2026:9.3","standard_id":"iso14001-2026","chapter":9,"code":"9.3","title":"Revue de direction","topic":"review","guidance":"Faire le bilan du système et tracer les décisions prises.","examples":["Compte rendu de revue de direction"],"active":true,"revision":1}',1);
--> statement-breakpoint
INSERT INTO smi_requirements(id,standard_id,chapter,code,data,revision) VALUES('iso14001-2026:10.2','iso14001-2026',10,'10.2','{"id":"iso14001-2026:10.2","standard_id":"iso14001-2026","chapter":10,"code":"10.2","title":"Écarts et actions correctives","topic":"corrective","guidance":"Traiter les écarts, rechercher les causes et vérifier les résultats.","examples":["Fiche de non-conformité","5 Pourquoi","Ishikawa"],"active":true,"revision":1}',1);
--> statement-breakpoint
INSERT INTO smi_requirements(id,standard_id,chapter,code,data,revision) VALUES('iso14001-2026:6.3','iso14001-2026',6,'6.3','{"id":"iso14001-2026:6.3","standard_id":"iso14001-2026","chapter":6,"code":"6.3","title":"Changements planifiés","topic":"changes","guidance":"Préparer les changements ayant des effets sur le système environnemental.","examples":["Fiche de changement"],"active":true,"revision":1}',1);
--> statement-breakpoint
INSERT INTO smi_requirements(id,standard_id,chapter,code,data,revision) VALUES('iso14001-2026:8.2','iso14001-2026',8,'8.2','{"id":"iso14001-2026:8.2","standard_id":"iso14001-2026","chapter":8,"code":"8.2","title":"Situations d’urgence","topic":"emergency","guidance":"Préparer les réponses et tester leur efficacité.","examples":["Plan d’urgence","Exercices"],"active":true,"revision":1}',1);
--> statement-breakpoint
INSERT INTO smi_requirements(id,standard_id,chapter,code,data,revision) VALUES('iso14001-2026:10.1','iso14001-2026',10,'10.1','{"id":"iso14001-2026:10.1","standard_id":"iso14001-2026","chapter":10,"code":"10.1","title":"Progrès continus","topic":"improvement","guidance":"Améliorer les résultats du système.","examples":["Plan de progrès"],"active":true,"revision":1}',1);
--> statement-breakpoint
INSERT INTO smi_requirements(id,standard_id,chapter,code,data,revision) VALUES('iso45001-2018:4.1','iso45001-2018',4,'4.1','{"id":"iso45001-2018:4.1","standard_id":"iso45001-2018","chapter":4,"code":"4.1","title":"Compréhension du contexte","topic":"context","guidance":"Analyser les enjeux internes et externes ; examiner la pertinence du changement climatique.","examples":["Analyse du contexte","SWOT","PESTEL","Analyse des enjeux"],"active":true,"revision":1}',1);
--> statement-breakpoint
INSERT INTO smi_requirements(id,standard_id,chapter,code,data,revision) VALUES('iso45001-2018:4.2','iso45001-2018',4,'4.2','{"id":"iso45001-2018:4.2","standard_id":"iso45001-2018","chapter":4,"code":"4.2","title":"Parties intéressées","topic":"stakeholders","guidance":"Identifier les parties concernées et les attentes à prendre en compte, dont celles liées au climat.","examples":["Matrice des parties intéressées"],"active":true,"revision":1}',1);
--> statement-breakpoint
INSERT INTO smi_requirements(id,standard_id,chapter,code,data,revision) VALUES('iso45001-2018:4.3','iso45001-2018',4,'4.3','{"id":"iso45001-2018:4.3","standard_id":"iso45001-2018","chapter":4,"code":"4.3","title":"Périmètre du système","topic":"scope","guidance":"Définir les activités et sites compris dans le système.","examples":["Périmètre du SMI","Cartographie des sites"],"active":true,"revision":1}',1);
--> statement-breakpoint
INSERT INTO smi_requirements(id,standard_id,chapter,code,data,revision) VALUES('iso45001-2018:4.4','iso45001-2018',4,'4.4','{"id":"iso45001-2018:4.4","standard_id":"iso45001-2018","chapter":4,"code":"4.4","title":"Organisation du système","topic":"system","guidance":"Décrire le fonctionnement des processus et leurs interactions.","examples":["Manuel SMI","Cartographie des processus"],"active":true,"revision":1}',1);
--> statement-breakpoint
INSERT INTO smi_requirements(id,standard_id,chapter,code,data,revision) VALUES('iso45001-2018:5.1','iso45001-2018',5,'5.1','{"id":"iso45001-2018:5.1","standard_id":"iso45001-2018","chapter":5,"code":"5.1","title":"Engagement de la direction","topic":"leadership","guidance":"Démontrer le pilotage, les moyens et la mobilisation de la direction.","examples":["Revue de direction","Engagement de la direction"],"active":true,"revision":1}',1);
--> statement-breakpoint
INSERT INTO smi_requirements(id,standard_id,chapter,code,data,revision) VALUES('iso45001-2018:5.2','iso45001-2018',5,'5.2','{"id":"iso45001-2018:5.2","standard_id":"iso45001-2018","chapter":5,"code":"5.2","title":"Politique et orientations","topic":"policy","guidance":"Partager des orientations adaptées au contexte.","examples":["Politique QSSE"],"active":true,"revision":1}',1);
--> statement-breakpoint
INSERT INTO smi_requirements(id,standard_id,chapter,code,data,revision) VALUES('iso45001-2018:5.3','iso45001-2018',5,'5.3','{"id":"iso45001-2018:5.3","standard_id":"iso45001-2018","chapter":5,"code":"5.3","title":"Responsabilités et autorités","topic":"roles","guidance":"Identifier les missions, responsabilités et délégations.","examples":["Organigramme","Fiches de fonction"],"active":true,"revision":1}',1);
--> statement-breakpoint
INSERT INTO smi_requirements(id,standard_id,chapter,code,data,revision) VALUES('iso45001-2018:6.1','iso45001-2018',6,'6.1','{"id":"iso45001-2018:6.1","standard_id":"iso45001-2018","chapter":6,"code":"6.1","title":"Risques et opportunités","topic":"risks","guidance":"Identifier, évaluer et traiter les risques et opportunités propres à chaque référentiel. Inclure dangers, évaluation SST et exigences légales (§6.1.2 à 6.1.4).","examples":["Matrice risques et opportunités","DUERP"],"active":true,"revision":1}',1);
--> statement-breakpoint
INSERT INTO smi_requirements(id,standard_id,chapter,code,data,revision) VALUES('iso45001-2018:6.2','iso45001-2018',6,'6.2','{"id":"iso45001-2018:6.2","standard_id":"iso45001-2018","chapter":6,"code":"6.2","title":"Objectifs et programme","topic":"objectives","guidance":"Fixer les objectifs, les moyens, les pilotes et le suivi des résultats.","examples":["Programme QSSE","Plan d’actions"],"active":true,"revision":1}',1);
--> statement-breakpoint
INSERT INTO smi_requirements(id,standard_id,chapter,code,data,revision) VALUES('iso45001-2018:7.1','iso45001-2018',7,'7.1','{"id":"iso45001-2018:7.1","standard_id":"iso45001-2018","chapter":7,"code":"7.1","title":"Moyens disponibles","topic":"resources","guidance":"Justifier les ressources nécessaires au système.","examples":["Budget","Plan de maintenance"],"active":true,"revision":1}',1);
--> statement-breakpoint
INSERT INTO smi_requirements(id,standard_id,chapter,code,data,revision) VALUES('iso45001-2018:7.2','iso45001-2018',7,'7.2','{"id":"iso45001-2018:7.2","standard_id":"iso45001-2018","chapter":7,"code":"7.2","title":"Compétences","topic":"skills","guidance":"Démontrer les compétences nécessaires et l’efficacité des formations.","examples":["Matrice de compétences","Habilitations","Plan de formation"],"active":true,"revision":1}',1);
--> statement-breakpoint
INSERT INTO smi_requirements(id,standard_id,chapter,code,data,revision) VALUES('iso45001-2018:7.3','iso45001-2018',7,'7.3','{"id":"iso45001-2018:7.3","standard_id":"iso45001-2018","chapter":7,"code":"7.3","title":"Sensibilisation des équipes","topic":"awareness","guidance":"S’assurer que chacun comprend sa contribution.","examples":["Accueil QSSE","Supports de sensibilisation"],"active":true,"revision":1}',1);
--> statement-breakpoint
INSERT INTO smi_requirements(id,standard_id,chapter,code,data,revision) VALUES('iso45001-2018:7.4','iso45001-2018',7,'7.4','{"id":"iso45001-2018:7.4","standard_id":"iso45001-2018","chapter":7,"code":"7.4","title":"Communication","topic":"communication","guidance":"Organiser les échanges internes et externes pertinents.","examples":["Plan de communication"],"active":true,"revision":1}',1);
--> statement-breakpoint
INSERT INTO smi_requirements(id,standard_id,chapter,code,data,revision) VALUES('iso45001-2018:7.5','iso45001-2018',7,'7.5','{"id":"iso45001-2018:7.5","standard_id":"iso45001-2018","chapter":7,"code":"7.5","title":"Maîtrise documentaire","topic":"documents","guidance":"Maîtriser la création, l’accès, l’utilisation et la conservation des informations.","examples":["Procédure GED","Liste des documents applicables"],"active":true,"revision":1}',1);
--> statement-breakpoint
INSERT INTO smi_requirements(id,standard_id,chapter,code,data,revision) VALUES('iso45001-2018:8.1','iso45001-2018',8,'8.1','{"id":"iso45001-2018:8.1","standard_id":"iso45001-2018","chapter":8,"code":"8.1","title":"Maîtrise opérationnelle","topic":"operations","guidance":"Organiser et maîtriser les activités, y compris les prestations externes pertinentes. Inclure prévention, changements, achats, entreprises extérieures et externalisation (§8.1.1 à §8.1.4).","examples":["Modes opératoires","Plans de contrôle","Plan de prévention"],"active":true,"revision":1}',1);
--> statement-breakpoint
INSERT INTO smi_requirements(id,standard_id,chapter,code,data,revision) VALUES('iso45001-2018:9.1','iso45001-2018',9,'9.1','{"id":"iso45001-2018:9.1","standard_id":"iso45001-2018","chapter":9,"code":"9.1","title":"Mesure des performances","topic":"monitoring","guidance":"Suivre les résultats du système et évaluer les performances.","examples":["Tableau de bord QSSE"],"active":true,"revision":1}',1);
--> statement-breakpoint
INSERT INTO smi_requirements(id,standard_id,chapter,code,data,revision) VALUES('iso45001-2018:9.2','iso45001-2018',9,'9.2','{"id":"iso45001-2018:9.2","standard_id":"iso45001-2018","chapter":9,"code":"9.2","title":"Audits internes","topic":"audits","guidance":"Planifier les audits, restituer les constats et suivre les suites données.","examples":["Programme d’audit","Rapport audit Qualité","Rapport audit Environnement","Rapport audit SST"],"active":true,"revision":1}',1);
--> statement-breakpoint
INSERT INTO smi_requirements(id,standard_id,chapter,code,data,revision) VALUES('iso45001-2018:9.3','iso45001-2018',9,'9.3','{"id":"iso45001-2018:9.3","standard_id":"iso45001-2018","chapter":9,"code":"9.3","title":"Revue de direction","topic":"review","guidance":"Faire le bilan du système et tracer les décisions prises.","examples":["Compte rendu de revue de direction"],"active":true,"revision":1}',1);
--> statement-breakpoint
INSERT INTO smi_requirements(id,standard_id,chapter,code,data,revision) VALUES('iso45001-2018:10.2','iso45001-2018',10,'10.2','{"id":"iso45001-2018:10.2","standard_id":"iso45001-2018","chapter":10,"code":"10.2","title":"Écarts et actions correctives","topic":"corrective","guidance":"Traiter les écarts, rechercher les causes et vérifier les résultats.","examples":["Fiche de non-conformité","5 Pourquoi","Ishikawa"],"active":true,"revision":1}',1);
--> statement-breakpoint
INSERT INTO smi_requirements(id,standard_id,chapter,code,data,revision) VALUES('iso45001-2018:5.4','iso45001-2018',5,'5.4','{"id":"iso45001-2018:5.4","standard_id":"iso45001-2018","chapter":5,"code":"5.4","title":"Participation des travailleurs","topic":"participation","guidance":"Organiser leur consultation et leur participation.","examples":["Compte rendu CSE","Remontées terrain"],"active":true,"revision":1}',1);
--> statement-breakpoint
INSERT INTO smi_requirements(id,standard_id,chapter,code,data,revision) VALUES('iso45001-2018:8.2','iso45001-2018',8,'8.2','{"id":"iso45001-2018:8.2","standard_id":"iso45001-2018","chapter":8,"code":"8.2","title":"Situations d’urgence","topic":"emergency","guidance":"Préparer les secours et tester les dispositifs.","examples":["Plan d’urgence","Exercices"],"active":true,"revision":1}',1);
--> statement-breakpoint
INSERT INTO smi_requirements(id,standard_id,chapter,code,data,revision) VALUES('iso45001-2018:10.1','iso45001-2018',10,'10.1','{"id":"iso45001-2018:10.1","standard_id":"iso45001-2018","chapter":10,"code":"10.1","title":"Opportunités de progrès","topic":"improvement-general","guidance":"Définir les améliorations nécessaires.","examples":["Programme de prévention"],"active":true,"revision":1}',1);
--> statement-breakpoint
INSERT INTO smi_requirements(id,standard_id,chapter,code,data,revision) VALUES('iso45001-2018:10.3','iso45001-2018',10,'10.3','{"id":"iso45001-2018:10.3","standard_id":"iso45001-2018","chapter":10,"code":"10.3","title":"Progrès continus","topic":"improvement","guidance":"Améliorer les résultats du système SST.","examples":["Plan de progrès"],"active":true,"revision":1}',1);