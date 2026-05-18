import { ConfirmDialog } from 'kombase';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function ConfirmDialogExample() {
  const [openDelete, setOpenDelete] = useState(false);
  const [openForm, setOpenForm] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      {/* Basic Confirm Dialog */}
      <Button onClick={() => setOpenDelete(true)}>Open Delete Dialog</Button>

      <ConfirmDialog
        cancelBtnText="Cancel"
        confirmText="Delete"
        desc="Are you sure you want to delete this product? This action cannot be undone."
        destructive
        handleConfirm={() => {
          setOpenDelete(false);
        }}
        onOpenChange={setOpenDelete}
        open={openDelete}
        title="Delete Product"
      />

      {/* Confirm Dialog with Form */}
      <Button onClick={() => setOpenForm(true)}>Open Form Dialog</Button>

      <ConfirmDialog
        confirmText="Submit"
        desc="Please confirm to create a new user."
        form="create-user-form"
        onOpenChange={setOpenForm}
        open={openForm}
        title="Create User"
      >
        <form
          className="space-y-4"
          id="create-user-form"
          onSubmit={(e) => {
            e.preventDefault();

            setOpenForm(false);
          }}
        >
          <div className="space-y-2">
            {/** biome-ignore lint/a11y/noLabelWithoutControl: <> */}
            <label className="text-sm font-medium">Name</label>

            <input className="w-full rounded-md border px-3 py-2" placeholder="Enter name" />
          </div>

          <div className="space-y-2">
            {/** biome-ignore lint/a11y/noLabelWithoutControl: <> */}
            <label className="text-sm font-medium">Email</label>

            <input
              className="w-full rounded-md border px-3 py-2"
              placeholder="Enter email"
              type="email"
            />
          </div>
        </form>
      </ConfirmDialog>
    </div>
  );
}
