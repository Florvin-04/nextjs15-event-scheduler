import { Textarea } from "@/components/ui/textarea";
import { RenderInputType } from "@/lib/types";

export default function InputTextArea({ field, props }: RenderInputType) {
  return (
    <div>
      <Textarea maxLength={250} {...field} {...props} />
    </div>

  );
}
