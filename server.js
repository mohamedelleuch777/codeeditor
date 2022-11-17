// import express from 'express';
const express = require('express');
const fs = require('fs');
const path = require('path');
const sl_path = require('./data.json');

const app = express();

const port = 6695;

const sl_directory = path.dirname(sl_path.path);

app.listen(port, "", function() {
  console.log("... port %d in %s mode", port, app.settings.env);
});

const directoryList = fs.readdirSync(sl_directory)
var filePath = "";
app.get("*", async (req, res) => {
    url = req.url;
    filePath = req.url;
    if (filePath == '/')
        filePath = './index.html';
    // filePath = sl_directory + filePath;
    
    filePath = filePath.replace(".min","");

    var extname = path.extname(filePath);
    var contentType = 'text/html';
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
        case '.wav':
            contentType = 'audio/wav';
            break;
    }

    fs.readFile(sl_directory + filePath, async function(error, content) {
        if (error) {
            if(error.code == 'ENOENT'){
                for(let i=0; i<directoryList.length; i++) {
                    let newFilePath = sl_directory + "\\" + directoryList[i]+filePath;
                    let fileExistance = await checkFileExists(newFilePath);
                    if(fileExistance) {
                        const newFileContent = fs.readFileSync(newFilePath);
                        res.writeHead(200, { 'Content-Type': contentType });
                        res.end(newFileContent, 'utf-8');
                        return;
                    }
                }
                res.writeHead(404, { 'Content-Type': "text/html" });
                res.end("<h1>Page not found 404!!</h1>", 'utf-8');
            }
            else {
                res.writeHead(500);
                res.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
                res.end(); 
            }
        }
        else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

function checkFileExists(file) {
    return fs.promises.access(file, fs.constants.F_OK)
             .then(() => true)
             .catch(() => false)
  }

