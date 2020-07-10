import { request } from 'utils/request';

const SPECIMEN_ADMINISTRATION_API = {
  GET_SPECIMENS: '/specimen/lov',
  GET_SPECIES_FOR_SPECIMEN: '/specimen/getInfoForSpecimen',
};

export const getSpecimenLOV = () =>
  request({
    url: SPECIMEN_ADMINISTRATION_API.GET_SPECIMENS,
    method: 'GET',
    functionName: 'getSpecimenLov',
  });

export const getSpeciesForSpecimenLOV = (
  data = {
    specimenTypeCode: 'string',
  },
) =>
  request({
    url: SPECIMEN_ADMINISTRATION_API.GET_SPECIES_FOR_SPECIMEN,
    method: 'POST',
    data,
    functionName: 'getInfoForSpecimen',
  });
