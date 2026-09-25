CREATE TABLE `unit_dashboards` (
	`unit_code` text PRIMARY KEY NOT NULL,
	`data` text NOT NULL,
	`revision` integer DEFAULT 1 NOT NULL,
	`updated_at` text NOT NULL,
	`updated_by` text NOT NULL,
	FOREIGN KEY (`unit_code`) REFERENCES `evrp_units`(`code`) ON UPDATE no action ON DELETE no action
);
