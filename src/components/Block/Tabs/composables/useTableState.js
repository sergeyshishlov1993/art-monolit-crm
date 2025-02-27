import { ref, onUnmounted } from "vue";

export function useTableState(history, data, tableName, calcTotalPrice, emit) {
  const saveState = () => {
    history.value.push(JSON.stringify(data.value));
  };

  function undo() {
    if (history.value.length > 0) {
      data.value = JSON.parse(history.value.pop());

      if (tableName === "rowsWorks") {
        emit(
          "updateRows",
          tableName,
          data.value.filter((el) => !el.header)
        );
      } else {
        emit("updateRows", tableName, data.value);
      }

      calcTotalPrice();
    }
  }

  const handleKeyDown = (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "z") {
      event.preventDefault();
      undo();
    }
  };

  window.addEventListener("keydown", handleKeyDown);

  onUnmounted(() => {
    window.removeEventListener("keydown", handleKeyDown);
  });

  return {
    saveState,
    undo,
  };
}
