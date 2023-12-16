-- CREATE DATABASE --
CREATE DATABASE knowledgebase;

-- CREATE TABLE OF user_mst
CREATE TABLE `user_mst` (
    `user_id` int NOT NULL AUTO_INCREMENT,
    `firstName` varchar(45) DEFAULT NULL,
    `lastName` varchar(45) DEFAULT NULL,
    `email` varchar(45) DEFAULT NULL,
    `password` varchar(15) DEFAULT NULL,
    `role_id` int DEFAULT '2',
    `company_name` varchar(20) DEFAULT NULL,
    `profile` text,
    `isSuspended` varchar(2) DEFAULT 'N',
    `isdeleted` varchar(2) DEFAULT 'N',
    `isAdmin` varchar(2) DEFAULT 'N',
    `created_date` date DEFAULT NULL,
    `created_by` varchar(45) DEFAULT NULL,
    `updated_date` date DEFAULT NULL,
    `updated_by` varchar(45) DEFAULT NULL,
    PRIMARY KEY (`user_id`),
    KEY `role_id` (`role_id`),
    CONSTRAINT `user_mst_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `role_mst` (`role_id`)
);

-- For User Example
INSERT INTO
    user_mst (
        firstName,
        lastName,
        email,
        password,
        role_id,
        company_name,
        profile,
        isSuspended,
        isdeleted,
        isAdmin,
        created_by,
        updated_by
    )
VALUES
    (
        'Amit',
        'Vishwakarma',
        'amit.vishwakarma@agami-tech.com',
        '12345678',
        1,
        'agami-tech.com',
        'https://lh3.googleusercontent.com/a/AAcHTtfcwztiiEM774jAikYg0PPze8mRvpRGHEvQKb27fNGoRA=s96-c',
        'N',
        'N',
        'Y',
        'Admin',
        'Admin'
    );

--  CREATE TABLE OF role_mst
CREATE TABLE `role_mst` (
    `role_id` int NOT NULL AUTO_INCREMENT,
    `role_name` varchar(25) NOT NULL,
    `permission` longtext,
    `created_by` varchar(25) DEFAULT NULL,
    `created_date` date DEFAULT NULL,
    `updated_by` varchar(25) DEFAULT NULL,
    `updated_date` date DEFAULT NULL,
    `isdeleted` varchar(2) DEFAULT 'N',
    PRIMARY KEY (`role_id`)
) -- FOR ADMIN
INSERT INTO
    `role_mst` (
        `role_name`,
        `permission`,
        `created_by`,
        `created_date`,
        `updated_by`,
        `updated_date`,
        `isdeleted`
    )
VALUES
    (
        'Admin',
        '[{"page":"Dashboard","permission":"Editor"},{"page":"History","permission":"Editor"},{"page":"Task","permission":"Editor"},{"page":"Team","permission":"Editor"},{"page":"Users","permission":"Editor"},{"page":"Permission","permission":"Editor"}]',
        'Meet',
        '2023-09-06',
        'Meet',
        '2023-09-06',
        'N'
    );

-- FOR EMPLOYEE
INSERT INTO
    `role_mst` (
        `role_name`,
        `permission`,
        `created_by`,
        `created_date`,
        `updated_by`,
        `updated_date`,
        `isdeleted`
    )
VALUES
    (
        'Employee',
        '[{"page":"Dashboard","permission":"Editor"},{"page":"History","permission":"Editor"},{"page":"Task","permission":"Editor"},{"page":"Team","permission":"None"},{"page":"Users","permission":"None"},{"page":"Permission","permission":"None"}]',
        'Meet',
        '2023-09-06',
        'Meet',
        '2023-09-06',
        'N'
    );

-- FOR MANAGER
INSERT INTO
    `role_mst` (
        `role_name`,
        `permission`,
        `created_by`,
        `created_date`,
        `updated_by`,
        `updated_date`,
        `isdeleted`
    )
VALUES
    (
        'Manager',
        '[{"page":"Dashboard","permission":"Editor"},{"page":"History","permission":"Editor"},{"page":"Task","permission":"Editor"},{"page":"Team","permission":"Viewer"},{"page":"Users","permission":"None"},{"page":"Permission","permission":"None"}]' 'Meet',
        '2023-09-06',
        'Meet',
        '2023-09-06',
        'N'
    );

-- CREATE TABLE OF team_mst
CREATE TABLE `team_mst` (
    `team_id` int NOT NULL AUTO_INCREMENT,
    `team_name` varchar(20) NOT NULL,
    `created_by` varchar(25) DEFAULT NULL,
    `created_date` date DEFAULT NULL,
    `updated_by` varchar(25) DEFAULT NULL,
    `updated_date` date DEFAULT NULL,
    `isdeleted` varchar(2) DEFAULT 'N',
    PRIMARY KEY (`team_id`)
);

-- CREATE TABLE OF team_details
CREATE TABLE `team_details` (
    `user_id` int NOT NULL,
    `team_id` int NOT NULL,
    KEY `team_id` (`team_id`),
    CONSTRAINT `team_details_ibfk_1` FOREIGN KEY (`team_id`) REFERENCES `team_mst` (`team_id`)
);

-- CREATE TABLE OF user_status
CREATE TABLE `user_status` (
    `user_status_id` int NOT NULL AUTO_INCREMENT,
    `user_id` int NOT NULL,
    `login_time` varchar(30) DEFAULT '',
    `logout_time` varchar(30) DEFAULT '',
    PRIMARY KEY (`user_status_id`),
    KEY `user_id` (`user_id`),
    CONSTRAINT `user_status_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user_mst` (`user_id`)
);

-- CREATE TABLE OF task_mst
CREATE TABLE `task_mst` (
    `task_id` int NOT NULL AUTO_INCREMENT,
    `task_user_id` int NOT NULL,
    `title` longtext NOT NULL,
    `description` longtext NOT NULL,
    `due_date` varchar(100) NOT NULL,
    `priority` varchar(30) NOT NULL,
    `created_by` varchar(25) DEFAULT NULL,
    `created_date` date DEFAULT NULL,
    `updated_by` varchar(25) DEFAULT NULL,
    `updated_date` date DEFAULT NULL,
    `file` longblob,
    `isdeleted` varchar(2) DEFAULT 'N',
    `status` varchar(20) NOT NULL,
    PRIMARY KEY (`task_id`),
    KEY `task_user_id` (`task_user_id`),
    CONSTRAINT `task_mst_ibfk_1` FOREIGN KEY (`task_user_id`) REFERENCES `user_mst` (`user_id`)
);

CREATE TABLE `subcategory_mst` (
`subcategory_id` int(11) NOT NULL AUTO_INCREMENT,
`category_id` int(11) DEFAULT NULL ,
`subcategory_name` varchar(45) DEFAULT NULL,
`description` varchar(90) DEFAULT NULL,
`status` int(11) NOT NULL DEFAULT 0,
`created_date` date DEFAULT NULL,
`created_by` varchar(45) DEFAULT NULL,
`updated_date` date DEFAULT NULL,
`updated_by` varchar(45) DEFAULT NULL,
PRIMARY KEY (`subcategory_id`)
)

INSERT INTO
`subcategory_mst` (
`subcategory_id`,
`subcategory_name`,
`description`,
`status`,
`created_date`,
`created_by`,
`updated_by`,
`updated_date`,
)
VALUES
(
'1',
'message',
'hello',
'2023-12-16'
);

INSERT INTO
`subcategory_mst` (
`subcategory_id`,
`subcategory_name`,
`description`,
`status`,
`created_date`,
`created_by`,
`updated_by`,
`updated_date`
)
VALUES
(
'1',
'message',
'hello',
0, 
'2023-12-16',
'meet', 
'meet', 
'2023-12-16' 
);

 CREATE TABLE `category_mst` (
  `category_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `description` varchar(90) DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT 1,
  `created_date` date DEFAULT NULL,
  `created_by` varchar(45) DEFAULT NULL,
  `updated_date` date DEFAULT NULL,
  `updated_by` varchar(45) DEFAULT NULL,
  PRIMARY KEY (category_id)
)


INSERT INTO
`category_mst` (
    `category_id`,
`name`,
`description`,
`status`,
`created_date`,
`created_by`,
`updated_by`,
`updated_date`
)
VALUES
(
'1',
'message',
'hello',
0, 
'2023-12-16',
'meet', 
'meet', 
'2023-12-16' 
);