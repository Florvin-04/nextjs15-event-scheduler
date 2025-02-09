"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import DeleteAlertDialog from "@/components/custom/DeleteAlertDialog";
import DeleteEventButton from "./DeleteEventButton";

type Props = {
  id: string;
};

export default function DeleteEventButtonParent({ id }: Props) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <>
      <Button
        variant="destructive"
        type="button"
        onClick={() => setIsDeleteDialogOpen(true)}
      >
        Delete
      </Button>

      <DeleteAlertDialog
        actionButton={<DeleteEventButton eventId={id} />}
        open={isDeleteDialogOpen}
        setOpen={setIsDeleteDialogOpen}
      />
    </>
  );
}
