import { reactive } from "vue";

export function useTableManagement(dataTable, calcTotalPrice, calcFinalPrice) {
  function addItem(tableName, item) {
    if (tableName === "rowsWorks") {
      dataTable.rowsWorks.push(item);
    } else {
      dataTable[tableName].push(
        reactive({
          id: crypto.randomUUID(),
          accountNumber: dataTable[tableName].length + 1,
          name: "Выбрать",
          quantity: 1,
          price: 0,
        })
      );
    }
  }

  function addSelectedValue(val, table) {
    const idx = dataTable[table].findIndex((el) => el.id === val.id);
    dataTable[table][idx] = val;
    calcTotalPrice();
    calcFinalPrice();
  }

  function createCell(table, val) {
    dataTable[table] = val;
    calcTotalPrice();
    calcFinalPrice();
  }

  function removeItem(table, id) {
    const idx = dataTable[table].findIndex((el) => el.id === id);
    if (idx !== -1) {
      dataTable[table].splice(idx, 1);
      dataTable[table].forEach((item, index) => {
        item.accountNumber = index + 1;
      });
    }
    calcTotalPrice();
    calcFinalPrice();
  }

  function updateInput(table, id, row, fieldName) {
    const idx = dataTable[table].findIndex((el) => el.id === id);
    if (idx === -1) return;
    const key = Object.keys(row).find((k) => row[k] === fieldName);
    if (table === "rowsWorks") {
      dataTable[table][idx][key] = row[key];
    } else {
      dataTable[table][idx][fieldName] = row[fieldName];
    }
    calcTotalPrice();
    calcFinalPrice();
  }

  function saveState(tableName, data) {
    dataTable[tableName] = data;
  }

  return {
    addItem,
    removeItem,
    updateInput,
    createCell,
    addSelectedValue,
    saveState,
  };
}
