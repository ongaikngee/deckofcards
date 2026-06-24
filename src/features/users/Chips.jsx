import React, { useState, useEffect } from "react";
import { PokerChipIcon } from "@phosphor-icons/react";
import {
  getChipsHistoryService,
  updateChipsAmtService,
} from "../../services/chipService";

import { useAuth } from "../auth/AuthContext";

// helpers
import { formatCurrency } from "../../utils/formatCurrency";

const Chips = () => {
  const [chips, setChips] = useState(0)
  const [chipsHistory, setChipsHistory] = useState([]);
  const [error, setError] = useState("");
  const [topUpAmt, setTopUpAmt] = useState(0);

  const { user } = useAuth();

  const getChipsHistory = async () => {
    setError("");
    try {
      const response = await getChipsHistoryService(user);
      setChipsHistory(response);
    
    } catch (e) {
      setError(e);
      console.log(e);
    }
  };

  const topUpChip = async () => {
    setError("");
    try {
      const response = await updateChipsAmtService({user_id:user, amt:topUpAmt});
      setChips((prev) => prev + topUpAmt);
    } catch (e) {
      setError(e);
      console.log(e);
    }
  };

  useEffect(() => {
    getChipsHistory();
  }, [chips]);

  useEffect(() => {
    getChipsHistory();
  }, []);

  return (
    <div>
      <h2>
        <PokerChipIcon size={44} />
        Chips {formatCurrency(chips)}
      </h2>
      {chipsHistory && (
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th scope="col">id</th>
              <th scope="col">Amount</th>
              <th scope="col">Reason</th>
            </tr>
          </thead>
          <tbody>
            {chipsHistory.map((record) => (
              <tr key={record.id}>
                <td>{record.id}</td>
                <td>{formatCurrency(record.amount)}</td>
                <td>{record.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <hr></hr>
      <div className="h2">Top Up</div>
      {/* Betting Amount Range Selector */}
      <div className="col-sm-6 mt-3">
        <input
          type="range"
          className="form-range"
          id="betSize"
          min="0"
          max="10000"
          step="1000"
          value={topUpAmt}
          onChange={(e) => setTopUpAmt(e.target.valueAsNumber)}
        ></input>
      </div>
      <button className="btn btn-primary" onClick={() => topUpChip()}>
        Top up {formatCurrency(topUpAmt)}
      </button>
    </div>
  );
};

export default Chips;
