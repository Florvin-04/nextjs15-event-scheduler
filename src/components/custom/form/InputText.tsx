import { Input } from "@/components/ui/input";
import { RenderInputType } from "@/lib/types";

export default function InputText({ field, props }: RenderInputType) {
  return (
    <div>
      <Input {...field} {...props} />
    </div>
  );
}
