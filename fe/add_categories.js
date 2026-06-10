// No node-fetch needed

const API_BASE = "http://127.0.0.1:5000/api/categories";

const addMissing = async () => {
  try {
    const res = await fetch(API_BASE);
    const existing = await res.json();
    const existingNames = existing.map(c => c.name.toLowerCase());
    
    const missing = ["Linh Kiện PC", "Chuột", "Bàn Phím", "Tai Nghe"];
    
    for (const cat of missing) {
      if (!existingNames.includes(cat.toLowerCase())) {
        const createRes = await fetch(API_BASE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: cat })
        });
        if (createRes.ok) {
          console.log(`Added category: ${cat}`);
        } else {
          console.error(`Failed to add category: ${cat}`);
        }
      } else {
        console.log(`Category already exists: ${cat}`);
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

addMissing();
