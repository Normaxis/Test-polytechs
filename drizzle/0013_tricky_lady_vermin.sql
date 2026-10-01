CREATE TABLE `waste_history` (
	`id` text PRIMARY KEY NOT NULL,
	`record_id` text NOT NULL,
	`snapshot` text NOT NULL,
	`saved_at` text NOT NULL,
	`saved_by` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_waste_history_record` ON `waste_history` (`record_id`);--> statement-breakpoint
CREATE TABLE `waste_records` (
	`id` text PRIMARY KEY NOT NULL,
	`data` text NOT NULL,
	`revision` integer NOT NULL,
	`updated_at` text NOT NULL,
	`updated_by` text NOT NULL
);
