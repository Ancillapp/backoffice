import React, { FunctionComponent } from 'react';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@material-ui/core';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import Loader from '../../components/common/Loader';
import HolyMassesTimetable from '../../components/holyMass/HolyMassesTimetable';
import { useTimetables } from '../../providers/ApiProvider';

const HolyMassTimetables: FunctionComponent = () => {
  const { loading, data, error } = useTimetables();

  if (error) {
    return <span>{error.message}</span>;
  }

  return loading ? (
    <Loader />
  ) : (
    <>
      {data?.map(({ fraternityId, location, masses }) => (
        <Accordion key={fraternityId}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{location}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <HolyMassesTimetable fraternityId={fraternityId} masses={masses} />
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
};

export default HolyMassTimetables;
