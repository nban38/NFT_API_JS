require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const apiRouter = require('./routes');
const { sequelize } = require('./models');
const logger = require('./utils/logger');
const crontab = require('./controllers/cronController');

const app = express();  // express

/* middleware */
app.use(express.json());
app.use(express.urlencoded({ extended : true }));
app.use(express.static('public'));
app.use(helmet({ contentSecurityPolicy: false }));
app.use(morgan('combined', {stream : logger.stream})); // morgan 로그 설정 
app.use(cors());

/* router */
app.use('/api', apiRouter);


/* crontab */
crontab.startCronTab();

app.listen(process.env.WEB_PORT || 3000, () => {
    
    sequelize.sync({ force : false, logging : false }).then(() => {
        console.log(`
        #############################################
            🛡️ Server listening on port: ${process.env.WEB_PORT} 🛡️
        #############################################    
        `);
    }).catch((error) => {
        console.log(error);
    });

});