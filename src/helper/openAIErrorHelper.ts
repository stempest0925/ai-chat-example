
export class OpenAIError extends Error {
  type: string;

  constructor(message: string, type: string) {
    super(message);
    this.name = "CustomError";
    this.type = type;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
