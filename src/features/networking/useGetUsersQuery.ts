import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";

export function useGetUsersQuery() {
    const {data, isLoading, refetch} = 