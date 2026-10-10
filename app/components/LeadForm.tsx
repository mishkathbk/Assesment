"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "./Button";
import Input from "./Input";
import { Lead, LeadFormValues } from "@/app/types/lead";
import { leadSchema } from "@/app/lib/validation";

type LeadFormProps = {
  lead?: Lead | null;
  onSubmit: (values: LeadFormValues) => Promise<boolean>;
  onCancel: () => void;
};

const emptyValues: LeadFormValues = {
  first_name: "",
  last_name: "",
  email: "",
  job: "",
};

export default function LeadForm({ lead, onSubmit, onCancel }: LeadFormProps) {
  const isEditing = !!lead;
  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    mode: "onTouched",
    defaultValues: lead
      ? {
          first_name: lead.first_name,
          last_name: lead.last_name,
          email: lead.email,
          job: lead.job ?? "",
        }
      : emptyValues,
  });

  useEffect(() => {
    setFocus("first_name");
  }, [setFocus]);

  const submit = async (values: LeadFormValues) => {
    const success = await onSubmit(values);
    if (success && !isEditing) reset(emptyValues);
  };

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="space-y-6">
      <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
        <Input
          label="First name"
          required
          placeholder="John"
          error={errors.first_name?.message}
          disabled={isSubmitting}
          {...register("first_name")}
        />
        <Input
          label="Last name"
          required
          placeholder="Doe"
          error={errors.last_name?.message}
          disabled={isSubmitting}
          {...register("last_name")}
        />
      </div>
      <Input
        label="Email"
        type="email"
        required
        placeholder="john@company.com"
        error={errors.email?.message}
        disabled={isSubmitting}
        {...register("email")}
      />
      <Input
        label="Job title"
        placeholder="Sales Manager"
        error={errors.job?.message}
        disabled={isSubmitting}
        {...register("job")}
      />

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {isSubmitting ? "Saving..." : isEditing ? "Save changes" : "Add lead"}
        </Button>
      </div>
    </form>
  );
}
