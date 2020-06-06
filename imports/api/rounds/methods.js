import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

import { Rounds } from './collection';

import { stories } from '/utils/fixtures';

const allWords = Object.keys(stories).reduce((acc, category) => [...acc, ...stories[category]], []);
export const getCategory = (word) =>
    Object.keys(stories).find((category) => stories[category].includes(word));
const getWordBank = (category) =>
    !category || category.value === 'Random' ? allWords : stories[category.value];
export const generateWord = (category) => {
    const wordBank = getWordBank(category);
    return wordBank[Math.floor(Math.random() * wordBank.length)];
};

export const add = new ValidatedMethod({
    name: 'Rounds.add',
    validate: new SimpleSchema({
        gameId: {
            type: String,
        },
    }).validator(),
    run: ({ gameId }) => {
        console.log('Method - Rounds.add / run', gameId);

        const response = {
            success: false,
            message: 'There was some server error.',
        };
        const word = generateWord();

        const roundId = Rounds.insert({ gameId, word });

        if (roundId) {
            response.success = true;
            response.message = 'Round added.';
            response.roundId = roundId;
        }

        return response;
    },
});

export const updateWord = new ValidatedMethod({
    name: 'Rounds.updateWord',
    validate: new SimpleSchema({
        _id: {
            type: String,
        },
        category: {
            type: Object,
            optional: true,
        },
        'category.label': {
            type: String,
        },
        'category.value': {
            type: String,
        },
        word: {
            type: String,
        },
    }).validator(),
    run: ({ _id, category, word }) => {
        console.log('Method - Rounds.updateWord / run', _id);

        const response = {
            success: false,
            message: 'There was some server error.',
        };

        const roundId = Rounds.update({ _id }, { $set: { word, category } });

        if (roundId) {
            response.success = true;
            response.message = 'Round word updated.';
        }

        return response;
    },
});
