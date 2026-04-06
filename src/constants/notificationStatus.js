/** Matches Mongoose enum on Notification model */
export const NOTIFICATION_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
};

/**
 * Body for POST /api/notifications and PUT /api/notifications/:id
 * (heading required; description, content, image optional URL; status enum)
 */
export function buildNotificationPayload({
  heading,
  description = "",
  content = "",
  image = "",
  status = NOTIFICATION_STATUS.ACTIVE,
}) {
  const s =
    status === NOTIFICATION_STATUS.INACTIVE
      ? NOTIFICATION_STATUS.INACTIVE
      : NOTIFICATION_STATUS.ACTIVE;
  const img = image != null ? String(image).trim() : "";
  return {
    heading: String(heading ?? "").trim(),
    description: description != null ? String(description) : "",
    content: content != null ? String(content) : "",
    image: img,
    status: s,
  };
}

export function normalizeNotificationStatus(doc) {
  if (doc?.status === NOTIFICATION_STATUS.INACTIVE) return NOTIFICATION_STATUS.INACTIVE;
  if (doc?.status === NOTIFICATION_STATUS.ACTIVE) return NOTIFICATION_STATUS.ACTIVE;
  if (doc?.active === false) return NOTIFICATION_STATUS.INACTIVE;
  return NOTIFICATION_STATUS.ACTIVE;
}
