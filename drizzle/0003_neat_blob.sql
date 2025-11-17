CREATE TABLE `cosmetics` (
	`id` integer NOT NULL,
	`name` text NOT NULL,
	`visible` integer DEFAULT false NOT NULL,
	`x_pos` float NOT NULL,
	`y_pos` float NOT NULL,
	`angle` float DEFAULT 0 NOT NULL,
	`scale` float DEFAULT 1 NOT NULL,
	`img_path` text NOT NULL,
	`anchored_to_pet` integer DEFAULT false NOT NULL
);
