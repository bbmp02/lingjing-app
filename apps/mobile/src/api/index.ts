// API 配置 - 本地开发环境
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Users
  async getUsers() {
    return this.request('/users');
  }

  async getUser(id: string) {
    return this.request(`/users/${id}`);
  }

  async createUser(data: any) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: any) {
    return this.request('/users/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Spirit Currency
  async getSpiritCurrencies() {
    return this.request('/spirit-currency');
  }

  async getSpiritCurrency(id: string) {
    return this.request(`/spirit-currency/${id}`);
  }

  async createSpiritCurrency(data: any) {
    return this.request('/spirit-currency', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Relationships
  async getRelationships() {
    return this.request('/relationships');
  }

  async getRelationship(id: string) {
    return this.request(`/relationships/${id}`);
  }

  async createRelationship(data: any) {
    return this.request('/relationships', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Interaction Records
  async getInteractionRecords() {
    return this.request('/interaction-records');
  }

  async createInteractionRecord(data: any) {
    return this.request('/interaction-records', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const api = new ApiClient(API_BASE_URL);
export default api;
