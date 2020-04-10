const express = require('express');
const router = express.Router();

const ctrlUser = require('../controller/user.controller');
const ctrlMatch = require('../controller/match.controller');
const ctrlDelivery = require('../controller/delivery.controller');
const ctrlPerformance=require('../controller/performance.controller');

router.post('/register', ctrlUser.register);
router.post('/login', ctrlUser.login);
router.put('/setFavorite', ctrlUser.setFavorite);
router.get('/getAllUser', ctrlUser.getAllUsers);
router.put('/updateUserPermission', ctrlUser.updateUserPermission);
router.delete('/deleteUserById/:id', ctrlUser.deleteUserById);

router.get('/getAllMatches', ctrlMatch.getAllMatches);
router.get('/getMatchTotalRunPerTeam', ctrlMatch.getMatchTotalRunPerTeam);
router.get('/getMatchTotalWicketPerTeam', ctrlMatch.getMatchTotalWicketPerTeam);
router.get('/getAllDeliveries/:id', ctrlMatch.getDeliveriesData);
router.get('/getMatch/:id', ctrlMatch.getMatchDataById);
router.put('/updateMatchById/:id', ctrlMatch.updateMatchById);
router.delete('/deleteMatchById/:id', ctrlMatch.deleteMatchById);
router.post('/addMatch', ctrlMatch.addMatch);
router.post('/getBatsmenByTeamAndMatches', ctrlMatch.getBatsmenByTeamAndMatches);
router.post('/getBowlersByTeamAndMatches', ctrlMatch.getBowlersByTeamAndMatches);

router.get('/getAllDeliveries',ctrlDelivery.getAllDeliveries);
router.get('/getDeliveryDataById/:match_id',ctrlDelivery.getDeliveryDataById);
router.put('/updateDeliveryDataById/:_id',ctrlDelivery.updateDeliveryDataById);
router.delete('/deleteDeliveryDataById/:id',ctrlDelivery.deleteDeliveryDataById);
router.post('/addDelivery',ctrlDelivery.addDelivery);

router.get('/getPerformanceData/:seasons&:batting_team&:playerType',ctrlPerformance.getPerformanceData);


module.exports = router;