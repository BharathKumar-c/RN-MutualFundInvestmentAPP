import ApiUtil from '../util/ApiUtil';

interface addPension {
  pensionName?: string | null;
  accountNumber?: string | null;
  employer?: string | null;
  potSize?: number | null;
  pensionCompany?: string | null;
  isActive?: boolean | null;
}

export const addPension = (body: addPension) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await ApiUtil.postWithToken('user/addPension', body);
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
};

export const getPensionById = (id: number) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await ApiUtil.getWithToken(`user/getPension/${id}`);
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
};

export const getAggregatePension = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await ApiUtil.getWithToken('user/getUserPensions');
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
};

export const editPension = (body: addPension, id: number) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await ApiUtil.putWithToken(
        `user/editPension/${id}`,
        body,
      );
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
};

export const deletePension = (id: number) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await ApiUtil.deleteWithToken(
        `user/deletePension/${id}`,
      );
      resolve(response ? true : false);
    } catch (error) {
      reject(error);
    }
  });
};
