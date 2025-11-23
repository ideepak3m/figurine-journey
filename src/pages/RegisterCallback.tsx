import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Modal from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

const messages = {
    "custom-order": {
        title: "Order Request Submitted",
        body: "Thank you for submitting the order request for the figurine. Someone from our team will contact you shortly with more details.",
        button: "Close"
    },
    "standard": {
        title: "Registration Successful",
        body: "Thank you very much for registering, these are some of the things you can do on this website.",
        button: "Close"
    }
};

export default function RegisterCallback() {
    const navigate = useNavigate();
    const location = useLocation();
    const [open, setOpen] = useState(true);
    const [type, setType] = useState("standard");

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const t = params.get("type");
        if (t && messages[t]) setType(t);
    }, [location.search]);

    const handleClose = () => {
        setOpen(false);
        navigate("/shop");
    };

    const msg = messages[type];

    return (
        <Modal open={open} onOpenChange={handleClose} showClose={false}>
            <div className="w-full max-w-md flex flex-col items-center justify-center p-6">
                <h2 className="text-xl font-bold mb-4 text-center">{msg.title}</h2>
                <p className="mb-6 text-center text-muted-foreground text-base">{msg.body}</p>
                <Button className="mt-4 w-40" onClick={handleClose}>{msg.button}</Button>
            </div>
        </Modal>
    );
}
