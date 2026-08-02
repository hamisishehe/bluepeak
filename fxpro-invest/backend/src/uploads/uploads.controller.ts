import { Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('api/v1/uploads')
@UseGuards(JwtAuthGuard)
export class UploadsController {
  @Post('payment-proof')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (_, file, cb) => cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`),
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_, file, cb) => cb(null, ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'].includes(file.mimetype)),
  }))
  uploadPaymentProof(@UploadedFile() file: Express.Multer.File) {
    return { url: `/uploads/${file.filename}`, originalName: file.originalname, size: file.size };
  }
}

