import type { Response } from 'express';
import status from 'http-status';

const handleErrorResponse = (error: unknown, res: Response): void => {
  console.error(error);

  if (error instanceof Error) {
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ message: error.message || 'Internal Server Error' });
  } else {
    res.status(status.INTERNAL_SERVER_ERROR).json({ message: 'Unknown error occurred' });
  }
};

export default handleErrorResponse;
