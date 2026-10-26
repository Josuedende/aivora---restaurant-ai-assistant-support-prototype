# AIVORA - Restaurant Operations & Guest Communication

AIVORA — Restaurant Operations & Guest Communication Platform A modern, responsive web application for managing restaurant guest communications, table reservations, menu and dietary inquiries, and staff takeover workflows.

 Table of Contents
 
  Overview 
  Key Features Project Architecture & File Structure Prerequisites Getting Started in VS Code Available Scripts Tech Stack Configuration License Overview AIVORA provides restaurant managers and hospitality teams with a unified operations portal. 
  
  The platform handles incoming guest conversations across channels (such as WhatsApp, Web, and SMS), assists with reservation requests and menu questions, and provides staff with a seamless manual takeover interface when personal assistance or VIP handling is required.
  
   Key Features Atmospheric Landing Page: Designed with high-fidelity bistro ambiance imagery, clear value propositions, and direct entry points to the portal.
   
    Operations Dashboard: Live metric cards (Conversations, Confirmed Bookings, Questions Answered, Takeover alerts). Prominent red exterior-bordered takeover banner for high-priority diner alerts.

    Clean, scannable table of recent guest interactions with filter tags (All, Takeover, Needs attention, Booked, Answered). Live Takeover & Conversation Hub: Dedicated conversation view with real-time guest messaging feed. 
    
    Instant staff takeover mode with manual intervention controls and status badges. Table Bookings Management: Clean and clutter-free reservation list with party sizes, dates, seating preferences, and confirmation states.
    
    Knowledge Base: Centralized repository for restaurant menus, dietary and allergen guides, wine lists, and opening hours. Staff Profile & Navigation: Sidebar with streamlined typography, active routing indicators, and quick-access Logout controls.
    


# aivora-project/
├── public/                 # Static assets and public images
├── src/
│   ├── assets/             # Bundled application images and media
│   ├── components/
│   │   ├── auth/           # Login and registration screens
│   │   ├── bookings/       # Table reservation management views
│   │   ├── conversations/  # Guest communication & live takeover view
│   │   ├── dashboard/      # Main restaurant operations dashboard
│   │   ├── designSystem/   # UI component guidelines and tokens
│   │   ├── knowledge/      # Restaurant knowledge base and menu docs
│   │   ├── landing/        # Public bistro-themed landing page
│   │   ├── layout/         # Application shell (sidebar navigation & header)
│   │   ├── onboarding/     # Multi-step restaurant onboarding wizard
│   │   └── settings/       # Operational preferences & account configuration
│   ├── data/
│   │   └── mockData.ts     # Sample operational data, guest interactions, and menus
│   ├── types.ts            # TypeScript interfaces and domain type definitions
│   ├── App.tsx             # Main routing and screen transition logic
│   ├── main.tsx            # React application entry point
│   └── index.css           # Global Tailwind CSS imports and utility styles
├── .env.example            # Environment variable template
├── .gitignore              # Git ignore rules for node_modules and builds
├── index.html              # HTML document template
├── package.json            # Dependencies and npm script definitions
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite build tool configuration
└── README.md               # Project documentation

