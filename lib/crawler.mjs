import feedparser from 'feedparser-promised';
import { SETTINGS } from '../config';
import { indexer } from './indexer';
import readFilePromise from 'fs-readfile-promise';
import fs from 'fs';
import striptags from 'striptags';

export const crawler = {};

crawler.crawl = async function(urlArray) {
    return new Promise((resolve, reject) => {
        let dataInfo = []
        let count = 0;
        let data = [];
        urlArray.forEach(url => {
            let feed = feedparser.parse(url)
            feed.catch((error) => {console.log(error)})
            feed.then(items => {
                data.push(items)
            }).then(() => {
                data[count].forEach(item => {
                    dataInfo.push({
                        'title': striptags(item.title),
                        'summary': striptags(item.summary),
                        'description': striptags(item.description),
                        'url': item.link,
                        'date': item.date
                    })
                    return true
                });
            }).then(() => {
                count += 1;
                console.log(`URL Parsed ${url}`);
                if (count === urlArray.length) {
                    resolve(dataInfo);
                }
            });
        })
    })
}; 

crawler.controller = async function(urlList) {
    console.log('Starting crawling');
    let newData = await crawler.crawl(urlList);
    let database = JSON.parse(fs.readFileSync('./database/database.json'));
    let count = 1;
    let newDataCount = 0;

    Object.values(database).forEach((element) => {
        if (element.id > count) {
            count = element.id + 1;
        }
    })

    newData.forEach((element) => {
        let exists = false;
        Object.values(database).forEach((entry) => {
            if ((element.url === entry.url && element.url !== undefined) || element.title === entry.title) {
                exists = true;
            }
        })
        if (!(exists)) {
            newDataCount += 1;
            element["id"] = count;
            database[count] = element;
            count += 1;
        }
    })
    let articleCount = count - 1;
    console.log(`Total articles in the database ${articleCount}`);
    console.log(`New articles added to the database ${newDataCount}`);
    let stringifiedDatabase = JSON.stringify(database);
    fs.writeFileSync('./database/database.json', stringifiedDatabase);
    await indexer.controller(database)

    return {
        'newArticleCount': newDataCount,
        'totalArticleCount': articleCount,
        'urlList': urlList
    }
}



