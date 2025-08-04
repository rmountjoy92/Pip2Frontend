import type ErrorData from 'src/interfaces/error-data';

class ApiError extends Error {
  data: ErrorData

  constructor(message: string, data: ErrorData) {
    super(message)
    this.data = data
  }
}

export default ApiError
