import { z } from "zod";
import { leadSchema } from "@/app/lib/validation";

export type ApiUser = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
};

export type UsersResponse = {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: ApiUser[];
};

export type LeadPayload = {
  first_name: string;
  last_name: string;
  email: string;
  job: string;
};

export type CreatedLeadResponse = Partial<LeadPayload> & {
  id: string | number;
  createdAt: string;
};

export type UpdatedLeadResponse = Partial<LeadPayload> & {
  updatedAt: string;
};

export type Lead = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar?: string;
  job?: string;
};

export type LeadFormValues = z.infer<typeof leadSchema>;
