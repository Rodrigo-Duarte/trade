const winston = require('winston')
const tsFormat = () => (new Date()).toLocaleTimeString();

logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({ 
        colorize: true,
        timestamp: tsFormat,
        level: "info"
     }),
    new winston.transports.File({ 
        filename: 'info.log' ,
        level: "verbose"
    })
  ]
});

module.exports = logger