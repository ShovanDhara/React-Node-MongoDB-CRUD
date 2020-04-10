const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
    match_id: {
        type: Number,
        required: 'ID can\'t be empty',
    },
    inning: {
        type: Number
    },
    batting_team: {
        type: String,
    },
    bowling_team: {
        type: String
    },
    over: {
        type: Number
    },
    ball: {
        type: Number
    },
    batsman: {
        type: String
    },
    non_striker: {
        type: String
    },
    bowler: {
        type: String
    },
    is_super_over: {
        type: Number
    },
    wide_runs: {
        type: Number
    },
    bye_runs: {
        type: Number
    },
    legbye_runs: {
        type: Number
    },
    noball_runs: {
        type: Number
    },
    noball_runs: {
        type: Number
    }, penalty_runs: {
        type: Number
    }, batsman_runs: {
        type: Number
    }, extra_runs: {
        type: Number
    }, total_runs: {
        type: Number
    }, player_dismissed: {
        type: String
    }, dismissal_kind: {
        type: String
    }, fielder: {
        type: String
    },
});
mongoose.model('Delivery', deliverySchema, 'deliveries');