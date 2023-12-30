const path = require('path');

module.exports = {
    entry: './static/main.js',
    output: {
        path: path.resolve(__dirname, 'static/dist'),
        filename: 'bundle.js', 
    },
    mode: 'development'
}
