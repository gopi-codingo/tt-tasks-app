const express = require("express");
require("dotenv").config();
const userRoutes = require("./modules/users/route");
const { authMiddleware, idMiddleware } = require("./modules/users/middleware");
const tasksRoutes = require("./modules/tasks/route");

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

app.post("/", ( req, res, next ) => {
    console.log(req.body)
    return res.send({"hello": "world"});
});

app.use(userRoutes);
app.use(authMiddleware);
app.use(idMiddleware);
app.use(tasksRoutes);

const error = require('./modules/errors/middleware');
app.use(error);

app.listen(port, () => {
    console.log("Tasks App running on Port : " + port);
});