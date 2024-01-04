import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
    entry: glob.sync('./static/js/**/*.js').reduce((acc, path) => {
        const filePath = path.startsWith('./') ? path : './' + path;
        const entry = filePath
            .replace('./static/js/', '')
            .replace(/\.js$/, '');
        acc[entry] = filePath;
        return acc;
    }, {}),
    output: {
        path: path.resolve(__dirname, 'static/dist'),
        filename: '[name].bundle.js', 
    },
};
