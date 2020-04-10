const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: 'ID can\'t be empty',
    },
    season: {
        type: Number,
        required: 'Season can\'t be empty',
    },
    city: {
        type: String,
    },
    date: {
        type: String,
        required: 'Date can\'t be empty',
    },
    team1: {
        type: String,
        required: 'Team1 can\'t be empty',
    },
    team2: {
        type: String,
        required: 'Team2 can\'t be empty',
    },
    toss_winner: {
        type: String
    },
    toss_decision: {
        type: String
    },
    result: {
        type: String
    },
    dl_applied: {
        type: Number
    },
    winner: {
        type: String
    },
    win_by_runs: {
        type: Number
    },
    win_by_wickets: {
        type: Number
    },
    player_of_match: {
        type: String
    },
    venue: {
        type: String
    },
     umpire1: {
        type: String
    },
    umpire2: {
        type: String
    },
    umpire3: {
        type: String
    }
});
mongoose.model('Match', matchSchema, 'matches');