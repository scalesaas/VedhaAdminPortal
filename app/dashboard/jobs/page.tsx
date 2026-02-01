import React from "react";
import BlogTable from "./components/JobTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusIcon } from "@radix-ui/react-icons";
export default function Blog() {

  return (
    <div className="space-y-5">
      <div className="flex items-center pt-[100px] justify-between">
        <h1 className="text-3xl font-bold">Jobs</h1>
        <Link href="/dashboard/jobs/create">
          <Button className="flex items-center gap-2" variant="outline">
            Create <PlusIcon />
          </Button>
        </Link>
      </div>
      <BlogTable  />
      <div></div>
    </div>
  );
}