import { database } from "./config/database";
import bodyParser from 'body-parser';
import express from 'express';
import routes from './routes';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

routes(app);

(async () => {
    await database.loadAll();

    app.listen(80, () => console.log(`Server listening on port 80`))
})()
