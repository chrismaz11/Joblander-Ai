import jsPDF from 'jspdf';

export class PDFGenerator {
  static async generateFromElement(element, filename = 'resume.pdf', options = {}) {
    const defaultOptions = {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 794, // A4 width in pixels at 96 DPI
      height: 1123, // A4 height in pixels at 96 DPI
      ...options
    };

    try {
      console.log('🔄 Starting PDF generation...');
      
      // Calculate dimensions
      const imgWidth = 210; // A4 width in mm
      const imgHeight = 297; // A4 height in mm
      
      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Add text content from element
      const textContent = element.textContent || element.innerText || '';
      const lines = pdf.splitTextToSize(textContent, imgWidth - 20);
      
      pdf.text(lines, 10, 20);
      
      // Return PDF blob
      return {
        blob: pdf.output('blob'),
        filename: filename
      };
      
    } catch (error) {
      console.error('❌ PDF generation failed:', error);
      throw new Error(`PDF generation failed: ${error.message}`);
    }
  }

  static async generateMultiFormat(element, baseName = 'resume', options = {}) {
    try {
      const formats = [];
      
      // Generate PDF
      const pdfResult = await this.generateFromElement(element, `${baseName}.pdf`, options);
      formats.push({
        type: 'pdf',
        blob: pdfResult.blob,
        filename: `${baseName}.pdf`
      });
      
      return formats;
      
    } catch (error) {
      console.error('❌ Multi-format generation failed:', error);
      throw error;
    }
  }

  static downloadBlob(blob, filename) {
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
