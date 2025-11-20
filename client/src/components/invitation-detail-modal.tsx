import { X, Send } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { type Invitation } from "@shared/schema";
import { useState, useEffect } from "react";

interface InvitationDetailModalProps {
  invitation: Invitation | null;
  isOpen: boolean;
  onClose: () => void;
  telegramLink: string;
}

export function InvitationDetailModal({
  invitation,
  isOpen,
  onClose,
  telegramLink,
}: InvitationDetailModalProps) {
  if (!invitation) return null;

  const handleShare = () => {
    const shareUrl = `${telegramLink}?text=Selected: ${encodeURIComponent(invitation.title)}`;
    window.open(shareUrl, "_blank");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <DialogTitle className="sr-only">{invitation.title}</DialogTitle>
        <div className="grid md:grid-cols-[60%_40%] gap-0 relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 rounded-full z-10"
            onClick={onClose}
            data-testid="button-close-modal"
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="bg-muted p-6 md:p-8">
            <img
              src={invitation.imageUrl}
              alt={invitation.title}
              className="w-full rounded-lg shadow-xl"
              data-testid="img-invitation-detail"
            />
          </div>
          
          <div className="p-6 md:p-8 flex flex-col">

            <div className="flex-1 space-y-6 mt-8 md:mt-0">
              <div>
                <h2
                  className="font-serif text-3xl font-bold text-foreground mb-3"
                  data-testid="text-invitation-title"
                >
                  {invitation.title}
                </h2>
                <p
                  className="text-muted-foreground leading-relaxed"
                  data-testid="text-invitation-description"
                >
                  {invitation.description}
                </p>
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground mb-2">Price</p>
                <p className="text-2xl font-bold text-foreground" data-testid="text-invitation-price">
                  ${invitation.price}
                </p>
              </div>
            </div>

            <Button
              onClick={handleShare}
              className="w-full mt-6 bg-[#0088cc] hover:bg-[#0077b3] text-white"
              size="lg"
              data-testid="button-share-telegram"
            >
              <Send className="h-4 w-4 mr-2" />
              Share on Telegram
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
