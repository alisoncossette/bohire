import axios from 'axios';

const BOLO_API_URL = process.env.BOLO_API_URL || 'https://api.bolospot.com';
const BOLO_API_KEY = process.env.BOLO_API_KEY;

export interface BoloRequest {
  requester: string;
  target: string;
  resource: string;
  message?: string;
}

export interface BoloGrant {
  id: string;
  requester: string;
  target: string;
  resource: string;
  grantedAt: string;
  expiresAt?: string;
}

class BoloSDK {
  private apiKey: string;
  private baseURL: string;

  constructor(apiKey: string, baseURL: string) {
    this.apiKey = apiKey;
    this.baseURL = baseURL;
  }

  async requestBolo(data: BoloRequest): Promise<{ success: boolean; requestId: string }> {
    try {
      const response = await axios.post(
        `${this.baseURL}/v1/requests`,
        data,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Bolo request failed:', error);
      throw new Error('Failed to send bolo request');
    }
  }

  async getGrants(userId: string): Promise<BoloGrant[]> {
    try {
      const response = await axios.get(
        `${this.baseURL}/v1/grants/${userId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
          },
        }
      );
      return response.data.grants || [];
    } catch (error) {
      console.error('Failed to fetch grants:', error);
      return [];
    }
  }

  async revokeBolo(grantId: string): Promise<{ success: boolean }> {
    try {
      const response = await axios.delete(
        `${this.baseURL}/v1/grants/${grantId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
          },
        }
      );
      return { success: response.status === 200 };
    } catch (error) {
      console.error('Failed to revoke grant:', error);
      throw new Error('Failed to revoke bolo grant');
    }
  }

  async getPendingRequests(userId: string): Promise<BoloRequest[]> {
    try {
      const response = await axios.get(
        `${this.baseURL}/v1/requests/pending/${userId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
          },
        }
      );
      return response.data.requests || [];
    } catch (error) {
      console.error('Failed to fetch pending requests:', error);
      return [];
    }
  }

  async approveBolo(requestId: string): Promise<{ success: boolean; grant: BoloGrant }> {
    try {
      const response = await axios.post(
        `${this.baseURL}/v1/requests/${requestId}/approve`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to approve request:', error);
      throw new Error('Failed to approve bolo request');
    }
  }
}

export const boloClient = new BoloSDK(BOLO_API_KEY || '', BOLO_API_URL);
