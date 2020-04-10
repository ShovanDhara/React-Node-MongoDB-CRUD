const mongoose = require('mongoose');
const Delivery = mongoose.model('Delivery');



module.exports.getAllDeliveries = (req, res, next) => {
    Delivery.find({}, (err, deliveries) => {
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
module.exports.getDeliveryDataById = (req, res, next) => {
    Delivery.find({ match_id: req.params.match_id }, (err, deliveries) => {
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
module.exports.updateDeliveryDataById = (req, res, next) => {
    Delivery.updateOne({ _id: (req.params._id) }, req.body, (err, deliveries) => {
        if (deliveries) {
            res.json({
                success: true,
                deliveries: 'Document updated'
            });
        } else {
            return next(err);
        }

    });
}
module.exports.deleteDeliveryDataById = (req, res, next) => {
    Delivery.deleteOne({ id: req.params.id }, (err, deliveries) => {
        if (deliveries) {
            res.json(deliveries.deletedCount);
        } else {
            return next(err);
        }
    });
}

module.exports.addDelivery = (req, res, next) => {
    Delivery.find({}).sort({ id: -1 }).limit(1).lean().exec((err, data) => {
        if (data) {
            const getMaxDeliveryId = data[0].id
            const delivery = new Delivery();
            delivery.match_id = getMaxDeliveryId + 1;
            delivery.inning = req.body.inning;
            delivery.batting_team = req.body.batting_team;
            delivery.bowling_team = req.body.bowling_team;
            delivery.over = req.body.over;
            delivery.ball = req.body.ball;
            delivery.batsman = req.body.batsman;
            delivery.non_striker = req.body.non_striker;
            delivery.bowler = req.body.bowler;
            delivery.is_super_over = req.body.is_super_over;
            delivery.wide_runs = req.body.wide_runs;
            delivery.bye_runs = req.body.bye_runs;
            delivery.legbye_runs = req.body.legbye_runs;
            delivery.noball_runs = req.body.noball_runs;
            delivery.penalty_runs = req.body.penalty_runs;
            delivery.batsman_runs = req.body.batsman_runs;
            delivery.extra_runs = req.body.extra_runs;
            delivery.total_runs = req.body.total_runs;
            delivery.player_dismissed = req.body.player_dismissed;
            delivery.dismissal_kind = req.body.dismissal_kind;
            delivery.fielder = req.body.fielder;
            delivery.save((err, deliveries) => {
                if (!err) {
                    res.send(deliveries);
                } else {
                    return next(err);
                }
            });
        } else {
            return next(err);
        }

    });
}

