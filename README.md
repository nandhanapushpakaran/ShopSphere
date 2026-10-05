# ShopSphere

Modern mini e-commerce store built with Next.js, Django REST Framework and PostgreSQL.

## Overview

ShopSphere is a full-stack e-commerce web application featuring a modern lifestyle and tech storefront. It demonstrates end-to-end integration between a Next.js App Router frontend, a robust Django REST Framework backend, and a PostgreSQL database.

## Features

- **Product Catalog**: Browse, search, filter by category, and sort products with responsive grid layouts.
- **Stock & Availability**: Real-time stock status display and strict inventory boundaries.
- **Shopping Cart**: Guest cart persistence using browser localStorage with safe hydration.
- **User Authentication**: Secure user registration, token-based authentication, and profile management.
- **Simulated Checkout**: Delivery address collection and transactional order placement without real payment gateways.
- **Order Management**: Historical price snapshots, unique order numbers, status tracking, and protected order history.
- **Responsive Interface**: Polished, mobile-first design built with Tailwind CSS.

## Frontend

- **Framework**: Next.js (App Router)
- **UI Library**: React 19 & TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Context (CartContext, AuthContext)
- **Testing**: Vitest

## Backend

- **Language**: Python 3.11
- **Framework**: Django 5.x
- **API Engine**: Django REST Framework
- **CORS Handling**: django-cors-headers
- **Testing**: Django Test Suite (17 automated tests)

## Database

- **Database**: PostgreSQL (with SQLite development fallback)
- **ORM**: Django ORM with atomic transactions
- **Models**: Category, Product, Order, OrderItem, User, UserProfile
- **Integrity**: Server-side recalculated totals, non-negative stock validation, and price snapshots.

## Authentication & Security

- **Authentication**: Token-based authentication via DRF uthtoken.
- **Password Security**: Standard PBKDF2 password hashing; plain-text passwords are never stored.
- **Transactional Consistency**: select_for_update() and 	ransaction.atomic() during checkout prevent overselling and race conditions.
- **Strict Authorization**: Order access and profile endpoints are strictly scoped to the authenticated user on the backend.
- **Environment Isolation**: All configuration values read from environment variables; .env is gitignored.

## Project Purpose

This project is the final capstone in a portfolio series demonstrating intermediate full-stack engineering skills, secure REST API design, relational data modeling, and clean modern frontend architecture.

## Author

Built by [Nandh](https://github.com/nandh) as a portfolio project.
