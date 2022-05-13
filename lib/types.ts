import { NextApiRequest, NextApiResponse } from 'next';
import { RequestHandler as NcRequestHandler } from 'next-connect';
import type { ReqExt } from './session';

export type ApiRequest = NextApiRequest & ReqExt;

export type RequestHandler = NcRequestHandler<ApiRequest, NextApiResponse>;
