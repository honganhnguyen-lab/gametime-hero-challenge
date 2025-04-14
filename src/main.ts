import { RenderUIRsvpService } from "./renderUI";
import { ConsoleLogger } from "./logger";

const logger = new ConsoleLogger();
const interactiveRsvp = new RenderUIRsvpService([], logger);

document.addEventListener("DOMContentLoaded", () => {
  interactiveRsvp.init();
});
