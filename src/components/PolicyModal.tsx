import React from "react";
import Modal from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface PolicyModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    url: string;
    title: string;
}

const getPublicUrl = (url: string) => {
    // Handles base path for gh-pages or subfolder deploys
    const base = import.meta.env.BASE_URL || "/";
    return base + url.replace(/^\//, "");
};

const PolicyModal: React.FC<PolicyModalProps> = ({ open, onOpenChange, url, title }) => {
    return (
        <Modal open={open} onOpenChange={onOpenChange} showClose={true}>
            <div className="w-full max-w-2xl h-[70vh] flex flex-col">
                <h2 className="text-xl font-bold mb-4 text-center">{title}</h2>
                <iframe
                    src={getPublicUrl(url)}
                    title={title}
                    className="flex-1 w-full border rounded"
                    style={{ minHeight: 400 }}
                />
                <Button className="mt-4 mx-auto w-40" onClick={() => onOpenChange(false)}>
                    Close
                </Button>
            </div>
        </Modal>
    );
};

export default PolicyModal;
