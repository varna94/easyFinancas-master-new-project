let express = require('express'),
    path = require('path'),
    mongoose = require('mongoose'),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    dataBaseConfig = require('./database/db');

// Connecting mongoDB
mongoose.Promise = global.Promise;
mongoose.connect(dataBaseConfig.db, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => {
        console.log('Database connected sucessfully ')
    },
    error => {
        console.log('Could not connected to database : ' + error)
    }
)

// Set up express js port
const despesasRoute = require('./routes/depesas.route');
const contasRoute = require('./routes/conta.route');
const recursosRoute = require('./routes/recursos.route');
const cartoesRoute = require('./routes/cartao.route');
const despesasCartaoRoute = require('./routes/depesasCC.route');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cors());

// RESTful API root
app.use('/api', despesasRoute);
app.use('/api', contasRoute);
app.use('/api', recursosRoute);
app.use('/api', cartoesRoute);
app.use('/api', despesasCartaoRoute);

// PORT
const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log('Connected to port ' + port)
})

// Find 404 and hand over to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// Index Route
app.get('/', (req, res) => {
    res.send('invaild endpoint');
});

// error handler
app.use(function(err, req, res, next) {
    console.error(err.message);
    if (!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).send(err.message);
});
