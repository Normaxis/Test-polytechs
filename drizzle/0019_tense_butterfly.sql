CREATE TABLE `user_profiles` (
	`user_id` text PRIMARY KEY NOT NULL,
	`locale` text DEFAULT 'fr' NOT NULL,
	`photo_key` text DEFAULT '' NOT NULL,
	`photo_mime` text DEFAULT '' NOT NULL,
	`photo_updated_at` text DEFAULT '' NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
