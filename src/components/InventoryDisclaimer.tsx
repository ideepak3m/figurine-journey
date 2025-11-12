import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

export const InventoryDisclaimer = () => {
    return (
        <Alert className="mb-6 border-amber-500 bg-amber-50">
            <InfoIcon className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
                <strong>Important:</strong> Our figurines are unique, one-of-a-kind items.
                Multiple customers can add the same item to their cart, but
                <strong> only the first person to complete payment gets the item.</strong>
                Items in your cart are not reserved - payment guarantees availability.
            </AlertDescription>
        </Alert>
    );
};
