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
    } catch (error: any) {
      console.error('PDF generation failed:', error);
      throw new Error(`PDF generation failed: ${error?.message || 'Unknown error'}`);
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

  static async downloadPDF(element: HTMLElement, filename: string, config: any) {
    const { blob } = await this.generateFromElement(element, filename);
    this.downloadBlob(blob, filename);
  }

  static async previewPDF(element: HTMLElement, config: any) {
    const { blob } = await this.generateFromElement(element, 'preview.pdf');
    const url = URL.createObjectURL(blob);
    const newWindow = window.open(url, '_blank');
    if (newWindow) {
      newWindow.addEventListener('beforeunload', () => {
        URL.revokeObjectURL(url);
      });
      // Cleanup after 30 seconds as fallback
      setTimeout(() => {
        try {
          URL.revokeObjectURL(url);
        } catch (e) {
          // URL already revoked
        }
      }, 30000);
    } else {
      URL.revokeObjectURL(url);
    }
  }

  static async generateMultipleFormats(element: HTMLElement, baseFilename: string) {
    const formats = [];
    
    try {
      // PDF format
      const { blob: pdfBlob } = await this.generateFromElement(element, `${baseFilename}.pdf`);
      formats.push({ blob: pdfBlob, filename: `${baseFilename}.pdf` });
      
      // HTML format
      const htmlBlob = new Blob([element.outerHTML], { type: 'text/html' });
      formats.push({ blob: htmlBlob, filename: `${baseFilename}.html` });
      
      return formats;
    } catch (error: any) {
      throw new Error(`Failed to generate multiple formats: ${error?.message || 'Unknown error'}`);
    }
  }
}

export async function generatePDF(
  elementId: string,
  filename = "resume.pdf",
  options: PDFOptions = {}
) {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with id "${elementId}" not found`);
  }

  const { blob } = await PDFGenerator.generateFromElement(element, filename, options);
  PDFGenerator.downloadBlob(blob, filename);
}

export function downloadAsHTML(elementId: string, filename = "resume.html") {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with id "${elementId}" not found`);
  }

  const blob = new Blob([element.outerHTML], { type: "text/html;charset=utf-8" });
  PDFGenerator.downloadBlob(blob, filename);
}
