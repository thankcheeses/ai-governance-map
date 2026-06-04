CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` enum('control_update','assessment_complete','compliance_alert','framework_change','general') NOT NULL,
	`title` varchar(255) NOT NULL,
	`message` text,
	`relatedControlId` int,
	`relatedFrameworkId` int,
	`isRead` boolean NOT NULL DEFAULT false,
	`actionUrl` varchar(512),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`readAt` timestamp,
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
