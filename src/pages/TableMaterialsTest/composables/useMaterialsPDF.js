import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { useMaterials } from "@/stores/Materials";

export function useMaterialsPDF() {
  const storeMaterials = useMaterials();

  function generatePDF() {
    const docDefinition = {
      content: [
        {
          text: `Заказ ${storeMaterials.getCurrentDate()}`,
          style: "header",
          alignment: "center",
        },
        {
          table: {
            headerRows: 1,
            widths: ["*", "*", "*", "*", "*", "*", "*"],
            body: [
              [
                "Номер",
                "Название",
                "Длина",
                "Ширина",
                "Толщина",
                "Вес",
                "Количество",
              ],
              ...storeMaterials.rows.map((row, index) => [
                index + 1,
                row.name,
                row.length,
                row.width,
                row.thickness,
                row.weight,
                row.quantity,
              ]),
            ],
          },
          layout: "grid",
        },
        {
          text: `Общий вес ${storeMaterials
            .calculateTotalWeight()
            .toLocaleString("ru-RU")} кг`,
          style: "header",
          alignment: "right",
          margin: [0, 10, 0, 5],
        },
      ],
      styles: {
        header: { fontSize: 18, bold: true, margin: [0, 0, 0, 20] },
        subheader: { fontSize: 14, bold: true, margin: [0, 15, 0, 10] },
      },
      defaultStyle: { fontSize: 12 },
    };

    pdfMake
      .createPdf(docDefinition)
      .download(`Заказ ${storeMaterials.getCurrentDate()} .pdf`);
  }

  return {
    generatePDF,
  };
}
