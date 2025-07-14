import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import { join } from "path";
import * as fs from "fs";
import { setUncaughtExceptionCaptureCallback } from "process";
import { Etapa } from "src/enums/etapa.enum";
import { ConfigService } from "@nestjs/config";
import { UsuarioResponseDto } from "src/usuarios/dto/usuario-response.dto";
import { Status } from "src/enums/status.enum";

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) { }

  async sendDynamicEmail(
    to: string,
    subject: string,
    content: string,
    template?: string,
    context?: Record<string, any>,
    attachments?: any[] // Novo parâmetro para anexos
  ) {
    const mailOptions: any = {
      to,
      subject,
    };
    // Adicione anexos se existirem
    if (attachments && attachments.length > 0) {
      mailOptions.attachments = attachments;
    }

    if (template) {
      mailOptions.template = template;
      mailOptions.context = context;
    } else {
      mailOptions.html = content;
    }

    try {
      await this.mailerService.sendMail(mailOptions);
      return { success: true, message: "Email enviado" };
    } catch (error) {
      throw new Error(`Falha no envio: ${error.message}`);
    }
  }

  async sendActivationEmail(email: string, name: string, link: string) {
    const logoPath = join(__dirname, "templates", "assets", "logo.png");
    await this.sendDynamicEmail(
      email,
      "Ative sua conta",
      "",
      "activation",
      {
        name,
        link,
        currentYear: new Date().getFullYear(),
        appName: "SESMT",
        supportEmail: "sesmt@treslagoas.ms.gov.br",
      },
      [
        {
          filename: "logoBranca.png",
          path: logoPath,
          cid: "logo", // Deve corresponder ao cid:logo no template
        },
      ]
    );
  }

  async sendRecoveryEmail(email: string, name: string, link: string) {
    const logoPath = join(__dirname, "templates", "assets", "logo.png");
    await this.sendDynamicEmail(
      email,
      "Alteração de Senha",
      "",
      "recover_password",
      {
        name,
        link,
        currentYear: new Date().getFullYear(),
        appName: "SESMT",
        supportEmail: "sesmt@treslagoas.ms.gov.br",
      },
      [
        {
          filename: "logoBranca.png",
          path: logoPath,
          cid: "logo", // Deve corresponder ao cid:logo no template
        },
      ]
    );
  }

  async sendConfirmateRecoveryEmail(email: string, name: string) {
    const logoPath = join(__dirname, "templates", "assets", "logo.png");

    await this.sendDynamicEmail(
      email,
      "Alteracão de senha",
      "",
      "recovery_success",
      {
        name,
        currentYear: new Date().getFullYear(),
        appName: "SESMT",
        supportEmail: "sesmt@treslagoas.ms.gov.br",
      },
      [
        {
          filename: "logoBranca.png",
          path: logoPath,
          cid: "logo",
        },
      ]
    );
  }


  async sendActivatedEmail(email: string, name: string, link: string | undefined) {
    const logoPath = join(__dirname, "templates", "assets", "logo.png");
    await this.sendDynamicEmail(
      email,
      "Conta ativada",
      "",
      "activated",
      {
        name,
        link,
        currentYear: new Date().getFullYear(),
        appName: "SESMT",
        supportEmail: "sesmt@treslagoas.ms.gov.br",
      },
      [
        {
          filename: "logoBranca.png",
          path: logoPath,
          cid: "logo",
        },
      ]
    );
  }

  async sendChangeStateEmail(usuario: UsuarioResponseDto, etapaAnterior: Etapa, etapaAtual: Etapa, novoStatus: Status, exibirNovaEtapa: boolean = true) {
    const etapa: string[] = [
      "TRIAGEM",
      "MÉDICO",
      "ENFERMEIRO",
      "AJUSTE"
    ]

    const status: string[] = [
      "INDEFERIDO",
      "DEFERIDO",
      "EM_PROCESSO",
    ]
    
    const logoPath = join(__dirname, "templates", "assets", "logo.png");
    console.log("Enviando email de mudança de etapa para:", usuario.email);
    await this.sendDynamicEmail(
      usuario.email,
      "Alteração de Etapa",
      "",
      "change_stage",
      {
        name: usuario.nomeCompleto,
        etapaAnterior: etapa[etapaAnterior],
        exibirNovaEtapa,
        etapaAtual: etapa[etapaAtual],
        status: status[novoStatus],
        link: this.configService.get<string>("URL_FRONT_APPLICATION"),
        currentYear: new Date().getFullYear(),
        appName: "SESMT", 
        supportEmail: "sesmt@treslagoas.ms.gov.br",
      },
      [
        {
          filename: "logoBranca.png",
          path: logoPath,
          cid: "logo",
        },
      ]
    );
  }
}
