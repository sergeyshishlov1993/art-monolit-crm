export function allowOnlyNumbers(event, column) {
  if (column === "name") return;
  const charCode = event.which ? event.which : event.keyCode;
  if (
    charCode !== 8 &&
    charCode !== 9 &&
    charCode !== 13 &&
    (charCode < 48 || charCode > 57)
  ) {
    event.preventDefault();
  }
}

export function handlerFocusInput(row) {
  row.isChanged = true;
}
