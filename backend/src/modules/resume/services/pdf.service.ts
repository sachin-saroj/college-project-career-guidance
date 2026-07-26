import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';
import puppeteer from 'puppeteer';
import { IResume } from '../models/Resume';
import { AppError } from '../../../utils/AppError';

export class PdfService {
  /**
   * Compiles an HTML template using Handlebars and uses Puppeteer to render a PDF buffer.
   */
  async generatePdf(resume: IResume): Promise<Buffer> {
    const templateName = resume.templateId || 'modern';
    const templatePath = path.join(__dirname, `../templates/${templateName}.hbs`);

    if (!fs.existsSync(templatePath)) {
      throw new AppError(`Template ${templateName} not found`, 404);
    }

    const templateHtml = fs.readFileSync(templatePath, 'utf8');
    
    // Register handlebars helpers
    handlebars.registerHelper('formatDate', function (date) {
      if (!date) return 'Present';
      return new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    });

    const template = handlebars.compile(templateHtml);
    const html = template({ resume: resume.toObject() });

    // Launch Puppeteer (in production, you'd configure args for sandbox/docker)
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    
    // Set content and wait for network to idle so fonts/images load
    await page.setContent(html, { waitUntil: 'networkidle0' });

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true, // Render CSS backgrounds
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });

    await browser.close();

    // The newer puppeteer type definitions return Uint8Array. 
    // We can convert to Buffer for Express res.send
    return Buffer.from(pdfBuffer);
  }
}

export const pdfService = new PdfService();
