const mongoose = require('mongoose');
const Performance = mongoose.model('Performance');
const Match = mongoose.model('Match');
const Delivery = mongoose.model('Delivery');


module.exports.getPerformanceData = (req, res, next) => {

    if (req.params.playerType == 'bat') {
        Delivery.aggregate([{ $match: { batting_team: req.params.batting_team } },
        { $project: { _id: 0, batsman: "$batsman", batsman_runs: "$batsman_runs", match_id: "$match_id", bowling_team: "$bowling_team" } },
        {
            $lookup: {
                from: "matches", let: { matchid: "$match_id" },
                pipeline: [{ $match: { season: parseInt(req.params.seasons), $expr: { $eq: ["$$matchid", "$id"] } } },
                { $project: { _id: 0, season: "$season", match_id: "$id" } }], as: "matches"
            }
        }, { $unwind: "$matches" },
        {
            $group: {
                _id: { batsman: "$batsman", bowlingTeam: "$bowling_team", match_id: "$match_id" },
                TotalRuns: { $sum: "$batsman_runs" }, countStrike: { $sum: 1 }
            }
        }, { "$addFields": { "strikeRate": { $trunc: { "$multiply": [{ "$divide": ["$TotalRuns", "$countStrike"] }, 100] }} } },
        { $sort: { "_id.batsman": 1 } }]
            , (err, data) => {
                if (!data) {
                    res.status(404).send('No record found.');
                }
                else {
                    if (data) {
                        res.status(200).send(data);
                    }
                    else {
                        return next(error);
                    }

                }
            });
    }
    else if (req.params.playerType == 'field') {

        Delivery.aggregate([{ $match: { bowling_team: req.params.batting_team } },
        {
            $project: {
                _id: 0, bowler: "$bowler", total_runs: "$total_runs", match_id: "$match_id", batting_team: "$batting_team",
                wicketTakerCount: {
                    $cond: {
                        if: { $eq: ["$dismissal_kind", ""] }, then: 0, else: {
                            $cond: {
                                if: { $eq: ["$dismissal_kind", "run out"] }, then: 0,
                                else: { $cond: { if: { $eq: ["$dismissal_kind", "retired hurt"] }, then: 0, else: 1 } }
                            }
                        }
                    }
                }
            }
        },
        {
            $lookup: {
                from: "matches", let: { matchid: "$match_id" },
                pipeline: [{ $match: { season: parseInt(req.params.seasons), $expr: { $eq: ["$$matchid", "$id"] } } },
                { $project: { _id: 0, season: "$season", match_id: "$id" } }], as: "matches"
            }
        }, { $unwind: "$matches" },
        {
            $group: {
                _id: { bowler: "$bowler", batting_team: "$batting_team", match_id: "$match_id" },
                TotalRunsGivenPerInnings: { $sum: "$total_runs" }, WicketsTaken: { $sum: "$wicketTakerCount" },
                Ball: { $sum: 1 }
            }
        }, {
            "$addFields": {
                "EconomyRate": {
                    $cond: [{ $eq: ["$wicketTakerCount", 0] }, "N/A",
                    { "$divide": ["$countBall", "$wicketTakerCount"] }]
                }
            }
        }, { $sort: { "_id.bowler": 1 } }]
            , (err, data) => {
                if (!data) {
                    res.status(404).send('No record found.');
                }
                else {
                    if (data) {
                        res.status(200).send(data);
                    }
                    else {
                        return next(error);
                    }

                }
            });

    }
    else if (req.params.playerType == 'team') {
        Match.aggregate([{
            "$match": {
                $or: [{ team1: req.params.batting_team },
                { team2: req.params.batting_team }], season: parseInt(req.params.seasons)
            }
        },
        {
            $project: {
                _id: 0, winner: "$winner",
                against: {
                    $cond: {
                        if: { $eq: ["$team1", req.params.batting_team] },
                        then: "$team2", else: "$team1"
                    }
                }, city: "$city", venue: "$venue",
                manoftheMatch: "$player_of_match", toss: { $cond: [{ $eq: ["$toss_winner", req.params.batting_team] }, "Win","Loss"] },
                winner: { $cond: [{ $eq: ["$winner", req.params.batting_team] }, "Win", "Loss"] }
            }
        }]
            , (err, data) => {
                if (!data) {
                    res.status(404).send('No record found.');
                }
                else {
                    if (data) {
                        res.status(200).send(data);
                    }
                    else {
                        return next(error);
                    }

                }
            });

    }


    /*Delivery.aggregate([{$match:{batting_team:req.params.batting_team}},
    {$group:{_id:{batsman:"$batsman",match_id:"$match_id"},
    total:{$sum:"$batsman_runs"}}},{$lookup:{from:"matches",localField:"match_id",foreignField:"id",as :"matches"}},
    {$limit:1}]
    ,(err,data)=>{
            if(!data){
                res.status(404).send('No record found.');
            }
            else
            {
                    if(data){
                        res.status(200).send(data);
                    }
                    else{
                        return next(error);
                    }

            }
    });    */

}

