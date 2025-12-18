export const omitAuditFields = (responseData: any, additionalFields:string[] = []) => {
  // Default fields to remove
  const defaultFields = ["created_at", "updated_at", "deleted"];

  // Merge default + additional fields
  const fieldsToRemove = [...defaultFields, ...additionalFields];

  // Create a new object excluding those fields
  const sanitizedResponse = Object.fromEntries(
    Object.entries(responseData).filter(
      ([key]) => !fieldsToRemove.includes(key)
    )
  );

  return sanitizedResponse;
};
