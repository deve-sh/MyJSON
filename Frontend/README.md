# MyJSON - Frontend

This is the frontend repository of the service **MyJSON**, and serves just as a placeholder or a facilitator on top of the main functionality of the backend service.

For the backend docs, and instructions on how to use the MyJSON API, refer to the backend docs in the separate folder.

## Small background

The frontend is written in React, it's a simple app that supports Dark Mode functionality as well just as a cherry on top.

### Setting up

To setup the frontend, follow the following commands from your terminal.

```bash
git clone https://github.com/deve-sh/MyJSON.git
cd MyJSON/Frontend
npm install
npm start	# Starts the dev server.
```

In order to setup and start your backend, open up a new instance of your terminal.

```bash
cd MyJSON/backend
npm install
npm start # or npm run dev # if you have nodemon installed
```

Following the above instructions launches an app on ports `4567` (Backend) and `3000` (Frontend),
you can edit the configuration of the frontend in the **`src/config/index.js`** file.

You can change the remote backend URL if you are using the app in production in the config file as well.

Now you can follow the setup in the app that you just launched in order to modify the structure of the data you need, and get the JSON you need.

## Issues, Contributions and Suggestions

For issues, open an issue in the repo.
For contributions, just make the changes necessary by forking the repo and open a pull request. Pull requests that pass and are deemed worthwhile will be merged.
For suggestions, just [mail me](mailto:devesh2027@gmail.com).