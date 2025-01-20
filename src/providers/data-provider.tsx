import {
  CreateParams,
  DataProvider,
  GetListParams,
  GetListResult,
  GetManyParams,
  GetManyReferenceParams,
  GetOneParams,
  GetOneResult,
  UpdateParams,
} from "react-admin";
import { stringify } from "query-string";
import { fetchJsonFacade } from "../util/fetch-api-facade";

const apiUrl = import.meta.env.VITE_JSON_SERVER_URL;

const MyDataProvider: DataProvider = {
  getList: async (
    resource: string,
    params: GetListParams
  ): Promise<GetListResult> => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const query = {
      filter: JSON.stringify(params.filter),
      sort: field,
      order,
      limit: perPage,
      start: (page - 1) * perPage,
      end: page * perPage,
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;

    try {
      const response = await fetchJsonFacade(url, { method: "GET" });
      const totalCount = response.headers.get("X-Total-Count");
      const total = totalCount ? parseInt(totalCount, 10) : 0;
      const data = await response.json;
      const entry = data.entry;

      if (response.status < 200 || response.status >= 300) {
        throw new Error(
          "Something went wrong while getting list : " + response.json.message
            ? response.json.message
            : "Unknown error"
        );
      }

      return {
        data: entry,
        total: isNaN(total) ? 0 : total,
      };
    } catch (error) {
      throw new Error("Error while getting list : " + error);
    }
  },

  getOne: async (
    resource: string,
    params: GetOneParams
  ): Promise<GetOneResult> => {
    const url = `${apiUrl}/${resource}/${params.id}`;

    try {
      const response = await fetchJsonFacade(url, { method: "GET" });

      if (response.status < 200 || response.status >= 300) {
        throw new Error(
          "Something went wrong while getting one : " + response.json.message
            ? response.json.message
            : "Unknown error"
        );
      }

      return {
        data: response.json.entry,
      };
    } catch (error) {
      throw new Error("Error while getting one : " + error);
    }
  },

  create: async (resource: string, params: CreateParams) => {
    const url = `${apiUrl}/${resource}`;

    try {
      const response = await fetchJsonFacade(url, {
        body: JSON.stringify(params.data),
        method: "POST",
      });

      if (response.status < 200 || response.status >= 300) {
        throw new Error(
          "Something went wrong while creating : " + response.json.message
            ? response.json.message
            : "Unknown error"
        );
      }

      //Check if it is array
      if (Array.isArray(response.json.entry)) {
        return {
          data: response.json.entry[0],
        };
      }

      return {
        data: response.json.entry,
      };
    } catch (error) {
      throw new Error("Error while creating : " + error);
    }
  },

  update: async (resource: string, params: UpdateParams) => {
    const url = `${apiUrl}/${resource}/${params.id}`;

    try {
      const response = await fetchJsonFacade(url, {
        method: "PUT",
        body: JSON.stringify(params.data),
      });

      if (response.status < 200 || response.status >= 300) {
        throw new Error(
          "Something went wrong while updating : " + response.json.message
            ? response.json.message
            : "Unknown error"
        );
      }
      return {
        data: response.json.entry,
      };
    } catch (error) {
      throw new Error("Error while updating : " + error);
    }
  },

  delete: async (resource: string, params: any) => {
    const url = `${apiUrl}/${resource}/${params.id}`;

    try {
      const response = await fetchJsonFacade(url, {
        method: "DELETE",
      });

      if (response.status < 200 || response.status >= 300) {
        throw new Error(
          "Something went wrong while deleting: " +
            (response.json.message ? response.json.message : "Unknown error")
        );
      }

      return {
        data: response.json.entry,
      };
    } catch (error) {
      throw new Error("Error while deleting : " + error);
    }
  },

  getMany: async (resource: string, params: GetManyParams) => {
    // const query = {
    //   filter: JSON.stringify({ id: params.ids }),
    // };
    const url = `${apiUrl}/${resource}`;

    try {
      const response = await fetchJsonFacade(url, { method: "GET" });

      if (response.status < 200 || response.status >= 300) {
        throw new Error(
          "Something went wrong while fetching: " +
            (response.json.message ? response.json.message : "Unknown error")
        );
      }

      // Map response to only ids
      const data = response.json.entry.filter((item: any) =>
        params.ids.includes(item.id)
      );
      data.sort(
        (a: any, b: any) => params.ids.indexOf(a.id) - params.ids.indexOf(b.id)
      );

      return { data };
    } catch (error) {
      throw new Error("Error while fetching: " + error);
    }
  },

  getManyReference: async (
    resource: string,
    params: GetManyReferenceParams
  ) => {
    const { target, id } = params;
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const query = {
      filter: JSON.stringify(params.filter),
      sort: field, // Sort by field
      order, // Order direction
      start: (page - 1) * perPage, // Calculate start based on page and perPage
      end: page * perPage, // Calculate end based on page and perPage
    };
    const url = `${apiUrl}/${target}/${id}/${resource}?${stringify(query)}`;

    try {
      const response = await fetchJsonFacade(url, { method: "GET" });

      if (response.status < 200 || response.status >= 300) {
        throw new Error(
          "Something went wrong while fetching: " +
            (response.json.message ? response.json.message : "Unknown error")
        );
      }

      return {
        data: response.json.entry,
        total: parseInt(
          response.headers.get("content-range")?.split("/")?.pop() || "",
          10
        ),
      };
    } catch (error) {
      throw new Error("Error while fetching: " + error);
    }
  },

  updateMany: async (resource: string, params: any) => {
    const query = {
      filter: JSON.stringify({ id: params.id }),
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;

    try {
      const response = await fetchJsonFacade(url, {
        method: "PUT",
        body: JSON.stringify(params.data),
      });

      if (response.status < 200 || response.status >= 300) {
        throw new Error(
          "Something went wrong while updating: " +
            (response.json.message ? response.json.message : "Unknown error")
        );
      }

      return {
        data: response.json.entry,
      };
    } catch (error) {
      throw new Error("Error while updating: " + error);
    }
  },

  deleteMany: async (resource: string, params: any) => {
    const query = {
      filter: JSON.stringify({ id: params.id }),
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;

    try {
      const response = await fetchJsonFacade(url, {
        method: "DELETE",
        body: JSON.stringify(params.data),
      });

      if (response.status < 200 || response.status >= 300) {
        throw new Error(
          "Something went wrong while deleting: " +
            (response.json.message ? response.json.message : "Unknown error")
        );
      }

      return {
        data: response.json.entry,
      };
    } catch (error) {
      throw new Error("Error while deleting: " + error);
    }
  },
};

export default MyDataProvider;
