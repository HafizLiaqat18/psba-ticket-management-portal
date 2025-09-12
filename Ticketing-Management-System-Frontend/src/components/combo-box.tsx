// Combobox.tsx (or inside your createticket-dialog.tsx file)
import * as React from "react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export function Combobox({
  options,
  value,
  onChange,
  placeholder,
  disabled,
}: {
  options: { _id: string; name: string }[];
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const filtered = options.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const selected = options.find((item) => item._id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between"
          disabled={disabled}
        >
          {selected ? selected.name : placeholder || "Select..."}
          <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput
            placeholder="Search..."
            value={search}
            onValueChange={setSearch}
            autoFocus
          />
          <CommandList>
            {filtered.length === 0 && (
              <div className="p-2 text-sm text-muted-foreground">
                No results
              </div>
            )}
            {filtered.map((item) => (
              <CommandItem
                key={item._id}
                value={item._id}
                onSelect={() => {
                  onChange(item._id);
                  setOpen(false);
                  setSearch("");
                }}
              >
                {item.name}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
