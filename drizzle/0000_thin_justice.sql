CREATE TABLE `assessments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`controlId` int NOT NULL,
	`frameworkId` int NOT NULL,
	`assessmentDate` timestamp NOT NULL DEFAULT (now()),
	`score` decimal(5,2),
	`status` enum('compliant','non_compliant','partial','not_applicable') NOT NULL,
	`findings` text,
	`recommendations` text,
	`evidenceUrl` varchar(512),
	`assessedBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `assessments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `compliance_metrics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`frameworkId` int,
	`metricDate` timestamp NOT NULL DEFAULT (now()),
	`overallCompliance` decimal(5,2),
	`controlsCompliant` int,
	`controlsInProgress` int,
	`controlsPlanning` int,
	`controlsNotStarted` int,
	`averageMaturity` decimal(5,2),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `compliance_metrics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `control_framework_map` (
	`id` int AUTO_INCREMENT NOT NULL,
	`controlId` int NOT NULL,
	`frameworkId` int NOT NULL,
	`complianceLevel` enum('full','partial','none') NOT NULL DEFAULT 'none',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `control_framework_map_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `controls` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`category` varchar(255),
	`tier` enum('critical','high','medium','low') NOT NULL,
	`status` enum('compliant','in_progress','planning','not_started') NOT NULL DEFAULT 'not_started',
	`maturityLevel` int DEFAULT 1,
	`targetMaturityLevel` int DEFAULT 5,
	`ownerId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `controls_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `frameworks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`region` varchar(255),
	`year` int,
	`status` enum('active','draft','deprecated') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `frameworks_id` PRIMARY KEY(`id`),
	CONSTRAINT `frameworks_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
