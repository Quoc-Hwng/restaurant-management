import accountApiRequest from "@/apiRequests/account";
// import { AccountResType } from "@/schemaValidations/account.schema";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useAccountQuery = () => {
  return useQuery({
    queryKey: ["account-me"],
    queryFn: accountApiRequest.me,
  });
};

export const useUpdateMeMutation = () => {
  return useMutation({
    mutationFn: accountApiRequest.updateMe,
  });
};

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: accountApiRequest.changePasswordV2,
  });
};
