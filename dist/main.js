import { RenderUIRsvpService } from "./renderUI.js";
import { ConsoleLogger } from "./logger.js";
const logger = new ConsoleLogger();
const interactiveRsvp = new RenderUIRsvpService([], logger);
document.addEventListener("DOMContentLoaded", () => {
  interactiveRsvp.init();
});
