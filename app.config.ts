import { ConfigContext, ExpoConfig } from "expo/config";

// EAS CONFIG
const EAS_PROJECT_ID = "b08c8825-d4d1-41b3-9701-1e47cda5c331";
const PROJECT_SLUG = "agile-calling";
const OWNER = "danils-expo";

// PRODUCTION
const APP_NAME = "Tychepp";
const APP_BUNDLE_IDENTIFIER = "com.danilsexpo.tychepp";
const PACKAGE_NAME = "com.danilsexpo.tychepp";
const ICON = "./assets/icon.png";
const ADAPTATIVE_ICON = "./assets/adaptive-icon.png";
const SCHEME = "app-scheme";

export default ({ config }: ConfigContext): ExpoConfig => {
  console.log("⚙️ Building app for environment:", process.env.APP_ENV);
  const { name, bundleIdentifier, icon, adaptiveIcon, packageName, scheme } =
    getDynamicConfig(
      (process.env.APP_ENV as "development" | "preview" | "production") ||
        "development"
    );

  return {
    ...config,
    name: name,
    version: "1.0.0",
    slug: PROJECT_SLUG,
    orientation: "portrait",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    icon: icon,
    scheme: scheme,
    ios: {
      supportsTablet: true,
      bundleIdentifier: bundleIdentifier,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: adaptiveIcon,
        backgroundColor: "#ffffff",
      },
      package: packageName,
    },
    updates: {
      url: `https://u.expo.dev/${EAS_PROJECT_ID}`,
    },
    runtimeVersion: {
      policy: "appVersion",
    },
    extra: {
      eas: {
        projectId: EAS_PROJECT_ID,
      },
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-image-picker",
        {
          photosPermission:
            "La app accede a tus fotos para subir el menú del restaurante.",
        },
      ],
      [
        "expo-splash-screen",
        {
          image: "./assets/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    owner: OWNER,
  };
};

export const getDynamicConfig = (
  environtment: "development" | "preview" | "production"
) => {
  if (environtment === "production") {
    return {
      name: APP_NAME,
      bundleIdentifier: `${APP_BUNDLE_IDENTIFIER}.prod`,
      packageName: `${PACKAGE_NAME}.prod`,
      icon: ICON,
      adaptiveIcon: ADAPTATIVE_ICON,
      scheme: SCHEME,
    };
  }

  if (environtment === "preview") {
    return {
      name: `${APP_NAME} Preview`,
      bundleIdentifier: `${APP_BUNDLE_IDENTIFIER}.preview`,
      packageName: `${PACKAGE_NAME}.preview`,
      icon: ICON,
      adaptiveIcon: ADAPTATIVE_ICON,
      scheme: `${SCHEME}-preview`,
    };
  }

  return {
    name: `${APP_NAME} Dev`,
    bundleIdentifier: `${APP_BUNDLE_IDENTIFIER}.dev`,
    packageName: `${PACKAGE_NAME}.dev`,
    icon: ICON,
    adaptiveIcon: ADAPTATIVE_ICON,
    scheme: `${SCHEME}-dev`,
  };
};
