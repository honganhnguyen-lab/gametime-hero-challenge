import { RsvpService } from "./service.js";
export const RSVP_STATUSES = ["Yes", "No", "Maybe"];
export class RenderUIRsvpService extends RsvpService {
  constructor(initialEntries, logger) {
    super(initialEntries, logger);
    this.modal = document.getElementById("modal-overlay");
    this.form = document.getElementById("add-guest-form");
    this.tableBody = document.getElementById("table-body");
    this.statusFilter = document.getElementById("status-filter");
  }
  init() {
    this.updateDisplay();
    this.bindUIEvents();
  }
  bindUIEvents() {
    var _a, _b, _c, _d, _e;
    (_a = document.getElementById("add-new-btn")) === null || _a === void 0
      ? void 0
      : _a.addEventListener("click", () => {
          var _a;
          (_a = this.modal) === null || _a === void 0
            ? void 0
            : _a.classList.remove("hidden");
        });
    (_b = document.getElementById("close-modal")) === null || _b === void 0
      ? void 0
      : _b.addEventListener("click", () => {
          this.closeModal();
        });
    (_c = document.getElementById("cancel-btn")) === null || _c === void 0
      ? void 0
      : _c.addEventListener("click", () => {
          this.closeModal();
        });
    (_d = this.form) === null || _d === void 0
      ? void 0
      : _d.addEventListener("submit", (e) => {
          e.preventDefault();
          this.handleFormSubmit();
        });
    (_e = this.statusFilter) === null || _e === void 0
      ? void 0
      : _e.addEventListener("change", () => {
          this.updateDisplay();
        });
  }
  handleFormSubmit() {
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const birthday = document.getElementById("birthday").value.trim();
    const rsvpStatus = document.getElementById("rsvpStatus").value;
    const id = String(Date.now());
    this.addOrUpdateRsvp({
      player: { id, firstName, lastName, birthday },
      status: rsvpStatus
    });
    this.updateDisplay();
    this.closeModal();
  }
  updateDisplay() {
    if (!this.tableBody || !this.statusFilter) return;
    const entries = this.getEntriesFilteredBy(this.statusFilter.value);
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
  createCell(content) {
    const td = document.createElement("td");
    td.textContent = content;
    return td;
  }
  createStatusDropdown(entry) {
    const td = document.createElement("td");
    td.classList.add("filter-section");
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
      const newStatus = select.value;
      if (newStatus !== currentStatus) {
        this.showConfirmModal(
          newStatus,
          () => {
            this.addOrUpdateRsvp(
              Object.assign(Object.assign({}, entry), { status: newStatus })
            );
            this.updateDisplay();
          },
          () => {
            select.value = currentStatus;
          }
        );
      }
    });
    td.appendChild(select);
    return td;
  }
  showConfirmModal(newStatus, onConfirm, onCancel) {
    const modalOverlay = document.getElementById("confirm-modal-overlay");
    const modal = document.getElementById("confirm-modal");
    const yesBtn = document.getElementById("confirm-yes-btn");
    const noBtn = document.getElementById("confirm-no-btn");
    const closeBtn = document.getElementById("close-confirm-modal");
    const statusSpan = document.getElementById("new-status-value");
    if (
      !modal ||
      !modalOverlay ||
      !yesBtn ||
      !noBtn ||
      !closeBtn ||
      !statusSpan
    )
      return;
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
  closeModal() {
    var _a, _b;
    (_a = this.form) === null || _a === void 0 ? void 0 : _a.reset();
    (_b = this.modal) === null || _b === void 0
      ? void 0
      : _b.classList.add("hidden");
  }
}
