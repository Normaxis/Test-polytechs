CREATE TABLE `record_history` (
	`id` text PRIMARY KEY NOT NULL,
	`record_id` text NOT NULL,
	`revision` integer NOT NULL,
	`snapshot` text NOT NULL,
	`saved_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_history_record` ON `record_history` (`record_id`);--> statement-breakpoint
ALTER TABLE `records` ADD `updated` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `records` ADD `revision` integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `records` ADD `source_id` text DEFAULT '' NOT NULL;