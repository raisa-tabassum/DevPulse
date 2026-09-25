DevPulse – Internal Tech Issue & Feature Tracker

<!-- Live URL : ... ... ... -->

Features :

- User signup and login
- JWT based authentication
- Contributor and Maintainer roles
- Create bug/feature issues
- View all issues
- Filter issues by type and status
- Sort issues by newest/oldest
- View single issue details
- Contributors can update their own open - issues
- Maintainers can update and delete any issues
- PostgreSQL database integration(NeonDB)

Tech Stack :

- Node.js
- TypeScript
- Express.js
- PostgreSQL
- pg
- bcrypt
- jsonwebtoken

Setup Steps :

1. Clone the repository
   <!-- git clone <repository-url> -->

2. Go to the project folder
   <!-- cd <project-folder> -->

3. Install dependencies
   npm install

4. Create a .env file
   PORT=5000
   DATABASE_URL=your_neon_database_url
   NODE_ENV=development
   JWT_SECRET=your_jwt_secret

5. Run the project
   npm run dev

API Endpoints :

1. User Signup

POST /api/auth/signup

Creates a new user account.

2. User Login

POST /api/auth/login

Authenticates the user and returns a JWT token.

3. Create Issue

POST /api/issues

Creates a new bug or feature issue. Authentication is required.

4. Get All Issues

GET /api/issues

Returns all issues with optional filtering and sorting.

GET /api/issues?sort=newest
GET /api/issues?sort=oldest
GET /api/issues?type=bug
GET /api/issues?type=feature_request
GET /api/issues?status=open
GET /api/issues?status=in_progress
GET /api/issues?status=resolved

5. Get Single Issue

GET /api/issues/:id

Returns details of a specific issue.

6. Update Issue

PATCH /api/issues/:id

Updates an issue based on the user's role and permissions.

7. Delete Issue

DELETE /api/issues/:id

Deletes an issue. Maintainer access is required.

Database Schema Summary :
Users:

- id
- name
- email
- password_hash
- role
- created_at
- updated_at

Roles:
contributor | maintainer

Issues:

- id
- title
- description
- type
- status
- reporter_id
- created_at
- updated_at

Issue Types:
bug | feature_request

Issue Statuses:
open | in_progress | resolved

Role & Permissions

Contributor:

- Register and login
- Create issues
- View issues
- Update their own issues when the status is open

Maintainer:

- All contributor permissions
- Update any issue
- Delete any issue
- Change issue workflow status
