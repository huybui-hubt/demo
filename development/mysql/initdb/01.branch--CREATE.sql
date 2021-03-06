CREATE TABLE `branch` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `status` tinyint(2) NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;
