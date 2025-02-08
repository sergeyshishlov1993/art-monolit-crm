export function useValidation($q) {
  // function validateCustomerData(customer) {
  //   let isValid = true;

  //   Object.entries(customer).forEach(([key, value]) => {
  //     if (
  //       value === null ||
  //       value === undefined ||
  //       (typeof value === "string" && value.trim().length === 0)
  //     ) {
  //       $q.notify({
  //         message: `Данные о заказчике внесены не полностью`,
  //         color: "negative",
  //         icon: "error",
  //         position: "top-right",
  //         timeout: 3000,
  //       });
  //       isValid = false;
  //     }
  //   });

  //   return isValid;
  // }

  function validateCustomerData(customer) {
    for (const [key, value] of Object.entries(customer)) {
      if (
        value === null ||
        value === undefined ||
        (typeof value === "string" && value.trim().length === 0)
      ) {
        $q.notify({
          message: `Данные о заказчике внесены не полностью`,
          color: "negative",
          icon: "error",
          position: "top-right",
          timeout: 3000,
        });
        return false; // Останавливаем выполнение при первой ошибке
      }
    }
    return true;
  }

  function validationTable(tableData, tableName) {
    let isValid = true;

    tableData.forEach((row, index) => {
      for (let key in row) {
        if (row.hasOwnProperty(key)) {
          const value = row[key];
          if (
            value === null ||
            value === undefined ||
            (typeof value === "string" && value.trim().length === 0)
          ) {
            $q.notify({
              message: `В таблице "${tableName}" поля не могут буть пустими.`,
              color: "negative",
              icon: "error",
              position: "top-right",
              timeout: 3000,
            });
            isValid = false;
            break;
          }
        }
      }
    });

    return isValid;
  }

  return {
    validateCustomerData,
    validationTable,
  };
}
