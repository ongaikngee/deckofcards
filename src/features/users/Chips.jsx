import React, { useState, useEffect } from "react";
// componenets
import { useAuth } from "../auth/AuthContext";
import Spinner from "../../components/Spinner";
import {
  getChipsHistoryService,
  updateChipsAmtService,
} from "../../services/chipService";

// helpers
import { formatCurrency } from "../../utils/formatCurrency";

// 3rd party libraries
import { PokerChipIcon } from "@phosphor-icons/react";
import dayjs from "dayjs";

const Chips = () => {
  const [chips, setChips] = useState(0);
  const [chipsHistory, setChipsHistory] = useState([]);
  const [error, setError] = useState("");
  const [topUpAmt, setTopUpAmt] = useState(1000);
  const [loading, setLoading] = useState(false)

  const { user } = useAuth();

  const getChipsHistory = async () => {
    setError("");
    setLoading(true)
    try {
      const response = await getChipsHistoryService(user);
      setChipsHistory(response.data);
      setChips(response.total_amount);
    } catch (e) {
      setError(e);
      console.error(e);
    } finally {
      setLoading(false)
    }
  };

  const topUpChip = async () => {
    setError("");
    try {
      const response = await updateChipsAmtService({
        user_id: user,
        amt: topUpAmt,
      });
      setChips((prev) => prev + topUpAmt);
    } catch (e) {
      const errorMessage = e?.detail || e?.message || "Top up failed";
      setError("Top up failed");
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
        Chips {loading? <Spinner/> : formatCurrency(chips)}
      </h2>
      {chipsHistory && (
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Amount</th>
              <th scope="col">Reason</th>
            </tr>
          </thead>
          <tbody>
            {chipsHistory.map((record) => (
              <tr key={record.id}>
                <td>
                  {record.created_at
                    ? dayjs(record.created_at).fromNow()
                    : "N/A"}
                </td>
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
          min="1000"
          max="10000"
          step="1000"
          value={topUpAmt}
          onChange={(e) => setTopUpAmt(e.target.valueAsNumber)}
        ></input>
      </div>
      <button className="btn btn-primary" onClick={() => topUpChip()}>
        Top up {formatCurrency(topUpAmt)}
      </button>
      {error && <div className="mt-5 alert alert-danger">{error}</div>}
    </div>
  );
};

export default Chips;
