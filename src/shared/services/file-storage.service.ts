import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileStorageService {
  async saveFile(directory: string, filename: string, data: Buffer): Promise<string> {
    const dir = path.resolve(directory);
    await fs.promises.mkdir(dir, { recursive: true });
    const destination = path.join(dir, filename);
    await fs.promises.writeFile(destination, data);
    return destination;
  }
}
