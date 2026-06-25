import { useState } from "react";
import {
  getUsersChipCounts,
  makeAdmin,
  deleteUser,
} from "../services/adminApi";
import Modal from "../components/Modal";
import { formatCurrency } from "../utils/formatCurrency";
import {
  ShieldCheck,
  UserCircle,
  ShieldStar,
  TrashSimple,
} from "@phosphor-icons/react";

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [deleteTarget, setDeleteTarget] = useState(null);

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

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteUser(deleteTarget.user_id);
      await loadUsers();
    } catch (err) {
      setError(err.message || "Failed to delete user.");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="container py-4">
      <h2>Admin Page</h2>
      <div className="my-3">
        <button
          className="btn btn-primary"
          onClick={loadUsers}
          disabled={loading}
        >
          {loading ? "Loading..." : "Show Users and Chip Counts"}
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {users.length > 0 && (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th
                  scope="col"
                  role="button"
                  onClick={() => handleSort("username")}
                >
                  Username
                  {sortColumn === "username"
                    ? sortDirection === "asc"
                      ? " ▲"
                      : " ▼"
                    : ""}
                </th>
                <th
                  scope="col"
                  role="button"
                  onClick={() => handleSort("created_at")}
                >
                  Created At
                  {sortColumn === "created_at"
                    ? sortDirection === "asc"
                      ? " ▲"
                      : " ▼"
                    : ""}
                </th>
                <th
                  scope="col"
                  role="button"
                  onClick={() => handleSort("chip_count")}
                >
                  Chip Count
                  {sortColumn === "chip_count"
                    ? sortDirection === "asc"
                      ? " ▲"
                      : " ▼"
                    : ""}
                </th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                const sorted = [...users];
                if (sortColumn) {
                  sorted.sort((a, b) => {
                    const dir = sortDirection === "asc" ? 1 : -1;
                    if (sortColumn === "username") {
                      return (
                        dir * (a.username || "").localeCompare(b.username || "")
                      );
                    }
                    if (sortColumn === "created_at") {
                      return (
                        dir *
                        (new Date(a.created_at || 0) -
                          new Date(b.created_at || 0))
                      );
                    }
                    // numeric
                    return dir * ((a[sortColumn] || 0) - (b[sortColumn] || 0));
                  });
                }
                return sorted.map((user) => (
                  <tr key={user.user_id}>
                    <td>
                      <span className="d-flex align-items-center gap-2">
                        {user.role === "admin" ? (
                          <ShieldStar
                            size={18}
                            weight="fill"
                            className="text-success"
                          />
                        ) : (
                          <UserCircle
                            size={18}
                            weight="duotone"
                            className="text-secondary"
                          />
                        )}
                        <span>
                          {user.username}{" "}
                          <span
                            className={`badge ${user.role === "admin" ? "bg-success" : "bg-secondary"}`}
                          >
                            {user.role}
                          </span>
                        </span>
                      </span>
                    </td>
                    <td>
                      {user.created_at
                        ? new Date(user.created_at).toLocaleString()
                        : ""}
                    </td>
                    <td>{formatCurrency(user.chip_count)}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary me-2"
                        disabled={user.role === "admin"}
                        title={
                          user.role === "admin"
                            ? "Already an admin"
                            : "Promote to admin"
                        }
                        onClick={async () => {
                          try {
                            await makeAdmin(user.user_id);
                            await loadUsers();
                          } catch (err) {
                            setError(err.message || "Failed to promote user.");
                          }
                        }}
                      >
                        <ShieldCheck size={18} />
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        title="Delete user"
                        data-bs-toggle="modal"
                        data-bs-target="#adminDeleteModal"
                        onClick={() => setDeleteTarget(user)}
                      >
                        <TrashSimple size={18} />
                      </button>
                    </td>
                  </tr>
                ));
              })()}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        modalID="adminDeleteModal"
        modalTitle="Confirm Delete"
        modalInstruction={
          <div>
            Are you sure you want to delete{" "}
            <strong>{deleteTarget?.username}</strong>? This action is
            irreversible and all associated data may be permanently
            removed.{" "}
          </div>
        }
        closeBtnLabel="Cancel"
        okBtnLabel="Delete"
        okBtnClass="btn-danger"
        closeBtnClass="btn-secondary"
        okBtnFunc={confirmDelete}
      />
    </div>
  );
};

export default AdminPage;
