const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
const routes = require('./controllers');
const helpers = require('./utils/helpers');
const sequelize = require('./config/connection');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;

// Set up sessions with cookies
const sess = {
    secret: 'Super secret secret',
    cookie: {
        // Stored in milliseconds
        maxAge: 60 * 1000 * 5, // expires after 5 minutes DEFAULT VALUE IS SET TO SESSION, so it will clear after you ex the window 
    },
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({     //Store the value of the session in the sequlize db
        db: sequelize,
    }),
};

app.use(session(sess));

// Create the Handlebars.js engine object with custom helper functions
const hbs = exphbs.create({ helpers });

// Inform Express.js which template engine we're using
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);

sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log(`Now listening on port http://localhost:${PORT}`));
});
