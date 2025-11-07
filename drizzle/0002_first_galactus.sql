PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_foods` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`calories` float NOT NULL,
	`carbs` float NOT NULL,
	`proteins` float NOT NULL,
	`fats` float NOT NULL,
	`is_from_api` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
INSERT INTO `__new_foods`("id", "name", "calories", "carbs", "proteins", "fats", "is_from_api", "created_at") SELECT "id", "name", "calories", "carbs", "proteins", "fats", "is_from_api", "created_at" FROM `foods`;--> statement-breakpoint
DROP TABLE `foods`;--> statement-breakpoint
ALTER TABLE `__new_foods` RENAME TO `foods`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_meals` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`calories` float NOT NULL,
	`carbs` float NOT NULL,
	`proteins` float NOT NULL,
	`fats` float NOT NULL,
	`consumed_at` text DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
INSERT INTO `__new_meals`("id", "name", "calories", "carbs", "proteins", "fats", "consumed_at") SELECT "id", "name", "calories", "carbs", "proteins", "fats", "consumed_at" FROM `meals`;--> statement-breakpoint
DROP TABLE `meals`;--> statement-breakpoint
ALTER TABLE `__new_meals` RENAME TO `meals`;