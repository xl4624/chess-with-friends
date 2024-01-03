import path from 'path';
import { fileURLToPath } from 'url';

export default {
    entry: {
        game_view: './static/js/game_view.js',
        waiting_room: './static/js/waiting_room.js',
    },
    output: {
        path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'static/js/dist'),
        filename: '[name].bundle.js', 
    },
};
