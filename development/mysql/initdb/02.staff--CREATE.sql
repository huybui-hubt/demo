CREATE TABLE `staff` (
  `id` varchar(36) NOT NULL,
  `fullName` varchar(255) NOT NULL,
  `role` enum('saleman', 'admin') DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;
