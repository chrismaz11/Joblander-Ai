import { renderResume } from "./resumeGenerator.js";

export async function generateResumePDF(resumeData, templateId = "template-1") {
  try {
    // Generate HTML from template
    const htmlContent = await renderResume(resumeData, templateId);
    
    // For now, return the HTML - in production you'd use puppeteer or similar
    // to convert HTML to PDF
    return {
      success: true,
      html: htmlContent,
      filename: `${resumeData.personalInfo?.fullName || 'resume'}_${Date.now()}.html`,
      // In production, you'd return PDF buffer here
      message: "HTML generated successfully. PDF conversion available in production."
    };
    
  } catch (error) {
    console.error("[pdfGenerator] Failed to generate PDF:", error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Future: Add actual PDF generation with puppeteer
/*
import puppeteer from 'puppeteer';

export async function generateResumePDF(resumeData, templateId = "template-1") {
  let browser;
  try {
    const htmlContent = await renderResume(resumeData, templateId);
    
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in'
      }
    });
    
    return {
      success: true,
      buffer: pdfBuffer,
      filename: `${resumeData.personalInfo?.fullName || 'resume'}_${Date.now()}.pdf`,
      contentType: 'application/pdf'
    };
    
  } catch (error) {
    console.error("[pdfGenerator] Failed to generate PDF:", error);
    return {
      success: false,
      error: error.message
    };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
*/
