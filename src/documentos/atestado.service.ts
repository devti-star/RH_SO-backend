import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as puppeteer from 'puppeteer';

@Injectable()
export class AtestadoPuppeteerService {
  // NÃO precisa de construtor se não for usar outros serviços!

  async gerarPdf(dados: any): Promise<Buffer> {
    // Carregar template HTML
    const templatePath = path.resolve(__dirname, 'atestado-template.html');
    let html = fs.readFileSync(templatePath, 'utf8');

    // Montar checklist em HTML
    const checklistHtml = (dados.checklist || []).map((item: any) => `
      <tr>
        <td>${item.inciso}</td>
        <td>${item.descricao}</td>
        <td style="text-align:center">${item.resposta === false ? 'X' : ''}</td>
        <td style="text-align:center">${item.resposta === true ? 'X' : ''}</td>
      </tr>
    `).join('');
    
    // Substituir variáveis do template
    html = html.replace('{{nomeCompleto}}', dados.nomeCompleto || '')
      .replace('{{cpf}}', dados.cpf || '')
      .replace('{{telefone}}', dados.telefone || '')
      .replace('{{email}}', dados.email || '')
      .replace('{{matricula}}', dados.matricula || '')
      .replace('{{secretaria}}', dados.secretaria || '')
      .replace('{{departamento}}', dados.departamento || '')
      .replace('{{localTrabalho}}', dados.localTrabalho || '')
      .replace('{{assinatura}}', dados.assinatura || '')
      .replace('{{responsavelRecebimento}}', dados.responsavelRecebimento || '')
      .replace('{{status}}', dados.status || '')
      .replace('{{observacao}}', dados.observacao || '')
      .replace('{{qtdDias}}', dados.qtdDias || '')
      .replace('{{coordenadorNome}}', dados.coordenadorNome || 'Dr. Leandro Araújo')
      .replace('{{coordenadorCrm}}', dados.coordenadorCrm || '6322')
      .replace('{{checklist}}', checklistHtml);

    // Gera o PDF com Puppeteer
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = Buffer.from(await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: "20px", right: "20px", bottom: "20px", left: "20px" }
    }));
    await browser.close();
    return pdfBuffer;
  }
}
 