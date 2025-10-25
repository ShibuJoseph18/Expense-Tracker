CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`mobile` integer,
	`created_at` integer DEFAULT '"2025-10-23T18:09:10.334Z"' NOT NULL,
	`updated_at` integer DEFAULT '"2025-10-23T18:09:10.334Z"' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_mobile_unique` ON `users` (`mobile`);