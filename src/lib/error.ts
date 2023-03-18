export class ApiError extends Error {
  status = 400;
  field: string | undefined;
  data: any;

  constructor(message: string, status: number, field?: string, data?: Record<string, any>) {
    super(message);
    this.status = status;
    this.field = field;
    this.data = data;
  }

  toJSON() {
    return {
      status: this.status,
      message: this.message,
      field: this.field,
      data: this.data,
    };
  }
}