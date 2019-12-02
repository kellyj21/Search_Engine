import express from 'express';
import { Responder, Crawler, Indexer, Searcher } from '../lib/class';
import { SETTINGS } from '../config';
import fs from 'fs';
import readFilePromise from 'fs-readfile-promise';
const router = express.Router();

router.get('/', async function(request, response) {
    let responder = new Responder(response);
    
    responder.render = 'crawler/crawler';
    responder.data = await Crawler.controller(SETTINGS.URL_LIST);
    responder.send();
});

export const crawlerRouter = router;
