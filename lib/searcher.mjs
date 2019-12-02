import fs from 'fs';
import stopwords from 'stopword';
import Lemmatizer from 'javascript-lemmatizer';
import removePunctuation from 'remove-punctuation';
import validator from 'validator';
import Entities from 'html-entities';
export const searcher = {};

searcher.search = function(string) {
    let stringArray = removePunctuation(string).split(" ");
    stringArray = stopwords.removeStopwords(stringArray);
    const lemmatizer = new Lemmatizer();
    const resultsArray = [];
    stringArray.forEach((word) => {
        if (validator.isInt(word)) {
            return false;
        }
        word = lemmatizer.only_lemmas(word.toLowerCase())[0];
        resultsArray.push(searcher.findResults(word));
        return true;
    })
    const docs = [];
    resultsArray.forEach((wordResults) => {
        wordResults.forEach((result) => {
            if (docs.includes(result)) {
                return true;
            } else {
                docs.push(result);
                return true;
            }
        })
    })

    const orderedDocArray = searcher.orderTFIDF(docs, string);
    const resultItems = [];
    orderedDocArray.forEach((id) => {
        resultItems.push(searcher.getArticle(id));
    })
    return resultItems;
}

searcher.findResults = function(word) {
    const index = JSON.parse(fs.readFileSync('./database/index.json'));
    if (word in index.words) {
        return index.words[word]
    }
    return [];
}

searcher.getArticle = function(id) {
    const database = JSON.parse(fs.readFileSync('./database/database.json'));
    id = Number(id);
    let article
    if (database[id] == database[id].id) {
        article = database[id];
    } else {
        Object.values(database).forEach((item) => {
            if (item.id === id) {
                article = item;
            }
            return true;
        })
    }
    const entities = new Entities.AllHtmlEntities();
    article.summary = entities.decode(article.summary);
    article.title = entities.decode(article.title);
    article.description = entities.decode(article.description);
    let summary = []
        article.summary.split(" ").forEach((word) => {
            if (summary.length < 50) {
                summary.push(word);
            };
        })
        if (summary.length === 50) {
            summary.push("...");
        }
        article.reducedSummary = summary.join(" ");
    return article;
}

searcher.orderTFIDF = function(idArray, query) {
    const index = JSON.parse(fs.readFileSync('./database/index.json'));
    
    let queryArray = stopwords.removeStopwords(removePunctuation(query).split(" "));
    const lemmatizer = new Lemmatizer();
    queryArray = queryArray.map((word) => {
        return lemmatizer.only_lemmas(word.toLowerCase())[0];
    })

    const IDF = {};
    queryArray.forEach((word) => {
        if (word in index.words) {
            IDF[word] = Math.log(index.ids.length / index.words[word].length);
        }
        return true;
    })
    const TFIDF = {};
    idArray.forEach((id) => {
        let tfidf = 0;
        let article = searcher.getArticle(id)
        let wordArray = removePunctuation([article.title, article.description].join(" ")).split(" ");
        Object.keys(IDF).forEach((queryWord) => {
            let wordCount = 0;
            wordArray.forEach((word) => {
                if (queryWord === lemmatizer.only_lemmas(word.toLowerCase())[0]) {
                    wordCount += 1;
                }
                return true;
            })
            tfidf += (wordCount / wordArray.length) * IDF[queryWord];
            return true;
        })
        TFIDF[id] = tfidf;
        return true;
    })
    const orderedArray = [];
    while (true) {
        if (Object.keys(TFIDF).length === 0) {break}
        let mostRelevent = undefined;
        Object.keys(TFIDF).forEach((id) => {
            if (mostRelevent === undefined) {
                mostRelevent = id;
                return true;
            } 
            if (TFIDF[id] > TFIDF[mostRelevent]) {
                mostRelevent = id;
            }
            return true;
        })
        orderedArray.push(mostRelevent);
        delete TFIDF[mostRelevent];
    }
    return orderedArray;    
}