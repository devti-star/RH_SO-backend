// src/shared/interceptors/file-cleanup.interceptor.ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileCleanupInterceptor implements NestInterceptor {
  /**
   * Se o controller receber arquivos em outros campos, basta passar os nomes via options.
   * Ex: new FileCleanupInterceptor(['foto', 'documento'])
   */
  constructor(private fileFields: string[] = ['file', 'foto']) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      catchError(async (err) => {
        // Apaga todos os arquivos enviados (file único ou múltiplos)
        this.fileFields.forEach((field) => {
          const files = request[field] // single
            ? [request[field]]
            : Array.isArray(request.files) && request.files.length
            ? request.files
            : request.files?.[field];

          if (Array.isArray(files)) {
            files.forEach((f) => this.deleteFileIfExists(f));
          } else if (files) {
            this.deleteFileIfExists(files);
          }
        });
        return throwError(() => err);
      }),
    );
  }

  private async deleteFileIfExists(file: any) {
    if (!file?.filename) return;
    // Descobre pasta, considerando o Multer padrão (diskStorage)
    const uploadPath =
      file.destination || './uploads' || path.dirname(file.path || '');
    const filePath = path.join(uploadPath, file.filename);
    fs.promises.unlink(filePath).catch(() => {});
  }
}
