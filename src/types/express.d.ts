import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Add request.user type definition in express
declare namespace Express {
  interface Request {
    user?: {
      id: string;
      username: string;
      email: string;
      isAdmin: boolean;
    };
  }
}

// Add Express.Multer.File custom type definition
declare namespace Express {
  namespace Multer {
    interface File {
      fieldname: string;
      originalname: string;
      encoding: string;
      mimetype: string;
      size: number;
      destination: string;
      filename: string;
      path: string;
      buffer: Buffer;
    }
  }
}
