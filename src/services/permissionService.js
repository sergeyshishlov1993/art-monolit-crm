export function getPermissions() {
  return JSON.parse(localStorage.getItem("permissions") || "[]");
}

export function hasPermission(permission) {
  const permissions = getPermissions();
  return permissions.includes(permission);
}
