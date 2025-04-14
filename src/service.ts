import { RsvpEntry, Player } from "./models";
import { Logger } from "./logger";

export class RsvpService {
  private entries: Map<string, RsvpEntry>;

  constructor(initialEntries: RsvpEntry[] = [], private logger: Logger) {
    this.entries = new Map(initialEntries.map((e) => [e.player.id, e]));
  }

  addOrUpdateRsvp(entry: RsvpEntry): void {
    const { id, lastName, firstName, birthday } = entry.player;
    const message = this.entries.has(id)
      ? `Updating RSVP for ${firstName} ${lastName} who has birthday on ${birthday} : ${entry.status}`
      : `Adding RSVP for ${firstName} ${lastName} who has birthday on ${birthday} : ${entry.status}`;

    this.logger.log(message);
    this.entries.set(id, entry);
  }

  getConfirmedAttendees(): Player[] {
    return [...this.entries.values()]
      .filter((e) => e.status === "Yes")
      .map((e) => e.player);
  }

  getCounts(): { total: number; confirmed: number; declined: number } {
    let confirmed = 0;
    let declined = 0;

    for (const { status } of this.entries.values()) {
      if (status === "Yes") confirmed++;
      if (status === "No") declined++;
    }

    return {
      total: this.entries.size,
      confirmed,
      declined,
    };
  }

  getEntriesFilteredBy(statusFilter: "total" | "confirm" | "decline"): RsvpEntry[] {
    const allEntries = [...this.entries.values()];
    if (statusFilter === "confirm") return allEntries.filter((e) => e.status === "Yes");
    if (statusFilter === "decline") return allEntries.filter((e) => e.status === "No");
    return allEntries;
  }
}
