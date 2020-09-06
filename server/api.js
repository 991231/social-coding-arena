// express
const app = require("express")();

// firebase
const fbFunctions = require("firebase-functions");
const { db } = require("./api/utils/fbAdmin");

// API routes

// TODO: user
app.post("/signup"); // sign up new user
app.post("/signin"); // sign in user

// TODO: contest
app.get("/contest"); // get available contests
app.post("/contest"); // request create contest room, response id
app.post("/contest/:roomID"); // post code submissions, response evaluation result
app.get("/contest/:roomID/leaderboard"); // contest leaderboard

exports.api = fbFunctions.https.onRequest(app);
