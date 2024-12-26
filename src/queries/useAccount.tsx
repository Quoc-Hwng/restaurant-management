import accountApiRequest from "@/apiRequests/account";
// import { AccountResType } from "@/schemaValidations/account.schema";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useAccountQuery = ({ enabled }: { enabled: boolean }) => {
  return useQuery({
    queryKey: ["account", "me"],
    queryFn: accountApiRequest.me,
    enabled,
  });
};

export const useUpdateMeMutation = () => {
  return useMutation({
    mutationFn: accountApiRequest.updateMe,
  });
};
