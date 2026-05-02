const getHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const sendRequest = async (data) => {
  try {
    const response = await fetch('http://localhost:3000/request', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error sending request:', error);
    throw error;
  }
};

export const getAnalysis = async (city, category) => {
  try {
    const url = new URL('http://localhost:3000/analyze');
    if (city) url.searchParams.append('city', city);
    if (category) url.searchParams.append('category', category);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        ...getHeaders()
      }
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching analysis:', error);
    throw error;
  }
};
