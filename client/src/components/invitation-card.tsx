import { type Invitation } from "@shared/schema";

interface InvitationCardProps {
  invitation: Invitation;
  onClick: () => void;
}

export function InvitationCard({ invitation, onClick }: InvitationCardProps) {
  return (
    <div
      onClick={onClick}
      data-testid={`card-invitation-${invitation.id}`}
      className="group relative overflow-hidden rounded-lg cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl"
    >
      <div className="aspect-[3/4] overflow-hidden bg-muted">
        <img
          src={invitation.imageUrl}
          alt={invitation.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
        <div>
          <h3 className="text-white text-lg font-semibold" data-testid={`text-title-${invitation.id}`}>
            {invitation.title}
          </h3>
          <p className="text-white/90 text-sm mt-1" data-testid={`text-price-${invitation.id}`}>
            ${invitation.price}
          </p>
        </div>
      </div>
    </div>
  );
}
