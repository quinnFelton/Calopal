CREATE TABLE `foods` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`calories` integer NOT NULL,
	`carbs` integer NOT NULL,
	`proteins` integer NOT NULL,
	`fats` integer NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP)
);
