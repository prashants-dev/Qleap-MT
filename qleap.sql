-- MySQL dump 10.13  Distrib 8.0.32, for Win64 (x86_64)
--
-- Host: localhost    Database: qleap_db
-- ------------------------------------------------------
-- Server version	8.0.32

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `resource` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
INSERT INTO `permissions` VALUES (5,'getAllUsers','Can fetch all users list','users','2025-11-07 11:44:41'),(6,'updateUser','Can update existing users','users','2025-11-10 12:18:11'),(8,'createStaff','Can create new Staff','users','2025-11-20 11:16:01'),(9,'updateStaff','Can update existing Staff','users','2025-11-24 11:24:38'),(10,'deleteStaff','Can delete existing Staff','users','2025-11-24 11:25:09'),(12,'deleteUser','can delete existing users','users','2025-11-25 11:46:36'),(13,'createUser','can create new users','users','2025-11-25 12:38:14');
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_permissions`
--

DROP TABLE IF EXISTS `role_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_permissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role_id` int NOT NULL,
  `permission_id` int NOT NULL,
  `granted_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `is_deleted` tinyint DEFAULT '0',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `role_id` (`role_id`),
  KEY `permission_id` (`permission_id`),
  CONSTRAINT `role_permissions_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `role_permissions_ibfk_2` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_permissions`
--

LOCK TABLES `role_permissions` WRITE;
/*!40000 ALTER TABLE `role_permissions` DISABLE KEYS */;
INSERT INTO `role_permissions` VALUES (9,2,5,2,'2025-11-07 11:45:32',0,'2025-11-26 05:27:32'),(12,2,6,2,'2025-11-12 07:08:26',0,'2025-11-20 11:01:32'),(14,3,8,2,'2025-11-21 03:48:03',0,'2025-11-24 09:14:56'),(15,4,8,2,'2025-11-24 09:37:48',0,'2025-11-24 10:04:31'),(16,1,8,1,'2025-11-24 09:56:42',0,'2025-11-24 09:56:42'),(17,2,8,1,'2025-11-24 09:56:42',0,'2025-11-24 09:56:42'),(18,1,5,1,'2025-11-24 09:56:42',0,'2025-11-24 09:56:42'),(19,1,6,1,'2025-11-24 09:56:42',0,'2025-11-24 09:56:42'),(20,3,5,2,'2025-11-24 09:56:42',1,'2025-11-28 10:14:38'),(21,3,6,2,'2025-11-24 09:56:42',1,'2025-11-24 09:57:59'),(22,4,5,2,'2025-11-24 09:56:42',1,'2025-11-24 10:15:44'),(23,4,6,2,'2025-11-24 09:56:42',1,'2025-11-24 10:15:46'),(24,5,8,2,'2025-11-24 09:57:26',1,'2025-11-24 10:15:41'),(30,5,5,2,'2025-11-24 10:19:54',1,'2025-11-24 10:20:35'),(31,5,6,2,'2025-11-24 10:19:54',1,'2025-11-24 10:20:36'),(32,1,9,1,'2025-11-24 11:27:55',0,'2025-11-24 11:27:55'),(33,1,10,2,'2025-11-24 11:27:55',1,'2025-11-28 09:01:57'),(34,2,10,1,'2025-11-24 11:27:55',0,'2025-11-24 11:27:55'),(35,2,9,1,'2025-11-24 11:27:55',0,'2025-11-24 11:27:55'),(36,3,9,2,'2025-11-24 11:27:55',0,'2025-11-24 11:31:42'),(37,3,10,2,'2025-11-24 11:27:55',0,'2025-11-24 12:49:29'),(38,4,9,2,'2025-11-24 11:27:55',0,'2025-11-24 11:31:43'),(39,4,10,2,'2025-11-24 11:27:55',0,'2025-11-24 11:31:37'),(40,5,9,2,'2025-11-24 11:27:55',1,'2025-11-24 11:31:20'),(43,2,12,2,'2025-11-25 11:47:48',0,'2025-11-25 11:47:48'),(44,2,13,2,'2025-11-25 12:50:06',0,'2025-11-26 09:25:20'),(45,3,13,2,'2025-11-28 06:19:39',1,'2025-11-28 10:14:41');
/*!40000 ALTER TABLE `role_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `is_system` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'SUPER_ADMIN','Has full system access',1,'2025-11-05 17:01:41'),(2,'ADMIN','Can manage users and content',1,'2025-11-05 17:01:41'),(3,'MEDIA_OWNER','Owns media inventory',2,'2025-11-05 17:01:41'),(4,'ADVERTISER','Can create and manage ads',2,'2025-11-05 17:01:41'),(5,'STAFF','Basic internal user',3,'2025-11-18 09:03:00'),(15,'ADMIN_STAFF','User Under Admin',4,'2025-11-27 11:55:44'),(16,'MEDIAOWNER_STAFF','User Under MediaOwner',5,'2025-11-27 11:56:25'),(17,'ADVERTISER_STAFF','User Under Advertiser',6,'2025-11-27 11:56:47');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_roles`
--

DROP TABLE IF EXISTS `user_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `role_id` int NOT NULL,
  `assigned_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `user_roles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_roles_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_roles`
--

LOCK TABLES `user_roles` WRITE;
/*!40000 ALTER TABLE `user_roles` DISABLE KEYS */;
INSERT INTO `user_roles` VALUES (2,2,3,NULL,'2025-11-06 06:52:32'),(3,3,4,NULL,'2025-11-06 06:53:17'),(12,18,5,3,'2025-11-24 10:30:42'),(35,1,2,1,'2025-11-26 07:21:47'),(36,33,5,1,'2025-11-27 09:35:33'),(37,32,16,1,'2025-11-28 05:22:46'),(39,35,16,1,'2025-11-28 07:32:24'),(40,36,15,1,'2025-11-28 08:47:55'),(43,39,17,3,'2025-11-28 09:07:07'),(44,40,15,1,'2025-11-29 10:09:48');
/*!40000 ALTER TABLE `user_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_staff`
--

DROP TABLE IF EXISTS `user_staff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_staff` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `staff_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `staff_id` (`staff_id`),
  CONSTRAINT `user_staff_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `user_staff_ibfk_2` FOREIGN KEY (`staff_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_staff`
--

LOCK TABLES `user_staff` WRITE;
/*!40000 ALTER TABLE `user_staff` DISABLE KEYS */;
INSERT INTO `user_staff` VALUES (8,3,18,'2025-11-24 10:30:42'),(14,2,32,'2025-11-25 17:16:36'),(15,1,33,'2025-11-27 09:35:33'),(16,1,35,'2025-11-28 07:32:24'),(19,3,39,'2025-11-28 09:07:07'),(20,1,40,'2025-11-29 10:09:48');
/*!40000 ALTER TABLE `user_staff` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Prashant','prashant@gmail.com','$2b$10$UNYq2vOEMlz2B.ZKrx1IO.J2sQk7rdaRvqbkB1HEAKTpQu49f.jIa','active','2025-11-05 17:06:56','2025-11-26 07:26:01'),(2,'rahul','rahul@gmail.com','$2b$10$5rV7pNJxhydzVKv19SzJAeceFdOAZiWf6NmSlwdprIjh3BibFlqfa','active','2025-11-06 06:52:32','2025-11-06 06:52:32'),(3,'shree','shree@gmail.com','$2b$10$46lZp3/gjkTyqogiJj7wLu/o7Rb9oDvUyJ.SjoIFgcm9AvhD2qXpa','active','2025-11-06 06:53:17','2025-11-17 05:37:00'),(18,'adviertiser-staff','adv@gmail.com','$2b$10$Bsk3DVIJoeFN3wWl08QreOLr7s7uFEMa2xt7xZasjc7Igu8bftjQy','active','2025-11-24 10:30:42','2025-11-24 11:20:07'),(32,'rahulStaff','rahulStaff@gmail.com','$2b$10$.MWSr/ljATf8LZFw3ojKP.uXeZdSNezDOb7cwX24DhbXuO12NkJSC','inactive','2025-11-25 17:16:36','2025-11-28 05:22:46'),(33,'shree12345','bh@gm','$2b$10$sdDoBIgwfWsGFmqBuP99.e6X66GyYJZlBKMpeEYM1DUnqy6g5scnq','active','2025-11-27 09:35:33','2025-11-27 09:35:33'),(35,'1234567890','qwer@gmail.com','$2b$10$u1XEXg4qRMgZoY4dLZNaP.PyP1jkB4zsSSRxnQ9ISDYVaRTm44PvC','active','2025-11-28 07:32:24','2025-11-28 07:32:24'),(36,'admin_user','user@gmail.com','$2b$10$DibnJvAXFKdaIrwvPFcfSuG7KqJxZMlylUQLcESg5/WDgEVt0k776','active','2025-11-28 08:47:55','2025-11-28 08:47:55'),(39,'advertiser','advertiser@gmail.com','$2b$10$3BRi.un.REYCsv6oQ47hSeUdj6zdgJq9zDItuwi0VASXIJxLy7IUq','active','2025-11-28 09:07:07','2025-11-28 09:07:07'),(40,'admin_staff11','adminstaff11@gmail.com','$2b$10$.3jfO7KXcj2WJd0cthg69.itgxrUf.L3IYG3rNQUn1vNmJwq1tKX.','active','2025-11-29 10:09:48','2025-11-29 10:09:48');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-02 11:55:11
