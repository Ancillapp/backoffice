import { makeMiddleware } from 'rendertron-middleware';

import type { RequestHandler } from 'express';

const rendertronMiddleware = makeMiddleware({
  proxyUrl: 'https://render-tron.appspot.com/render',
  injectShadyDom: true,
});

export const ssr: RequestHandler = (req, res, next) => {
  req.headers.host = `${process.env.GCLOUD_PROJECT}.firebaseapp.com`;

  return rendertronMiddleware(req, res, next);
};
