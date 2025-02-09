import { ControllerRenderProps, FieldValues } from "react-hook-form";

export type ControllerType = ControllerRenderProps<FieldValues, string>;

export type FieldType =
  | "text"
  | "password"
  | "textarea"
  | "select"
  | "customField"
  | "number"
  | "switch";

type RenderCustomFieldParams = {
  field: ControllerType; // Assuming ControllerType is already defined
  additionalParam?: number; // Replace with actual parameter names and types
};

export type FormFieldProps = {
  // control: any;
  // name: string;
  type: FieldType;
  children?: React.ReactNode;
  renderCustomField?: (params: RenderCustomFieldParams) => React.ReactNode;
} & FieldValues;

export type RenderInputType = {
  field: ControllerType;
  props: FormFieldProps;
};
