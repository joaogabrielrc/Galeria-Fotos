import {
  Controller,
  FileTypeValidator,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Pool } from "pg";
import { pool } from "./config/pool";

@Controller({
  path: "/upload",
  version: "1",
})
export class UploadController {
  private pool: Pool;

  constructor() {
    this.pool = pool;
    this.createTable();
  }

  private async createTable() {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS files (
        id SERIAL PRIMARY KEY,
        file_name VARCHAR(255) NOT NULL,
        file_type VARCHAR(50) NOT NULL,
        file_size BIGINT NOT NULL,
        data BYTEA NOT NULL
      );
    `;

    try {
      await this.pool.query(createTableQuery);
      console.log("Table created or already exists.");
    } catch (error) {
      console.error("Error creating table:", error);
    }
  }

  @Post("/image")
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor("file"))
  public async uploadSingleImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 25 + 1 }), // 25MB
          new FileTypeValidator({ fileType: "image/jpeg" }),
        ],
      })
    )
    file: Express.Multer.File
  ) {
    const sql = `
      INSERT INTO files (
        file_name,
        file_type,
        file_size,
        data
      ) VALUES (
        $1,
        $2,
        $3,
        $4
      ) RETURNING id
    `;

    try {
      const result = await this.pool.query(sql, [
        file.originalname,
        file.mimetype,
        file.size,
        file.buffer,
      ]);
      return {
        message: `File uploaded and stored as BLOB with ID: ${result.rows[0].id}`,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException("Error storing file in database");
    }
  }
}
