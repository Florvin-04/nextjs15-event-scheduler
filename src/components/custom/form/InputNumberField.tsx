import { Input } from "@/components/ui/input";
import { RenderInputType } from "@/lib/types";

export default function InputNumber({ field, props }: RenderInputType) {
  const { value } = field;
  const { type, ...rest } = props;

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    field.onChange(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevent non-numeric keys except Backspace, Tab, Delete, and Arrow keys
    if (
      !/[\d]/.test(e.key) &&
      !["Backspace", "Tab", "Delete", "ArrowLeft", "ArrowRight"].includes(e.key)
    ) {
      e.preventDefault();
    }
  };

  return (
    <div>
      <Input
        type={type}
        {...rest}
        value={value}
        onChange={handleNumberInputChange}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
