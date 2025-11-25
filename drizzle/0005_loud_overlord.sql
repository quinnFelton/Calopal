CREATE TABLE `user_details` (
	`user_name` text NOT NULL,
	`pet_name` text NOT NULL,
	`goals_completed` integer DEFAULT 0 NOT NULL,
	`pet_state` integer DEFAULT 0 NOT NULL,
	`last_logged_in` text DEFAULT (CURRENT_TIMESTAMP)
);
