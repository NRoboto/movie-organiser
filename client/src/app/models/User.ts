export class UserSignup {
  constructor(
    public readonly username: string,
    public readonly password: string,
    public readonly gender: string,
    public readonly age: string,
    public readonly location?: string
  ) {}
}

export class UserSignin {
  constructor(
    public readonly username: string,
    public readonly password: string
  ) {}
}
