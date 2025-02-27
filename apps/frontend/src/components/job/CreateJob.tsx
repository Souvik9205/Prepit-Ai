"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";

const jobSchema = z.object({
  category: z.string().min(1, "Category is required"),
  roles: z.string().min(1, "Roles are required"),
  videoRequired: z.boolean(),
  questionType: z.string(),
  followUp: z.boolean(),
  totalQuestions: z.number().min(1, "Must be at least 1"),
  resumeRequired: z.boolean(),
});

export default function CreateJobDialog() {
  const [open, setOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer YOUR_USER_ID`,
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (response.ok) {
        setOpen(false);
      } else {
        console.log("errrrrrrrrror in else block");
      }
    } catch (error) {
      console.log("errrrrrrrrror in catch block");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button>Create Job</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Create Job</DialogTitle>
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className=" text-[#6b7280] text-sm ">Name</FormLabel>
                  <FormControl>
                    <Input
                      className="w-full text-sm bg-white border-blue-300 focus:border-blue-500  focus:bg-[#eaf5fb] !mt-0"
                      type="name"
                      placeholder="Enter your name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <Label>Category</Label>
              <Input {...register("category")} />
              {errors.category && <p className="text-red-500">{errors.category.message}</p>}
            </div>
            <div>
              <Label>Roles (comma-separated)</Label>
              <Input
                {...register("roles")}
                placeholder="Role1, Role2"
              />
              {errors.roles && <p className="text-red-500">{errors.roles.message}</p>}
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox {...register("videoRequired")} />
              <Label>Video Required</Label>
            </div>
            <div>
              <Label>Question Type</Label>
              <Input {...register("questionType")} />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox {...register("followUp")} />
              <Label>Follow Up</Label>
            </div>
            <div>
              <Label>Total Questions</Label>
              <Input
                type="number"
                {...register("totalQuestions")}
              />
              {errors.totalQuestions && <p className="text-red-500">{errors.totalQuestions.message}</p>}
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox {...register("resumeRequired")} />
              <Label>Resume Required</Label>
            </div>
            <Button type="submit">Submit</Button>
          </form>
          <Button type="submit">Submit</Button>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
