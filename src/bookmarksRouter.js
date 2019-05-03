/* eslint-disable strict */
/* eslint-disable indent */
const express = require('express');
const bookmarkRouter = express.Router();
const bodyParser = express.json();
const uuid = require('uuid/v4');
const logger = require('./logger')
const store = require('./store');


bookmarkRouter
    .route('/bookmarks/:id')
    .get((req, res) => {
    const { id } = req.params;
    const bookmark = store.find(bm => bm.id == id);
        if (!bookmark) {
            logger.error(`Bookmark with id ${id} not found.`);
            return res
                .status(404)
                .send('Bookmark Not Found');
            }
    res.json(bookmark);
    })
    .delete((req, res) => {
        
            const { id } = req.params;

    const bmIndex = store.findIndex(bm => bm.id == id);

    if (bmIndex === -1) {
        logger.error(`Bookmark with id ${id} not found.`);
        return res
        .status(404)
        .send('Not found');
    }

    store.splice(bmIndex, 1);
    logger.info(`Bookmark with id ${id} deleted.`);
    res
        .status(204)
        .end();
    })
    

bookmarkRouter
    .route('/bookmarks')
    .get((req , res)=> {
        res
        .status(200)
        .json(store);
    })
    .post(bodyParser,(req, res) => {
        const {title, url, rating, desc} = req.body;

        if (!title){
            logger.error('title is required')

            return res
            .status(400)
            .json('title is needed')
        }
        if (!url){
            logger.error('url is required')

            return res
            .status(400)
            .json('url is needed')
        }
        if (!rating){
            logger.error('rating is required')

            return res
            .status(400)
            .json('rating is needed')
        }
        if (!desc){
            logger.error('desc is required')

            return res
            .status(400)
            .json('desc is needed')
        }

        const id = uuid();
    const newBookmark = {
        id,
        title,
        url,
        rating,
        desc
    };

        store.push(newBookmark);
        res
        .status(201)
        .location(`http://localhost:8000/bookmarks/${id}`)
        .json(newBookmark);
    })

module.exports = bookmarkRouter;