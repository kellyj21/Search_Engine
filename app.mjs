import express from 'express';
import jsonwebtoken from 'jsonwebtoken';
import path from 'path';

// Main page routers.
import { crawlerRouter } from './routes/crawler';
import { searchRouter } from './routes/search';
import { resultsRouter } from './routes/results';


export const server = express();
export default server;

const directory = path.resolve();

server.set('views', path.join(directory, 'views'));
server.set('view engine', 'ejs');

server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(express.static(path.join(directory, 'public')));

// Main page routers.
server.use('/', searchRouter);
server.use('/crawler', crawlerRouter);
server.use('/results', resultsRouter);


