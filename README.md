# Todo App

A modern, full-featured Todo application built with Next.js, React, Redux Toolkit, and Tailwind CSS.

## Features

- User authentication (signup, login, logout)
- Profile management with image upload
- Create, update, delete, and view todos
- Priority badges (Extreme, Moderate, Low) with color-coded cards
- Drag & drop reordering (visual only)
- Search and filter todos by deadline
- Responsive, clean UI

## Tech Stack

- Next.js 16 (App Router)
- React 19
- Redux Toolkit & Redux Persist
- Zod validation
- Tailwind CSS 4
- Sonner for notifications
- AWS S3 for profile images

## Getting Started

1. **Install dependencies:**
   ```
   npm install
   ```
2. **Run the development server:**
   ```
   npm run dev
   ```
3. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

## Folder Structure

- `app/` — Main app pages and components
- `libs/` — Redux slices, hooks, API logic, validation schemas
- `public/` — Static assets (icons, images)

## API

- Backend: [https://todo-app.pioneeralpha.com](https://todo-app.pioneeralpha.com)
- All CRUD operations use REST endpoints

## Customization

- Priority badge colors and card borders are customizable in `TodoCard.tsx`
- Modal and layout styles are easily adjustable via Tailwind classes

