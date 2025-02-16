import { SelectItem } from "../ui/select";

type Item = {
  value: string; // Type for the value
  displayName: string; // Type for the name
};

type Props = {
  items: Item[];
};

export default function SelectOptionItems({ items }: Props) {
  return items.map((item) => (
    <SelectItem className="cursor-pointer" key={item.value} value={item.value}>
      {item.displayName}
    </SelectItem>
  ));
}
