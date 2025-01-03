/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "@/hooks/use-toast";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { EntityError } from "./http";
import { UseFormSetError } from "react-hook-form";
import jwt from "jsonwebtoken";
import authApiRequest from "@/apiRequests/auth";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const normalizePath = (path: string) => {
  return path.startsWith("/") ? path.slice(1) : path;
};

export const handleErrorApi = ({
  error,
  setError,
  duration,
}: {
  error: any;
  setError?: UseFormSetError<any>;
  duration?: number;
}) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach((item) => {
      setError(item.field, {
        type: "server",
        message: item.message,
      });
    });
  } else {
    toast({
      title: "Lỗi",
      description: error?.payload?.message ?? "Lỗi không xác định",
      variant: "destructive",
      duration: duration ?? 5000,
    });
  }
};

const isBrowser = typeof window !== "undefined";

export const getAccessTokenFromLocalStorage = () => {
  return isBrowser ? localStorage.getItem("accessToken") : null;
};

export const getRefreshTokenFromLocalStorage = () => {
  return isBrowser ? localStorage.getItem("refreshToken") : null;
};

export const setAccessTokenToLocalStorage = (value: string) =>
  isBrowser && localStorage.setItem("accessToken", value);

export const setRefreshTokenToLocalStorage = (value: string) =>
  isBrowser && localStorage.setItem("refreshToken", value);

export const removeTokensFromLocalStorage = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  isBrowser && localStorage.removeItem("accessToken");
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  isBrowser && localStorage.removeItem("refreshToken");
};

export const checkAndRefreshToken = async (param: {
  onError?: () => void;
  onSuccess?: () => void;
}) => {
  const accessToken = getAccessTokenFromLocalStorage();
  const refreshToken = getRefreshTokenFromLocalStorage();
  if (!accessToken || !refreshToken) return;
  const decodedAccessToken = jwt.decode(accessToken) as {
    exp: number;
    iat: number;
  };
  const decodedRefreshToken = jwt.decode(refreshToken) as {
    exp: number;
    iat: number;
  };
  const now = new Date().getTime() / 1000 - 1;
  if (decodedRefreshToken.exp <= now) {
    removeTokensFromLocalStorage();
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    param?.onError && param.onError();
    return;
  }
  if (
    decodedAccessToken.exp - now <
    (decodedAccessToken.exp - decodedAccessToken.iat) / 3
  ) {
    try {
      const res = await authApiRequest.refreshToken();
      setAccessTokenToLocalStorage(res.payload.data.accessToken);
      setRefreshTokenToLocalStorage(res.payload.data.refreshToken);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      param?.onSuccess && param.onSuccess();
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      param?.onError && param.onError();
    }
  }
};
