export const getInitial = (param) => {
  if (param) {
    let parts = param.split(' ')
    let initials = ''
    for (var i = 0; i < parts.length; i++) {
      if (parts[i].length > 0 && parts[i] !== '') {
        initials += parts[i][0]
      }
    }
    if (initials === 'DC' && param === 'Delhi Capitals') {
      initials = 'DC-C'
    }
    return initials
  }
}
export const getDateSlider = (param) => {
  if (param) {
    const options = { month: "long", day: "numeric" };
    return new Date(param).toLocaleDateString([], options);
  }
}

export const analyseBall = (ball) => {
  if (ball.player_dismissed) {
    return 'wicket'
  }
  if (ball.total_runs >= 4 && ball.total_runs <= 5) {
    return 'four-run'
  }
  if (ball.total_runs >= 6) {
    return 'six-run'
  }
}

export const analyseRun = (ball) => {
  if (ball.player_dismissed) {
    return 'W'
  } if (ball.legbye_runs) {
    return `${ball.total_runs}LR`
  } else {
    return ball.total_runs
  }
}

export const analyseBallResult = (ball) => {
  if (ball.wide_runs) {
    return 'Wide Ball'
  } if (ball.legbye_runs) {
    return 'Legby Run'
  } if (ball.player_dismissed) {
    return 'Wicket'
  } if (ball.noball_runs) {
    return 'No ball'
  } else {
    return ball.batsman
  }
}

export const getBatsmanData = (collection, batsman) => {
  let data = {}, run = 0, ball = 0, four = 0, six = 0;
  collection.filter((data) => {
    if (data.batsman === batsman) {
      run = run + data.total_runs;
      ball++
      if (data.total_runs === 4 || data.total_runs === 5) {
        four++
      }
      if (data.total_runs === 6) {
        six++
      }
    }
  })
  return data = {
    'batsman': batsman,
    'runs': run,
    'ball': ball,
    'four': four,
    'six': six
  }
}

export const getBowlerData = (collection, bowler) => {
  let data = {}, over = 0, run = 0, wicket = 0, dots = 0;
  collection.filter((data) => {
    if (data.bowler === bowler) {
      over = getNumberofOvers(collection, bowler)
      run = run + data.total_runs
      if (data.player_dismissed) {
        wicket++
      }
      if (data.total_runs === 0) {
        dots++
      }
    }
  })
  return data = {
    'bowler': bowler,
    'over': over,
    'run': run,
    'wicket': wicket,
    'dots': dots
  }
}

export const getNumberofOvers = (collection, bowler) => {
  let over = [], noofOver = 0;
  collection.filter((data) => {
    if (data.bowler === bowler) {
      if (over.indexOf(data.over) < 0) {
        over.push(data.over);
        noofOver++
      }
    }
  })
  return noofOver
}

export const getBatsmanAndBowlerData = (collection, team, type) => {
  let modifiedObj = []
  switch (type) {
    case 'batsman':
      collection.filter((data) => {
        if (data.batting_team === team) {
          if (!modifiedObj.some(el => el.batsman === data.batsman)) {
            modifiedObj.push(getBatsmanData(collection, data.batsman));
          }
        }
      })
      break;
    case 'bowler':
      collection.filter((data) => {
        if (data.bowling_team === team) {
          if (!modifiedObj.some(el => el.bowler === data.bowler)) {
            modifiedObj.push(getBowlerData(collection, data.bowler));
          }
        }
      })
      break;
    default:
      return modifiedObj;
  }
  return modifiedObj;
}

export const getTotalRunFromDeliveries = (collection, team_name) => {
  let total = 0
  collection.map((data) => {
    if (data.batting_team === team_name) {
      total = total + data.total_runs
    }
  })
  return total
}

export const getTotalWicketsFromDeliveries = (collection, team_name) => {
  let wickets = 0
  collection.map((data) => {
    if (data.batting_team === team_name && data.player_dismissed) {
      wickets++
    }
  })
  return wickets;
}

export const getStrikeRate = (runs, balls) => {
  const sr = (runs / balls) * 100;
  return sr.toFixed(2);
}

export const getEconomyRate = (overs, runs) => {
  const econ = (runs / overs);
  return econ.toFixed(2);
}

export const getTotalOverPalyed = (collection, team) => {
  let overPlayed = 0;
  let overs = [];
  collection.filter((data) => {
    if (overs.indexOf(data.over) < 0 && (data.batting_team === team)) {
      overs.push(data.over);
      overPlayed++
    }
  })
  return overPlayed;
}
export const getTotalWicketTaken = (collection, team) => {
  let wicketTaken = 0;
  collection.map((data) => {
    if (data.bowling_team === team && data.player_dismissed) {
      wicketTaken++
    }
  })
  return wicketTaken;
}


export const getRunRate = (totalRunScored, totalOverFaced) => {
  const runrate = (totalRunScored / totalOverFaced)
  return runrate.toFixed(2);
}

export default {
  getInitial, getDateSlider, analyseBall, analyseRun,
  analyseBallResult, getBatsmanData, getBowlerData, getBatsmanAndBowlerData,
  getTotalRunFromDeliveries, getStrikeRate, getEconomyRate, getTotalWicketsFromDeliveries, getTotalOverPalyed, getRunRate, getTotalWicketTaken
};