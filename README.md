# InTrack - OJT Monitoring System

## How to Run the App from a Downloaded ZIP File

Follow these steps if you received this project as a ZIP file.

### 1. Install Node.js

Before running the app, install Node.js from:

https://nodejs.org/

Use the LTS version. After installing, restart your terminal or command prompt.

To check if Node.js is installed, run:

```bash
node -v
npm -v
```

Both commands should show version numbers.

### 2. Download and Extract the ZIP File

1. Download the project ZIP file.
2. Right-click the ZIP file and choose **Extract All**.
3. Open the extracted folder.

Make sure the folder contains files such as:

```text
package.json
package-lock.json
src
public
vite.config.ts
```

### 3. Open the Project Folder in a Terminal

Open a terminal or command prompt inside the extracted project folder.

On Windows, you can:

1. Open the extracted folder.
2. Click the address bar.
3. Type `cmd`.
4. Press Enter.

### 4. Install the App Packages

Run these commands once:

```bash
npm install
python -m pip install -r requirements.txt
```

This downloads the website packages into `node_modules` and installs the FastAPI backend packages for Python.

### 5. Set Up MySQL Workbench

1. Open MySQL Workbench and connect to your local MySQL server.
2. Open `database/schema.sql`.
3. Run the full script. It creates the `pup_intrack` database and the tables used by the app.
4. Confirm that the `authorized_students` table contains the initial student whitelist.
5. Copy `.env.example` to a new file named `.env`.
6. In `.env`, update `DB_USER` and `DB_PASSWORD` to match your MySQL Workbench connection.

Example:

```text
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=pup_intrack
API_PORT=3001
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_sender_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM="InTrack - OJT Monitoring System <your_sender_email@gmail.com>"
```

The OTP sender uses SMTP. If the SMTP fields are blank, the local API will generate the OTP email in the server output for development. Add real SMTP credentials before using the app with students.

### 6. Start the App

Run:

```bash
npm run dev
```

The terminal starts both the database API and the website. The website address is usually:

```text
http://localhost:5173/
```

Open that address in your browser. The app API runs at:

```text
http://localhost:3001/
```

FastAPI's interactive API docs are available at:

```text
http://localhost:3001/docs
```

### 7. Stop the App

To stop the app, go back to the terminal and press:

```text
Ctrl + C
```

Then type `Y` if the terminal asks for confirmation.

## Optional: Build the App

To create a production build, run:

```bash
npm run build
```

The finished files will be created in the `dist` folder.

To preview the production build locally, run:

```bash
npm run preview
```

## Troubleshooting

If `npm install` fails, make sure Node.js is installed correctly and that you are inside the extracted project folder.

If the browser does not open automatically, copy the local address from the terminal and paste it into your browser.

If port `5173` is already being used, Vite may show a different local address. Use the address shown in the terminal.
