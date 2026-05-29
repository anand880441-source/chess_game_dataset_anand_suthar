import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import gameService from '../services/gameService';
import ChessBoardViewer from '../components/chess/ChessBoardViewer';
import MoveList from '../components/chess/MoveList';
import PGNViewer from '../components/chess/PGNViewer';
import AnalysisPanel from '../components/chess/AnalysisPanel';
import toast from 'react-hot-toast';

function MatchDetail() {
    const { id } = useParams();
    const [match, setMatch] = useState(null);
    const [moves, setMoves] = useState([]);
    const [pgn, setPgn] = useState('');
    const [fen, setFen] = useState('');
    const [analysis, setAnalysis] = useState(null);
    const [positionAnalysis, setPositionAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('moves');
    const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);

    useEffect(() => {
        fetchMatchDetails();
    }, [id]);

    const fetchMatchDetails = async () => {
        setLoading(true);
        try {
            // Fetch match details
            const matchRes = await gameService.getById(id);
            if (matchRes.success) {
                setMatch(matchRes.data);
            }

            // Fetch moves
            const movesRes = await gameService.getMoves(id);
            if (movesRes.success) {
                let movesArray = [];
                if (movesRes.moves && Array.isArray(movesRes.moves)) {
                    movesArray = movesRes.moves;
                } else if (movesRes.movesNotation) {
                    movesArray = movesRes.movesNotation.split(' ');
                }
                console.log('Moves loaded:', movesArray.length);
                setMoves(movesArray);
            }

            // Fetch PGN
            const pgnRes = await gameService.getPGN(id);
            if (pgnRes.success) {
                setPgn(pgnRes.pgn);
            }

            // Fetch FEN
            try {
                const fenRes = await gameService.getFEN(id);
                if (fenRes?.success) {
                    setFen(fenRes.fen);
                }
            } catch (e) {
                console.log('FEN not available');
            }

            // Fetch analysis
            try {
                const analysisRes = await gameService.getAnalysis(id);
                if (analysisRes?.success) {
                    setAnalysis(analysisRes.analysis);
                    setPositionAnalysis(analysisRes.position);
                }
            } catch (e) {
                console.log('Analysis not available');
            }

        } catch (error) {
            console.error('Error fetching match details:', error);
            toast.error('Failed to load match details');
        } finally {
            setLoading(false);
        }
    };

    const handleMoveClick = (index) => {
        setCurrentMoveIndex(index);
    };

    const handleMoveChange = (index, newFen) => {
        setCurrentMoveIndex(index);
        if (newFen) setFen(newFen);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!match) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Match not found</h2>
                <Link to="/matches" className="text-primary-600 hover:underline mt-4 inline-block">
                    ← Back to Matches
                </Link>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>{match.white?.username} vs {match.black?.username} | Chess Analytics</title>
            </Helmet>

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link to="/matches" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                        <ArrowLeftIcon className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {match.white?.username} vs {match.black?.username}
                        </h1>
                        <div className="flex items-center gap-3 mt-1">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                                match.winner === 'white' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                match.winner === 'black' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                            }`}>
                                {match.winner === 'white' ? 'White Wins' : match.winner === 'black' ? 'Black Wins' : 'Draw'}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(match.createdAt).toLocaleDateString()}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                {match.turns} moves • {match.incrementCode}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Chess Board */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <ChessBoardViewer 
                                moves={moves}
                                fen={fen}
                                onMoveChange={handleMoveChange}
                            />
                        </div>

                        {/* Tabs */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <div className="border-b border-gray-200 dark:border-gray-700">
                                <div className="flex">
                                    <button
                                        onClick={() => setActiveTab('moves')}
                                        className={`px-4 py-3 text-sm font-medium transition-colors ${
                                            activeTab === 'moves'
                                                ? 'text-primary-600 border-b-2 border-primary-600'
                                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                                        }`}
                                    >
                                        Move List
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('pgn')}
                                        className={`px-4 py-3 text-sm font-medium transition-colors ${
                                            activeTab === 'pgn'
                                                ? 'text-primary-600 border-b-2 border-primary-600'
                                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                                        }`}
                                    >
                                        PGN
                                    </button>
                                </div>
                            </div>
                            <div className="p-4">
                                {activeTab === 'moves' && (
                                    <MoveList 
                                        moves={moves}
                                        currentMoveIndex={currentMoveIndex}
                                        onMoveClick={handleMoveClick}
                                    />
                                )}
                                {activeTab === 'pgn' && (
                                    <PGNViewer pgn={pgn} />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Analysis */}
                    <div className="space-y-6">
                        {/* Match Info Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Match Information
                            </h2>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">White Player:</span>
                                    <Link to={`/players/${match.white?.username}`} className="font-medium text-primary-600 hover:underline">
                                        {match.white?.username} ({match.white?.rating})
                                    </Link>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">Black Player:</span>
                                    <Link to={`/players/${match.black?.username}`} className="font-medium text-primary-600 hover:underline">
                                        {match.black?.username} ({match.black?.rating})
                                    </Link>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">Opening:</span>
                                    <span className="font-medium text-gray-900 dark:text-white text-right">
                                        {match.opening?.name}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">ECO Code:</span>
                                    <span className="font-mono font-medium text-gray-900 dark:text-white">
                                        {match.opening?.eco}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">Time Control:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {match.incrementCode}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">Game Type:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {match.rated ? 'Rated' : 'Casual'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Analysis Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Game Analysis
                            </h2>
                            <AnalysisPanel 
                                analysis={analysis}
                                position={positionAnalysis}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default MatchDetail;
