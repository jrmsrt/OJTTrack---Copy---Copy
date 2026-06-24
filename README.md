# OJTTrack

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

Run this command once:

```bash
npm install
```

This downloads the required packages into a `node_modules` folder.

### 5. Start the App

Run:

```bash
npm run dev
```

The terminal will show a local website address, usually:

```text
http://localhost:5173/
```

Open that address in your browser.

### 6. Stop the App

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
