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
}
```

**Note** : The following code snippets are examples of the data one has to send to the API. Do convert it to JSON before sending it.

These are the supported types of Data Requestable from the route :

- **text** : Used to generate random lorem ipsum texts consisting of a set of n words or paragraphs.

```js
{
  type: "text",
  choice: "words/para (Default : 2 paragraphs of lorem ipsum.)",
  n: "Number of words or paras" // Max : 50, Min : 1
}
```

- **text-unspaced** : Used to generate non spaced strings of random characters, example : Usernames, titles etc.

```js
{
  type: "text-unspaced",
  n: "Number of characters (Default : 20)"
}
```

- **number** : Used to generate serial and random numbers.

```js
{
  type: "number",
  range: ["Number1", "Number2"], // Used only when you are generating inside a range. Default is random numbers below 10.
  serial: "boolean", // Required if the data is serial, for example : when generating userIDs. Default: false
  floating: "boolean" // Send as true if the numbers are supposed to be floating point numbers or integers. Default: false
}
```

- **email** : Used to generate email addresses. You can specify the length of the name, (the **top level domain** or the **entire service provider**).

```js
{
  type: "email",
  tld: "in",   // Will Give .in email addresses.
  serviceProvider: "xyz.com",   // Cannot be used in conjunction with Top Level Domain.
  nameLength: 6   // Length of the name in name@serviceProvider
}
```

- **boolean** : Used to generate `true` or `false` values depending on the need. It generates true or false based on `Math.random` by generating true if the outcome of Math.random is over 0.5 and false otherwise, hence, giving both of them a 50 - 50 chance of occuring.

```js
{
  type: "boolean"
} // That's it for boolean. No optiong available for now.
```

- **password** : Used to generate **hashes** for random passwords for storage in a database. These passwords are hashed using the `bCrypt` library for Node.js.

The default length of a random password generated is 8 (Right now there aren't many choices regarding that, since the length of the password hardly has any effect on the length of the hash. (Do correct me if I am wrong here.) )

If you want to generate text passwords that are not in the form of hashes, just use the **text-unspaced** format for data.

```js
{
  type: "password",    // "pass" will work too.
  randomLength: true  // Boolean : Generate random passwords of random length.
}
```