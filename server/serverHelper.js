'use strict';

const fs = require('fs');

module.exports.readContentJsonFile = (res, jsonFile) => {
    if(fs.existsSync(jsonFile)) {
        fs.readFile(jsonFile, (err, data) => {
            if (err) throw err;

            res.send(data.toString());
        })
    } else {
        res.status(404).send("Not found");
    }
}
