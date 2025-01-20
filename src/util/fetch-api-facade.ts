import { fetchUtils } from "react-admin";

export const fetchJsonFacade = (
  url: string,
  options: { user?: any; headers?: Headers; method?: string; body?: any } = {}
) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: "application/json" });
  }
  options.headers.set(
    "Authorization",
    `Bearer ${localStorage.getItem("token")}`
  );

  return fetchUtils.fetchJson(url, options);
};
