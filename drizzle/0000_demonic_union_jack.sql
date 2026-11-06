CREATE TABLE `accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`display_name` text NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`role` text DEFAULT 'member' NOT NULL,
	`platform_id` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `accounts_username_unique` ON `accounts` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `accounts_email_unique` ON `accounts` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `accounts_platform_id_unique` ON `accounts` (`platform_id`);--> statement-breakpoint
CREATE TABLE `admin_audit` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`action` text NOT NULL,
	`target` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `content_records` (
	`kind` text NOT NULL,
	`slug` text NOT NULL,
	`data` text NOT NULL,
	`published` integer DEFAULT false NOT NULL,
	`updated_at` integer NOT NULL,
	`updated_by` text NOT NULL,
	PRIMARY KEY(`kind`, `slug`)
);
--> statement-breakpoint
CREATE TABLE `login_attempts` (
	`key` text PRIMARY KEY NOT NULL,
	`count` integer DEFAULT 0 NOT NULL,
	`window_end` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `account_sessions` (
	`token_hash` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `site_settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL
);
