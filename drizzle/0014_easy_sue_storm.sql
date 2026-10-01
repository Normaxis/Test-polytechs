CREATE TABLE `ged_documents` (
	`id` text PRIMARY KEY NOT NULL,
	`data` text NOT NULL,
	`revision` integer DEFAULT 1 NOT NULL,
	`published_version_id` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `ged_events` (
	`id` text PRIMARY KEY NOT NULL,
	`document_id` text NOT NULL,
	`version_id` text NOT NULL,
	`action` text NOT NULL,
	`note` text NOT NULL,
	`snapshot` text NOT NULL,
	`actor_id` text NOT NULL,
	`actor` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_ged_events_document` ON `ged_events` (`document_id`);--> statement-breakpoint
CREATE TABLE `ged_files` (
	`id` text PRIMARY KEY NOT NULL,
	`version_id` text NOT NULL,
	`name` text NOT NULL,
	`mime` text NOT NULL,
	`size` integer NOT NULL,
	`sha256` text NOT NULL,
	`author` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`version_id`) REFERENCES `ged_versions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_ged_files_version` ON `ged_files` (`version_id`);--> statement-breakpoint
CREATE TABLE `ged_profiles` (
	`user_id` text PRIMARY KEY NOT NULL,
	`manager_id` text,
	`qsse` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`manager_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `ged_versions` (
	`id` text PRIMARY KEY NOT NULL,
	`document_id` text NOT NULL,
	`data` text NOT NULL,
	`status` text NOT NULL,
	`revision` integer DEFAULT 1 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`reviewed_by` text DEFAULT '' NOT NULL,
	`reviewed_at` text DEFAULT '' NOT NULL,
	`approved_by` text DEFAULT '' NOT NULL,
	`approved_at` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_ged_versions_document` ON `ged_versions` (`document_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_ged_versions_open` ON `ged_versions` (`document_id`) WHERE "ged_versions"."status" IN ('Brouillon','À corriger','Relecture QSSE','Approbation N+1');