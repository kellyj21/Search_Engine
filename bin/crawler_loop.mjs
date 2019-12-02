import { crawler } from '../lib/crawler';
import { SETTINGS } from '../config';
import fs from 'fs';

let loop = async function(url) {
    console.log(`Starting crawling for ${url}`)

    let crawlRates = JSON.parse(fs.readFileSync('./database/hitrates.json'));
    let waitTime = crawlRates[url];
    let response = await crawler.controller([url]);
    
    if (response.newArticleCount > 0) {
        waitTime = waitTime * 0.9;
    } else {
        waitTime = waitTime * 1.1;
    }
    crawlRates[url] = waitTime;
    fs.writeFileSync("./database/hitrates.json", JSON.stringify(crawlRates));
    console.log(`Waiting ${waitTime / 1000}s before next crawling ${url}`);
    setTimeout(() => {
        loop(url);
    }, waitTime);
}

setTimeout(() => {
    SETTINGS.URL_LIST.forEach(url => {
        console.log(`Creating crawl loop for ${url}`);
        loop(url)
    })
}, 5000);
    

