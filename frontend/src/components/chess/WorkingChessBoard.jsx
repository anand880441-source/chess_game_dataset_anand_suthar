import React from 'react';

// Chess piece Unicode characters
const pieceMap = {
    'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟',  // Black pieces (lowercase)
    'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙'   // White pieces (uppercase)
};

function WorkingChessBoard({ fen }) {
    const parseFenToBoard = (fenString) => {
        if (!fenString || fenString === 'start') {
            return [
                ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
                ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
                ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
            ];
        }
        
        try {
            const positionPart = fenString.split(' ')[0];
            const rows = positionPart.split('/');
            
            return rows.map(row => {
                const expanded = [];
                for (let i = 0; i < row.length; i++) {
                    const char = row[i];
                    if (char >= '0' && char <= '9') {
                        const emptyCount = parseInt(char);
                        for (let j = 0; j < emptyCount; j++) {
                            expanded.push('');
                        }
                    } else {
                        expanded.push(char);
                    }
                }
                return expanded;
            });
        } catch (e) {
            console.error('FEN parsing error:', e);
            return [];
        }
    };

    const board = parseFenToBoard(fen);
    
    const getPieceDisplay = (piece) => {
        if (!piece) return '';
        return pieceMap[piece] || piece;
    };

    const isWhitePiece = (piece) => {
        if (!piece) return false;
        return piece === piece.toUpperCase() && piece !== piece.toLowerCase();
    };

    const getSquareColor = (row, col) => {
        return (row + col) % 2 === 0 ? 'bg-amber-100' : 'bg-amber-800';
    };

    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

    if (!board || board.length === 0) {
        return <div className="text-center p-4 text-gray-500">Loading board...</div>;
    }

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="border-2 border-gray-700 rounded-lg overflow-hidden shadow-lg">
                {board.map((row, rowIndex) => (
                    <div key={rowIndex} className="grid grid-cols-8">
                        {row.map((piece, colIndex) => {
                            const isWhite = isWhitePiece(piece);
                            return (
                                <div
                                    key={`${rowIndex}-${colIndex}`}
                                    className={`
                                        aspect-square flex items-center justify-center
                                        ${getSquareColor(rowIndex, colIndex)}
                                        transition-all duration-150
                                        text-3xl sm:text-4xl md:text-5xl font-bold
                                    `}
                                >
                                    <span className={isWhite ? 'chess-piece-white' : 'chess-piece-black'}>
                                        {getPieceDisplay(piece)}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
            
            {/* Coordinates */}
            <div className="grid grid-cols-8 gap-0 mt-2 text-center text-xs text-gray-500 dark:text-gray-400 font-medium">
                {files.map(file => (
                    <div key={file}>{file}</div>
                ))}
            </div>
        </div>
    );
}

export default WorkingChessBoard;
