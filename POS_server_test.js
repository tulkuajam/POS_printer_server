async function printHello() {
    try {
      const response = await fetch('http://192.168.177.149:3000/print', { // Adjust URL if needed
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: 'hello' }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network response was not ok: ${response.status} - ${errorText}`);
      }
  
      const result = await response.text(); // or response.json() if your server returns JSON
      console.log('Print result:', result);
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  printHello();