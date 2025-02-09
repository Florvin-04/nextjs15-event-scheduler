import { Switch } from "@/components/ui/switch";
import { RenderInputType } from "@/lib/types";

export default function SwitchInput({ field, props }: RenderInputType) {
  return (
    <>
      <Switch
        checked={field.value}
        onCheckedChange={field.onChange}
        id={props.id}
      />
    </>
  );
}
