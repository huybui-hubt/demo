CREATE TABLE `staff_branch` (
  `branch_id` varchar(36) NOT NULL,
  `staff_id` varchar(36) NOT NULL,
  PRIMARY KEY (`branch_id`, `staff_id`)
) ENGINE=InnoDB;
