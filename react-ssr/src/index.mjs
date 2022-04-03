import fs from "fs";
import http from "http";
import React from "react";
import { renderToPipeableStream } from "react-dom/server";
import { dirname } from "path";
import { fileURLToPath } from "url";

import { App } from "./front/App.jsx";

const __dirname = dirname(fileURLToPath(import.meta.url));

const hostname = "127.0.0.1";
const port = 3000;

const TEMPLATE_APP_WRITE_POINT = "$app";
const FRONT_FILE_PREFIX = "/front/";

const responseFrontFile = (req, res) => {
    const fileNameIndex =
        req.url.indexOf(FRONT_FILE_PREFIX) + FRONT_FILE_PREFIX.length;
    const fileName = req.url.substr(fileNameIndex);

    res.statusCode = 200;
    res.setHeader("Content-Type", "text/javascript");
    fs.readFile(__dirname + FRONT_FILE_PREFIX + fileName, (err, data) => {
        if (err) {
            console.error(err);
            res.statusCode = 500;
            res.setHeader("Content-Type", "text/plain");
            res.end(JSON.stringify(err));
            return;
        }

        res.end(data);
    });
};

const responseTemplate = (req, res) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");

    fs.readFile(__dirname + "/front-template.html", (err, data) => {
        if (err) {
            console.error(err);
            res.statusCode = 500;
            res.setHeader("Content-Type", "text/plain");
            res.end(JSON.stringify(err));
            return;
        }

        const appStartIndex = data.indexOf(TEMPLATE_APP_WRITE_POINT);
        res.write(data.slice(0, appStartIndex), () => {
            const appStream = renderToPipeableStream(<App />, {
                onAllReady() {
                    appStream.pipe(res);

                    res.end(
                        data.slice(
                            appStartIndex + TEMPLATE_APP_WRITE_POINT.length
                        )
                    );
                },
            });
        });
    });
};

const server = http.createServer((req, res) => {
    const isFrontFileRequest = req.url.indexOf(FRONT_FILE_PREFIX) !== -1;

    if (isFrontFileRequest) {
        responseFrontFile(req, res);
    } else {
        responseTemplate(req, res);
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
