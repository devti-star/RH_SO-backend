import { Injectable, BadRequestException } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class FilesService {
  private readonly uploadDir = path.resolve(__dirname, '../../uploads');

  constructor() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async save(file: Express.Multer.File, subfolder = ''): Promise<string> {
    if (!file) {
      throw new BadRequestException('Arquivo não enviado');
    }

    const timestamp = Date.now();
    const filename = `${timestamp}-${file.originalname}`;

    const targetDir = subfolder
      ? path.join(this.uploadDir, subfolder)
      : this.uploadDir;

    await fs.promises.mkdir(targetDir, { recursive: true });
    const destination = path.join(targetDir, filename);
    await fs.promises.writeFile(destination, file.buffer);

    return subfolder ? path.join(subfolder, filename) : filename;
  }
}
