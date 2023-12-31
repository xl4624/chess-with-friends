# chess

Everyone viewing a chess game is going to have a chess.js game running in the frontend. When a spectator joins mid-game, we have two options, we could either have all the moves and send them as a string to do some sort of `load_pgn()` from the move history, or have the fen and just give them the board state. If we ever want to display move history alongside the board, doing it by moves is preferred, but for simplicity I'm down for just the board fen (would have to modify the `Game` model and remove moves and replace with fen).
- player1 - game() in chess.js
- player2 - game() in chess.js
- spectators - game() in chess.js


- make a move
    - validate the move using chess.js
    - send it to the backend
        - validate that the correct user is making their move and not a spectator or the opponent
        - so if it fails validation for any reason bc the wrong person is making this move (through sending user.id and matching white_player_id and black_player_id)
            - send some error message/code and don't make the move in the chess.js game instance 
        - but if it is a valid move
            - updates the Game model with the moves
            - sends the move to both player1 and player2 where they push the move to each of their own game instances, and probably the rest of the players? 
        - NOTE: if the game ends from whatever move, make sure it still sends to the backend and it is properly updated in the Game model


        

