import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface ItemUnavailableAlertProps {
    itemNames: string[];
}

export const ItemUnavailableAlert = ({ itemNames }: ItemUnavailableAlertProps) => {
    return (
        <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Items No Longer Available</AlertTitle>
            <AlertDescription>
                The following items have been purchased by another customer:
                <ul className="list-disc list-inside mt-2 font-semibold">
                    {itemNames.map((name, idx) => (
                        <li key={idx}>{name}</li>
                    ))}
                </ul>
                <p className="mt-2">
                    Please remove these items from your cart to proceed with your remaining items,
                    or browse our shop for similar products.
                </p>
            </AlertDescription>
        </Alert>
    );
};
