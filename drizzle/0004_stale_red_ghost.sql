CREATE TABLE `evrp_actions` (
	`id` text PRIMARY KEY NOT NULL,
	`unit_code` text NOT NULL,
	`risk_id` text DEFAULT '' NOT NULL,
	`data` text NOT NULL,
	`revision` integer DEFAULT 1 NOT NULL,
	`updated_at` text NOT NULL,
	`updated_by` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_evrp_actions_unit` ON `evrp_actions` (`unit_code`);--> statement-breakpoint
CREATE TABLE `evrp_revisions` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`kind` text NOT NULL,
	`description` text NOT NULL,
	`author` text DEFAULT '' NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `evrp_risk_history` (
	`id` text PRIMARY KEY NOT NULL,
	`risk_id` text NOT NULL,
	`revision` integer NOT NULL,
	`snapshot` text NOT NULL,
	`saved_at` text NOT NULL,
	`saved_by` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_evrp_history_risk` ON `evrp_risk_history` (`risk_id`);--> statement-breakpoint
CREATE TABLE `evrp_risks` (
	`id` text PRIMARY KEY NOT NULL,
	`unit_code` text NOT NULL,
	`data` text NOT NULL,
	`original` text NOT NULL,
	`status` text DEFAULT 'À vérifier' NOT NULL,
	`revision` integer DEFAULT 1 NOT NULL,
	`updated_at` text NOT NULL,
	`updated_by` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_evrp_risks_unit` ON `evrp_risks` (`unit_code`);--> statement-breakpoint
CREATE TABLE `evrp_units` (
	`code` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`roles` text DEFAULT '[]' NOT NULL,
	`source_ref` text DEFAULT '' NOT NULL,
	`revision` integer DEFAULT 1 NOT NULL,
	`updated_at` text DEFAULT '' NOT NULL
);
