import React from "react";
import {
    Dialog,
    DialogContent,
    DialogClose,
} from "@/components/ui/dialog";

interface ModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    showClose?: boolean;
    children: React.ReactNode;
    extraTopRight?: React.ReactNode; // new prop for extra button(s)
}

const Modal: React.FC<ModalProps> = ({ open, onOpenChange, showClose = true, children, extraTopRight }) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                {/* Extra top-right content (e.g. Skip) */}
                {extraTopRight && (
                    <div className="absolute top-2 right-14 z-30">{extraTopRight}</div>
                )}
                {children}
                {showClose && (
                    <DialogClose asChild>
                        <button
                            aria-label="Close"
                            className="absolute top-2 right-2 rounded-full bg-white/80 p-1 shadow hover:bg-white"
                        >
                            <span className="sr-only">Close</span>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="4" x2="16" y2="16" /><line x1="16" y1="4" x2="4" y2="16" /></svg>
                        </button>
                    </DialogClose>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default Modal;
