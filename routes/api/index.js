const router = require('express').Router();

// set routes
router.use('/users', require('./user-routes'));
router.use('/thoughts', require('./thought-routes'));

module.exports = router;