CREATE TABLE `quality_action_history` (
	`id` text PRIMARY KEY NOT NULL,
	`action_id` text NOT NULL,
	`snapshot` text NOT NULL,
	`saved_at` text NOT NULL,
	`saved_by` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_quality_history_action` ON `quality_action_history` (`action_id`);--> statement-breakpoint
CREATE TABLE `quality_actions` (
	`id` text PRIMARY KEY NOT NULL,
	`data` text NOT NULL,
	`revision` integer NOT NULL,
	`updated_at` text NOT NULL,
	`updated_by` text NOT NULL
);
