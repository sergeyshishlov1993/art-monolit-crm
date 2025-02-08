export function useOrdersStatus(statusOptions, store) {
  const getStatusClass = (statuses) => {
    if (!statuses || statuses.length === 0) return "status-default";
    const lastStatus = statuses[statuses.length - 1];
    return `status-${lastStatus}`;
  };

  function lastActiveStatus(activeStatuses) {
    if (!activeStatuses || !activeStatuses.length) return "Не выбрано";
    const lastValue = activeStatuses[activeStatuses.length - 1];
    return (
      statusOptions.find((option) => option.value === lastValue)?.label ||
      "Не выбрано"
    );
  }

  async function updateStatuses(row) {
    if (row.activeStatuses.length) {
      await store.changeStatusOrder(row.id, row.activeStatuses, row.name);
    } else {
      await store.changeStatusOrder(row.id, [], row.name);
    }
  }

  return { getStatusClass, lastActiveStatus, updateStatuses };
}
