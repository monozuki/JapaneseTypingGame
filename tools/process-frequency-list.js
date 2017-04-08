/*
    This script reads in a frequency list and uses kuromoji to retrieve
    the reading of each word. The results are written to a file. 
 */

const fs = require("fs");
const kuromoji = require('kuromoji');
const wanakana = require('wanakana');

const inputPath = __dirname + '/frequency-list-3000.txt';
const outputPath = __dirname + '/../src/assets/frequency-list.txt';
const dictionaryPath = {
    dicPath: __dirname + "/../node_modules/kuromoji/dict"
};

const words = [];
const map = {};

const contents = fs.readFileSync(inputPath).toString();

contents.split('\n').forEach(function (line) { 
	words.push(line);
});

kuromoji.builder(dictionaryPath).build(function (err, tokenizer) {

    for (let i = 0; i < 1500; i++) {
        const word = words[i].trim();
        if (wanakana.isHiragana(word)) {
            // map does not allow duplicate keys
            // switch to tuples later
            continue;
        }

        const result = tokenizer.tokenize(word)[0];
        if (result && result['reading']) { // some words don't have a reading? investigate later
            const reading = wanakana.toHiragana(result['reading']);
            if (!wanakana.isHiragana(reading)) {
                // wanakana.toHiragana does not work if the input contains a 長音符 (this thing: ー )
                continue;
            }
            map[word] = reading;
        }
    }

    fs.writeFileSync(outputPath, JSON.stringify(map));
});