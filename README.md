# My Recipe Book

My Recipe Book is a personal recipe management application. It gives you one place to save, browse, edit, and remove recipes. The React interface communicates with an Express API, and MongoDB Atlas stores recipe records permanently.

## Objectives

- Build a complete MERN application with a clear separation between frontend, API, and database.
- Practise REST API design, data validation, CRUD operations, and asynchronous requests.
- Provide a responsive and accessible interface for managing personal recipes.

## Features

- Create recipes with a name, category, ingredients, preparation steps, and cooking time.
- Browse the newest recipes first, open full recipe details, and edit or delete saved recipes.
- Validate fields in both the browser and the API; MongoDB records include creation and update timestamps.
- Show loading, empty, success, and error states without reloading the page.
- Use MongoDB Atlas for persistent recipe data. There is no local-storage database.

## Technologies

- React 18 and Vite
- Node.js and Express 4
- MongoDB Atlas and Mongoose 8
- Fetch API and custom CSS

## Project Structure

```text
.
├── backend/
│   ├── models/Recipe.js
│   ├── routes/recipeRoutes.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .env.example
└── README.md
```

## Requirements

- Node.js 20 or newer and npm.
- A MongoDB Atlas cluster and a database user with read/write access.
- Network access to Atlas from the development environment.

## MongoDB Atlas Setup

1. Sign in to MongoDB Atlas and create a project and cluster (the free tier is sufficient for development).
2. In **Database Access**, create a database user and grant the least privilege needed for this project, such as read/write access to the chosen database. This user is separate from your Atlas website login.
3. In **Network Access**, allow the IP address that your backend uses to connect. For a temporary academic demo, Atlas allows `0.0.0.0/0`, which permits connections from any IP and is less secure. Prefer a restricted IP range where possible, and remove broad access after the demo.
4. Choose **Connect > Drivers**, select Node.js, and copy the connection URI. Replace the password placeholder with the database user's password. URL-encode special characters in the password if necessary. Set a database name in the path, for example `my_recipe_book`.
5. Keep the URI only in `backend/.env`; never put it in React code, `frontend/.env`, screenshots, or source control. `.env` files are ignored by Git.

## Environment Configuration

Create the backend environment file from the example:

```bash
cp backend/.env.example backend/.env
```

Set its values:

```dotenv
MONGODB_URI=mongodb+srv://<database-user>:<encoded-password>@<cluster-host>/my_recipe_book?retryWrites=true&w=majority
PORT=5000
FRONTEND_URL=http://localhost:5173
```

`MONGODB_URI` is the Atlas connection string and is required for recipe CRUD. `FRONTEND_URL` is an optional browser-origin restriction; use your Vite forwarded URL in Codespaces if setting it there. Leaving it unset enables CORS from any origin, which is convenient for development but not recommended for a deployed application.

During development, the frontend defaults to the same-origin `/api` path. Vite proxies these requests to the backend at `http://127.0.0.1:5000`, which works in Codespaces without making the backend port public. To override the API base URL, create `frontend/.env`:

```dotenv
VITE_API_URL=/api
```

For production or a separately hosted API, set `VITE_API_URL` to the complete API base URL, such as `https://api.example.com/api`. If using the backend's separate Codespaces forwarded URL directly, its port must be accessible to your browser and `FRONTEND_URL` must allow the frontend origin. Restart Vite after changing environment variables. The value is public frontend configuration; it must never contain a database credential.

## Install Dependencies

From the workspace root, install each service independently:

```bash
npm install --prefix backend
npm install --prefix frontend
```

## Run the Application

Open two terminals in the workspace.

Backend terminal:

```bash
cd backend
npm run dev
```

The API listens on `0.0.0.0:5000`. For a non-watching start, use `npm start` in `backend/`.

Frontend terminal:

```bash
cd frontend
npm run dev
```

Vite listens on `0.0.0.0:5173`. Open the forwarded port 5173 URL in Codespaces. Make both forwarded ports accessible to your browser. The frontend's `VITE_API_URL` must point to the backend's forwarded port URL, not to the Vite URL. If setting `FRONTEND_URL`, use the browser origin of the forwarded Vite port (without `/api`).

Build the frontend for production with:

```bash
cd frontend
npm run build
```

## API Endpoints

All recipe endpoints are rooted at `/api/recipes`.

| Method | Path | Purpose | Success |
| --- | --- | --- | --- |
| GET | `/api/health` | Server and database connection status | 200 when connected, 503 otherwise |
| GET | `/api/recipes` | List recipes, newest first | 200 |
| GET | `/api/recipes/:id` | Get one recipe | 200 |
| POST | `/api/recipes` | Create a recipe | 201 |
| PUT | `/api/recipes/:id` | Replace recipe fields and return the updated recipe | 200 |
| DELETE | `/api/recipes/:id` | Delete a recipe | 200 |

POST and PUT accept a JSON body with all five fields:

```json
{
	"name": "Herb omelette",
	"category": "Breakfast",
	"ingredients": "2 eggs\nFresh herbs\nA pinch of salt",
	"preparationSteps": "Whisk the eggs.\nCook gently with the herbs.",
	"cookingTime": 10
}
```

The allowed categories are `Breakfast`, `Lunch`, `Dinner`, `Snack`, and `Dessert`. Invalid IDs and invalid values return 400, missing recipes return 404, unavailable database requests return 503, and unexpected server errors return a generic 500 response. Errors are returned as JSON with a useful `message`; validation errors may also include an `errors` array. The API does not expose stack traces.

## Validation

- Recipe name, category, ingredients, preparation steps, and cooking time are required.
- Name, ingredients, and preparation steps are trimmed. Category must match one of the five allowed values.
- Cooking time must be a number of at least one minute; the interface accepts whole minutes.
- Mongoose schema validation runs during creation and updates (`runValidators: true`).
- The browser checks required fields and cooking time before sending a request. The API also checks required fields and relies on Mongoose for category, type, and minimum validation.
- Mongoose timestamps provide `createdAt` and `updatedAt`.

## GitHub Codespaces

Codespaces assigns forwarded URLs to the ports. Start both services and open the forwarded frontend port 5173. In development, the Vite `/api` proxy forwards requests internally to port 5000, so port 5000 does not need to be made public. If you choose a direct forwarded backend URL instead, make that port accessible to the browser and configure `FRONTEND_URL` in `backend/.env` to the forwarded frontend origin. Restart the services after changing environment files.

## Deploy the Frontend to GitHub Pages

The `.github/workflows/deploy-pages.yml` workflow builds the React frontend and deploys it to GitHub Pages whenever a commit is pushed to `main`. GitHub Pages serves static files only; it cannot run the Express API or connect directly to MongoDB. Recipe operations require the API to be deployed separately, for example using the included Railway Docker configuration.

1. Deploy the backend using the root `Dockerfile` on a Node-capable host, set `MONGODB_URI` as a server-side secret, and generate a public backend URL. Verify its `/api/health` endpoint reports `database: connected`.
2. In the GitHub repository, open **Settings > Secrets and variables > Actions > Variables** and create the repository variable `VITE_API_URL`, set to the backend URL ending in `/api` (for example `https://your-api.example.com/api`). This URL is public frontend configuration, not a database credential.
3. Open **Settings > Pages** and set the publishing source to **GitHub Actions**.
4. Push to `main` or run **Deploy frontend to GitHub Pages** from the **Actions** tab. After the workflow succeeds, the site URL is `https://irene225764.github.io/mernstack_final1/`.
5. If the backend restricts CORS, set its `FRONTEND_URL` to `https://irene225764.github.io`.

The repository root `Dockerfile` and `railway.json` can deploy the API and frontend together on Railway instead. If using a separate API host, only deploy the backend there and point the Pages workflow at that API. Atlas Network Access must allow the backend host to connect. Check the backend provider's current plan and pricing before deploying; never place `MONGODB_URI` in GitHub Pages variables or frontend code.

## Troubleshooting

- **Database reports disconnected / recipe requests return 503:** Check that `backend/.env` exists, `MONGODB_URI` is correct, the database user's password is URL-encoded where needed, and Atlas Network Access allows the backend's IP.
- **Frontend cannot reach the API:** Confirm the backend is running, the forwarded port is available, `VITE_API_URL` includes `/api`, and Vite was restarted after editing `.env`.
- **CORS error:** Set `FRONTEND_URL` to the exact frontend origin (scheme and host, no path), then restart the backend. Ensure the Codespaces forwarded port is accessible.
- **Invalid recipe response:** Verify all five fields are supplied, category matches the allowed values exactly, and cooking time is at least one.
- **Port already in use:** Stop the other process using the port or choose another `PORT` for the backend. Vite's configured default is 5173.

## Presentation Overview

The frontend is responsible for the form, recipe cards, details dialog, and user feedback. When a user saves or edits a recipe, React sends JSON with Fetch to an Express route. The route checks the request and Mongoose validates the data against the recipe schema before MongoDB stores it. The API returns JSON, and React updates its state so the page reflects the change immediately. The MongoDB connection string stays on the backend, away from browser code.