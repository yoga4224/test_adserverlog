const express = require('express');
const app = express();
const {
    addOrUpdateCharacter,
    getCharacters,
    deleteCharacter,
    getCharacterById,
} = require('./dynamo');

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/log', async (req, res) => {
    try {
        const characters = await getCharacters();
        res.json(characters);
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    }
});

app.get('/log/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const character = await getCharacterById(id);
        res.json(character);
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    }
});

app.post('/log', async (req, res) => {
    const character = req.body;
    try {
        const newCharacter = await addOrUpdateCharacter(character);
        res.json(newCharacter);
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    }
});

app.put('/log/:id', async (req, res) => {
    const character = req.body;
    const { id } = req.params;
    character.id = id;
    try {
        const newCharacter = await addOrUpdateCharacter(character);
        res.json(newCharacter);
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    }
});

app.delete('/log/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        res.json(await deleteCharacter(id));
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`listening on port port`);
});
