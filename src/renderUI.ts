import { RsvpService } from "./service";
import { RsvpEntry, RSVPStatus } from "./models";
import { Logger } from "./logger";

export const RSVP_STATUSES: RSVPStatus[] = ["Yes", "No", "Maybe"];

export class RenderUIRsvpService extends RsvpService {
  private modal: HTMLElement | null;
  private form: HTMLFormElement | null;
  private tableBody: HTMLElement | null;
  private statusFilter: HTMLSelectElement | null;

  constructor(initialEntries: RsvpEntry[], logger: Logger) {
    super(initialEntries, logger);
    this.modal = document.getElementById("modal-overlay");
    this.form = document.getElementById("add-guest-form") as HTMLFormElement;
    this.tableBody = document.getElementById("table-body");
    this.statusFilter = document.getElementById("status-filter") as HTMLSelectElement;
  }

  public init(): void {
    this.updateDisplay();
    this.bindUIEvents();
  }

  private bindUIEvents(): void {
    document.getElementById("add-new-btn")?.addEventListener("click", () => {
      this.modal?.classList.remove("hidden");
    });

    document.getElementById("close-modal")?.addEventListener("click", () => {
      this.closeModal();
    });

    document.getElementById("cancel-btn")?.addEventListener("click", () => {
      this.closeModal();
    });

    this.form?.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleFormSubmit();
    });

    this.statusFilter?.addEventListener("change", () => {
      this.updateDisplay();
    });
  }

  private handleFormSubmit(): void {
    const firstName = (document.getElementById("firstName") as HTMLInputElement).value.trim();
    const lastName = (document.getElementById("lastName") as HTMLInputElement).value.trim();
    const birthday = (document.getElementById("birthday") as HTMLInputElement).value.trim();
    const rsvpStatus = (document.getElementById("rsvpStatus") as HTMLSelectElement).value;

    const id = String(Date.now());

    this.addOrUpdateRsvp({
      player: { id, firstName, lastName, birthday },
      status: rsvpStatus as "Yes" | "No" | "Maybe",
    });

    this.updateDisplay();
    this.closeModal();
  }

  private updateDisplay(): void {
    if (!this.tableBody || !this.statusFilter) return;

    const entries = this.getEntriesFilteredBy(this.statusFilter.value as "confirm" | "decline" | "total");
    this.tableBody.innerHTML = "";

    for (const entry of entries) {
      const tr = document.createElement("tr");

      tr.appendChild(this.createCell(entry.player.id));
      tr.appendChild(this.createCell(entry.player.lastName));
      tr.appendChild(this.createCell(entry.player.firstName));
      tr.appendChild(this.createCell(entry.player.birthday));
      tr.appendChild(this.createStatusDropdown(entry));


      this.tableBody.appendChild(tr);
    }

    const countEl = document.getElementById("total-count");
    if (countEl) countEl.textContent = String(entries.length);
  }

  private createCell(content: string): HTMLTableCellElement {
    const td = document.createElement("td");
    td.textContent = content;
    return td;
  }

  private createStatusDropdown(entry: RsvpEntry): HTMLTableCellElement {
    const td = document.createElement("td");
    td.classList.add("filter-section")
    const select = document.createElement("select");
    const currentStatus = entry.status;

  RSVP_STATUSES.forEach((status) => {
    const option = document.createElement("option");
    option.value = status;
    option.textContent = status;
    option.selected = status === currentStatus;
    select.appendChild(option);
  });

  select.addEventListener("change", () => {
    const newStatus = select.value as RSVPStatus;

    if (newStatus !== currentStatus) {
      this.showConfirmModal(newStatus, () => {
        this.addOrUpdateRsvp({
          ...entry,
          status: newStatus,
        });
        this.updateDisplay();
      }, () => {
        select.value = currentStatus;
      });
    }
  });

  td.appendChild(select);
  return td;
  }
  
  private showConfirmModal(
    newStatus: RSVPStatus,
    onConfirm: () => void,
    onCancel: () => void
  ): void {
    const modalOverlay = document.getElementById("confirm-modal-overlay");
    const modal = document.getElementById("confirm-modal");
    const yesBtn = document.getElementById("confirm-yes-btn");
    const noBtn = document.getElementById("confirm-no-btn");
    const closeBtn = document.getElementById("close-confirm-modal");
    const statusSpan = document.getElementById("new-status-value");

    if (!modal || !modalOverlay || !yesBtn || !noBtn || !closeBtn || !statusSpan) return;

    statusSpan.textContent = newStatus;
    modalOverlay.classList.remove("hidden");

    const cleanup = () => {
      modalOverlay.classList.add("hidden");
      yesBtn.removeEventListener("click", confirmHandler);
      noBtn.removeEventListener("click", cancelHandler);
      closeBtn.removeEventListener("click", cancelHandler);
    };

    const confirmHandler = () => {
      onConfirm();
      cleanup();
    };

    const cancelHandler = () => {
      onCancel();
      cleanup();
    };

    yesBtn.addEventListener("click", confirmHandler);
    noBtn.addEventListener("click", cancelHandler);
    closeBtn.addEventListener("click", cancelHandler);
  }


  private closeModal(): void {
    this.form?.reset();
    this.modal?.classList.add("hidden");
  }
}
