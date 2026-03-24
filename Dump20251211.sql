-- MySQL dump 10.13  Distrib 8.0.22, for Win64 (x86_64)
--
-- Host: localhost    Database: task_manager
-- ------------------------------------------------------
-- Server version	8.0.22

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
-- Table structure for table `tasks`
--

DROP TABLE IF EXISTS `tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tasks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `status` varchar(50) DEFAULT 'todo',
  `due_date` datetime DEFAULT NULL,
  `reminder_minutes_before` int DEFAULT '0',
  `reminder_sent_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `user_id` int DEFAULT NULL,
  `priority` varchar(20) DEFAULT 'medium',
  `completed` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_tasks_user_due` (`user_id`,`due_date`,`completed`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tasks`
--

LOCK TABLES `tasks` WRITE;
/*!40000 ALTER TABLE `tasks` DISABLE KEYS */;
INSERT INTO `tasks` (`id`,`title`,`description`,`status`,`due_date`,`created_at`,`updated_at`,`user_id`,`priority`,`completed`) VALUES (1,'Finish Sprint 2','Create DB + backend + frontend','in_progress',NULL,'2025-12-09 03:18:08','2025-12-09 03:18:08',NULL,'medium',0),(2,'Learn MySQL','Practice CRUD operations','todo',NULL,'2025-12-09 03:18:08','2025-12-09 03:18:08',NULL,'medium',0),(3,'TASK','TEST','todo',NULL,'2025-12-11 06:00:37','2025-12-11 06:00:37',NULL,'medium',0),(4,'TEST','APPLE','todo',NULL,'2025-12-11 06:47:39','2025-12-11 06:47:39',1,'medium',0),(15,'John','work\n\n','todo',NULL,'2025-12-11 08:34:19','2025-12-11 08:34:19',2,'medium',0),(16,'John','apple','todo',NULL,'2025-12-11 08:35:47','2025-12-11 08:35:47',2,'medium',0),(30,'APPLE','DAY','todo',NULL,'2025-12-11 12:48:46','2025-12-11 12:48:46',9,'High',0),(31,'BANANA','TWICE','todo',NULL,'2025-12-11 12:48:55','2025-12-11 12:48:55',9,'Medium',0),(32,'PIG','LOVE','todo',NULL,'2025-12-11 12:49:07','2025-12-11 12:49:07',9,'Low',0);
/*!40000 ALTER TABLE `tasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `task_id` int NOT NULL,
  `channel` varchar(20) NOT NULL DEFAULT 'in_app',
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_read_created` (`user_id`,`is_read`,`created_at`),
  KEY `idx_task_id` (`task_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `idx_users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`id`,`username`,`email`,`password`,`created_at`) VALUES (1,'John',NULL,'$2b$10$Y7Gm/xDsemQcqaCknlEVUupkBJkPLvR4gpTxEhw9PwJC5aPSy6.bO','2025-12-11 06:47:27'),(2,'123',NULL,'$2b$10$w.6oLZxUehpEPe0T7AAfRua2xji02JhQwP.I8CJW7dRcFnixVofnK','2025-12-11 06:50:40'),(3,'2338174932@qq.com','2338174932@qq.com','$2b$10$9cCGECxyN5226LkBsYSbM.YY3xtf99kvXClhgJtQhG4yXDg6rINeC','2025-12-11 08:39:41'),(8,'123456@123456','123456@123456','$2a$10$BZh9lTes2YTnVocwwxGzGOwITYsmeJfbHqwXYRYumI5goFfD8zYVm','2025-12-11 12:19:33'),(9,'1234@1234','1234@1234','$2a$10$XnHxXolYejhMBVmsCOgX3ONY2EdK6Dj9IfNwBck9xygH3rOUL6xYS','2025-12-11 12:20:20'),(10,'1@1','1@1','$2a$10$TSu.D6/PUB5o4Mx7x/nh8uKTajvXDQ9O99jIabKLpy9QulOh.A282','2025-12-11 12:51:20'),(11,'mama@mama','mama@mama','$2a$10$u4wN3RKjz79QlfD3cqv6COhqfrl3DWJEgS7vBpgljHWIR6JoYBo6q','2025-12-11 12:55:47');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'task_manager'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-11 21:08:37
