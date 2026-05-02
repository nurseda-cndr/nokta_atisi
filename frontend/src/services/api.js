export const sendRequest = async (data) => {
  try {
    const response = await fetch('http://localhost:3000/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching analysis:', error);
    throw error;
  }
};
