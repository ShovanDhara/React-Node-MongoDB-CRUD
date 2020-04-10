const mongoose = require('mongoose');
const Match = mongoose.model('Match');
const Delivery = mongoose.model('Delivery');

module.exports.getAllMatches = (req, res, next) => {
    Match.find({}, (err, matches) => {
        if (!matches) {
            res.status(404).send('No record found.');
        } else {
            if (matches) {
                res.status(200).send(matches);
            } else {
                return next(err);
            }
        }
    });
}
module.exports.getMatchDataById = (req, res, next) => {
    Match.find({
        id: req.params.id
    }, (err, data) => {
        if (!data) {
            res.status(404).send('No record found.');
        } else {
            if (data) {
                res.status(200).send(data);
            } else {
                return next(err);
            }
        }
    });
}
module.exports.updateMatchById = (req, res, next) => {
    Match.updateOne({
        id: req.params.id
    }, req.body, (err, data) => {
        if (data) {
            res.json({
                success: true,
                data: 'Document updated'
            });
        } else {
            return next(err);
        }

    });
}
module.exports.deleteMatchById = (req, res, next) => {
    Match.deleteOne({
        id: req.params.id
    }, (err, data) => {
        if (data) {
            res.json(data.deletedCount);
        } else {
            return next(err);
        }
    });
}
module.exports.addMatch = (req, res, next) => {
    Match.find({}).sort({
        id: -1
    }).limit(1).lean().exec((err, data) => {
        if (data) {
            const getMaxMatchId = data[0].id
            const match = new Match();
            match.id = getMaxMatchId + 1;
            match.season = req.body.season;
            match.city = req.body.city;
            match.date = req.body.date;
            match.team1 = req.body.team1;
            match.team2 = req.body.team2;
            match.toss_winner = req.body.toss_winner;
            match.toss_decision = req.body.toss_decision;
            match.result = req.body.result;
            match.dl_applied = req.body.dl_applied;
            match.winner = req.body.winner;
            match.win_by_runs = req.body.win_by_runs;
            match.win_by_wickets = req.body.win_by_wickets;
            match.player_of_match = req.body.player_of_match;
            match.venue = req.body.venue;
            match.umpire1 = req.body.umpire1;
            match.umpire2 = req.body.umpire2;
            match.umpire3 = req.body.umpire3;
            match.save((err, doc) => {
                if (!err) {
                    res.send(doc);
                } else {
                    return next(err);
                }
            });
        } else {
            return next(err);
        }

    });
}
module.exports.getMatchTotalRunPerTeam = (req, res, next) => {
    Delivery.aggregate(
        [{
            $group: {
                _id: {
                    match_id: "$match_id",
                    batting_team: "$batting_team"
                },
                total_run: {
                    $sum: "$total_runs"
                }
            }
        },
        {
            $sort: {
                "_id.match_id": 1
            }
        }
        ],
        ((err, data) => {
            if (!data) {
                res.status(404).send('No record found.');
            } else {
                if (data) {
                    res.status(200).send(data);
                } else {
                    return next(err);
                }
            }
        })
    )
}
module.exports.getMatchTotalWicketPerTeam = (req, res, next) => {
    Delivery.aggregate(
        [{
            $match: {
                player_dismissed: {
                    $ne: ""
                }
            }
        }, {
            $group: {
                _id: {
                    match_id: "$match_id",
                    batting_team: "$batting_team"
                },
                total_wicket: {
                    $sum: 1
                }
            }
        }, {
            $sort: {
                "_id.match_id": 1
            }
        }],
        ((err, data) => {
            if (!data) {
                res.status(404).send('No record found.');
            } else {
                if (data) {
                    res.status(200).send(data);
                } else {
                    return next(err);
                }
            }
        })
    )
}
module.exports.getBatsmenByTeamAndMatches = (req, res, next) => {
    Delivery.aggregate(
        [{
            $match: {
                batting_team: req.body.teamName,
                match_id: {
                    $in: req.body.matchIds
                }
            }
        }, {
            $group: {
                _id: "$batting_team",
                batsmen: {
                    $addToSet: "$batsman"
                },
                non_strikers: {
                    $addToSet: "$non_striker"
                }
            }
        }],
        ((err, data) => {
            if (!data) {
                res.status(404).send('No record found.');
            } else {
                if (data) {
                    res.status(200).send(data);
                } else {
                    return next(err);
                }
            }
        })
    )
}
module.exports.getBowlersByTeamAndMatches = (req, res, next) => {
    Delivery.aggregate(
        [{
            $match: {
                bowling_team: req.body.teamName,
                match_id: {
                    $in: req.body.matchIds
                }
            }
        }, {
            $group: {
                _id: "$bowling_team",
                bowlers: {
                    $addToSet: "$bowler"
                }
            }
        }],
        ((err, data) => {
            if (!data) {
                res.status(404).send('No record found.');
            } else {
                if (data) {
                    res.status(200).send(data);
                } else {
                    return next(err);
                }
            }
        })
    )
}
module.exports.getDeliveriesData = (req, res, next) => {
    Delivery.find({
        match_id: req.params.id
    }, (err, deliveries) => {
        if (!deliveries) {
            res.status(404).send('No record found.');
        } else {
            if (deliveries) {
                res.status(200).send(deliveries);
            } else {
                return next(err);
            }
        }
    });
}