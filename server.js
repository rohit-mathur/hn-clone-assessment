import 'babel-polyfill';
import express from 'express';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router';
import App from './src/containers/app';
import bodyParser from 'body-parser';
const PORT = process.env.PORT || 3000;
const app = express();


app.use(bodyParser.json())
app.use(express.static('build'))

app.get("*", (req, res) => {
    const context = {};
    const content = ReactDOMServer.renderToString(
        <StaticRouter location={req.url} context={context}>
            <App />
        </StaticRouter>
    )

    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta
      name="description"
      content="Web site created using create-react-app"
    />
        <link rel="stylesheet" href="main.css" />
        <link rel="manifest" href="../public/manifest.json" />
        <title>Hacker News Clone App</title>
    </head>
    <body>
    <div id="root">${content}</div>
    <script src="public/client_bundle.js"></script>
    </body></html>`;
    return res.send(html)
})


app.listen(PORT, () => {
    console.log('Server started at : ', PORT)
})