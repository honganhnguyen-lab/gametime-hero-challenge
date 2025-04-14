export interface Player {
  id: string;
  lastName: string;
  firstName: string;
  birthday: string;
}

export interface RsvpEntry {
  player: Player;
  status: RSVPStatus;
}

export type RSVPStatus = "Yes" | "No" | "Maybe";
