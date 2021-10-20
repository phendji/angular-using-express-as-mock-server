'use strict';

const srvHelper = require('../serverHelper.js');
const environment = require('../apiUrl.js');

module.exports = app => {
  app.get(`${environment.URL.API_WITHOUT_TOKEN.NAME_APP_TECHNOLOGY_LISTS}`, (req, res) => {
    setTimeout(srvHelper.readContentJsonFile, app.settings.latencies.technologyLists, res, `./server/api/technology-lists/technology-lists.json`);
  });
};
