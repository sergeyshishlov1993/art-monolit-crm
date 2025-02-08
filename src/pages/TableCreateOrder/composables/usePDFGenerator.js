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
  finalPrice
) {
  const generatePDF = () => {
    const rowsMaterials = ref([
      { id: crypto.randomUUID(), header: "На стеле" },
      { id: crypto.randomUUID(), header: "На плите" },
      ...dataTable.rowsWorks,
    ]);

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
              text: "Запорожье",
              alignment: "left",
              fontSize: 10,
              margin: [0, 0, 0, 5],
            },
            {
              text: "вул Космическая 63",
              alignment: "left",
              fontSize: 10,
              margin: [0, 0, 0, 5],
            },
            { text: "+380(50) 852 05 94", alignment: "left", fontSize: 10 },
          ],
          width: "auto",
        },
        { text: "Заказ №1", style: "header", alignment: "center" },

        {
          text: `${dataTable.customer.name || "Без назви"}`,
          style: "header",
          alignment: "center",
        },

        {
          columns: [
            { text: "Заказчик", style: "subheader", margin: [0, 0, 0, 5] },
          ],
        },
        {
          text: `Имя: ${dataTable.customer.first_name || "Не указано"}`,
          margin: [0, 0, 0, 5],
        },
        {
          text: `Фамилия: ${dataTable.customer.second_name || "Не указано"}`,
          margin: [0, 0, 0, 5],
        },
        {
          text: `Телефон: ${dataTable.customer.phone || "Не указано"}`,
          margin: [0, 0, 0, 5],
        },
        {
          text: `Адрес доставки: ${dataTable.customer.address || "Не указано"}`,
          margin: [0, 0, 0, 5],
        },
        {
          text: `Примечание: ${dataTable.customer.comment || "Нет"}`,
          margin: [0, 0, 0, 5],
        },

        { text: "Умерший", style: "subheader" },
        {
          table: {
            headerRows: 1,
            widths: ["*", "*", "*", "*", "*", "*"],
            body: [
              [
                "Номер",
                "Имя",
                "Фамилия",
                "Отчество",
                "Дата рождения",
                "Дата смерти",
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

        { text: "Материалы", style: "subheader" },
        {
          table: {
            headerRows: 1,
            widths: ["auto", "*", "auto"],
            body: [
              ["Номер", "Название", "Цена"],
              ...dataTable.rowsMaterials.map((row, index) => [
                index + 1,
                row.name || "Не указано",
                row.price || "0",
              ]),
            ],
          },
          layout: "grid",
        },

        { text: "Услуги", style: "subheader" },
        {
          table: {
            headerRows: 1,
            widths: ["auto", "*", "auto"],
            body: [
              ["Номер", "Название", "Цена"],
              ...dataTable.rowsServices.map((row, index) => [
                index + 1,
                row.name || "Не указано",
                row.price || "0",
              ]),
            ],
          },
          layout: "grid",
        },

        { text: "Виды работ", style: "subheader" },
        {
          table: {
            headerRows: 1,
            widths: ["auto", "*", "auto"],
            body: [
              ["Номер", "Название", "Цена"],
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
                    [rowIndex + 1, row.name || "Не указано", row.price || "0"],
                  ];
                }
              }),
            ],
          },
          layout: "grid",
        },

        { text: "Финансовая информация", style: "subheader" },
        {
          table: {
            headerRows: 0,
            widths: ["*", "*"],
            body: [
              [
                { text: "Общая сумма", alignment: "left" },
                {
                  text:
                    (Number(totalPrice.value) || 0).toLocaleString("ru-RU") +
                    " грн",
                  alignment: "right",
                },
              ],
              [
                { text: "Скидка", alignment: "left" },
                {
                  text:
                    "-" +
                    (Number(sale.value) || 0).toLocaleString("ru-RU") +
                    " грн",
                  alignment: "right",
                },
              ],
              [
                { text: "Предоплата", alignment: "left" },
                {
                  text:
                    (Number(prepayment.value) || 0).toLocaleString("ru-RU") +
                    " грн",
                  alignment: "right",
                },
              ],
              [
                {
                  text: "Итоговая сумма",
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

    pdfMake.createPdf(docDefinition).download(`${accountNumber.value}.pdf`);
  };

  return { generatePDF };
}
