import express from 'express';
import { Responder } from '../lib/class';
const router = express.Router();

router.get('/', async function(request, response) {
    let responder = new Responder(response);
    
    responder.render = 'search/search';
    responder.data = {}
    responder.send();
});

export const searchRouter = router;
