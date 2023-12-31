import path from 'path';
import { fileURLToPath } from 'url';

export default {
    entry: './static/main.js',
    output: {
        path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'static/dist'),
        filename: 'bundle.js', 
    },
};
