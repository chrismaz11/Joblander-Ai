import jsPDF from 'jspdf';

export class PDFGenerator {
  static async generateFromElement(element, options = {}) {
    const defaultOptions = {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 794,
      height: 1123,
      ...options
    };

    try {
      console.log('🔄 Starting PDF generation...');
      
      
      const imgWidth = 210;
      const pageHeight = 295;
      let heightLeft = imgHeight;
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      console.log('✅ PDF generated successfully');
      return pdf;
      
    } catch (error) {
      console.error('❌ PDF generation failed:', error);
      throw new Error('Failed to generate PDF');
    }
  }

  static async downloadPDF(element, filename = 'resume.pdf') {
    try {
      const pdf = await this.generateFromElement(element);
      pdf.save(filename);
      console.log(`📥 PDF downloaded: ${filename}`);
    } catch (error) {
      console.error('Download failed:', error);
      throw error;
    }
  }

  static async previewPDF(element) {
    try {
      const pdf = await this.generateFromElement(element);
      const pdfBlob = pdf.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      
      window.open(pdfUrl, '_blank');
      console.log('👁️ PDF preview opened');
      
      return pdfUrl;
    } catch (error) {
      console.error('Preview failed:', error);
      throw error;
    }
  }
}
