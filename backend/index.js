import express from "express";
import bodyparser from "body-parser";
import cors from "cors";
import path from "path";

const PORT = process.env.PORT || 3001;

const app = express();

app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}));

// serve react app in backend
app.use(express.static(path.join('build')))
app.get("*", function (request, response) {
    response.sendFile('index.html', {root: path.join('build')})
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
