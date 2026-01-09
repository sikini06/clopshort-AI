
const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://votre-app-railway.up.railway.app';

export const apiService = {
  async signup(email: string, pass: string) {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass })
    });
    return response.json();
  },

  async login(email: string, pass: string) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass })
    });
    const data = await response.json();
    if (data.token) {
      localStorage.setItem('clopshort_token', data.token);
    }
    return data;
  },

  async generateShorts(videoUrl: string, count: number) {
    const token = localStorage.getItem('clopshort_token');
    const response = await fetch(`${API_URL}/shorts/generate`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ videoUrl, count })
    });
    return response.json();
  }
};
