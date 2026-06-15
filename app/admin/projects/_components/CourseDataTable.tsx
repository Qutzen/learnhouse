"use no memo";
"use client";

import * as React from "react";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  level: string;
  status: string;
  students: number;
  createdAt: string;
}

interface DataTableProps {
  columns: ColumnDef<Course>[];
  data: Course[];
}

export function CourseDataTable({ columns, data }: DataTableProps) {
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [levelFilter, setLevelFilter] = React.useState("all");

  const filteredData = React.useMemo(() => {
    return data.filter((course) => {
      const matchesStatus =
        statusFilter === "all" || course.status === statusFilter;

      const matchesLevel =
        levelFilter === "all" || course.level === levelFilter;

      return matchesStatus && matchesLevel;
    });
  }, [data, statusFilter, levelFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <Input
          placeholder="Search courses..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="w-55 rounded-md h-10"
        />

        <div className="flex flex-wrap gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-10! w-45 rounded-md">
              <SelectValue placeholder="Status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>

              <SelectItem value="Published">Published</SelectItem>

              <SelectItem value="Draft">Draft</SelectItem>

              <SelectItem value="Archived">Archived</SelectItem>
            </SelectContent>
          </Select>

          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="h-10! w-45 rounded-md">
              <SelectValue placeholder="Level" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>

              <SelectItem value="Beginner">Beginner</SelectItem>

              <SelectItem value="Intermediate">Intermediate</SelectItem>

              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-10 rounded-md">
                Columns
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            onClick={() => {
              setStatusFilter("all");
              setLevelFilter("all");
              setGlobalFilter("");
            }}
            className="h-10 rounded-md"
          >
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No Courses Found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {table.getRowModel().rows.length} Courses
        </p>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
