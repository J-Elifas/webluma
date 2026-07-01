"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";

interface ClientActionsProps {
    clientName: string;
    isDeleting: boolean;
    onDelete: () => void;
    onEdit: () => void;
}

export default function ClientActions({
    clientName,
    isDeleting,
    onDelete,
    onEdit,
}: ClientActionsProps) {
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

    function handleDeleteConfirm() {
        setIsDeleteAlertOpen(false);
        onDelete();
    }

    return (
        <>
            <div className="flex items-center gap-2">
                <Button
                    type="button"
                    variant="secondary"
                    size="icon-sm"
                    aria-label={`Edit ${clientName}`}
                    disabled={isDeleting}
                    onClick={onEdit}
                    className="rounded-xl text-slate-gray"
                >
                    <Pencil className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button
                    type="button"
                    variant="secondary"
                    size="icon-sm"
                    aria-label={`Delete ${clientName}`}
                    aria-haspopup="dialog"
                    disabled={isDeleting}
                    onClick={() => setIsDeleteAlertOpen(true)}
                    className="rounded-xl text-slate-gray hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus:ring-2 focus:ring-red-200"
                >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                </Button>
            </div>

            <Alert
                isOpen={isDeleteAlertOpen}
                title="Delete client?"
                message={`Are you sure you want to delete ${clientName}? This action cannot be undone.`}
                isConfirming={isDeleting}
                onCancel={() => setIsDeleteAlertOpen(false)}
                onConfirm={handleDeleteConfirm}
            />
        </>
    );
}
