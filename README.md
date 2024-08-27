# Spotify Clone Redesigned 🎵

A modern redesign of Spotify, built using React, Next.js, TypeScript, and Tailwind CSS. This project mimics Spotify's core functionalities with a fresh, sleek interface.

## Features

- Music playback and control
- Search for tracks, albums, and artists
- Playlist management
- Responsive design optimized for desktop and mobile
- Server-side rendering with Next.js
- TypeScript for type safety
- Tailwind CSS for utility-first styling

## Videos

- **Redesign Video:** View the redesign process and features here: [Watch the Video](https://www.youtube.com/watch?v=suhEIUapSJQ&pp=ygURc3BvdGlmeSByZS1kZXNpZ24%3D) (Note: This video is not created by me.)

- **Project Introduction:** Get an overview of the project and its features: [Watch the Introduction Video](https://youtube.com) ( soon )

## Tech Stack

- **Frontend:** React, Next.js, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express, Prisma
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

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes. Make sure to follow the project's coding standards and include relevant tests.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
```

Replace `YOUR_INTRODUCTION_VIDEO_LINK_HERE` with the actual link to the introduction video. This way, users can view both the redesign process and an introductory overview of the project.
