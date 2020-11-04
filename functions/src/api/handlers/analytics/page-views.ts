import * as functions from 'firebase-functions';

import type { RequestHandler } from 'express';

import { chunk } from '../../../helpers/utils';

import { google } from 'googleapis';

const { OAuth2 } = google.auth;

const clientId = functions.config().analytics.clientid;
const clientSecret = functions.config().analytics.clientsecret;
const redirectUri = functions.config().analytics.redirecturi;
const refreshToken = functions.config().analytics.refreshtoken;
const propertyId = functions.config().analytics.propertyid;

const oauth2Client = new OAuth2(clientId, clientSecret, redirectUri);

oauth2Client.setCredentials({
  refresh_token: refreshToken,
});

const { v1alpha: analyticsData } = google.analyticsdata('v1alpha');

const getDateRange = (days = 20, batchSize = 4) =>
  chunk(
    Array.from({ length: days }, (_, index) => {
      const date = new Date();
      date.setHours(12, 0, 0, 0);
      date.setDate(date.getDate() - index);

      return date.toISOString().slice(0, 10);
    }),
    batchSize,
  ).map((datesChunk) => ({
    metrics: [
      {
        name: 'screenPageViews',
      },
    ],
    dateRanges: datesChunk.map((date) => ({
      name: date,
      startDate: date,
      endDate: date,
    })),
  }));

export const getPageViewsReport: RequestHandler = async (
  { query: { days: rawDays = '14' } },
  res,
) => {
  const { token } = await oauth2Client.getAccessToken();

  if (!token) {
    res.status(500).send();
    return;
  }

  const days = Number(rawDays);

  const {
    data: { reports = [] },
  } = await analyticsData.batchRunReports({
    access_token: token,
    requestBody: {
      entity: { propertyId },
      requests: getDateRange(days),
    },
  });

  res.json(
    reports.flatMap(({ rows = [] }) =>
      rows
        .filter(
          ({
            dimensionValues: [{ value: date }] = [],
            metricValues: [{ value }] = [],
          }) => typeof date !== 'undefined' && typeof value !== 'undefined',
        )
        .map(
          ({
            dimensionValues: [{ value: date }] = [],
            metricValues: [{ value }] = [],
          }) => ({
            date: date || '',
            pageViews: Number(value),
          }),
        )
        .sort((a, b) => Date.parse(b.date) - Date.parse(a.date)),
    ),
  );
};
