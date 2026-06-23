import { Pencil, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

type Column<T> = {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
};

type CrudTableProps<T extends { id: number }> = {
  rows: T[];
  columns: Column<T>[];
  onAdd: () => void;
  onEdit: (row: T) => void;
  onDelete: (row: T) => void;
  emptyLabel?: string;
};

export function CrudTable<T extends { id: number }>({
  rows,
  columns,
  onAdd,
  onEdit,
  onDelete,
  emptyLabel = "No records yet.",
}: CrudTableProps<T>) {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-soft">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <p className="text-sm text-muted-foreground">{rows.length} records</p>
        <Button onClick={onAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          Add new
        </Button>
      </div>

      {rows.length === 0 ? (
        <p className="px-5 py-10 text-center text-muted-foreground">{emptyLabel}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-border bg-secondary/40">
              <tr>
                {columns.map((column) => (
                  <th key={String(column.key)} className="px-5 py-3 font-semibold text-foreground">
                    {column.label}
                  </th>
                ))}
                <th className="px-5 py-3 text-right font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-border/70 last:border-0">
                  {columns.map((column) => (
                    <td key={String(column.key)} className="px-5 py-4 text-muted-foreground">
                      {column.render ? column.render(row) : String((row as Record<string, unknown>)[column.key as string] ?? "")}
                    </td>
                  ))}
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => onEdit(row)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => onDelete(row)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
