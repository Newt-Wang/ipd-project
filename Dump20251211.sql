mysqldump: [Warning] Using a password on the command line interface can be insecure.
-- MySQL dump 10.13  Distrib 9.4.0, for macos15.4 (arm64)
--
-- Host: localhost    Database: task_manager
-- ------------------------------------------------------
-- Server version	9.4.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
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
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `user_id` int DEFAULT NULL,
  `priority` varchar(20) DEFAULT 'medium',
  `completed` tinyint(1) DEFAULT '0',
  `reminder_at` datetime DEFAULT NULL,
  `reminder_notified` tinyint(1) DEFAULT '0',
  `category` varchar(50) DEFAULT 'Work',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tasks`
--

LOCK TABLES `tasks` WRITE;
/*!40000 ALTER TABLE `tasks` DISABLE KEYS */;
INSERT INTO `tasks` VALUES (1,'Finish Sprint 2','Create DB + backend + frontend','in_progress',NULL,'2025-12-09 03:18:08','2025-12-09 03:18:08',NULL,'medium',0,NULL,0,'Work'),(2,'Learn MySQL','Practice CRUD operations','todo',NULL,'2025-12-09 03:18:08','2025-12-09 03:18:08',NULL,'medium',0,NULL,0,'Work'),(3,'TASK','TEST','todo',NULL,'2025-12-11 06:00:37','2025-12-11 06:00:37',NULL,'medium',0,NULL,0,'Work'),(4,'TEST','APPLE','todo',NULL,'2025-12-11 06:47:39','2025-12-11 06:47:39',1,'medium',0,NULL,0,'Work'),(15,'John','work\n\n','todo',NULL,'2025-12-11 08:34:19','2025-12-11 08:34:19',2,'medium',0,NULL,0,'Work'),(16,'John','apple','todo',NULL,'2025-12-11 08:35:47','2025-12-11 08:35:47',2,'medium',0,NULL,0,'Work'),(30,'APPLE','DAY','todo',NULL,'2025-12-11 12:48:46','2025-12-11 12:48:46',9,'High',0,NULL,0,'Work'),(31,'BANANA','TWICE','todo',NULL,'2025-12-11 12:48:55','2025-12-11 12:48:55',9,'Medium',0,NULL,0,'Work'),(32,'PIG','LOVE','todo',NULL,'2025-12-11 12:49:07','2025-12-11 12:49:07',9,'Low',0,NULL,0,'Work'),(34,'Test Reminder','Testing reminder feature','todo',NULL,'2026-03-30 09:56:46','2026-03-30 09:57:46',12,'Medium',0,'2024-12-31 16:00:00',1,'Work');
/*!40000 ALTER TABLE `tasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'John','$2b$10$Y7Gm/xDsemQcqaCknlEVUupkBJkPLvR4gpTxEhw9PwJC5aPSy6.bO','2025-12-11 06:47:27'),(2,'123','$2b$10$w.6oLZxUehpEPe0T7AAfRua2xji02JhQwP.I8CJW7dRcFnixVofnK','2025-12-11 06:50:40'),(3,'2338174932@qq.com','$2b$10$9cCGECxyN5226LkBsYSbM.YY3xtf99kvXClhgJtQhG4yXDg6rINeC','2025-12-11 08:39:41'),(8,'123456@123456','$2a$10$BZh9lTes2YTnVocwwxGzGOwITYsmeJfbHqwXYRYumI5goFfD8zYVm','2025-12-11 12:19:33'),(9,'1234@1234','$2a$10$XnHxXolYejhMBVmsCOgX3ONY2EdK6Dj9IfNwBck9xygH3rOUL6xYS','2025-12-11 12:20:20'),(10,'1@1','$2a$10$TSu.D6/PUB5o4Mx7x/nh8uKTajvXDQ9O99jIabKLpy9QulOh.A282','2025-12-11 12:51:20'),(11,'mama@mama','$2a$10$u4wN3RKjz79QlfD3cqv6COhqfrl3DWJEgS7vBpgljHWIR6JoYBo6q','2025-12-11 12:55:47'),(12,'test@test.com','$2a$10$DWF2oB5OxFxsbrkuAfxhE.Xf7jqootHSkA7LXuqjGS9X5nm4194xK','2026-03-30 09:23:53');
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

-- Dump completed on 2026-03-30 18:02:13
