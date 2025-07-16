import { Injectable } from "@nestjs/common";
import { RelatorioAtestado } from "./entities/relatorio-atestado.viewentity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import * as PDFDocument from 'pdfkit';
import { PassThrough } from "stream";
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class RelatorioAtestadoService {
    constructor(
        @InjectRepository(RelatorioAtestado)
        private readonly repositorioRelatorioAtestado: Repository<RelatorioAtestado>
    ) { }

    async create(idRequerimento: number): Promise<Buffer> {
        const doc = new PDFDocument({ size: 'A4', margin: 50 });
        const stream = new PassThrough();
        
        const chunks: Uint8Array[] = [];
        stream.on('data', (chunk) => chunks.push(chunk));
        
        // Configura caminho do arquivo
        const pdfsDir = path.join(process.cwd(), 'pdfs');
        const filePath = path.join(pdfsDir, `relatorio-${idRequerimento}.pdf`);

        // Garante que o diretório existe
        if (!fs.existsSync(pdfsDir)) {
            fs.mkdirSync(pdfsDir, { recursive: true });
        }

        // Pipe para salvar em arquivo
        const fileStream = fs.createWriteStream(filePath);
        doc.pipe(fileStream);
        doc.pipe(stream);

        const pageWidth = doc.page.width;
        const margin = 50;
        const cellHeight = 30;
        let y = margin;

        // === TABELA 1 ===
        const colCount1 = 4;
        const cellWidth1 = (pageWidth - margin * 2) / colCount1;
        const tabela1 = [
            ['Nome:', '', 'Data:', ''],
            ['Cargo:', '', 'Setor:', ''],
            ['Turno:', '', 'Supervisor:', ''],
            ['Local:', '', 'Extensão:', ''],
        ];

        tabela1.forEach((linha, rowIndex) => {
            linha.forEach((texto, colIndex) => {
                const x = margin + colIndex * cellWidth1;
                const isCinza = colIndex % 2 === 0;

                doc
                    .rect(x, y, cellWidth1, cellHeight)
                    .fill(isCinza ? '#DDDDDD' : '#FFFFFF')
                    .stroke();

                doc
                    .fillColor('#000000')
                    .fontSize(10)
                    .text(
                        isCinza ? texto : '________________________',
                        x + 5,
                        y + 10,
                        {
                            width: cellWidth1 - 10,
                            align: 'left',
                        }
                    );
            });
            y += cellHeight;
        });

        y += 30;

        // === TABELA 2 ===
        const colCount2 = 3;
        const rowCount2 = 10;
        const cellWidth2 = (pageWidth - margin * 2) / colCount2;

        for (let row = 0; row < rowCount2; row++) {
            for (let col = 0; col < colCount2; col++) {
                const x = margin + col * cellWidth2;
                doc
                    .rect(x, y, cellWidth2, cellHeight)
                    .fill('#FFFFFF')
                    .stroke();

                doc
                    .fillColor('#000000')
                    .fontSize(10)
                    .text(`Item ${row + 1}.${col + 1}`, x + 5, y + 10, {
                        width: cellWidth2 - 10,
                    });
            }
            y += cellHeight;
        }

        // Assinatura
        y += 40;
        doc
            .fontSize(10)
            .text('Assinatura do Responsável:', margin, y)
            .moveTo(margin + 160, y + 15)
            .lineTo(pageWidth - margin, y + 15)
            .stroke();

        y += 60;
        doc.fontSize(10).text('Observações:', margin, y);
        for (let i = 0; i < 5; i++) {
            y += 20;
            doc.moveTo(margin, y).lineTo(pageWidth - margin, y).stroke();
        }

        // Finaliza o documento
        doc.end();

        // Trata erros na escrita do arquivo
        fileStream.on('error', (err) => {
            console.error('Erro ao salvar PDF:', err);
        });

        return new Promise<Buffer>((resolve, reject) => {
            stream.on('end', () => {
                const pdfBuffer = Buffer.concat(chunks);
                resolve(pdfBuffer);
            });
            stream.on('error', reject);
        });
    }
}