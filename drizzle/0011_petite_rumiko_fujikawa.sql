CREATE TABLE `epi_movements` (
	`id` text PRIMARY KEY NOT NULL,
	`code` text NOT NULL,
	`kind` text NOT NULL,
	`delta` integer NOT NULL,
	`quantity` integer NOT NULL,
	`recipient` text DEFAULT '' NOT NULL,
	`note` text DEFAULT '' NOT NULL,
	`author` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`code`) REFERENCES `epi_products`(`code`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_epi_movements_code` ON `epi_movements` (`code`,`created_at`);--> statement-breakpoint
CREATE TABLE `epi_products` (
	`code` text PRIMARY KEY NOT NULL,
	`family` text NOT NULL,
	`name` text NOT NULL,
	`specifics` text DEFAULT '' NOT NULL,
	`source_row` integer DEFAULT 0 NOT NULL,
	`quantity` integer,
	`minimum` integer,
	`location` text DEFAULT '' NOT NULL,
	`revision` integer DEFAULT 1 NOT NULL,
	`updated_at` text DEFAULT '' NOT NULL
);
