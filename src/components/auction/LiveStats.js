import settings from "../../config/settings.json";
import {useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { simplify, number, fraction, round } from 'mathjs'
import fetchModel from '../../helpers/fetchModel'
import _ from "lodash";
import PolarAreaChart from '../common/PolarArea';

function LiveStats (props) {
  const [socket, setSocket] = useState(null)
  const [auctionData, setAuctionData] = useState(
    props.auctionObj ? props.auctionObj : null
  )
  const [teamModel, setTeamModel] = useState(null)
  const [playerModel, setPlayerModel] = useState(null)
  const [flag, setFlag] = useState(false)

  useEffect(() => {
    const runMe = async () => {
      await fetchModel(`${settings.BaseUrl}/wimodels/TeamRuleModel`, setTeamModel)
      await fetchModel(`${settings.BaseUrl}/wimodels/PlayerRuleModel`, setPlayerModel)
    }
    const sck = io(`${settings.BaseUrl}`,{
      withCredentials : true
    })
    sck.on('connect', () => {
      setSocket(sck)
    })
    runMe()
  }, [])

  useEffect(() => {
    if (!socket) return
    if (!socket.connected) return
    console.log('Listening for data !')
    socket.on(`${props.auctionObj._id}`, data => {
      console.log('Auction data received !')
      setAuctionData(data)
    })
  }, [socket])

  useEffect(() => {
    if (!teamModel || !playerModel) return
    if (!auctionData) return
    if (auctionData.Teams.length) {
      for (let team of auctionData.Teams) {
        if (team.Players.length) {
          team.Players = team.Players.map(player => {
            if (Object.keys(player).length < 3) {
              player = _.find(
                auctionData.poolingMethod === 'Composite'
                  ? auctionData.dPlayers
                  : auctionData.cPlayers,
                p => {
                  return p._id === player._id
                }
              )
              return player
            }
            return player
          })
        }
      }
    }
    for (let team of auctionData.Teams) {
      for (let rule of auctionData.Rules) {
        const c_rule = JSON.parse(JSON.stringify(rule))
        if (c_rule.type === 'Team') {
          for (let key of Object.keys(teamModel)) {
            const re = new RegExp(`\\b${key}\\b`, 'g')
            while (c_rule.rule.match(re)) {
              c_rule.rule = c_rule.rule.replace(re, team[key])
            }
          }
          c_rule.rule = simplify(c_rule.rule).toString()
          while (c_rule.rule.includes(' ')) {
            c_rule.rule = c_rule.rule.replace(' ', '')
          }
          team[rule.ruleName] = round(number(fraction(c_rule.rule)), 2);
        }
        if (c_rule.type === 'Player') {
          let ruleAvg = 0;
          for (let player of team.Players) {
            for (let key of Object.keys(playerModel)) {
              const re = new RegExp(`\\b${key}\\b`, 'g')
              while (c_rule.rule.match(re)) {
                c_rule.rule = c_rule.rule.replace(re, player[key])
              }
            }
            c_rule.rule = simplify(c_rule.rule).toString()
            while (c_rule.rule.includes(' ')) {
              c_rule.rule = c_rule.rule.replace(' ', '')
            }
            player[rule.ruleName] = round(number(fraction(c_rule.rule)),2);
            ruleAvg += player[rule.ruleName];
          }
          team[`${c_rule.ruleName}avg`] = round(ruleAvg / team.Players.length,2)
        }
      }
    }
    setFlag(!flag)
  }, [auctionData, teamModel, playerModel])

  useEffect(() => {
    // For each rule, circular char of each team
  }, [flag])
  return (
    <div className='w-100'>
      <div className='d-flex justify-content-center mt-5'>
        <h1>Live Stats</h1>
        {/* <h2>
          {socket
            ? socket.connected
              ? `Connected to socket !`
              : `Not connected !`
            : 'Nan'}
        </h2> */}
      </div>
      
      <div className='d-flex justify-content-center'>
        <div style={{"width" : "70%"}}>
        {auctionData
          ? auctionData.Teams
            ? auctionData.Teams.map(team => {
                if (!auctionData.Rules) return null;
                for(let team of auctionData.Teams){
                  for(let player of team.Players){
                    if(Object.keys(player).length < 3) return null;
                  }
                }

                const rules = auctionData.Rules.map(rule => {
                  return (
                    <div className='mx-5'>
                      {rule.type === 'Team'
                        ? `${rule.ruleName} : ${team[rule.ruleName]}`
                        : null}
                    </div>
                  )
                })
                
                let tableHeads = ['Name', 'Current', 'Budget', 'AuctionMaxBudget']
                auctionData.Rules.forEach(rule => {
                  if (rule.type === 'Team') tableHeads.push(rule.ruleName)
                })
                let teamheads = tableHeads.map(head => {
                  return <th key={`${head}`}>{head}</th>
                })
                teamheads = <tr key={`${team.Name}`}>{teamheads}</tr>
                let teambody = (
                  <tr>
                    {tableHeads.map(prop => {
                      return prop === "Name" ? <td className='bg-dark text-white' key={`${team[prop]}${prop}`}>{team[prop]}</td> : <td key={`${team[prop]}${prop}`}>{team[prop]}</td>;
                    })}
                  </tr>
                )

                let theads_props = [
                  'Name',
                  'BasePrice',
                  'AuctionedPrice',
                  'SoldPrice'
                ]

                let ruleAvgs = [];

                auctionData.Rules.forEach(rule => {
                  if(rule.type === 'Team') return;
                  ruleAvgs.push(
                    <div key={`${rule.ruleName}$avg`} className='text-danger h5'>
                      {rule.ruleName}<sub>avg</sub> : {team[`${rule.ruleName}avg`]}
                    </div>
                  )
                  theads_props.push(rule.ruleName)
                })
                let theads = theads_props.map(head => {
                  return <th key={`${head}`}>{head}</th>
                })
                theads = <tr key={`${team.Name}`}>{theads}</tr>

                let tbody = team.Players.map(player => {
                  let tds = theads_props.map(prop => {
                    if(isNaN(player[prop])){
                      console.log(prop);
                      console.log(player);
                    }
                    return (
                      // !isNaN(player[prop]) ?
                      <td key={`${player.Name}${prop}`}>
                        {player[prop] ? player[prop] : NaN}
                      </td> 
                      // : null
                    )
                  })
                  return <tr key={`${player.SRNO}`}>{tds}</tr>
                })

                return (
                    <div className='shadow rounded p-3 mt-5' style={{"width" : "100%"}} key={`${auctionData.Teams.indexOf(team)}${team.Name}`}>
                        <div className='d-flex justify-content-start'>
                            <div>
                                <div className='w-100'>
                                    <table className='table table-striped table-bordered'>
                                        <thead className='h6'>{teamheads}</thead>
                                        <tbody className='h5'>{teambody}</tbody>
                                    </table>
                                </div>
                                <div className='w-100'>
                                    <table className='table table-striped table-bordered'>
                                        <thead className='table-head h6'>{theads}</thead>
                                        <tbody className='h5'>{tbody}</tbody>
                                    </table>
                                    <div>
                                      {ruleAvgs}
                                    </div>
                                </div>
                        </div>
                        </div>
                    </div>
                )
              })
            : null
          : null}
          </div>
          <div style={{"width" : "30%"}}>
              {
                auctionData ? 
                auctionData.Teams ? 
                auctionData.Rules.map(rule => {
                  return (
                    <div className='shadow rounded p-2 my-2'> 
                      <PolarAreaChart data={auctionData.Teams} option={{
                      ykey : rule.type === 'Player' ? `${rule.ruleName}avg` : rule.ruleName,
                      xkey : "Name",
                      ylabel : "Value"

                    }} />
                    <div className='d-flex justify-content-center h5'>
                      {rule.ruleName}
                    </div>  
                    </div>
                  )
                }) : null : null
              }
          </div>
        </div>
    </div>
  )
}

export default LiveStats
