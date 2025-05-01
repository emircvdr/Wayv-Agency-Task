# Music Campaign Admin Dashboard

Welcome to the Music Campaign Admin Dashboard — a full-featured web application designed for managing music campaigns through an intuitive admin interface. The app allows authorized administrators to perform all CRUD (Create, Read, Update, Delete) operations on campaigns. This project is built with modern web technologies including **Next.js**, **TypeScript**, **Supabase**, **tRPC** and **Drizzle ORM**, and is fully deployed on **Vercel**.

## 🚀 Live Demo

You can check out the live application here:

🔗 [https://wayv-agency-task.vercel.app](https://wayv-agency-task.vercel.app)

## 🔐 Admin Login Credentials

> Use the following dummy credentials for testing purposes:

- **Email**: `admin@admin.com`
- **Password**: `admin123`

## Tech Stack

- **Frontend**:

  - React 18 with functional components
  - Next.js 15 with App Router
  - TypeScript
  - Tailwind CSS
  - Shadcn UI
  - Tankstack Table and Tanstack Query

- **Backend**:

  - tRPC for type-safe API
  - Drizzle ORM for database schema and queries

- **Database**:
  - PostgreSQL

## Features

- **Dashboard**:
  - Overview of all music campaigns
  - Filter ------
- **Campaign Management**:
  - Create new campaigns with campaign title, brand, start date,end date, budget, image, and campaign description
  - View campaign details with the card preview
  - Update existing campaigns
  - Delete campaigns
  - Update existing image for the existing campaign

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (local or remote)

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/emircvdr/Wayv-Agency-Task.git

```

### 2. Install dependencies

```bash
npm install

```

### 3. Set up the database

1. Create a PostgreSQL database for the application
2. Set up your environment variables in `.env`:

```
NEXT_PUBLIC_SUPABASE_URL=<SUBSTITUTE_SUPABASE_URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<SUBSTITUTE_SUPABASE_ANON_KEY>
DATABASE_URL=postgresql://postgres:your-password@your-project-ref.supabase.co:5432/postgres
```

- ## Where to get these values?\*\*
  **You can find these values in your Supabase dashboard**
  1. Go to your Supabse Project 🔗 [https://app.supabase.com](https://app.supabase.com)
  2. Select Your Project
  3. Navigate to Settings -> API
     3.1. Copy `Project URL` -> use it as `NEXT_PUBLIC_SUPABASE_URL`
     3.2. Copy `anon public` key -> use it as `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  4. Click the `Connect` button top of the screen
     4.1. Click the ORMs
     4.2. Select the Drizzle
     4.3 Copy and paste the `DATABASE_URL`

2. Run database migrations:

```bash
npx drizzle-kit push
```

### 4. Run the development server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Fmusic-campaign-admin)

1. Push your code to GitHub
2. Import your repository to Vercel
3. Add the environment variables in the Vercel project settings
4. Deploy!
