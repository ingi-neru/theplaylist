import bodyParser from "body-parser";
import path from "path";
import express from "express";
import session from "express-session";
import fs from "fs";
import { createClient, connectClient } from "./db/connectClient.db.js";
import mainRouter from "./routes/main.router.js";

const PORT = process.env.PORT || 3000;
const client = createClient();
connectClient(client);
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.set("static", path.join(process.cwd(), "static"));
app.set("views", path.join(process.cwd(), "views"));
app.use("/", mainRouter);
app.use(
    session({
        secret: "142e6ecf42884f03",
        resave: false,
        saveUninitialized: true,
    }),
);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
