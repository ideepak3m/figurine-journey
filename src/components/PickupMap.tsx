import { useState } from "react";
import Modal from "@/components/ui/modal";
import pickupLocationImg from "@/assets/pickupLocation.jpg";

export function PickupMap({
    lat = 43.65744,
    lng = -79.79783,
    label = "Pickup Location",
    className = "",
}: {
    lat?: number;
    lng?: number;
    label?: string;
    className?: string;
}) {
    const [open, setOpen] = useState(false);
    const mapSrc = `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
    // Use local image for preview
    const mapImg = pickupLocationImg;

    return (
        <>
            <div
                className={"rounded overflow-hidden border border-muted-200 cursor-pointer hover:shadow-lg transition-all " + className}
                style={{ maxWidth: 600 }}
                onClick={() => setOpen(true)}
                title="Click to explore map"
            >
                <img
                    src={mapImg}
                    alt={label}
                    className="w-80 h-48 object-cover"
                />
                <div className="p-2 text-center text-sm font-medium bg-muted">{label}</div>
            </div>
            <Modal open={open} onOpenChange={setOpen}>
                <div
                    className="p-0"
                    style={{
                        width: '100%',
                        maxWidth: '600px',
                        margin: '0 auto',
                    }}
                >
                    <iframe
                        src={mapSrc}
                        width="100%"
                        height="60vh"
                        style={{ border: 0, minHeight: 300 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Pickup Location Map"
                    ></iframe>
                </div>
            </Modal>
        </>
    );
}
