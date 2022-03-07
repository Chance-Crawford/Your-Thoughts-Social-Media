const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(require('./routes'));

// will use end of url to look for a database in mongoDB called "your-thoughts-db" if
// it already exists, it will connect. If not, it will create the database.
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/your-thoughts-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Use this to log mongo queries being executed!
mongoose.set('debug', true);

app.listen(PORT, () => console.log(`Now connected on localhost:${PORT}`));
