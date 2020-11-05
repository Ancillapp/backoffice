import * as functions from 'firebase-functions';

import type { RequestHandler } from 'express';

import { google } from 'googleapis';

import { getDateRange } from './common';

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

export const getSessionsReport: RequestHandler = async (
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
      requests: getDateRange(days, 'sessions'),
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
            sessions: Number(value),
          }),
        )
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

  const {
    data: { rows: [{ metricValues: [{ value = '0' }] = [] }] = [] },
  } = await analyticsData.runReport({
    access_token: token,
    requestBody: {
      entity: { propertyId },
      metrics: [{ name: 'sessions' }],
      dateRanges: [
        {
          name: 'total',
          startDate: from,
          endDate: to,
        },
      ],
    },
  });

  res.json({ count: Number(value) });
};
