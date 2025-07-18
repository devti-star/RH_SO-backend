import { Injectable } from "@nestjs/common";
import { RelatorioAtestado } from "./entities/relatorio-atestado.viewentity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import * as puppeteer from 'puppeteer';
import { compile } from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class RelatorioAtestadoService {
    constructor(
        @InjectRepository(RelatorioAtestado)
        private readonly repositorioRelatorioAtestado: Repository<RelatorioAtestado>
    ) { }

    async create(id: number): Promise<Buffer> {
        // Template HTML com Handlebars
        const templateSource = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    @page {
                        size: A4;
                        margin: 50px;
                    }
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                        position: relative;
                        min-height: 90vh;
                    }
                    .element-header{
                        width: 30%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                    table {
                        border-collapse: collapse;
                        width: 100%;
                        max-width: 800px;
                        margin: 20px auto 0 auto;
                        font-family: Arial, sans-serif;
                        text-align: center;
                    }
                    th, td {
                        border: 1px solid #ccc;
                        padding: 10px;
                    }
                    th {
                        background-color: #f4f4f4;
                    }
                    td:first-child {
                        text-align: left;
                    }
                    .checkbox-cell input[type="checkbox"] {
                        transform: scale(1.3);
                        cursor: pointer;
                    }
                    .tabela1 {
                        width: 100%;
                        border-collapse: separate;
                        border-spacing: 0;
                        margin: 30px auto 0 auto;
                        background-color: #fff;
                        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
                        border-radius: 8px;
                        overflow: hidden;
                        font-size: 14px;
                    }
                    .tabela1 td {
                        padding: 12px 16px;
                        border-bottom: 1px solid #e0e0e0;
                        vertical-align: middle;
                    }
                    .tabela1 tr:last-child td {
                        border-bottom: none;
                    }
                    .tabela1 td.cinza {
                        background-color: #d1d1d1ff;
                        font-weight: 800;
                        width: 20%;
                        color: #000;
                    }
                    .tabela1 td.branco {
                        background-color: #fafafa;
                        color: #444;
                    }
                    .coordenador-centralizado {
                        text-align: center !important;
                        font-weight: 600;
                        font-size: 15px;
                        padding-top: 18px;
                        padding-bottom: 18px;
                    }
                    .assinatura-medico {
                        text-align: center !important;
                        font-size: 15px;
                        font-weight: 500;
                        min-height: 55px;
                        vertical-align: middle;
                    }
                    .rodape-institucional {
                        width: 100%;
                        text-align: center;
                        font-size: 12px;
                        color: #888;
                        padding: 18px 0 6px 0;
                        letter-spacing: 0.05em;
                        margin-top: 5px; 
                        }

                    .titulo-principal {
                        text-align: center;
                        margin: 32px 0 24px 0;
                        font-size: 1.35rem;
                        font-weight: bold;
                        letter-spacing: 0.06em;
                    }
                </style>
            </head>
            <body>
                <div style="display: flex; flex-direction: row; justify-content: space-between; width: 100%; margin-top: 24px;">
                    <div class="element-header">
                        <img src="{{logo}}" alt="Logo da Prefeitura de Três Lagoas" width="200" height="65">
                    </div>
                    <div class="element-header" style="font-weight:700; font-size: 1rem;">
                        Relatório de Conclusão<br>de Requerimento
                    </div>
                    <div class="element-header">
                        SESMT
                    </div>
                </div>
                <div class="titulo-principal">
                    RELATÓRIO DE CONCLUSÃO DE PROCESSO
                </div>

                <table class="tabela1">
                    <tr>
                        <td class="cinza">Nome:</td>
                        <td class="branco" colspan="3">{{nomeCompleto}}</td>
                    </tr>
                    <tr>
                        <td class="cinza">Matrícula:</td>
                        <td class="branco">{{matricula}}</td>
                        <td class="cinza">CPF:</td>
                        <td class="branco">{{cpf}}</td>
                    </tr>
                    <tr>
                        <td class="cinza">Secretaria:</td>
                        <td class="branco">{{secretaria}}</td>
                        <td class="cinza">Departamento:</td>
                        <td class="branco">{{departamento}}</td>
                    </tr>
                    <tr>
                        <td class="cinza">Cargo:</td>
                        <td class="branco">{{cargo}}</td>
                        <td class="cinza">E-mail:</td>
                        <td class="branco">{{email}}</td>
                    </tr>
                </table>

                <table style="margin-top:28px;">
                    <thead>
                        <tr>
                            <th>Incisos</th>
                            <th>Sim</th>
                            <th>Não</th>
                        </tr>
                    </thead>
                    <tbody>
                        {{#each itens.[0]}}
                            <tr>
                                <td>{{this.[0]}}</td>
                                <td class="checkbox-cell">
                                    <input type="checkbox" name="inciso_sim_{{@index}}" {{#if this.[1]}}checked{{/if}} disabled>
                                </td>
                                <td class="checkbox-cell">
                                    <input type="checkbox" name="inciso_nao_{{@index}}" {{#unless this.[1]}}checked{{/unless}} disabled>
                                </td>
                            </tr>
                        {{/each}}
                    </tbody>
                </table>

                <div style="font-weight: 700; margin: 14px 0 0 0; font-size: 16px;">
                  Responsável pelo recebimento: <span style="font-weight: 400;">{{reponsavelPelaAvaliacao}}</span>
                </div>

                <table style="margin-top:10px;">
                    <thead>
                        <tr>
                            <th>Coordenador do PCSMO</th>
                            <th>Médico Examinador</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="coordenador-centralizado">
                                Dr. Leeandro Araújo<br>
                                CRM 6322
                            </td>
                            <td class="assinatura-medico">
                            {{#if assinatura}}
                                {{{assinatura}}}
                            {{else}}
                                <span style="color: #999; font-style: italic;">(Sem assinatura digitalizada)</span>
                            {{/if}}
                            </td>

                        </tr>
                    </tbody>
                </table>

                <!-- STATUS DEFERIDO/INDEFERIDO AO FINAL DO DOCUMENTO -->
                <div style="margin: 26px 0 0 0; text-align: center; font-size: 17px; font-weight: bold;">
                    Resultado: 
                    {{#if qtdDias}}
                        {{qtdDias}}
                    {{else}}
                        Indeferido
                    {{/if}}
                </div>

                <div class="rodape-institucional">
                    Prefeitura Municipal de Três Lagoas - Sistema SESMT • Documento gerado eletronicamente - {{now}}
                </div>
            </body>
            </html>
        `;

        // Compilar template com Handlebars
        const template = compile(templateSource);

        // Obter dados REAIS do banco de dados
        const dados = await this.repositorioRelatorioAtestado.findOne({
            where: { id }
        });

        if (!dados)
            throw new Error("Dados vazios");

        const imagePath = path.join(process.cwd(), 'src/relatorio-atestado/logo.png');
        const imageBuffer = fs.readFileSync(imagePath);
        const base64Image = imageBuffer.toString('base64');
        const logoDataURL = `data:image/png;base64,${base64Image}`

        const incisos = this.RecuperaIncesosParaArray(dados);
        // Renderizar HTML (adicionando data atual para rodapé)
        const html = template({
            ...dados,
            itens: [incisos],
            logo: logoDataURL,
            now: new Date().toLocaleDateString('pt-BR')
        });

        let browser;
        try {
            browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });

            const page = await browser.newPage();

            await page.setContent(html, { waitUntil: 'domcontentloaded' });

            return await page.pdf({
                format: 'A4',
                margin: {
                    top: '50px',
                    right: '50px',
                    bottom: '70px', // espaço para rodapé
                    left: '50px'
                },
                printBackground: true
            });
        } catch (error) {
            throw new Error(`Erro ao gerar PDF: ${error.message}`);
        } finally {
            if (browser) {
                await browser.close();
            }
        }
    }

    RecuperaIncesosParaArray(dados: RelatorioAtestado) {
        const incisos = dados?.incisos?.[0] || {};

        return [
            ['Inciso I - Identificação do Médico: nome e CRM/UF;', incisos['incisoI']],
            ['Inciso II - Registro de Qualificação de Especialista (QRE), quando houver;', incisos['incisoII']],
            ['Inciso III - Identificação do paciente: nome e número do CPF, quando houver;', incisos['incisoIII']],
            ['Inciso IV - Data de emissão;', incisos['incisoIV']],
            ['Inciso V - Assinatura qualificada do médico, quando documento eletrônico;', incisos['incisoV']],
            ['Inciso VI - Assinatura e carimbo ou número de registro do Conselho Regional de Medicina, quando manuscrito;', incisos['incisoVI']],
            ['Inciso VII - Dados e contatos profissionais (telefone e/ou e-mail);', incisos['incisoVII']],
            ['Inciso VIII - Endereço profissional ou residencial do médico;', incisos['incisoVIII']],
        ];
    }
}
