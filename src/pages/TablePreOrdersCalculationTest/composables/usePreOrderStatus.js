export function usePreOrderStatus() {
  const getStatusColor = (isDraft) => {
    return !isDraft ? "green" : "deep-orange";
  };

  const getStatusText = (isDraft) => {
    return !isDraft ? "Заказан" : "На этапе просчета";
  };

  return {
    getStatusColor,
    getStatusText,
  };
}
