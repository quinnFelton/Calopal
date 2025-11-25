PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_meals` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`calories` float DEFAULT 0 NOT NULL,
	`carbs` float DEFAULT 0 NOT NULL,
	`proteins` float DEFAULT 0 NOT NULL,
	`fats` float DEFAULT 0 NOT NULL,
	`consumed_at` text DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
INSERT INTO `__new_meals`("id", "name", "calories", "carbs", "proteins", "fats", "consumed_at") SELECT "id", "name", "calories", "carbs", "proteins", "fats", "consumed_at" FROM `meals`;--> statement-breakpoint
DROP TABLE `meals`;--> statement-breakpoint
ALTER TABLE `__new_meals` RENAME TO `meals`;--> statement-breakpoint
PRAGMA foreign_keys=ON;