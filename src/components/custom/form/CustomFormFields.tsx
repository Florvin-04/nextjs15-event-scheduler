"use client";

import { ControllerType, FormFieldProps } from "@/lib/types";
import Field from ".";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { cn } from "@/lib/utils";

const RenderInput = ({
  field,
  props,
}: {
  field: ControllerType;
  props: FormFieldProps;
}) => {
  switch (props.type) {
    case "text":
    case "password":
      return <Field.InputText field={field} props={props} />;

    case "textarea":
      return <Field.Textarea field={field} props={props} />;

    case "switch":
      return <Field.Switch field={field} props={props} />;

    case "select":
      return (
        <Field.SelectMenu field={field} props={props}>
          {props.children}
        </Field.SelectMenu>
      );

    case "number":
      return <Field.InputNumber field={field} props={props} />;

    case "customField":
      return props.renderCustomField
        ? props.renderCustomField({ field, additionalParam: 1 })
        : null;
    default:
      return null;
  }
};

export default function CustomFormFields<T extends FieldValues>(
  props: FormFieldProps & { control: Control<T>; name: Path<T>; error?: string }
) {
  const { control, name, id, error: errorMessage, description } = props;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <div className="space-y-1">
            <div
              className={cn(
                "flex flex-col gap-1",
                props.type === "switch" && "items-center flex-row-reverse w-fit"
              )}
            >
              {props.label && <label htmlFor={id}>{props.label}</label>}

              <RenderInput field={field} props={props} />
            </div>
            {description && (
              <p className="text-sm text-gray-500">{description}</p>
            )}
            {errorMessage && (
              <p className="text-red-500 text-sm">{errorMessage}</p>
            )}
          </div>
        );
      }}
    />
  );
}
