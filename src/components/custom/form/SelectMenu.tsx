import { ControllerType, FormFieldProps } from "@/lib/types";

import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type Props = {
  field: ControllerType;
  children: React.ReactNode;
  props: FormFieldProps;
};

export default function SelectMenu({ field, children, props }: Props) {
  return (
    <Select onValueChange={field.onChange} defaultValue={field.value}>
      <SelectTrigger className={(cn("w-[180px]"), props.className)}>
        <SelectValue placeholder="Select" />
      </SelectTrigger>
      <SelectContent>{children}</SelectContent>
    </Select>
  );
}
