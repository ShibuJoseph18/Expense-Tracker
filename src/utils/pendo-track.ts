const PENDO_TRACK_URL = "https://data.pendo.io/data/track";
const PENDO_INTEGRATION_KEY = "6e2c84a2-ecff-45ba-94ae-e61787b662e9";

export const pendoTrack = (
  event: string,
  visitorId: string,
  properties?: Record<string, string | number | boolean>
): void => {
  const body = JSON.stringify({
    type: "track",
    event,
    visitorId,
    accountId: visitorId,
    timestamp: Date.now(),
    properties,
  });

  fetch(PENDO_TRACK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-pendo-integration-key": PENDO_INTEGRATION_KEY,
    },
    body,
  }).catch(() => {
    // Silently ignore tracking failures to avoid breaking application flow
  });
};
