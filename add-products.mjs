const API_BASE_URL = 'http://localhost:5002/api';

const PRODUCTS = [
  {
    name: "Paracetamol 500mg",
    category: "Pain Relief",
    price: 30,
    description: "Effective relief from pain and fever. Suitable for headaches, toothache, and cold symptoms.",
    image: "https://images.unsplash.com/photo-1584308666721-bb8bd1f9913d?auto=format&fit=crop&q=80&w=400&h=400",
    requiresPrescription: false,
    dosage: "1-2 tablets every 4-6 hours"
  },
  {
    name: "Vitamin C 1000mg",
    category: "Vitamins & Supplements",
    price: 60,
    description: "High-strength Vitamin C to support your immune system and overall health.",
    image: "https://images.unsplash.com/photo-1616671285441-fb7b5b24d721?auto=format&fit=crop&q=80&w=400&h=400",
    requiresPrescription: false,
    dosage: "1 tablet daily"
  },
  {
    name: "Amoxicillin 250mg",
    category: "Cold & Flu",
    price: 120,
    description: "Antibiotic used to treat various bacterial infections.",
    image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=400&h=400",
    requiresPrescription: false,
    dosage: "As directed by physician"
  },
  {
    name: "Infrared Thermometer",
    category: "Medical Devices",
    price: 1250,
    description: "Non-contact infrared thermometer for fast and accurate temperature readings.",
    image: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=400&h=400",
    requiresPrescription: false,
    dosage: ""
  },
  {
    name: "Antacid Liquid 200ml",
    category: "Digestive Health",
    price: 110,
    description: "Fast-acting relief from heartburn, indigestion, and trapped wind.",
    image: "https://images.unsplash.com/photo-1550573105-15864539da71?auto=format&fit=crop&q=80&w=400&h=400",
    requiresPrescription: false,
    dosage: "10-20ml after meals"
  },
  {
    name: "Baby Gentle Lotion",
    category: "Baby Care",
    price: 280,
    description: "Hypoallergenic and dermatologist-tested lotion for delicate baby skin.",
    image: "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=400&h=400",
    requiresPrescription: false,
    dosage: ""
  },
  {
    name: "Ibuprofen 200mg",
    category: "Pain Relief",
    price: 45,
    description: "Anti-inflammatory painkiller for relief from muscle pain, backache, and period pain.",
    image: "https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&q=80&w=400&h=400",
    requiresPrescription: false,
    dosage: "1-2 tablets every 4-6 hours"
  },
  {
    name: "Multivitamin Tablets",
    category: "Vitamins & Supplements",
    price: 150,
    description: "Complete daily multivitamin with essential minerals to maintain overall wellness.",
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde0b?auto=format&fit=crop&q=80&w=400&h=400",
    requiresPrescription: false,
    dosage: "1 tablet daily"
  },
  {
    name: "First Aid Box",
    category: "First Aid",
    price: 890,
    description: "Comprehensive first aid kit with bandages, antiseptic, and emergency supplies.",
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde0b?auto=format&fit=crop&q=80&w=400&h=400",
    requiresPrescription: false,
    dosage: ""
  },
  {
    name: "Elastic Support Brace",
    category: "Supports & Braces",
    price: 350,
    description: "Breathable elastic support brace for knee, ankle, and wrist support.",
    image: "https://images.unsplash.com/photo-1576091160550-112fdf541310?auto=format&fit=crop&q=80&w=400&h=400",
    requiresPrescription: false,
    dosage: ""
  },
  {
    name: "Cough Syrup 200ml",
    category: "Cold & Flu",
    price: 95,
    description: "Effective cough suppressant and expectorant for dry and productive coughs.",
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde0b?auto=format&fit=crop&q=80&w=400&h=400",
    requiresPrescription: false,
    dosage: "2-3 teaspoons three times daily"
  },
  {
    name: "Moisturizing Face Cream",
    category: "Personal Care",
    price: 450,
    description: "Rich, nourishing face cream with natural ingredients for healthy glowing skin.",
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&q=80&w=400&h=400",
    requiresPrescription: false,
    dosage: ""
  }
];

async function addProducts() {
  console.log('🚀 Starting product upload...\n');
  let successCount = 0;
  let failureCount = 0;

  for (const product of PRODUCTS) {
    try {
      console.log(`⏳ Adding: ${product.name}...`);
      
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
      });

      const data = await response.json();
      
      if (data.success || response.ok) {
        console.log(`   ✅ Success! ID: ${data.product?._id || data.product?.id || 'N/A'}`);
        successCount++;
      } else {
        console.log(`   ❌ Failed: ${data.error || 'Unknown error'}`);
        failureCount++;
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
      failureCount++;
    }
  }

  console.log(`\n📊 Upload Summary:`);
  console.log(`   ✅ Successful: ${successCount}`);
  console.log(`   ❌ Failed: ${failureCount}`);
  console.log(`   📦 Total: ${PRODUCTS.length}`);
  console.log(`\n✨ All products have been processed!`);
}

addProducts();
