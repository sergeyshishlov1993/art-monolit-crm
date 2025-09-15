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
    const existingRow = dataTable[table].find(
        (row) => row.name === val.name && row.id !== val.id
    );

    if (existingRow) {
      existingRow.quantity =
          (Number(existingRow.quantity) || 0) + (Number(val.quantity) || 1);

      const placeholderIndex = dataTable[table].findIndex((el) => el.id === val.id);
      if (placeholderIndex !== -1) {
        dataTable[table].splice(placeholderIndex, 1);
      }
    } else {
      const idx = dataTable[table].findIndex((el) => el.id === val.id);
      if (idx !== -1) {
        dataTable[table][idx] = val;
      }
    }

    calcTotalPrice();
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
    const tableData = dataTable[table];
    if (!tableData) return;

    const rowIndex = tableData.findIndex((el) => el.id === id);
    if (rowIndex === -1) return;

    tableData[rowIndex][fieldName] = row[fieldName];

    if (
        table === "rowsMaterials" ||
        table === "rowsServices" ||
        table === "rowsWorks"
    ) {
      calcTotalPrice();
    }
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
