import MailerLite from "@mailerlite/mailerlite-nodejs";

const apiKey = process.env.MAILERLITE_API_KEY;

let mailerlite: MailerLite | null = null;

if (apiKey) {
  mailerlite = new MailerLite({ api_key: apiKey });
  console.log("MailerLite integration initialized");
} else {
  console.log("MailerLite API key not configured - email sync disabled");
}

export interface SubscriberData {
  email: string;
  name?: string;
  fields?: Record<string, string>;
  groups?: string[];
}

export async function addSubscriber(data: SubscriberData): Promise<boolean> {
  if (!mailerlite) {
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

    await mailerlite.subscribers.createOrUpdate(params);
    console.log(`MailerLite: Added/updated subscriber ${data.email}`);
    return true;
  } catch (error: any) {
    console.error("MailerLite subscriber error:", error.response?.data || error.message);
    return false;
  }
}

export async function addToGroup(email: string, groupId: string): Promise<boolean> {
  if (!mailerlite) {
    return false;
  }

  try {
    await mailerlite.groups.assignSubscriber(email, groupId);
    console.log(`MailerLite: Added ${email} to group ${groupId}`);
    return true;
  } catch (error: any) {
    console.error("MailerLite group error:", error.response?.data || error.message);
    return false;
  }
}

export async function getGroups(): Promise<any[]> {
  if (!mailerlite) {
    return [];
  }

  try {
    const response = await mailerlite.groups.get({ limit: 100, sort: "name" });
    return response.data?.data || [];
  } catch (error: any) {
    console.error("MailerLite groups error:", error.response?.data || error.message);
    return [];
  }
}

export function isConfigured(): boolean {
  return mailerlite !== null;
}
