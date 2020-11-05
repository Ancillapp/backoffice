import * as functions from 'firebase-functions';

import type { RequestHandler } from 'express';

import { google } from 'googleapis';

import { getDateRange } from './common';

const propertyId = functions.config().analytics.propertyid;
const clientEmail = functions.config().analytics.clientemail;
const privateKey = functions
  .config()
  .analytics.privatekey.replace(/\\n/gm, '\n');

const googleAuthClient = new google.auth.GoogleAuth({
  credentials: {
    client_email: clientEmail,
    private_key: privateKey,
  },
  scopes: 'https://www.googleapis.com/auth/analytics.readonly',
});

const { v1alpha: analyticsData } = google.analyticsdata('v1alpha');

export const getSessionsReport: RequestHandler = async (
  { query: { days: rawDays = '14' } },
  res,
) => {
  const token = await googleAuthClient.getAccessToken();

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
  const token = await googleAuthClient.getAccessToken();

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
          startDate: from as string,
          endDate: to as string,
        },
      ],
    },
  });

  res.json({ count: Number(value) });
};
