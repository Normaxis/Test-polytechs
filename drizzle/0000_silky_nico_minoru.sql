CREATE TABLE `records` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`kind` text NOT NULL,
	`domain` text NOT NULL,
	`status` text NOT NULL,
	`priority` text NOT NULL,
	`owner` text NOT NULL,
	`due` text NOT NULL,
	`description` text NOT NULL,
	`url` text NOT NULL,
	`created` text NOT NULL
);
