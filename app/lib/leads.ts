import { Lead } from "@/app/types/lead";

export const fullName = (lead: Pick<Lead, "first_name" | "last_name">) =>
  `${lead.first_name} ${lead.last_name}`.trim();
