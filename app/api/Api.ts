import api from "./config/axios";
import {
  CreatedLeadResponse,
  LeadPayload,
  UpdatedLeadResponse,
  UsersResponse,
} from "@/app/types/lead";

export const getLeads = async (page = 1) => {
  const { data } = await api.get<UsersResponse>("/users", { params: { page } });
  return data;
};

export const createLead = async (payload: LeadPayload) => {
  const { data, status } = await api.post<CreatedLeadResponse>("/users", payload);
  return { data, status };
};

export const updateLead = async (id: number, payload: LeadPayload) => {
  const { data } = await api.put<UpdatedLeadResponse>(`/users/${id}`, payload);
  return data;
};

export const patchLead = async (id: number, payload: Partial<LeadPayload>) => {
  const { data } = await api.patch<UpdatedLeadResponse>(`/users/${id}`, payload);
  return data;
};

export const deleteLead = async (id: number) => {
  const { status } = await api.delete(`/users/${id}`);
  return status;
};
