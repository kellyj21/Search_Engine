import express from 'express';
import { Responder, Searcher } from '../lib/class';
const router = express.Router();

router.get('/', async function(request, response) {
    let responder = new Responder(response);
    let results = []
    if (!(request.query.search)) {
        responder.render = 'results/results';
        responder.data = {};
        responder.data.results = [];
        responder.send();
        return false;
    }

    const query = request.query.search.split("+").join(" ");

    if (request.query.search.includes(" AND ")) {
        const resultsArray = query.split(" AND ").map((query) => {
            return Searcher.search(query);
        })
        resultsArray.forEach((array) => {
            array.forEach((article) => {
                let inAll = true;
                let inResults = false;
                resultsArray.forEach((articles) => {
                    let inArray = false
                    articles.forEach((a) => {
                        if (a.id === article.id) {
                            inArray = true;
                        }
                    })
                    if (inArray === false) {
                        inAll = false;
                    }
                })
                results.forEach((result) => {
                    if (result.id === article.id) {
                        inResults = true
                    }
                })
                if (inAll === true && inResults === false) {
                    results.push(article);
                }
            })
        })
    } else {
        results = Searcher.search(query);
    }

    if (request.query.begining) {
        let newResults = [];
        results.forEach((article) => {
            let date = article.date.split("T")[0]; 
            if (article.date > request.query.begining) {
                newResults.push(article);
            }
            return true
        })
        results = newResults;
    }

    if (request.query.end) {
        let newResults = [];
        results.forEach((article) => {
            let date = article.date.split("T")[0]; 
            if (article.date < request.query.end) {
                newResults.push(article);
            }
            return true
        })
        results = newResults;
    }

    responder.render = 'results/results';
    responder.data = {};
    responder.data.results = results;
    responder.send();
});

export const resultsRouter = router;