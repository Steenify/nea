import { request } from 'utils/request';
import { API_URLS, MASTER_CODE } from 'constants/index';

export { MASTER_CODE };

export const getMasterCodeListLOV = async (mastCodeList, mastCodeSortSeqList, allLov) => {
  const { status, data } = await request({
    ...API_URLS.MASTER_CODE_LIST_LOV,
    data: { mastCodeList, mastCodeSortSeqList, allLov },
  });
  if (status === 200 && data) {
    return data?.map((code) => code.mastCdVo?.mastCdDetList || []) || [];
  }
  return [];
};

export const getMasterCodeListLOVService = (mastCodeList, mastCodeSortSeqList, allLov) =>
  request({
    ...API_URLS.MASTER_CODE_LIST_LOV,
    data: { mastCodeList, mastCodeSortSeqList, allLov },
  });
