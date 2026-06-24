import React, { useState, useEffect } from "react";
import { PokerChipIcon } from "@phosphor-icons/react";
import {
  getChipHistoryService,
  updateChipAmtService,
} from "../../services/chipService";

import { useAuth } from "../auth/AuthContext";

// helpers
import { formatCurrency } from "../../utils/formatCurrency";

const Chips = () => {
  const [chips, setChips] = useState([]);
  const [error, setError] = useState("");
  const [topUpAmt, setTopUpAmt] = useState(0);

  const { user } = useAuth();

  const getChipHistory = async () => {
    setError("");
    try {
      const response = await getChipHistoryService(user);
      setChips(response);
    } catch (e) {
      setError(e);
      console.log(e);
    }
  };

  const topUpChip = async () => {
    setError("");
    try {
      const response = await updateChipAmtService(user, topUpAmt);
      setChips(response);
    } catch (e) {
      setError(e);
      console.log(e);
    }
  };

  useEffect(() => {
    getChipHistory();
  }, []);

  return (
    <div>
      <h2>
        <PokerChipIcon size={44} />
        Chips
      </h2>
      {chips && (
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th scope="col">id</th>
              <th scope="col">Amount</th>
              <th scope="col">Reason</th>
            </tr>
          </thead>
          <tbody>
            {chips.map((record) => (
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
          max="100000"
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
