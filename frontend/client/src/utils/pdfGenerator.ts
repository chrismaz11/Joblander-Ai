import jsPDF from 'jspdf';

export interface PDFOptions {
  watermark?: string;
  includeWatermark?: boolean;
}

export const PDFTemplateConfigs = {
  modern: { fontSize: 12, lineHeight: 1.5 },
  classic: { fontSize: 11, lineHeight: 1.4 },
  creative: { fontSize: 13, lineHeight: 1.6 }
};

export class PDFGenerator {
  static async generateFromElement(
    element: HTMLElement, 
    filename = 'resume.pdf', 
    options: PDFOptions = {}
  ): Promise<{ blob: Blob; filename: string }> {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = 210;
      const pageHeight = 297;
      
      // Extract text content
      const textContent = element.textContent || element.innerText || '';
      const lines = pdf.splitTextToSize(textContent, pageWidth - 20);
      
      // Add watermark for free users
      if (options.includeWatermark && options.watermark) {
        pdf.setTextColor(200, 200, 200);
        pdf.setFontSize(50);
        pdf.text(options.watermark, pageWidth / 2, pageHeight / 2, {
          angle: 45,
          align: 'center'
        });
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(12);
      }
      
      // Add content
      pdf.text(lines, 10, 20);
      
      return {
        blob: pdf.output('blob'),
        filename
      };
    } catch (error) {
      console.error('PDF generation failed:', error);
      throw new Error(`PDF generation failed: ${error.message}`);
    }
  }

  static downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
