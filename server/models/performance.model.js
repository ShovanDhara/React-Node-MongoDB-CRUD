const mongoose = require('mongoose');

const performanceSchema = new mongoose.Schema({
    batting_team: {
        type: String,
    },
    batsman: {
        type: String
    },
     match_id: {
        type: Number,
        required: 'ID can\'t be empty',
    },
    total_runs: {
        type: Number
    },
 });
mongoose.model('Performance', performanceSchema, 'performances');