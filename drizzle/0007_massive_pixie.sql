CREATE TABLE `team_dashboards` (
	`id` text PRIMARY KEY NOT NULL,
	`team_id` text NOT NULL,
	`unit_code` text DEFAULT '' NOT NULL,
	`data` text NOT NULL,
	`revision` integer DEFAULT 1 NOT NULL,
	`updated_at` text NOT NULL,
	`updated_by` text NOT NULL,
	FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_team_dashboards_team` ON `team_dashboards` (`team_id`);--> statement-breakpoint
CREATE TABLE `teams` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`rank` integer NOT NULL,
	`parent_id` text,
	`revision` integer DEFAULT 1 NOT NULL
);

--> statement-breakpoint
INSERT INTO teams (id,name,rank,parent_id,revision) VALUES ('direction','Direction',1,NULL,1),('rh','Ressources humaines',2,'direction',1),('qsse','QSSE',2,'direction',1),('production','Production',2,'direction',1),('rd','R&D',2,'direction',1);
--> statement-breakpoint
INSERT INTO team_dashboards (id,team_id,unit_code,data,revision,updated_at,updated_by) SELECT 'legacy-' || u.code,'qsse',u.code,COALESCE(d.data,json_set('{"title":"Pilotage de l’unité","widgets":[{"id":"default-0","type":"risks","wide":false,"title":"Répartition des risques","text":"","value":"","target":"","unit":"","date":""},{"id":"default-1","type":"priorities","wide":false,"title":"Risques prioritaires","text":"","value":"","target":"","unit":"","date":""},{"id":"default-2","type":"actions","wide":true,"title":"Suivi des actions","text":"","value":"","target":"","unit":"","date":""},{"id":"default-3","type":"program","wide":false,"title":"PAPRIPACT annuel","text":"","value":"","target":"","unit":"","date":""},{"id":"default-4","type":"note","wide":false,"title":"Point d’équipe","text":"","value":"","target":"","unit":"","date":""},{"id":"default-5","type":"team","wide":false,"title":"Métiers de l’unité","text":"","value":"","target":"","unit":"","date":""}]}','$.title',u.code || ' · ' || u.name)),COALESCE(d.revision,1),COALESCE(d.updated_at,''),COALESCE(d.updated_by,'') FROM evrp_units u LEFT JOIN unit_dashboards d ON d.unit_code=u.code;
--> statement-breakpoint
INSERT INTO team_dashboards (id,team_id,unit_code,data,revision,updated_at,updated_by) SELECT 'board-' || id,id,'',json_set('{"title":"Tableau d’équipe","widgets":[{"id":"note","type":"note","wide":false,"title":"Point d’équipe","text":"","value":"","target":"","unit":"","date":""},{"id":"indicator","type":"indicator","wide":false,"title":"Indicateur personnalisé","text":"","value":"","target":"","unit":"","date":""}]}','$.title','Point ' || name),1,'','' FROM teams;
