export const ENDPOINTS_VEHICLE = {
  fetchData: (limit: number, page: number) =>
    `/vehicle/fetch-data?limit=${limit}&page=${page}`,
  proccessXml: () => `/vehicle/proccess-xml`,
};
