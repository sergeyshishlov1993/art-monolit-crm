// Отримання дозволів
export function getPermissions() {
  return JSON.parse(localStorage.getItem("permissions") || "[]");
}

// Перевірка дозволу
export function hasPermission(permission) {
  const permissions = getPermissions();
  return permissions.includes(permission);
}
