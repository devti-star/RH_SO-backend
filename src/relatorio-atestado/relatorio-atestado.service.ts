import { Injectable } from "@nestjs/common";
import { RelatorioAtestado } from "./entities/relatorio-atestado.viewentity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import * as puppeteer from 'puppeteer';
import { compile } from 'handlebars';

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
                        body {
                        font-family: Arial, sans-serif; margin: 50px; 
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
                            max-width: 600px;
                            margin: 20px auto;
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
                            margin: 30px auto;
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

                        .assinatura { margin-top: 40px; }
                        .assinatura .linha { border-top: 1px solid #000; width: 100%; margin-top: 5px; }
                        .observacoes { margin-top: 60px; }
                        .linha-observacao { border-top: 1px solid #000; margin-top: 20px; width: 100%; }
                    </style>
                </head>
                <body>
                    <div style="display: flex; flex-direction: row; justify-content: space-between; width: 100%;">
                        <div class="element-header">
                            <img src="{{logo}}" alt="Descrição da imagem" width="250" height="75">
                        </div>
                        <div class="element-header">
                            <span>RELATORIO DE CONCLUSÃO<br> DE REQUERIMENTO</span>
                        </div>
                        <div class="element-header">
                            <span>RELATORIO DE CONCLUSÃO<br> DE REQUERIMENTO</span>
                        </div>
                    </div>
                    <div style="display: flex; justify-content: center;">
                        <h1 style="text-align: center; width: 450px;">RELATÓRIO DE CONCLUSÃO DE PROCESSO</h1>
                    </div>

                    <table class="tabela1">
                        <tr>
                            <td class="cinza">Nome:</td>
                            <td class="branco">{{nomeCompleto}}</td>
                            <td class="cinza">Matricula:</td>
                            <td class="branco">{{matricula}}</td>
                        </tr>
                        <tr>
                            <td class="cinza">CPF:</td>
                            <td class="branco">{{cpf}}</td>
                            <td class="cinza">Secretaria:</td>
                            <td class="branco">{{secretaria}}</td>
                        </tr>
                        <tr>
                            <td class="cinza">Cargo:</td>
                            <td class="branco">{{cargo}}</td>
                            <td class="cinza">Departamento:</td>
                            <td class="branco">{{departamento}}</td>
                        </tr>
                        <tr>
                            <td class="cinza">Email:</td>
                            <td class="branco">{{email}}</td>
                            <td class="cinza">Assinatura:</td>
                            <td class="branco">{{assinatura}}</td>
                        </tr>
                    </table>


                    <table>
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
                    <div class="assinatura">
                        <div>Assinatura do Responsável:</div>
                        <div class="linha"></div>
                    </div>

                    <div class="observacoes">
                        <div>Observações:</div>
                        {{#each observacoes}}
                        <div class="linha-observacao"></div>
                        {{/each}}
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

        if(!dados)
            throw new Error("Dados vazios");
        
        const incisos = this.RecuperaIncesosParaArray(dados);
        // Renderizar HTML
        const html = template({
            ...dados,
            itens: [incisos], // precisa ser array de arrays
        });

        let browser;
        try {
            // Configurar Puppeteer
            browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            
            const page = await browser.newPage();
            
            // Configurar conteúdo da página
            await page.setContent(html, { waitUntil: 'domcontentloaded' });
            
            // Gerar PDF como Buffer
            return await page.pdf({
                format: 'A4',
                margin: {
                    top: '50px',
                    right: '50px',
                    bottom: '50px',
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
            ['Inciso I - Identificação do Médico: Nome e CRM/UF;', incisos['incisoI']],
            ['Inciso II - Registro de Qualificação de Especialista(QRE), quando houver;', incisos['incisoII']],
            ['Inciso III - Identificação do Paciente: Nome e numero deo CPF, quando houver;', incisos['incisoIII']],
            ['Inciso IV - Data de Emissão', incisos['incisoIV']],
            ['Inciso V - Assinatura Qualificada do Médico, quando documento eletrônico', incisos['incisoV']],
            ['Inciso VI - Assinatura e Carimbo ou Número de Registro do Conselho Regional de Medicina, quando manuscrito', incisos['incisoVI']],
            ['Inciso VII - Dados e Contatos Profissionais(Telefone e/ou email);', incisos['incisoVII']],
            ['Inciso VIII - Endereço Profissional ou Residêncial do Médico;', incisos['incisoVIII']],
        ];
    }

}