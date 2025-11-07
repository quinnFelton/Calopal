CREATE TABLE `goals` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`macro_type` text NOT NULL,
	`min_or_max` integer NOT NULL,
	`target_value` integer NOT NULL,
	`completed_value` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`is_completed` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `meal_components` (
	`meal_id` integer NOT NULL,
	`food_id` integer NOT NULL,
	`quantity` float DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `meals` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`calories` integer NOT NULL,
	`carbs` integer NOT NULL,
	`proteins` integer NOT NULL,
	`fats` integer NOT NULL,
	`consumed_at` text DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
ALTER TABLE `foods` ADD `is_from_api` integer DEFAULT false NOT NULL;