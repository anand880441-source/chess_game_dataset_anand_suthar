import React, { useState, useEffect, useCallback } from 'react';
import WorkingChessBoard from './WorkingChessBoard';
import { Chess } from 'chess.js';

function ChessBoardViewer({ moves, fen, onMoveChange }) {
    const [positionFen, setPositionFen] = useState('start');
    const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
    const [isReady, setIsReady] = useState(false);
    const movesList = React.useRef([]);

    // Store moves
    useEffect(() => {
        if (moves && moves.length > 0) {
            console.log('Moves received:', moves.length);
            movesList.current = moves;
        }
    }, [moves]);

    // Initialize to final position
    useEffect(() => {
        if (movesList.current.length > 0) {
            console.log('Building final position from', movesList.current.length, 'moves');
            const game = new Chess();
            for (let i = 0; i < movesList.current.length; i++) {
                try {
                    game.move(movesList.current[i]);
                } catch (e) {
                    console.error('Move error at', i, ':', movesList.current[i]);
                    break;
                }
            }
            const finalFen = game.fen();
            console.log('Final FEN:', finalFen);
            setPositionFen(finalFen);
            setCurrentMoveIndex(movesList.current.length - 1);
            setIsReady(true);
            if (onMoveChange) onMoveChange(movesList.current.length - 1, finalFen);
        } else if (fen) {
            console.log('Using provided FEN:', fen);
            setPositionFen(fen);
            setIsReady(true);
        } else {
            setIsReady(true);
        }
    }, []);

    const goToMove = useCallback((index) => {
        console.log('Going to move index:', index);
        if (index < -1) return;
        
        const game = new Chess();
        for (let i = 0; i <= index && i < movesList.current.length; i++) {
            try {
                game.move(movesList.current[i]);
            } catch (e) {
                console.error('Move error at', i);
                break;
            }
        }
        
        const newFen = game.fen();
        console.log('New FEN at move', index + 1, ':', newFen);
        setPositionFen(newFen);
        setCurrentMoveIndex(index);
        if (onMoveChange) onMoveChange(index, newFen);
    }, [onMoveChange]);

    const nextMove = () => {
        if (currentMoveIndex + 1 < movesList.current.length) {
            goToMove(currentMoveIndex + 1);
        }
    };

    const previousMove = () => {
        if (currentMoveIndex > -1) {
            goToMove(currentMoveIndex - 1);
        }
    };

    const goToStart = () => {
        goToMove(-1);
    };

    const goToEnd = () => {
        if (movesList.current.length > 0) {
            goToMove(movesList.current.length - 1);
        }
    };

    if (!isReady) {
        return (
            <div className="flex items-center justify-center h-96 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!movesList.current || movesList.current.length === 0) {
        return (
            <div className="flex items-center justify-center h-96 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <p className="text-gray-500 dark:text-gray-400">No moves available for this game</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <WorkingChessBoard fen={positionFen} />

            <div className="flex items-center justify-center gap-2 flex-wrap">
                <button onClick={goToStart} className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 disabled:opacity-50" disabled={currentMoveIndex === -1}>
                    ⏮️ Start
                </button>
                <button onClick={previousMove} className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 disabled:opacity-50" disabled={currentMoveIndex === -1}>
                    ◀ Previous
                </button>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                    Move {currentMoveIndex + 1} of {movesList.current.length}
                </span>
                <button onClick={nextMove} className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 disabled:opacity-50" disabled={currentMoveIndex === movesList.current.length - 1}>
                    Next ▶
                </button>
                <button onClick={goToEnd} className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 disabled:opacity-50" disabled={currentMoveIndex === movesList.current.length - 1}>
                    End ⏭️
                </button>
            </div>
            
            {currentMoveIndex >= 0 && movesList.current[currentMoveIndex] && (
                <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                    Current Move: <span className="font-mono font-semibold text-primary-600">{movesList.current[currentMoveIndex]}</span>
                </div>
            )}
        </div>
    );
}

export default ChessBoardViewer;
