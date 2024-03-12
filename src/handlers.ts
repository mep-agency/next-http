import { NextRequest, NextResponse } from 'next/server';

import HandlerError from './errors/HandlerError';

type NextRequestData = {
  params: any;
};

export type RequesHandler<TData> = (params: { request: NextRequest; data: TData }) => NextResponse | Promise<NextResponse>;
export type RequestInputNormalizer<TData> = (params: {
  request: NextRequest;
  data: NextRequestData;
}) => TData | Promise<TData>;
export type ErrorHandler<TData> = (params: {
  error: HandlerError;
  request: NextRequest;
  data: TData | null;
}) => NextResponse | Promise<NextResponse>;
export type AuthenticatedRequestHandler<TUser, TData> = (params: {
  request: NextRequest;
  user: TUser;
  data: TData;
}) => NextResponse | Promise<NextResponse>;
export type AuthenticatedErrorHandler<TUser, TData> = (params: {
  error: HandlerError;
  request: NextRequest;
  user: TUser | null;
  data: TData | null;
}) => NextResponse | Promise<NextResponse>;
export type UserFetcher<TUser, TData> = (params: { request: NextRequest; data: TData }) => TUser | Promise<TUser>;

export const basicErrorHandler: ErrorHandler<any> = async ({ error }) => {
  return error.response();
};

export const basicJsonErrorHandler: ErrorHandler<any> = async ({ error }) => {
  return error.jsonResponse();
};

export const basicAuthenticatedErrorHandler: AuthenticatedErrorHandler<any, any> = async ({ error }) => {
  return error.response();
};

export const basicJsonAuthenticatedErrorHandler: AuthenticatedErrorHandler<any, any> = async ({ error }) => {
  return error.jsonResponse();
};

export const basicRequestInputNormalizer: RequestInputNormalizer<any> = async ({ data }) => {
  return data.params;
};

type CreateHandlerParams<TData> = {
  inputNormalizer?: RequestInputNormalizer<TData>;
  requestHandler: RequesHandler<TData>;
  errorHandler?: ErrorHandler<TData>;
};

export const createHandler =
  <TData>({
    inputNormalizer = basicRequestInputNormalizer,
    requestHandler,
    errorHandler = basicJsonErrorHandler,
  }: CreateHandlerParams<TData>) =>
  async (request: NextRequest, data: NextRequestData): Promise<NextResponse> => {
    let normalizedData = null;

    try {
      normalizedData = await inputNormalizer({ request, data });

      return await requestHandler({ request, data: normalizedData });
    } catch (error) {
      if (error instanceof HandlerError) {
        return await errorHandler({ error, request, data: normalizedData });
      }

      throw error;
    }
  };

type CreateAuthenticatedHandlerParams<TUser, TData> = {
  userFetcher: UserFetcher<TUser, TData>;
  inputNormalizer?: RequestInputNormalizer<TData>;
  requestHandler: AuthenticatedRequestHandler<TUser, TData>;
  errorHandler?: AuthenticatedErrorHandler<TUser, TData>;
};

export const createAuthenticatedHandler =
  <TUser, TData>({
    userFetcher,
    inputNormalizer = basicRequestInputNormalizer,
    requestHandler,
    errorHandler = basicJsonErrorHandler,
  }: CreateAuthenticatedHandlerParams<TUser, TData>) =>
  async (request: NextRequest, data: NextRequestData): Promise<NextResponse> => {
    let normalizedData = null;
    let user = null;

    try {
      normalizedData = await inputNormalizer({ request, data });
      user = await userFetcher({ request, data: normalizedData });

      return await requestHandler({ request, user, data: normalizedData });
    } catch (error) {
      if (error instanceof HandlerError) {
        return await errorHandler({ error, request, user, data: normalizedData });
      }

      throw error;
    }
  };
