import { Request, Response } from "express";
import { UserDocument } from "../models/User";

export type NextError = { message: string; status?: number };
type NextFunction = (err?: NextError) => any;

export interface ReqAuthRequestHandler<
  ResBody = any,
  ReqBody = any,
  ReqQuery = Record<string, any>
> {
  (
    req: Request<Record<string, string>, ResBody, ReqBody, ReqQuery>,
    res: Response<ResBody>,
    next: NextFunction,
    authedUser: UserDocument
  ): any;
}
export interface UseAuthRequestHandler<
  ResBody = any,
  ReqBody = any,
  ReqQuery = Record<string, any>
> {
  (
    req: Request<Record<string, string>, ResBody, ReqBody, ReqQuery>,
    res: Response<ResBody>,
    next: NextFunction,
    authedUser?: UserDocument
  ): any;
}
export interface SigninRequestHandler<
  ResBody = any,
  ReqBody = any,
  ReqQuery = Record<string, any>
> {
  (
    req: Request<Record<string, string>, ResBody, ReqBody, ReqQuery>,
    res: Response<ResBody>,
    next: NextFunction,
    authedUser: UserDocument
  ): any;
}
export interface NoAuthRequestHandler<
  ResBody = any,
  ReqBody = any,
  ReqQuery = Record<string, any>
> {
  (
    req: Request<Record<string, string>, ResBody, ReqBody, ReqQuery>,
    res: Response<ResBody>,
    next: NextFunction
  ): any;
}
