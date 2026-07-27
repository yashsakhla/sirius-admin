import { useCallback, useEffect, useState } from "react";
import {
  createNotification,
  deleteNotification,
  getNotificationsAdmin,
  updateNotification,
  setAuthToken,
  uploadImagesToImgbb,
} from "../api";
import {
  NOTIFICATION_STATUS,
  buildNotificationPayload,
  normalizeNotificationStatus,
} from "../constants/notificationStatus";

const emptyForm = {
  heading: "",
  description: "",
  content: "",
  image: "",
  status: NOTIFICATION_STATUS.ACTIVE,
};

function normalizeList(res) {
  const raw = res?.data;
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.notifications)) return raw.notifications;
  if (Array.isArray(raw?.data)) return raw.data;
  return [];
}

export default function Notifications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageError, setImageError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getNotificationsAdmin();
      setItems(normalizeList(res));
    } catch (e) {
      console.error(e);
      setItems([]);
      alert(
        e?.response?.data?.message ||
          "Could not load notifications. Ensure GET /api/notifications/admin exists."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setAuthToken(token);
    load();
  }, [load]);

  const openAdd = () => {
    setImageError("");
    setForm(emptyForm);
    setEditing(null);
    setShowAdd(true);
  };

  const openEdit = (n) => {
    setImageError("");
    setForm({
      heading: n.heading ?? "",
      description: n.description ?? "",
      content: n.content ?? "",
      image: n.image ?? "",
      status: normalizeNotificationStatus(n),
    });
    setEditing(n);
    setShowAdd(false);
  };

  const closeModals = () => {
    setShowAdd(false);
    setEditing(null);
    setForm(emptyForm);
    setImageError("");
  };

  const handleImageFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setImageError("");
    try {
      setImageUploading(true);
      const [url] = await uploadImagesToImgbb([file]);
      if (url) setForm((f) => ({ ...f, image: url }));
    } catch (err) {
      console.error(err);
      setImageError(err?.message || "Image upload failed.");
    } finally {
      setImageUploading(false);
    }
  };

  const handleSaveCreate = async () => {
    if (!form.heading.trim()) {
      alert("Heading is required.");
      return;
    }
    try {
      setSaving(true);
      await createNotification(
        buildNotificationPayload({
          heading: form.heading,
          description: form.description.trim(),
          content: form.content,
          image: form.image,
          status: form.status,
        })
      );
      closeModals();
      await load();
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.message || "Failed to create notification.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!form.heading.trim()) {
      alert("Heading is required.");
      return;
    }
    try {
      setSaving(true);
      await updateNotification(
        editing._id,
        buildNotificationPayload({
          heading: form.heading,
          description: form.description.trim(),
          content: form.content,
          image: form.image,
          status: form.status,
        })
      );
      closeModals();
      await load();
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.message || "Failed to update notification.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (n) => {
    const next =
      normalizeNotificationStatus(n) === NOTIFICATION_STATUS.ACTIVE
        ? NOTIFICATION_STATUS.INACTIVE
        : NOTIFICATION_STATUS.ACTIVE;
    try {
      await updateNotification(n._id, { status: next });
      await load();
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.message || "Failed to update status.");
    }
  };

  const handleDelete = async (n) => {
    if (!window.confirm(`Delete notification “${n.heading}”?`)) return;
    try {
      await deleteNotification(n._id);
      await load();
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.message || "Failed to delete.");
    }
  };

  if (loading && !items.length) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Loading notifications…</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl">
      <div className="page-header">
        <div>
          <h1 className="page-title">Notifications</h1>
          <p className="page-subtitle">
            Create announcements with heading, description, and content. Only{" "}
            <span className="font-medium text-emerald-700">active</span> items are intended for users.
          </p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="btn-primary"
        >
          + Add notification
        </button>
      </div>

      <div className="table-shell">
        <table className="min-w-full text-sm">
          <thead className="table-head-row">
            <tr>
              <th className="table-cell w-20">Image</th>
              <th className="table-cell">Heading</th>
              <th className="table-cell">Description</th>
              <th className="table-cell max-w-xs">Content</th>
              <th className="table-cell">Status</th>
              <th className="table-cell w-40">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} className="table-cell text-center text-gray-500">
                  No notifications yet. Add one to get started.
                </td>
              </tr>
            ) : (
              items.map((n) => (
                <tr key={n._id} className="table-row">
                  <td className="table-cell">
                    {n.image ? (
                      <img
                        src={n.image}
                        alt=""
                        className="w-12 h-12 object-cover rounded-lg border border-gray-100"
                      />
                    ) : (
                      <span className="text-gray-300 text-xs">—</span>
                    )}
                  </td>
                  <td className="table-cell font-medium text-gray-900">{n.heading}</td>
                  <td className="table-cell text-gray-600 max-w-xs">
                    <span className="line-clamp-2">{n.description || "—"}</span>
                  </td>
                  <td className="table-cell text-gray-600 max-w-md">
                    <span className="line-clamp-2 whitespace-pre-wrap">{n.content || "—"}</span>
                  </td>
                  <td className="table-cell">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(n)}
                      className={
                        normalizeNotificationStatus(n) === NOTIFICATION_STATUS.ACTIVE
                          ? "badge-success"
                          : "badge-neutral"
                      }
                    >
                      {normalizeNotificationStatus(n) === NOTIFICATION_STATUS.ACTIVE
                        ? "Active"
                        : "Inactive"}
                    </button>
                  </td>
                  <td className="table-cell">
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEdit(n)}
                        className="btn-warning btn-sm"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(n)}
                        className="btn-danger btn-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {(showAdd || editing) && (
        <div className="modal-overlay">
          <div className="modal-panel max-w-lg">
            <div className="modal-header">
              <h2 className="text-lg font-bold text-gray-900">
                {editing ? "Edit notification" : "Add notification"}
              </h2>
            </div>
            <div className="modal-body">
              <div>
                <label className="field-label">Heading</label>
                <input
                  type="text"
                  value={form.heading}
                  onChange={(e) => setForm((f) => ({ ...f, heading: e.target.value }))}
                  className="input-field"
                  placeholder="Short title"
                />
              </div>
              <div>
                <label className="field-label">Description</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="input-field"
                  placeholder="Summary or subtitle"
                />
              </div>
              <div>
                <label className="field-label">Content</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                  rows={6}
                  className="input-field"
                  placeholder="Full message body (shown to users)"
                />
              </div>
              <div>
                <label className="field-label">Image</label>
                <p className="text-xs text-gray-500 mb-2">
                  Upload an image (hosted via imgbb). You can also paste a URL below.
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFile}
                  disabled={saving || imageUploading}
                  className="input-field file:mr-3 file:py-1 file:px-2 file:rounded file:border-0 file:bg-gray-100 file:text-gray-700"
                />
                {imageUploading ? (
                  <p className="text-xs text-gray-600 mt-2">Uploading image…</p>
                ) : null}
                {imageError ? (
                  <p className="text-xs text-red-600 mt-2">{imageError}</p>
                ) : null}
                <input
                  type="url"
                  value={form.image}
                  onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                  className="input-field mt-2"
                  placeholder="Image URL (optional)"
                />
                {form.image ? (
                  <div className="mt-3 flex items-start gap-3">
                    <img
                      src={form.image}
                      alt=""
                      className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, image: "" }))}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Remove image
                    </button>
                  </div>
                ) : null}
              </div>
              <div>
                <label className="field-label">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                  className="input-field"
                >
                  <option value={NOTIFICATION_STATUS.ACTIVE}>Active (visible on storefront)</option>
                  <option value={NOTIFICATION_STATUS.INACTIVE}>Inactive</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                onClick={closeModals}
                className="btn-secondary"
                disabled={saving || imageUploading}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={editing ? handleSaveEdit : handleSaveCreate}
                disabled={saving || imageUploading}
                className="btn-primary"
              >
                {saving ? "Saving…" : editing ? "Save changes" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
