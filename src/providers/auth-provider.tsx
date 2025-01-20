import { AuthProvider } from "react-admin";
import { fetchJsonFacade } from "../util/fetch-api-facade";

const apiUrl = import.meta.env.VITE_JSON_SERVER_URL + "/api/v1";

interface PermissionType {
  //[{ action: ['list', 'edit'], resource: 'products' }]
  action: string[] | string;
  resource: string[] | string;
  record: string[] | string | null;
}

class HttpError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message); // Pass the message to the Error constructor
    this.status = status; // Set the statusCode property
    this.name = "HttpError"; // Set the error name (optional)
  }
}

let permissions = [] as PermissionType[];
let permissionsExpiresAt = 0;
let isFetchingPermissions = false;

const getPermissions = async () => {
  if (isFetchingPermissions) return permissions;

  isFetchingPermissions = true;

  try {
    const token = localStorage.getItem("token");
    const request = new Request(`${apiUrl}/auth/getPermissions`, {
      headers: new Headers({
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      }),
    });

    const res = await fetch(request);

    if (res.status === 401 || res.status === 403) {
      throw new HttpError("Error 401 or 403, please log in again", res.status);
    }

    const data = await res.json();
    permissions = data;
    permissionsExpiresAt = Date.now() + 1000 * 60 * 5; // Cache for 5 minutes
    return permissions;
  } finally {
    isFetchingPermissions = false;
  }
};

const MyAuthProvider: AuthProvider = {
  login: async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    try {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: username, password }),
      });
      if (!response.ok) {
        throw new Error(
          `HTTP error! status: ${response.status} message: ${response.statusText}`
        );
      }
      const user = await response.json();
      localStorage.setItem("token", user.access_token);
      return await Promise.resolve();
    } catch (error) {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
      return await Promise.reject();
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    return Promise.resolve();
  },
  checkError: (error) => {
    const status = error.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem("token");
      return Promise.reject({ redirectTo: "/login" });
    }
    // other error code (404, 500, etc): no need to log out
    return Promise.resolve();
  },
  checkAuth: () => {
    return localStorage.getItem("token")
      ? Promise.resolve()
      : Promise.reject({ redirectTo: "/login" });
  },
  getIdentity: async () => {
    const response = await fetchJsonFacade(`${apiUrl}/auth/me`, {
      method: "POST",
    });

    if (response.status < 200 || response.status >= 300) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const user = await response.json;

    return Promise.resolve({
      id: user.id,
      email: user.email,
      fullName: user.fullname,
    });
  },
  getPermissions: async () => {
    if (localStorage.getItem("token")) {
      return Date.now() > permissionsExpiresAt
        ? await getPermissions()
        : Promise.resolve(permissions);
    }
  },
};

export default MyAuthProvider;
