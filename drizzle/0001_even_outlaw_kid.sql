CREATE TABLE `account_tokens` (
	`hash` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`purpose` text NOT NULL,
	`payload` text DEFAULT '' NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `contact_replies` (
	`id` text PRIMARY KEY NOT NULL,
	`contact_id` text NOT NULL,
	`author_id` text NOT NULL,
	`body` text NOT NULL,
	`state` text NOT NULL,
	`error` text DEFAULT '' NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`contact_id`) REFERENCES `contacts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `contacts` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`type` text NOT NULL,
	`subject` text NOT NULL,
	`message` text NOT NULL,
	`order_number` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`assignee` text DEFAULT '' NOT NULL,
	`note` text DEFAULT '' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `account_favorites` (
	`account_id` text NOT NULL,
	`member_slug` text NOT NULL,
	PRIMARY KEY(`account_id`, `member_slug`),
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text,
	`email` text NOT NULL,
	`status` text DEFAULT 'requested' NOT NULL,
	`data` text NOT NULL,
	`total` integer NOT NULL,
	`guest_hash` text NOT NULL,
	`idempotency` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `orders_idempotency_unique` ON `orders` (`idempotency`);--> statement-breakpoint
CREATE TABLE `account_profiles` (
	`account_id` text PRIMARY KEY NOT NULL,
	`data` text NOT NULL,
	`email_verified` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE cascade
);
