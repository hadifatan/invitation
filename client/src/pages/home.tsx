import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { InvitationCard } from "@/components/invitation-card";
import { InvitationDetailModal } from "@/components/invitation-detail-modal";
import { type Invitation } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [selectedInvitation, setSelectedInvitation] = useState<Invitation | null>(null);
  const [telegramLink, setTelegramLink] = useState("");

  const { data: invitations, isLoading } = useQuery<Invitation[]>({
    queryKey: ["/api/invitations"],
  });

  const { data: settings } = useQuery<{ key: string; value: string }[]>({
    queryKey: ["/api/settings"],
  });

  useEffect(() => {
    if (settings) {
      const telegramSetting = settings.find((s) => s.key === "telegram_link");
      if (telegramSetting) {
        setTelegramLink(telegramSetting.value);
      }
    }
  }, [settings]);

  return (
    <div className="min-h-screen bg-background">
      <div
        className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-background min-h-[50vh] flex items-center justify-center px-4"
        data-testid="section-hero"
      >
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            Invitation Gallery
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our curated collection of elegant designs for every special occasion
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[3/4] w-full rounded-lg" />
              </div>
            ))}
          </div>
        ) : invitations && invitations.length > 0 ? (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
            data-testid="grid-invitations"
          >
            {invitations.map((invitation) => (
              <InvitationCard
                key={invitation.id}
                invitation={invitation}
                onClick={() => setSelectedInvitation(invitation)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20" data-testid="section-empty-state">
            <p className="text-muted-foreground text-lg">
              No invitations available at the moment
            </p>
          </div>
        )}
      </div>

      <InvitationDetailModal
        invitation={selectedInvitation}
        isOpen={!!selectedInvitation}
        onClose={() => setSelectedInvitation(null)}
        telegramLink={telegramLink || "https://t.me"}
      />
    </div>
  );
}
