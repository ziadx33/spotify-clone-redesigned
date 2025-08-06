# Spotiq 🎵

A fully custom music streaming platform built with React, Next.js, TypeScript, and Tailwind CSS. Designed from the ground up with a unique UI and essential features like playback, queue management, and user profiles.

## Features

- Music playback and control
- Search for tracks, albums, and artists
- Playlist management
- Responsive design optimized for desktop and mobile
- Server-side rendering with Next.js
- TypeScript for type safety
- Tailwind CSS for utility-first styling

## Videos

- **Project Introduction:** Get an overview of the project and its features: [Watch the Introduction Video](https://youtu.be/TkTtpf5ez_0?si=LkYhASLqIal4765C)

## Tech Stack

- **Frontend:** React, Next.js, TypeScript, Tanstack Query, Tailwind CSS
- **Backend:** Prisma, Next.js
- **Database:** PostgreSQL

## Installation

To set up the project locally, follow these steps:

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/ziadx33/spotify-clone-redesigned.git
   cd spotify-clone-redesigned
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Set Up Environment Variables:**

   - Copy the example environment file:
     ```bash
     cp .env.example .env
     ```
   - Edit the `.env` file and update it with your database connection details and other configuration settings.

4. **Set Up the Database:**

   - Ensure PostgreSQL is installed and running.
   - Create a new PostgreSQL database.
   - Update the `.env` file with your database connection details.
   - Apply Prisma migrations:
     ```bash
     npx prisma migrate dev
     ```

5. **Run the Development Server:**

   ```bash
   npm run dev
   ```

   - Open your browser and go to `http://localhost:3000` to view the application.

6. **Build and Run for Production (Optional):**
   - Build the project for production:
     ```bash
     npm run build
     ```
   - Start the production server:
     ```bash
     npm start
     ```
