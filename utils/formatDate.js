let moment = require('moment');

function formatDate(date){
    return moment(date).format('MMMM Do YYYY, h:mm a');
}

module.exports = formatDate;