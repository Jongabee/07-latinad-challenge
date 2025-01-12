import jsPDF from 'jspdf';
import 'jspdf-autotable';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: any;
  }
}
interface IAutoTableDraw {
  cursor: { y: number };
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}/${date.getFullYear()}`;
};

export const budgetPdf = async (
  items: any[],
  numberOfDays: number,
  dateRange: { dateFrom: string; dateTo: string },
) => {
  const doc = new jsPDF();

  const response = await fetch('/latinAd1.svg');
  const svgText = await response.text();

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = 100;
  canvas.height = 20;

  const img = new Image();
  img.onload = () => {
    ctx!.drawImage(img, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/png');

    doc.addImage(dataUrl, 'PNG', 14, 10, 20, 8);

    const pageWidth = doc.internal.pageSize.width;
    const marginLeft = 14;
    const marginRight = 14;
    const maxWidth = pageWidth - marginLeft - marginRight;

    doc.setFontSize(12);
    doc.text(
      `A continuación, se presenta el desglose del presupuesto correspondiente a ${numberOfDays} día(s) para la empresa LatinAd, cubriendo el periodo comprendido entre ${formatDate(
        dateRange.dateFrom,
      )} y ${formatDate(dateRange.dateTo)}.`,
      marginLeft,
      30,
      { maxWidth: maxWidth },
    );

    const tableData = items.map((item) => {
      const total = (item.price * numberOfDays).toFixed(2);
      return [
        item.name,
        `$${item.price.toFixed(2)}`,
        numberOfDays,
        `$${total}`,
      ];
    });

    const grandTotal = items
      .reduce((sum, item) => sum + item.price * numberOfDays, 0)
      .toFixed(2);

    doc.autoTable({
      head: [['Nombre', 'Precio por día', 'Días', 'Total']],
      body: tableData,
      startY: 45,
      styles: {
        cellPadding: 3,
        fontSize: 10,
        overflow: 'linebreak',
      },
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 40 },
        2: { cellWidth: 20 },
        3: { cellWidth: 40 },
      },
      didDrawPage: (data: IAutoTableDraw) => {
        const finalY = data.cursor.y + 10;

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 255);
        doc.text(
          `Total a pagar: $${grandTotal}`,
          pageWidth - marginRight,
          finalY,
          { align: 'right' },
        );
      },
    });

    doc.save(
      `presupuesto_latinad_${numberOfDays}$${grandTotal}${formatDate(
        dateRange.dateFrom,
      )}${formatDate(dateRange.dateTo)}.pdf`,
    );
  };

  img.src = 'data:image/svg+xml;base64,' + btoa(svgText);
};
