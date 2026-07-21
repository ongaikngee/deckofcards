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
  const [loading, setLoading] = useState(false);
  const [showTopup, setShowTopup] = useState(true);
  const [limit, setLimit] = useState(20);

  const { user } = useAuth();

  const HistoryLimits = [5, 10, 15, 20, 25, 30];

  const getChipsHistory = async () => {
    setError("");
    setLoading(true);
    try {
      const response = await getChipsHistoryService(user.id, showTopup, limit);
      setChipsHistory(response.data);
      setChips(response.total_amount);
    } catch (e) {
      setError(e?.detail || e?.message || "Failed to load chip history");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const topUpChip = async () => {
    setError("");
    setLoading(true);
    try {
      await updateChipsAmtService({
        user_id: user.id,
        amt: topUpAmt,
      });
      await getChipsHistory();
    } catch (e) {
      setError(e?.detail || e?.message || "Top up failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      getChipsHistory();
    }
  }, [user, showTopup, limit]);

  return (
    <div>
      <h2>
        <PokerChipIcon size={44} />
        Chips {loading ? <Spinner /> : formatCurrency(chips)}
      </h2>
      <div className="d-flex flex-column align-items-end gap-2">
        <button
          className="btn btn-primary w-25"
          style={{ minWidth: "200px" }}
          onClick={() => setShowTopup((prev) => !prev)}
        >
          {showTopup ? "Show All History" : "Show Topups Only"}
        </button>
        <div className="d-flex align-items-center gap-2">
          <div className="dropdown">
            <button
              className="btn btn-secondary btn-sm dropdown-toggle btn-info"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Results per page{" "}
            </button>
            <ul
              className="dropdown-menu dropdown-menu-end"
              style={{ minWidth: "4rem" }}
            >
              {HistoryLimits.map((limit) => (
                <li key={limit}>
                  <button
                    className="dropdown-item text-center"
                    type="button"
                    onClick={() => setLimit(limit)}
                  >
                    {limit}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div>
        {chipsHistory.length > 0 ? (
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
        ) : (
          <p>No history found.</p>
        )}
      </div>
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
      <button
        className="btn btn-primary"
        disabled={loading}
        onClick={() => topUpChip()}
      >
        {loading ? "Processing..." : `Top up ${formatCurrency(topUpAmt)}`}
      </button>
      {error && <div className="mt-5 alert alert-danger">{error}</div>}
    </div>
  );
};

export default Chips;
