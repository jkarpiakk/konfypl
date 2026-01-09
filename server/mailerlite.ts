let mailerlite: any = null;
let initialized = false;

async function getClient(): Promise<any> {
  if (initialized) return mailerlite;
  
  const apiKey = process.env.MAILERLITE_API_KEY;
  if (!apiKey) {
    console.log("MailerLite API key not configured - email sync disabled");
    initialized = true;
    return null;
  }

  try {
    const MailerLiteModule = await import("@mailerlite/mailerlite-nodejs");
    const MailerLite = MailerLiteModule.default || MailerLiteModule;
    mailerlite = new MailerLite({ api_key: apiKey });
    console.log("MailerLite integration initialized");
  } catch (error) {
    console.error("Failed to initialize MailerLite:", error);
    mailerlite = null;
  }
  
  initialized = true;
  return mailerlite;
}

export interface SubscriberData {
  email: string;
  name?: string;
  fields?: Record<string, string>;
  groups?: string[];
}

export async function addSubscriber(data: SubscriberData): Promise<boolean> {
  const client = await getClient();
  if (!client) {
    console.log("MailerLite not configured, skipping subscriber sync");
    return false;
  }

  try {
    const params: any = {
      email: data.email,
      fields: data.fields || {},
    };

    if (data.groups && data.groups.length > 0) {
      params.groups = data.groups;
    }

    await client.subscribers.createOrUpdate(params);
    console.log(`MailerLite: Added/updated subscriber ${data.email}`);
    return true;
  } catch (error: any) {
    console.error("MailerLite subscriber error:", error.response?.data || error.message);
    return false;
  }
}

export async function addToGroup(email: string, groupId: string): Promise<boolean> {
  const client = await getClient();
  if (!client) {
    return false;
  }

  try {
    await client.groups.assignSubscriber(email, groupId);
    console.log(`MailerLite: Added ${email} to group ${groupId}`);
    return true;
  } catch (error: any) {
    console.error("MailerLite group error:", error.response?.data || error.message);
    return false;
  }
}

export async function getGroups(): Promise<any[]> {
  const client = await getClient();
  if (!client) {
    return [];
  }

  try {
    const response = await client.groups.get({ limit: 100, sort: "name" });
    return response.data?.data || [];
  } catch (error: any) {
    console.error("MailerLite groups error:", error.response?.data || error.message);
    return [];
  }
}

export async function isConfigured(): Promise<boolean> {
  const client = await getClient();
  return client !== null;
}
