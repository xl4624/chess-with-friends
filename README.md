# chess

player2 - game() in chess.js
player1 - game() in chess.js
spectators - game() in chess.js


make a move:
    send it to the backend
        validate that the correct user is making their move and not a spectator or the opponent
        so if it fails validation for any reason, meaning it's not a valid move (checked by what? either chess.js or python-chess), or the wrong person is making this move (through sending user.id and matching white_player_id and black_player_id)
            send some error message/code and don't make the move in the chess.js game instance 
        but if it is a valid move
            updates the Game model with the moves
            sends the move to both player1 and player2 where they push the move to each of their own game instances, and probably the rest of the players? 
        NOTE: if the game ends from whatever move, make sure it still sends to the backend and it is properly updated in the Game model

        

