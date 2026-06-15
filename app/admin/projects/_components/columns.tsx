"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import Link from "next/link";
import { constructUrl } from "@/lib/construct-url";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type Course = {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  level: string;
  status: string;
  students: number;
  createdAt: string;
};

export const columns: ColumnDef<Course>[] = [
  {
    accessorKey: "image",
    header: "Thumbnail",
    cell: ({ row }) => (
      <Image
        src={constructUrl(row.original.image)}
        alt={row.original.title}
        width={80}
        unoptimized
        height={50}
        className="h-12 w-20 rounded-md object-cover"
      />
    ),
  },

  {
    accessorKey: "title",
    header: "Course",
    cell: ({ row }) => (
      <div className="space-y-1">
        <p className="font-medium">{row.original.title}</p>

        {/* <p className="text-muted-foreground text-xs line-clamp-1">
          {row.original.description}
        </p> */}
      </div>
    ),
  },

  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => (
      <span>₹{row.original.price.toLocaleString("en-IN")}</span>
    ),
  },

  {
    accessorKey: "level",
    header: "Level",
    cell: ({ row }) => <Badge variant="secondary">{row.original.level}</Badge>,
  },

  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={row.original.status === "Published" ? "default" : "secondary"}
      >
        {row.original.status}
      </Badge>
    ),
  },

  {
    accessorKey: "students",
    header: "Students",
  },

  {
    accessorKey: "createdAt",
    header: "Created",
  },

  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/admin/courses/${row.original.id}/edit`}>
              <Pencil className="mr-2 size-4" />
              Edit
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem className="text-red-500">
            <Trash2 className="mr-2 size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
