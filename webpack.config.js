import path from 'path';
import { fileURLToPath } from 'url';

export default {
    entry: './static/js/main.js',
    output: {
        path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'static/js/dist'),
        filename: 'bundle.js', 
    },
};
