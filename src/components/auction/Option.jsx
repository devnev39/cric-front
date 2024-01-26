import settings from '../../config/settings';
import React, {useEffect, useState} from 'react';
import fetchModel from '../../helpers/fetchModel';
import UpdateForm from '../common/UpdateForm';
import './styles.css';

function Option(props) {
  const [modelJson, setModelJson] = useState(null);
  const [modelVal, setModelVal] = useState(null);
  const [wiModel, setwiModel] = useState(null);

  useEffect(() => {
    const run = async () => {
      await fetchModel(`${settings.BaseUrl}/wimodels/auction`, setModelJson);
      await fetchModel(
          `${settings.BaseUrl}/wimodels/PlayerRuleModel`,
          setwiModel,
      );
    };
    run();
  }, []);
  useEffect(() => {
    console.log(wiModel);
  }, [wiModel]);

  useEffect(() => {
    if (!modelJson) return;
    const obj = {};
    Object.keys(modelJson).forEach((key) => {
      if (props.auctionObj[key] !== undefined) {
        obj[key] = props.auctionObj[key];
      }
    });
    obj['_id'] = props.auctionObj._id;
    setModelVal(obj);
    console.log(obj);
  }, [modelJson, props.auctionObj]);

  const captureWiModel = async () => {
    const ele = document.getElementById('wimodelSelection').value;
    await fetchModel(
        `${settings.BaseUrl}/wimodels/${ele}RuleModel`,
        setwiModel,
    );
  };

  const showRuleConsole = () => {
    const e = document.getElementById('ruleConsoleForm');
    if (e.classList.contains('display')) {
      e.classList.toggle('display');
      e.classList.toggle('openForm');
      e.classList.toggle('closeForm');
      e.classList.toggle('openFormDisplay');
      e.classList.toggle('closeFormDisplay');
      // setTimeout(() => {e.classList.toggle("closeFormDisplay")},500);
      document
          .getElementById('optionMainDiv')
          .classList.toggle('blurBackground');
    } else {
      e.classList.toggle('display');
      e.classList.toggle('closeForm');
      e.classList.toggle('openFormDisplay');
      e.classList.toggle('closeFormDisplay');
      e.classList.toggle('openForm');
      // setTimeout(() => {e.classList.toggle("openForm");},100);
      document
          .getElementById('optionMainDiv')
          .classList.toggle('blurBackground');
    }
  };

  const addNewRule = async () => {
    const ruleName = document.getElementById('ruleName').value;
    if (ruleName === '') {
      alert('Rule name empty !');
      return;
    }
    let rule = document.getElementById('ruleInput').value;
    const type = document.getElementById('wimodelSelection').value;
    const ruleCheck = JSON.parse(JSON.stringify(rule));
    if (rule === '') {
      alert('Empty rule !');
      return;
    }
    const keys = Object.keys(wiModel);
    for (const key of keys) {
      console.log(key);
      const re = new RegExp(`\\b${key}\\b`, 'g');
      while (rule.match(re)) {
        rule = rule.replace(re, '');
        console.log(rule);
      }
    }
    rule = rule.match('([A-z])');
    if (rule && rule.length) {
      alert('Rule invalid !');
      console.log(rule);
      return;
    }
    const Rule = {
      ruleName: ruleName,
      rule: ruleCheck,
      type: type,
    };
    const resp = await (
      await fetch(`${settings.BaseUrl}/auction/${props.auctionObj._id}/rule`, {
        method: 'POST',
        body: JSON.stringify({rule: Rule}),
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })
    ).json();
    if (resp.status !== 200) {
      alert(`${resp.status} ${resp.data}`);
    } else {
      alert('Success !');
      if (resp.data && props.setAuctionObj) {
        props.setAuctionObj(resp.data);
      }
      showRuleConsole();
    }
  };

  const deleteRule = async (rule) => {
    if (!window.confirm('Delete rule ?')) {
      return;
    }
    const resp = await (
      await fetch(`${settings.BaseUrl}/auction/${props.auctionObj._id}/rule`, {
        method: 'DELETE',
        body: JSON.stringify({rule: rule}),
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })
    ).json();
    if (resp.status !== 200) {
      alert(`${resp.status} ${resp.data}`);
    } else {
      alert('Success !');
      if (resp.data && props.setAuctionObj) {
        props.setAuctionObj(resp.data);
      }
    }
  };

  return (
    <>
      <div className="optionContainerRoot" id="optionMainDiv">
        <div className="mt-5 d-flex justify-content-center" key={'1'}>
          {modelJson ? (
            modelVal ? (
              <UpdateForm
                dataSchema={modelJson}
                neglects={['Password', 'Adminid']}
                model={modelVal}
                modelKey="auction"
              />
            ) : null
          ) : null}
        </div>
        <div
          className="RulesContainerRoot mt-5 d-flex justify-content-center"
          key={'2'}
        >
          <div className="shadow rounded py-3 px-5 w-100">
            <div className="d-flex justify-content-center h2">Rules</div>
            <div className="playerRuleContainer border-top d-flex justify-content-center w-100">
              <div className="h5 w-100">
                {props.auctionObj.Rules ?
                  props.auctionObj.Rules.map((rule) => {
                    return (
                      <>
                        <div
                          className="ruleDiv shadow rounded p-3 m-3 w-100"
                          key={rule.ruleName}
                        >
                          <div className="row">
                            <div className="col-2">{rule.ruleName}</div>
                            <div className="col-2">
                              {rule.type || '<Nan>'}
                            </div>
                            <div className="col-6">{rule.rule || null}</div>
                            <div className="col-2">
                              <button
                                className="btn btn-danger"
                                onClick={() => deleteRule(rule)}
                              >
                                <i className="fa-solid fa-trash-can"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  }) :
                  null}
              </div>
            </div>
            <div className="d-flex justify-content-center">
              <button
                className="btn btn-success"
                onClick={() => showRuleConsole()}
              >
                Add Rule
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className="closeFormDisplay closeForm"
        style={{top: '30%', left: '40%'}}
        id="ruleConsoleForm"
      >
        <div className="d-flex justify-content-center">
          <div
            className="w-50 p-5 rounded shadow"
            id="ruleConsole"
            style={{backgroundColor: 'rgba(255,255,255,0.9)'}}
          >
            <div className="row my-4">
              <div className="col-4 d-flex justify-content-center font-weight-bold">
                <label>Name : </label>
              </div>
              <div className="col-8 d-flex justify-content-center">
                <input
                  id="ruleName"
                  type="text"
                  className="w-100"
                  placeholder="rule name"
                />
              </div>
            </div>
            <div className="row my-4">
              <div className="col-4 d-flex justify-content-center font-weight-bold">
                <label>Type : </label>
              </div>
              <div className="col-8 d-flex justify-content-center">
                <select id="wimodelSelection" onChange={() => captureWiModel()}>
                  <option defaultChecked>Player</option>
                  <option>Team</option>
                </select>
                <div className="wiModels border border-primary mx-5 p-3">
                  {wiModel ?
                    Object.keys(wiModel).map((key) => {
                      return (
                        <>
                          <strong key={key}>{`${key}`}</strong>
                          <br />
                        </>
                      );
                    }) :
                    null}
                </div>
              </div>
            </div>
            <div className="row my-4">
              <div className="col-4 d-flex justify-content-center font-weight-bold">
                <label>Rule : </label>
              </div>
              <div className="col-8 d-flex justify-content-center">
                <input
                  id="ruleInput"
                  className="w-100"
                  type="text"
                  placeholder="rule - eg. (AuctionedPrice - SoldPrice) / AuctionedPrice"
                />
              </div>
            </div>
            <div className="d-flex justify-content-center">
              <button
                className="btn btn-success mr-5"
                onClick={() => addNewRule()}
              >
                Add
              </button>
              <button
                className="btn btn-danger"
                onClick={() => showRuleConsole()}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Option;
