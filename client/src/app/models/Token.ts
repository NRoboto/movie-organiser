export class Token {
  constructor(
    public readonly token: string,
    public readonly createdAt: string
  ) {}

  static fromResponse(response: any) {
    if (
      response.token &&
      response.createdAt &&
      typeof response.token === 'string' &&
      typeof response.createdAt === 'string'
    )
      return new Token(response.token, response.createdAt);
    return undefined;
  }
}

export class SignoutToken {
  constructor(public readonly token: string) {}
}
