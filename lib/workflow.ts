export const triggerWorkflow = async (score: number, category: string, userId: string) => {
  console.log(`Triggering workflow for ${category} lead (score: ${score}) for user ${userId}`);

  if (category === 'Hot') {
    // Trigger call API (stub)
    console.log("TRIGGER: Instant call initiated between counselor and user.");
  } else if (category === 'Warm') {
    // Send WhatsApp messages (stub)
    console.log("TRIGGER: WhatsApp follow-up campaign started.");
  } else {
    // Add to email drip campaign (stub)
    console.log("TRIGGER: Email drip campaign added.");
  }
};
