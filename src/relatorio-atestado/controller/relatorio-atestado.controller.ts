import { Controller, Get, Param, Res } from '@nestjs/common';

import { Response } from 'express';
import { RelatorioAtestadoService } from '../relatorio-atestado.service';

@Controller('relatorios-atestado')
export class RelatorioAtestadoController {
  constructor(
    private readonly relatorioService: RelatorioAtestadoService
  ) {}

  @Get(':id')
  async gerarRelatorio(
    @Param('id') id: number,
    @Res() res: Response
  ) {
    try {
      const pdfBuffer = await this.relatorioService.create(id);
      
      // Configurar cabeçalhos da resposta
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=relatorio-${id}.pdf`,
        'Content-Length': pdfBuffer.length
      });

      // Enviar PDF
      res.end(pdfBuffer);
    } catch (error) {
      res.status(500).json({
        statusCode: 500,
        message: error.message || 'Erro ao gerar relatório'
      });
    }
  }
}