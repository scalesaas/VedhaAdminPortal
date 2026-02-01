import React from "react";
import Linkstable from "./components/Linkstable";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusIcon } from "@radix-ui/react-icons";
export default function Blog() {

  return (
    <div className="space-y-5">
      <div className="flex items-center pt-[100px] justify-between">
        <h1 className="text-3xl font-bold">Links</h1>
        <Link href="/dashboard/links/create">
          <Button className="flex items-center gap-2" variant="outline">
            Create <PlusIcon />
          </Button>
        </Link>
      </div>
      <Linkstable  />
      <div></div>
    </div>
  );
}