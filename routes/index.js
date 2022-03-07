const router = require('express').Router();

// set api route
router.use('/api', require('./api'));

// fallback if route doesnt exist
router.use((req, res) => {
    res.status(404).send('<h1>404 Error</h1>');
});

module.exports = router;