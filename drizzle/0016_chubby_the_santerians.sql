CREATE TABLE `gmao_assets` (
	`id` text PRIMARY KEY NOT NULL,
	`code` text NOT NULL,
	`data` text NOT NULL,
	`revision` integer NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `gmao_assets_code_unique` ON `gmao_assets` (`code`);--> statement-breakpoint
CREATE TABLE `gmao_history` (
	`id` text PRIMARY KEY NOT NULL,
	`entity_id` text NOT NULL,
	`kind` text NOT NULL,
	`action` text NOT NULL,
	`snapshot` text NOT NULL,
	`note` text NOT NULL,
	`actor` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_gmao_history_entity` ON `gmao_history` (`entity_id`);--> statement-breakpoint
CREATE TABLE `gmao_movements` (
	`id` text PRIMARY KEY NOT NULL,
	`part_id` text NOT NULL,
	`order_id` text,
	`kind` text NOT NULL,
	`delta` real NOT NULL,
	`unit_cost` real,
	`quantity_after` real NOT NULL,
	`note` text NOT NULL,
	`actor` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`part_id`) REFERENCES `gmao_parts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`order_id`) REFERENCES `gmao_orders`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_gmao_movements_order` ON `gmao_movements` (`order_id`);--> statement-breakpoint
CREATE INDEX `idx_gmao_movements_part` ON `gmao_movements` (`part_id`);--> statement-breakpoint
CREATE TABLE `gmao_orders` (
	`id` text PRIMARY KEY NOT NULL,
	`asset_id` text,
	`plan_id` text,
	`occurrence` text,
	`ticket_id` text NOT NULL,
	`data` text NOT NULL,
	`revision` integer NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`asset_id`) REFERENCES `gmao_assets`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`plan_id`) REFERENCES `gmao_plans`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `gmao_orders_ticket_id_unique` ON `gmao_orders` (`ticket_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_gmao_order_occurrence` ON `gmao_orders` (`plan_id`,`occurrence`);--> statement-breakpoint
CREATE INDEX `idx_gmao_orders_asset` ON `gmao_orders` (`asset_id`);--> statement-breakpoint
CREATE TABLE `gmao_parts` (
	`id` text PRIMARY KEY NOT NULL,
	`code` text NOT NULL,
	`data` text NOT NULL,
	`quantity` real NOT NULL,
	`revision` integer NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `gmao_parts_code_unique` ON `gmao_parts` (`code`);--> statement-breakpoint
CREATE TABLE `gmao_plans` (
	`id` text PRIMARY KEY NOT NULL,
	`asset_id` text NOT NULL,
	`data` text NOT NULL,
	`revision` integer NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`asset_id`) REFERENCES `gmao_assets`(`id`) ON UPDATE no action ON DELETE no action
);
