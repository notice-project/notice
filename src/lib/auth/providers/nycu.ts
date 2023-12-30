import type { OAuthConfig, OAuthUserConfig } from "@auth/core/providers";

type NYCUProfile = {
  username: string;
  email: string;
};

const NYCU = <P extends NYCUProfile>(
  options: OAuthUserConfig<NYCUProfile>,
): OAuthConfig<P> => {
  const authorization =
    typeof options.authorization === "string"
      ? options.authorization
      : {
          url: "https://id.nycu.edu.tw/o/authorize/",
          params: {
            scope: "profile",
          },
          ...options.authorization,
        };

  const token =
    typeof options.token === "string"
      ? options.token
      : {
          url: "https://id.nycu.edu.tw/o/token/",
          ...options.token,
        };

  const userinfo =
    typeof options.userinfo === "string"
      ? options.userinfo
      : {
          url: "https://id.nycu.edu.tw/api/profile/",
          params: options.userinfo?.params ?? {},
          ...options.userinfo,
        };

  return {
    id: "nycu",
    name: "NYCU",
    type: "oauth",
    authorization,
    token,
    userinfo,
    profile: async (profile) => {
      return {
        id: profile.username,
        name: profile.username,
        email: profile.email,
        image: null,
      };
    },
    checks: ["none"],
    clientId: options.clientId,
    clientSecret: options.clientSecret,
  };
};

export default NYCU;
