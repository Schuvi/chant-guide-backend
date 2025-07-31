import { Controller, Get, Req, Res, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('csrf')
export class CsrfController {
  @Get('token')
  getCsrfToken(@Req() req: Request, @Res() res: Response) {
    if (typeof req.csrfToken !== 'function') {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'CSRF token function not available on request.' });
    }
    const csrfToken = req.csrfToken();
    if (!csrfToken) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'CSRF token not generated.' });
    }
    return res.status(HttpStatus.OK).json({ csrfToken });
  }
}
