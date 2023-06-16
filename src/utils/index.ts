import ky from "ky";

let accessToken: string | undefined;

export const setAccessToken = (token: string) => {
  accessToken = token;
};

export const api = ky.create({
  prefixUrl: "https://api.spacetraders.io/v2",
  hooks: {
    beforeRequest: [
      (request) => {
        if (accessToken) {
          request.headers.set("Authorization", `Bearer ${accessToken}`);
        }
      }
    ]
  }
});
