-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: roomly
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.28-MariaDB

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
-- Table structure for table `locacao_loca`
--

DROP TABLE IF EXISTS `locacao_loca`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `locacao_loca` (
  `ID_Locacao` int(11) NOT NULL,
  `Checkin` datetime DEFAULT NULL,
  `Checkout` datetime DEFAULT NULL,
  `fk_usuario_ID_Usuario` int(11) DEFAULT NULL,
  `fk_salas_ID_Sala` int(11) DEFAULT NULL,
  PRIMARY KEY (`ID_Locacao`),
  KEY `FK_locacao_loca_2` (`fk_usuario_ID_Usuario`),
  KEY `FK_locacao_loca_3` (`fk_salas_ID_Sala`),
  CONSTRAINT `FK_locacao_loca_2` FOREIGN KEY (`fk_usuario_ID_Usuario`) REFERENCES `usuario` (`ID_Usuario`),
  CONSTRAINT `FK_locacao_loca_3` FOREIGN KEY (`fk_salas_ID_Sala`) REFERENCES `salas` (`ID_Sala`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `locacao_loca`
--

LOCK TABLES `locacao_loca` WRITE;
/*!40000 ALTER TABLE `locacao_loca` DISABLE KEYS */;
/*!40000 ALTER TABLE `locacao_loca` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `papel`
--

DROP TABLE IF EXISTS `papel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `papel` (
  `ID_Papel` int(11) NOT NULL AUTO_INCREMENT,
  `Papel` int(11) DEFAULT NULL,
  `Nome_Papel` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`ID_Papel`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `papel`
--

LOCK TABLES `papel` WRITE;
/*!40000 ALTER TABLE `papel` DISABLE KEYS */;
INSERT INTO `papel` VALUES (1,1,'Usuario'),(2,2,'Locador');
/*!40000 ALTER TABLE `papel` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `salas`
--

DROP TABLE IF EXISTS `salas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `salas` (
  `ID_Sala` int(11) NOT NULL AUTO_INCREMENT,
  `Capacidade` int(11) DEFAULT NULL,
  `Tamanho` decimal(9,2) DEFAULT NULL,
  `Valor_Hora` decimal(7,2) DEFAULT NULL,
  `Recursos` varchar(200) DEFAULT NULL,
  `Tipo_Mobilia` varchar(200) DEFAULT NULL,
  `CEP` varchar(8) DEFAULT NULL,
  `Rua` varchar(100) DEFAULT NULL,
  `Cidade` varchar(50) DEFAULT NULL,
  `Estado` varchar(50) DEFAULT NULL,
  `Numero` int(11) DEFAULT NULL,
  `Complemento` varchar(50) DEFAULT NULL,
  `Descricao` varchar(200) DEFAULT NULL,
  `fk_usuario_ID_Usuario` int(11) DEFAULT NULL,
  `fk_tipo_sala_ID_Tipo_Sala` int(11) DEFAULT NULL,
  `Status` int(11) DEFAULT NULL,
  `Segunda_Disp` int(11) DEFAULT NULL,
  `Terca_Disp` int(11) DEFAULT NULL,
  `Quarta_Disp` int(11) DEFAULT NULL,
  `Quinta_Disp` int(11) DEFAULT NULL,
  `Sexta_Disp` int(11) DEFAULT NULL,
  `Sabado_Disp` int(11) DEFAULT NULL,
  `Domingo_Disp` int(11) DEFAULT NULL,
  PRIMARY KEY (`ID_Sala`),
  KEY `FK_salas_2` (`fk_usuario_ID_Usuario`),
  KEY `FK_salas_3` (`fk_tipo_sala_ID_Tipo_Sala`),
  CONSTRAINT `FK_salas_2` FOREIGN KEY (`fk_usuario_ID_Usuario`) REFERENCES `usuario` (`ID_Usuario`) ON DELETE CASCADE,
  CONSTRAINT `FK_salas_3` FOREIGN KEY (`fk_tipo_sala_ID_Tipo_Sala`) REFERENCES `tipo_sala` (`ID_Tipo_Sala`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `salas`
--

LOCK TABLES `salas` WRITE;
/*!40000 ALTER TABLE `salas` DISABLE KEYS */;
INSERT INTO `salas` VALUES (11,1,1.00,1.00,'tetse','teste','81900000','Rua Izaac Ferreira da Cruz','Curitiba','PR',123,'teste','teste',5,8,1,0,1,0,0,0,0,0);
/*!40000 ALTER TABLE `salas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_sala`
--

DROP TABLE IF EXISTS `tipo_sala`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo_sala` (
  `ID_Tipo_Sala` int(11) NOT NULL AUTO_INCREMENT,
  `Tipo` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`ID_Tipo_Sala`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_sala`
--

LOCK TABLES `tipo_sala` WRITE;
/*!40000 ALTER TABLE `tipo_sala` DISABLE KEYS */;
INSERT INTO `tipo_sala` VALUES (1,'Sala de reunião'),(2,'Auditório'),(3,'Sala de treinamento'),(4,'Estúdio de gravação'),(8,'Sala teste');
/*!40000 ALTER TABLE `tipo_sala` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `ID_Usuario` int(11) NOT NULL AUTO_INCREMENT,
  `Nome` varchar(100) DEFAULT NULL,
  `CPF` char(11) DEFAULT NULL,
  `Email` varchar(50) DEFAULT NULL,
  `Telefone` char(11) DEFAULT NULL,
  `Senha` varchar(255) DEFAULT NULL,
  `fk_papel_ID_Papel` int(11) DEFAULT NULL,
  PRIMARY KEY (`ID_Usuario`),
  KEY `FK_usuario_2` (`fk_papel_ID_Papel`),
  CONSTRAINT `FK_usuario_2` FOREIGN KEY (`fk_papel_ID_Papel`) REFERENCES `papel` (`ID_Papel`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (5,'Leonardo Stall (locador)','28114896060','stall.leonardo+locador@pucpr.edu.br','41996384242','$2b$12$/dId8Y9poMTEwKr/B8MyaOH7OLJjLxs/tFuwRjupeKF2azDSWImfO',2),(6,'Leonardo Stall (locatario) teste','09201426054','stall.leonardo+locatario@pucpr.edu.br','41996384242','$2b$12$sx5AhDNADiusjR4Dd5galeMOGqcULHaG.eiJnzdAzo2tUK9S/laFW',1);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-11 22:41:29
