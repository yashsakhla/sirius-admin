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
        <p className="text-gray-600">Loading notifications…</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-600 mt-1">
            Create announcements with heading, description, and content. Only{" "}
            <span className="font-medium text-green-700">active</span> items are intended for users.
          </p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          + Add notification
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-100">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-left text-gray-700">
            <tr>
              <th className="px-4 py-3 font-medium w-20">Image</th>
              <th className="px-4 py-3 font-medium">Heading</th>
              <th className="px-4 py-3 font-medium">Description</th>
              <th className="px-4 py-3 font-medium max-w-xs">Content</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium w-40">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  No notifications yet. Add one to get started.
                </td>
              </tr>
            ) : (
              items.map((n) => (
                <tr key={n._id} className="border-t border-gray-100 hover:bg-gray-50/80">
                  <td className="px-4 py-3">
                    {n.image ? (
                      <img
                        src={n.image}
                        alt=""
                        className="w-12 h-12 object-cover rounded border border-gray-100"
                      />
                    ) : (
                      <span className="text-gray-300 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">{n.heading}</td>
                  <td className="px-4 py-3 text-gray-600 max-w-xs">
                    <span className="line-clamp-2">{n.description || "—"}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 max-w-md">
                    <span className="line-clamp-2 whitespace-pre-wrap">{n.content || "—"}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(n)}
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        normalizeNotificationStatus(n) === NOTIFICATION_STATUS.ACTIVE
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {normalizeNotificationStatus(n) === NOTIFICATION_STATUS.ACTIVE
                        ? "Active"
                        : "Inactive"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEdit(n)}
                        className="text-xs bg-amber-500 hover:bg-amber-600 text-white px-2 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(n)}
                        className="text-xs bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">
                {editing ? "Edit notification" : "Add notification"}
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Heading</label>
                <input
                  type="text"
                  value={form.heading}
                  onChange={(e) => setForm((f) => ({ ...f, heading: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  placeholder="Short title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  placeholder="Summary or subtitle"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                  rows={6}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  placeholder="Full message body (shown to users)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                <p className="text-xs text-gray-500 mb-2">
                  Upload an image (hosted via imgbb). You can also paste a URL below.
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFile}
                  disabled={saving || imageUploading}
                  className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 file:mr-3 file:py-1 file:px-2 file:rounded file:border-0 file:bg-gray-100 file:text-gray-700"
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-2"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
                >
                  <option value={NOTIFICATION_STATUS.ACTIVE}>Active (visible on storefront)</option>
                  <option value={NOTIFICATION_STATUS.INACTIVE}>Inactive</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/80">
              <button
                type="button"
                onClick={closeModals}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm"
                disabled={saving || imageUploading}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={editing ? handleSaveEdit : handleSaveCreate}
                disabled={saving || imageUploading}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm disabled:opacity-60"
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
