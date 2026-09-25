CREATE TABLE `evrp_action_history` (
	`id` text PRIMARY KEY NOT NULL,
	`action_id` text NOT NULL,
	`revision` integer NOT NULL,
	`snapshot` text NOT NULL,
	`saved_at` text NOT NULL,
	`saved_by` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_evrp_action_history_action` ON `evrp_action_history` (`action_id`);