import * as functions from 'firebase-functions';

import type { RequestHandler } from 'express';

import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { OAuth2Client } from 'google-auth-library';
import { grpc } from 'google-gax';

import { getDateRange } from './common';

const clientId = functions.config().analytics.clientid;
const clientSecret = functions.config().analytics.clientsecret;
const redirectUri = functions.config().analytics.redirecturi;
const refreshToken = functions.config().analytics.refreshtoken;
const propertyId = functions.config().analytics.propertyid;

const oauth2Client = new OAuth2Client(clientId, clientSecret, redirectUri);
oauth2Client.setCredentials({
  refresh_token: refreshToken,
});
const sslCreds = grpc.credentials.createSsl();
const credentials = grpc.credentials.combineChannelCredentials(
  sslCreds,
  grpc.credentials.createFromGoogleCredential(oauth2Client),
);
const analyticsDataClient = new BetaAnalyticsDataClient({
  sslCreds: credentials,
});

export const getSessionsReport: RequestHandler = async (
  { query: { days: rawDays = '14' } },
  res,
) => {
  const days = Number(rawDays);

  const [{ reports }] = await analyticsDataClient.batchRunReports({
    property: `properties/${propertyId}`,
    requests: getDateRange(days, 'sessions'),
  });

  res.json(
    (reports || []).flatMap(({ rows }) =>
      (rows || [])
        .filter(
          ({ dimensionValues, metricValues }) =>
            typeof dimensionValues?.[0]?.value !== 'undefined' &&
            typeof metricValues?.[0]?.value !== 'undefined',
        )
        .map(({ dimensionValues, metricValues }) => ({
          date: dimensionValues?.[0]?.value || '',
          sessions: Number(metricValues?.[0]?.value || '0'),
        }))
        .sort((a, b) => Date.parse(b.date) - Date.parse(a.date)),
    ),
  );
};

export const getTotalSessions: RequestHandler = async (
  { query: { from = '2020-05-01', to = 'today' } },
  res,
) => {
  const { token } = await oauth2Client.getAccessToken();

  if (!token) {
    res.status(500).send();
    return;
  }

  const [{ rows }] = await analyticsDataClient.runReport({
    property: `properties/${propertyId}`,
    metrics: [{ name: 'sessions' }],
    dateRanges: [
      {
        name: 'total',
        startDate: from as string,
        endDate: to as string,
      },
    ],
  });

  res.json({ count: Number(rows?.[0]?.metricValues?.[0]?.value || '0') });
};
