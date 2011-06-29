-- phpMyAdmin SQL Dump
-- version 2.11.7.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jun 29, 2011 at 05:54 PM
-- Server version: 5.0.41
-- PHP Version: 5.2.6

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `freego`
--

-- --------------------------------------------------------

--
-- Table structure for table `place`
--

CREATE TABLE IF NOT EXISTS `place` (
  `id` int(11) NOT NULL auto_increment,
  `project` int(11) NOT NULL,
  `title` varchar(128) collate utf8_bin NOT NULL,
  `address` varchar(512) collate utf8_bin NOT NULL,
  `lat` decimal(20,17) NOT NULL,
  `lng` decimal(20,17) NOT NULL,
  `sorting` int(11) NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=19 ;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL auto_increment,
  `username` varchar(256) collate utf8_bin NOT NULL,
  `email` varchar(256) collate utf8_bin NOT NULL,
  `password` varchar(256) collate utf8_bin NOT NULL,
  `createdate` datetime NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=3 ;
