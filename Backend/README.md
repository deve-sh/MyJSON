# MyJSON - Backend

This is the documentation regarding the Backend of MyJSON, in fact the main part of the web app.

### Introduction

Let's start with a story, I worked as a Front End Developer at a start-up that had all the design mockups ready, but had none of the Backend features ready, and a big part of it was the due to the fact that they had to custom generate the fake data they had to put into their backends. I wondered if we could have a tool that gave you the data you needed, in the format you need it, then that's absolutely FUCKING GOLD!

The MyJSON Backend acts as custom Fake JSON Generator for various purposes such as App Testing, filling in data in the Backend or the Frontend (You could always request data from MyJSON in order to fill your layouts and components).

MyJSON Allows various routes for fakedata, many of them are identical to [JSON Placeholder](https://jsonplaceholder.typicode.com) which is a big inspiration for this app. The most important one however is the `POST api/getjson` route.

Let's have a look at the routes.

For instructions on how to set the app up, just follow the guide in the main README at the Repository Root.

## Routes

### `POST /api/getjson`

This is the most important route of the app, or rather, the app that sets this out from all the other apps. This route accepts a JSON Object as its request body in the form : 

```js
body : {
    fields : {
      ID: {
    	type: "number",
        range: [10,25],
        serial : true
      },
      name: {
        type: "text",
        choice : "words",
        n : 2
      },
      password : {
        type : "password",
        randomLength : false,
        length: 5
      },
      username: {
		type: "text-unspaced"
      }
    },
    n : 10
```