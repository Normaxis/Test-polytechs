CREATE TABLE `security_events` (
	`id` text PRIMARY KEY NOT NULL,
	`action` text NOT NULL,
	`user_id` text NOT NULL,
	`detail` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_security_events_date` ON `security_events` (`created_at`);--> statement-breakpoint
CREATE TABLE `security_limits` (
	`key` text PRIMARY KEY NOT NULL,
	`attempts` integer NOT NULL,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `site_identities` (
	`identity_id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);

--> statement-breakpoint
INSERT OR IGNORE INTO team_access(team_id,restricted) SELECT id,1 FROM teams WHERE id='qsse';
