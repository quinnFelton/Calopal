PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_cosmetics` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`visible` integer DEFAULT false NOT NULL,
	`x_pos` float NOT NULL,
	`y_pos` float NOT NULL,
	`angle` float DEFAULT 0 NOT NULL,
	`scale` float DEFAULT 1 NOT NULL,
	`img_path` text NOT NULL,
	`anchored_to_pet` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_cosmetics`("id", "name", "visible", "x_pos", "y_pos", "angle", "scale", "img_path", "anchored_to_pet") SELECT "id", "name", "visible", "x_pos", "y_pos", "angle", "scale", "img_path", "anchored_to_pet" FROM `cosmetics`;--> statement-breakpoint
DROP TABLE `cosmetics`;--> statement-breakpoint
ALTER TABLE `__new_cosmetics` RENAME TO `cosmetics`;--> statement-breakpoint
PRAGMA foreign_keys=ON;