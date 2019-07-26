const express = require('express');
const knex = require('knex');
// const dbConnection = require('../data/dbConfig.js');

const dbConnection = knex({
    client: 'sqlite3',
    connection: {
        filename: './data/budget.sqlite3'
    },
    useNullAsDefault: true,
})

const router = express.Router();

router.get('/', (req, res) => {
    dbConnection('accounts')
        .then(accounts => {
            res.status(200).json(accounts)
        })
        .catch(error => {
            res.status(500).json(error)
        })
});

router.get('/:id', (req, res) => {
    dbConnection('accounts')
        .where({ id: req.params.id })
        .first()
        .then(account => {
            if (account) {
                res.status(200).json(account);
            } else {
                res.status(404).json({ message: 'Account not found' });
            }
        });
});


router.post('/', (req, res) => {
    const account = req.body;
    dbConnection('accounts')
        .insert(account, 'id')
        .then(arrayOfIds => {
            const idOfLastRecordInserted = arrayOfIds[0];
            res.status(201).json(idOfLastRecordInserted);
        })
        .catch(error => {
            res.status(500).json(error);
        })
});

router.put('/:id', (req, res) => {
    dbConnection('accounts')
        .where({ id: req.params.id })
        .update(req.body)
        .then(count => {
            if (count > 0) {
                res.status(200).json({ message: `${count} record(s) updated` });
            } else {
                res.status(404).json({ message: "record not found" })
            }
        })
        .catch(error => {
            res.status(500).json(error);
        })
});

router.delete('/:id', (req, res) => {
    dbConnection('accounts')
        .where({ id: req.params.id })
        .del()
        .then(count => {
            res.status(200).json({ message: `${count} record(s) deleted` });
        })
        .catch(error => {
            res.status(500).json(error);
        })
});


module.exports = router;