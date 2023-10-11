# React + TanStack Query 
TanStack Query gives you declarative, always-up-to-date auto-managed queries and mutations that directly improve both your developer and user experiences.
![tanstack](https://github.com/Rahul4dev/React_Query/assets/114183358/bace35d1-972b-4746-bb57-b7709d14d59c)


## How to run the project in a local environment?
  step 1: Clone / Fork the repository / Download the Zip of the project
  step 2: Open the folder in VS-Code or your code editor and open the terminal
  step 3: Duplicate the terminal, one for frontend and send for backend
  step 4: Install the dependencies for frontend and backend files for that
      - For frontend: In the terminal run ```npm install ``` 
      - For backend: first, run ``` cd backend ``` to navigate to the backend folder and then run ```npm install ```
  Step 6: In frontend run ``` npm run dev``` and in backend run  ```npm start```

  Now both terminals will run their chain of commands to run the local server. In frontend, you will see 
```
> react-query@0.0.0 dev
> vite

  VITE v4.4.9  ready in 1032 ms
  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Here You can open the live server to see the frontend page by clicking  ```http://localhost:5173/``` using the ctrl or cmd key

While the Backend terminal will show
```
> backend@1.0.0 start
> node app.js

Server running on port 3000
```
Now your backend server is also up and running. Now you can see the whole page and do certain activities:
  - See the recent events
  - Search for all or specific events. For all events, you have to enter the search bar empty.
  - You can see specific events by navigating to their detail page where you can also edit and delete the event.
  - On the main page, you can add new events by clicking the new event button and filling out the forms. Right now we have limited pictures for the theme of the event.

## Directories: 
  - In this `main` directory: The whole project is based on React queries except the editEvent.jsx and app.jsx where I have used the `react-router-dom` to fetch the data and provide it before the component's loading.
  - In `useMutation` directory, you can see how we can use `useMutation` hook of the react query to edit the content and provide it to the component and also integrate other features of the react query.
