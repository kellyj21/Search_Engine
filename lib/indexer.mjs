import stopwords from 'stopword';
import Lemmatizer from 'javascript-lemmatizer';
import removePunctuation from 'remove-punctuation';
import validator from 'validator';
import fs from 'fs';

export const indexer = {};

indexer.controller = async function(database) {
    console.log('Indexing Start');
    let index = JSON.parse(fs.readFileSync('./database/index.json'));
    Object.values(database).forEach(async function(item) {
        index = await indexer.indexArticle(item.id, item.title, item.description, index);
    })
    let stringifiedIndex = JSON.stringify(index);
    fs.writeFileSync('./database/index.json', stringifiedIndex);
    console.log('Indexing Complete');
}

indexer.indexArticle = async function(id, title, description, index) {
    if (index.ids.includes(id)) {
        return 'Already indexed';
    }
    const text = [title, description].join(" ");
    let textarray = removePunctuation(text).split(" ");
    textarray = stopwords.removeStopwords(textarray);
    const lemmatizedArray = [];
    const lemmatizer = new Lemmatizer();
    textarray.forEach((word) => {
        if (validator.isInt(word)) {
            return 'Number';
        }
        let newWord = lemmatizer.only_lemmas(word.toLowerCase())[0];
        if (newWord === undefined) {
            newWord = word.toLocaleLowerCase();
        }
        lemmatizedArray.push(newWord);
        return 'Lemmatized';
    })

    lemmatizedArray.forEach((word) => {
        if (!(word in index.words)) {
            index.words[word] = [id];
            return true;
        } else if (!(index.words[word].includes(id))) {
            index.words[word].push(id);
            return true;
        }
        if (!(index.ids.includes(id))) {
            index.ids.push(id);
        }
        return 'Already added';
    })
    
    return index;
}