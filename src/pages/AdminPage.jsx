import { useState } from "react";
import { getUsersChipCounts } from "../services/adminApi";

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getUsersChipCounts();
      setUsers(data);
    } catch (err) {
      setError(err.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <h2>Admin Page</h2>
      <div className="my-3">
        <button className="btn btn-primary" onClick={loadUsers} disabled={loading}>
          {loading ? "Loading..." : "Show Users and Chip Counts"}
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {users.length > 0 && (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">User ID</th>
                <th scope="col">Username</th>
                <th scope="col">Chip Count</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.user_id}>
                  <td>{user.user_id}</td>
                  <td>{user.username}</td>
                  <td>{user.chip_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
