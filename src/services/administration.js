import { request } from 'utils/request';
import { API_URLS } from 'constants/index';

export const getUserRolesLOV = async (roles) => {
  const { status, data } = await request({
    ...API_URLS.ADMINISTRATION.USER_ROLE_LOV,
    data: { roles },
  });
  if (status === 200 && data) {
    const dataTemp = data.rolesWithUsersVOList || [];
    return dataTemp.map((item) => item?.anaUserVOList || []);
  }
  return [];
};
