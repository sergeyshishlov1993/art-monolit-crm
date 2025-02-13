// src/composables/usePDFGenerator.js
import { ref, computed, reactive } from "vue";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

export function usePDFGenerator(
  accountNumber,
  dataTable,
  totalPrice,
  prepayment,
  sale,
  finalPrice,
  orderNumber
) {
  const generatePDF = () => {
    const rowsMaterials = ref([
      { id: crypto.randomUUID(), header: "На стелі" },
      { id: crypto.randomUUID(), header: "На плиті" },
      ...dataTable.rowsWorks,
    ]);

    console.log("dataTable", dataTable);

    const sortedRows = computed(() => {
      const headers = rowsMaterials.value.filter((row) => row.header);
      const result = reactive([]);
      headers.forEach((header) => {
        result.push(header);

        const relatedRows = rowsMaterials.value.filter(
          (row) => row.parentTitle === header.header
        );
        result.push(...relatedRows);
      });
      return result;
    });

    const docDefinition = {
      content: [
        {
          stack: [
            {
              text: "Запоріжжя",
              alignment: "left",
              fontSize: 10,
              margin: [0, 0, 0, 5],
            },
            {
              text: "вул Космічна 63",
              alignment: "left",
              fontSize: 10,
              margin: [0, 0, 0, 5],
            },
            { text: "+380(50) 852 05 94", alignment: "left", fontSize: 10 },
          ],
          width: "auto",
        },
        {
          text: `Замовлення ${String(orderNumber.value).toUpperCase()}`,
          style: "header",
          alignment: "center",
        },

        {
          text: `${dataTable.customer.name || "Без назви"}`,
          style: "header",
          alignment: "center",
        },

        {
          columns: [
            { text: "Замовник", style: "subheader", margin: [0, 0, 0, 5] },
          ],
        },
        {
          text: `Імʼя: ${dataTable.customer.first_name || "Не указано"}`,
          margin: [0, 0, 0, 5],
        },
        {
          text: `Прізвище: ${dataTable.customer.second_name || "Не указано"}`,
          margin: [0, 0, 0, 5],
        },
        {
          text: `Телефон: ${dataTable.customer.phone || "Не указано"}`,
          margin: [0, 0, 0, 5],
        },
        {
          text: `Адреса доставки: ${
            dataTable.customer.address || "Не указано"
          }`,
          margin: [0, 0, 0, 5],
        },
        {
          text: `Коментар: ${dataTable.customer.comment || "Нет"}`,
          margin: [0, 0, 0, 5],
        },

        { text: "Померлий", style: "subheader" },
        {
          table: {
            headerRows: 1,
            widths: ["*", "*", "*", "*", "*", "*"],
            body: [
              [
                "Номер",
                "Імʼя",
                "Прізвище",
                "По-батькові",
                "Дата народження",
                "Дата смерті",
              ],
              ...dataTable.rowsDead.map((row, index) => [
                index + 1,
                row.deadName,
                row.deadSecondName,
                row.deadSurName,
                row.deadDateBirth,
                row.deadDateDeath,
              ]),
            ],
          },
          layout: "grid",
        },

        { text: "Матеріали", style: "subheader" },
        {
          table: {
            headerRows: 1,
            widths: ["auto", "*", "auto"],
            body: [
              ["Номер", "Назва", "Ціна"],
              ...dataTable.rowsMaterials.map((row, index) => [
                index + 1,
                row.name || "Не вказано",
                row.price || "0",
              ]),
            ],
          },
          layout: "grid",
        },

        { text: "Послуги", style: "subheader" },
        {
          table: {
            headerRows: 1,
            widths: ["auto", "*", "auto"],
            body: [
              ["Номер", "Назва", "Ціна"],
              ...dataTable.rowsServices.map((row, index) => [
                index + 1,
                row.name || "Не вказано",
                row.price || "0",
              ]),
            ],
          },
          layout: "grid",
        },

        { text: "Види робіт", style: "subheader" },
        {
          table: {
            headerRows: 1,
            widths: ["auto", "*", "auto"],
            body: [
              ["Номер", "Назва", "Ціна"],
              ...sortedRows.value.flatMap((row, index, array) => {
                if (row.header) {
                  return [
                    [
                      {
                        text: row.header,
                        colSpan: 3,
                        bold: true,
                        alignment: "left",
                      },
                      {},
                      {},
                    ],
                  ];
                } else {
                  const rowIndex = array
                    .slice(0, index)
                    .filter((item) => !item.header).length;
                  return [
                    [rowIndex + 1, row.name || "Не вказано", row.price || "0"],
                  ];
                }
              }),
            ],
          },
          layout: "grid",
        },

        { text: "Фінансова інформація", style: "subheader" },
        {
          table: {
            headerRows: 0,
            widths: ["*", "*"],
            body: [
              [
                { text: "Загальна сума", alignment: "left" },
                {
                  text:
                    (Number(totalPrice.value) || 0).toLocaleString("ru-RU") +
                    " грн",
                  alignment: "right",
                },
              ],
              [
                { text: "Знижка", alignment: "left" },
                {
                  text:
                    "-" +
                    (Number(sale.value) || 0).toLocaleString("ru-RU") +
                    " грн",
                  alignment: "right",
                },
              ],
              [
                { text: "Передплата", alignment: "left" },
                {
                  text:
                    (Number(prepayment.value) || 0).toLocaleString("ru-RU") +
                    " грн",
                  alignment: "right",
                },
              ],
              [
                {
                  text: "Підсумкова сума",
                  alignment: "left",
                  bold: true,
                  fontSize: 12,
                },
                {
                  text:
                    (Number(finalPrice.value) || 0).toLocaleString("ru-RU") +
                    " грн",
                  alignment: "right",
                  bold: true,
                  fontSize: 14,
                },
              ],
            ],
          },
          layout: "noBorders",
        },
      ],

      styles: {
        header: {
          fontSize: 16,
          bold: true,
          margin: [0, 0, 0, 20],
        },
        subheader: {
          fontSize: 12,
          bold: true,
          margin: [0, 15, 0, 10],
        },
      },
      defaultStyle: {
        fontSize: 10,
      },
    };

    pdfMake
      .createPdf(docDefinition)
      .download(`${String(orderNumber.value).toUpperCase()}.pdf`);
  };

  return { generatePDF };
}
