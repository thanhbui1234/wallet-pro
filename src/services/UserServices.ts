import { api } from "@/core/api.ts";

export const fetchUsers = async () => {
  const { data } = await api.get("https://jsonplaceholder.typicode.com/users");
  return data;
};
