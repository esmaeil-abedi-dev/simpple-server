// nvm use 23.11.0
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Persian product categories
const persianCategories = [
  "لوازم الکترونیکی",
  "لوازم خانگی",
  "پوشاک",
  "لوازم آرایشی",
  "کتاب و لوازم التحریر"
];

// Persian product names by category
const productNamesByCategory: Record<string, string[]> = {
  "لوازم الکترونیکی": [
    "تلفن هوشمند سامسونگ گلکسی",
    "لپ تاپ اپل مک‌بوک پرو",
    "هدفون بی‌سیم سونی",
    "تلویزیون ال‌جی اولد",
    "دوربین عکاسی کانن",
    "ساعت هوشمند اپل واچ",
    "تبلت سامسونگ گلکسی تب",
    "اسپیکر هوشمند بلوتوثی",
    "پاور بانک آنکر",
    "ایرپاد پرو"
  ],
  "لوازم خانگی": [
    "ماشین لباسشویی بوش",
    "یخچال و فریزر سامسونگ",
    "جاروبرقی رباتیک",
    "مایکروویو پاناسونیک",
    "قهوه‌ساز نسپرسو",
    "توستر فیلیپس",
    "چرخ گوشت مولینکس",
    "اتو بخار بوش",
    "پلوپز پارس خزر",
    "مخلوط‌کن فیلیپس"
  ],
  "پوشاک": [
    "کت و شلوار مردانه",
    "مانتو زنانه ترک",
    "پیراهن آستین بلند مردانه",
    "شلوار جین زنانه",
    "کفش چرم مردانه",
    "کیف دستی زنانه",
    "تی‌شرت اسپرت",
    "روسری ابریشم",
    "کاپشن زمستانی",
    "لباس مجلسی زنانه"
  ],
  "لوازم آرایشی": [
    "رژ لب مک",
    "کرم پودر دیور",
    "ریمل میبلین",
    "سایه چشم آرت دکو",
    "لاک ناخن اسنس",
    "برس آرایشی رئال تکنیک",
    "شامپو لورآل",
    "کرم مرطوب کننده نیوآ",
    "عطر زنانه شنل",
    "ماسک صورت ایننیسفری"
  ],
  "کتاب و لوازم التحریر": [
    "کتاب صد سال تنهایی",
    "خودکار پارکر",
    "دفتر یادداشت مولسکین",
    "مداد رنگی فابر کاستل",
    "ماژیک هایلایتر استدلر",
    "کاغذ یادداشت چسب‌دار",
    "کتاب باغبان شب",
    "دفتر نقاشی کانسون",
    "روان‌نویس یونی بال",
    "کتاب بوف کور"
  ]
};

// Persian descriptions by category
const descriptionsByCategory: Record<string, string[]> = {
  "لوازم الکترونیکی": [
    "این محصول با کیفیت بالا و طراحی زیبا، مناسب برای استفاده روزمره است. دارای امکانات متنوع و کاربردی برای سهولت استفاده.",
    "محصولی با تکنولوژی پیشرفته که ترکیبی از زیبایی و کارایی است. با خرید این محصول از تخفیف ویژه بهره‌مند شوید.",
    "طراحی منحصر به فرد این محصول آن را از سایر محصولات متمایز می‌کند. گارانتی ۱۸ ماهه برای اطمینان خاطر شما.",
    "این محصول با بهره‌گیری از فناوری روز دنیا، تجربه‌ای متفاوت را برای شما به ارمغان می‌آورد. مصرف انرژی بهینه."
  ],
  "لوازم خانگی": [
    "این محصول با طراحی مدرن و کارایی بالا، انتخابی مناسب برای خانه‌های امروزی است. دارای گارانتی معتبر.",
    "محصولی با کیفیت عالی که به زیبایی دکوراسیون منزل شما می‌افزاید. مصرف انرژی پایین و کارایی بالا.",
    "طراحی هوشمندانه این محصول، استفاده از آن را برای همه افراد خانواده آسان می‌کند. با قابلیت کنترل از راه دور.",
    "این محصول با مواد مرغوب ساخته شده و دوام بالایی دارد. مناسب برای استفاده طولانی مدت و روزمره."
  ],
  "پوشاک": [
    "این محصول با پارچه درجه یک و دوخت عالی، راحتی و زیبایی را برای شما به ارمغان می‌آورد. در رنگ‌های متنوع.",
    "طراحی شیک و مدرن این محصول، شما را در جمع‌های دوستانه و کاری متمایز می‌کند. مناسب برای تمام فصول سال.",
    "این محصول با الهام از جدیدترین مدهای روز دنیا طراحی شده است. راحتی و شیک بودن را همزمان تجربه کنید.",
    "کیفیت عالی دوخت و استفاده از مواد اولیه مرغوب، دوام بالای این محصول را تضمین می‌کند. قابل شستشو در ماشین لباسشویی."
  ],
  "لوازم آرایشی": [
    "این محصول با فرمولاسیون منحصر به فرد، ماندگاری بالا و کیفیت عالی را برای شما به ارمغان می‌آورد. بدون ایجاد حساسیت.",
    "محصولی با کیفیت جهانی که زیبایی طبیعی شما را دوچندان می‌کند. مناسب برای انواع پوست.",
    "این محصول با ترکیبات گیاهی و طبیعی، علاوه بر زیبایی، سلامت پوست شما را نیز تضمین می‌کند. تست شده توسط متخصصین پوست.",
    "محصولی با ماندگاری بالا که نیاز به ترمیم مکرر را از بین می‌برد. دارای رنگ‌های متنوع برای سلیقه‌های مختلف."
  ],
  "کتاب و لوازم التحریر": [
    "این محصول با کیفیت عالی چاپ و صحافی، مطالعه را برای شما لذت‌بخش می‌کند. با کاغذ مرغوب و بدون اسید.",
    "طراحی کاربردی و زیبای این محصول، نوشتن را برای شما آسان و لذت‌بخش می‌کند. مناسب برای استفاده روزانه.",
    "این محصول با کیفیت بالا، همراه مناسبی برای تحصیل و کار شماست. با دوام و قابل استفاده برای مدت طولانی.",
    "محصولی با طراحی ارگونومیک که خستگی ناشی از نوشتن طولانی مدت را کاهش می‌دهد. مناسب برای دانش‌آموزان و دانشجویان."
  ]
};

// Seed function for PostgreSQL
async function main() {
  console.log("Starting database seeding with PostgreSQL...");
  
  try {
    // Create admin user
    console.log("Creating admin user...");
    const hashedAdminPassword = await bcrypt.hash("admin123", 10);
    const admin = await prisma.user.create({
      data: {
        username: "مدیر سیستم",
        email: "admin@example.com",
        password: hashedAdminPassword,
        isAdmin: true
      }
    });
    console.log("Admin user created:", admin.email);
    
    // Create regular user
    console.log("Creating regular user...");
    const hashedUserPassword = await bcrypt.hash("user123", 10);
    const user = await prisma.user.create({
      data: {
        username: "کاربر عادی",
        email: "user@example.com",
        password: hashedUserPassword,
        isAdmin: false
      }
    });
    console.log("Regular user created:", user.email);
    
    // Create categories
    console.log("Creating categories...");
    const categoryMap = new Map();
    for (const categoryName of persianCategories) {
      const category = await prisma.category.create({
        data: { name: categoryName }
      });
      categoryMap.set(categoryName, category);
      console.log(`Category created: ${categoryName}`);
    }
    
    // Create products (50 products as requested)
    console.log("Creating products...");
    let productCount = 0;
    
    for (const categoryName of persianCategories) {
      const category = categoryMap.get(categoryName);
      if (!category) continue;
      
      const productNames = productNamesByCategory[categoryName] || [];
      const descriptions = descriptionsByCategory[categoryName] || [];
      
      for (const productName of productNames) {
        if (productCount >= 50) break;
        
        // Get a random description
        const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)];
        
        // Generate random price and quantity
        const price = (Math.floor(Math.random() * 9900000) + 100000) / 10000;
        const quantity = Math.floor(Math.random() * 101);
        
        // Create product
        await prisma.product.create({
          data: {
            name: productName,
            description: randomDescription,
            price: price,
            quantity: quantity,
            categoryId: category.id,
            image: `product_${productCount + 1}.jpg`, // Placeholder image name
            rating: Math.floor(Math.random() * 5) + 1, // Random rating between 1-5
            numReviews: Math.floor(Math.random() * 100) // Random number of reviews
          }
        });
        
        productCount++;
        console.log(`Product created: ${productName}`);
      }
      
      if (productCount >= 50) break;
    }
    
    console.log(`Seeding completed successfully. Created ${productCount} products.`);
    
  } catch (error) {
    console.error("Error during seeding:", error);
    throw error;
  }
}

// Execute seed function
main()
  .catch((error) => {
    console.error("Fatal error during seeding:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("Database connection closed");
  });
