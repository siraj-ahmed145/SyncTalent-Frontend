# Smart Resume Screening & Job Matching Platform

An AI-driven candidate resume screening and job recommendation system built with Next.js and Tailwind CSS.

## 🚀 Features

### For Employers
- AI-powered candidate ranking
- Automated resume screening
- Advanced filtering options
- Real-time applicant tracking

### For Candidates
- Personalized job recommendations
- Smart profile matching
- Easy resume upload
- Track application status

### Platform Benefits
- **Accurate Matching**: Advanced NLP algorithms ensure precise candidate-job alignment
- **Time Efficient**: Reduce screening time from hours to minutes with automation
- **Fair & Transparent**: Minimize bias with objective AI-driven candidate evaluation

## 🎨 Design Features

- **Fully Responsive**: Optimized for desktop, tablet, and mobile devices
- **Dark Mode**: Toggle between light and dark themes with persistent preference storage
- **Modern UI**: Clean, professional design with smooth transitions and hover effects
- **Accessibility**: Built with semantic HTML and ARIA labels

## 🛠️ Tech Stack

- **Framework**: Next.js 16
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Fonts**: Geist Sans & Geist Mono
- **Language**: JavaScript (React)

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🌐 Development

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

The landing page is located at `app/page.js` and will auto-reload when you make changes.

## 🎯 Project Structure

```
fyp-fe/
├── app/
│   ├── favicon.ico
│   ├── globals.css       # Global styles and dark mode transitions
│   ├── layout.js         # Root layout with metadata
│   └── page.js           # Landing page component
├── public/               # Static assets
├── package.json
└── README.md
```

## 🌙 Dark Mode

The application includes a fully functional dark mode toggle:
- Click the moon/sun icon in the top-right corner to switch themes
- Theme preference is saved to localStorage
- Smooth transitions between light and dark modes
- Dark mode uses a navy blue background (#0f1729) for better contrast

## 📱 Responsive Breakpoints

- **Mobile**: < 768px (single column layout)
- **Tablet**: 768px - 1024px (grid adjustments)
- **Desktop**: > 1024px (full two-column layout)

## 📄 Pages Implemented

### Authentication Pages:
1. **Intro/Landing Page** (`/`) - Choose employer or candidate
2. **Employer Login** (`/employer/login`) - Sign in for employers
3. **Candidate Login** (`/candidate/login`) - Sign in for candidates
4. **Employer Signup** (`/employer/signup`) - Register as employer (Company Name)
5. **Candidate Signup** (`/candidate/signup`) - Register as candidate (Full Name)

All authentication pages include:
- ✅ Google Sign In integration
- ✅ Light/Dark mode toggle
- ✅ Fully responsive design
- ✅ Form validation
- ✅ Password visibility toggle
- ✅ Consistent branding

## 🚧 Future Enhancements

- Backend authentication integration
- Employer dashboard
- Candidate profile management
- Resume upload and parsing
- Job posting functionality
- AI-powered matching algorithm integration

## 📝 License

This project is part of a Final Year Project (FYP) for academic purposes.

## 👥 SDG Alignment

This system aligns with **SDG 9: Industry, Innovation, and Infrastructure** by introducing innovation into recruitment practices and providing a scalable, intelligent solution with real-world applicability.
