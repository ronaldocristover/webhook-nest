import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  await prisma.aboutCompany.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.contactUs.deleteMany();
  await prisma.basicCompanyInfo.deleteMany();
  await prisma.user.deleteMany();
  await prisma.quotePrice.deleteMany();
  console.log(
    '🗑️  Cleared existing AboutCompany, Banner, ContactUs, BasicCompanyInfo, User, and QuotePrice data',
  );

  const baseUrl = 'https://pub-e5f46e0c6d2d4313829c38c984304979.r2.dev/static/';

  // Seed AboutCompany data
  const aboutCompanies = [
    {
      id: 1,
      title: 'About Our Company',
      subtitle: '公司簡介',
      content:
        '222 康師傅搭棚工程 隸屬 利高棚業工程有限公司其下一品牌，專責處理小型工程，行內又稱為「濕碎」。我們憑著廿多年的搭棚經驗，以專業團隊和工作流程，致力服務業主和中小企各類的棚架工程。由多位廿年資深搭棚師傅監工，以確保棚架安全、實用、省的時；工程和團隊亦已獲得政府認可之專業資格、牌照和保險，定期會配合嚴格的安全評核和訓練。每個工程完成後，更會定期安排督導員檢驗棚架，以確保安全。我們專業快捷、安全可靠、公道取價。',
      images: {
        section1: ['/company-1.png', '/company-2.png'],
        section2: [
          baseUrl + '/company-logo-1.png',
          baseUrl + '/company-logo-2.png',
          baseUrl + '/company-logo-3.png',
          baseUrl + '/company-logo-1.png',
        ],
        section3: [
          {
            type: 'image',
            src: baseUrl + '/banner-1.jpeg',
            alt: 'Scaffolding work 1',
          },
          {
            type: 'image',
            src: baseUrl + '/banner-2.jpeg',
            alt: 'Scaffolding work 2',
          },
        ],
      },
    },
  ];

  // Seed Banner data
  const banners = [
    {
      id: 1,
      title: 'About This Application',
      subtitle: 'Manage Your Tasks Efficiently',
      content:
        'This application is designed to help users manage their tasks efficiently. It offers',
      images: [baseUrl + '/certificate.jpeg', baseUrl + '/certificate.jpeg'],
    },
  ];

  // Seed ContactUs data
  const contactUsData = [
    {
      id: 1,
      title: 'Contact Us',
      subtitle: '聯絡我們',
      content: {
        email: 'support@example.com',
        phone: '+1-800-123-4567',
        whatsapp: '+1-800-765-4321',
        facebook: 'https://facebook.com/example',
      },
    },
  ];

  // Seed BasicCompanyInfo data
  const basicCompanyInfoData = [
    {
      id: 1,
      logo: baseUrl + '/logo.png',
      name: '康師傅搭棚工程',
      title: '專業搭棚工程服務',
      subtitle: '安全、可靠、專業的棚架解決方案',
      phone: '+1-800-123-4567',
      email: 'ronaldochristover@gmail.com',
      whatsapp: '+6282121180999',
      footer: '康師傅搭棚工程 © 版權所有 2026。保留所有權利。',
    },
  ];

  // Seed QuotePrice data
  const quotePriceData = [
    {
      id: 1,
      title: 'About This Application',
      subtitle: 'Manage Your Tasks Efficiently',
      content: [
        {
          title: 'About This Application',
          subtitle: 'Manage Your Tasks Efficiently',
          content:
            'This application is designed to help users manage their tasks efficiently. It offers',
          order: 1,
        },
        {
          title: 'About This Application',
          subtitle: 'Manage Your Tasks Efficiently',
          content:
            'This application is designed to help users manage their tasks efficiently. It offers',
          order: 2,
        },
        {
          title: 'About This Application',
          subtitle: 'Manage Your Tasks Efficiently',
          content:
            'This application is designed to help users manage their tasks efficiently. It offers',
          order: 3,
        },
        {
          title: 'About This Application',
          subtitle: 'Manage Your Tasks Efficiently',
          content:
            'This application is designed to help users manage their tasks efficiently. It offers',
          order: 4,
        },
        {
          title: 'About This Application',
          subtitle: 'Manage Your Tasks Efficiently',
          content:
            'This application is designed to help users manage their tasks efficiently. It offers',
          order: 5,
        },
        {
          title: 'About This Application',
          subtitle: 'Manage Your Tasks Efficiently',
          content:
            'This application is designed to help users manage their tasks efficiently. It offers',
          order: 6,
        },
      ],
    },
  ];

  // Seed User data
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const usersData = [
    {
      id: 1,
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Admin User',
    },
  ];

  // Insert the AboutCompany data
  for (const company of aboutCompanies) {
    await prisma.aboutCompany.create({
      data: company,
    });
  }

  // Insert the Banner data
  for (const banner of banners) {
    await prisma.banner.create({
      data: banner,
    });
  }

  // Insert the ContactUs data
  for (const contactUs of contactUsData) {
    await prisma.contactUs.create({
      data: contactUs,
    });
  }

  // Insert the BasicCompanyInfo data
  for (const companyInfo of basicCompanyInfoData) {
    await prisma.basicCompanyInfo.create({
      data: companyInfo,
    });
  }

  // Insert the QuotePrice data
  for (const quotePrice of quotePriceData) {
    await prisma.quotePrice.create({
      data: quotePrice,
    });
  }

  // Insert the User data
  for (const user of usersData) {
    await prisma.user.create({
      data: user,
    });
  }

  console.log(`✅ Created ${aboutCompanies.length} AboutCompany entries`);
  console.log(`✅ Created ${banners.length} Banner entries`);
  console.log(`✅ Created ${contactUsData.length} ContactUs entries`);
  console.log(
    `✅ Created ${basicCompanyInfoData.length} BasicCompanyInfo entries`,
  );
  console.log(`✅ Created ${quotePriceData.length} QuotePrice entries`);
  console.log(`✅ Created ${usersData.length} User entries`);
  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
