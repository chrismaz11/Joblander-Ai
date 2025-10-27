# Job-Lander 🚀

> AI-Powered Resume Builder with Blockchain Verification

## 📜 License Notice

**🚨 IMPORTANT: This project is NOT open source for commercial use.**

- ✅ **Educational Use**: Feel free to study and learn from the code
- ✅ **Personal Projects**: Use for non-commercial personal projects  
- ✅ **Contributions**: Bug reports and improvements are welcome
- ❌ **Commercial Use**: Prohibited without explicit written permission
- ❌ **Competing Services**: Cannot create competing commercial services

**For commercial licensing, please contact the author.**

See [LICENSE](LICENSE) for full terms.


## ✨ Features

### 🤖 AI-Powered Content Generation
- Automatic resume parsing from PDF/DOCX files using Gemini AI
- Intelligent content enhancement and professional writing
- AI-generated cover letters tailored to specific jobs
- Smart job matching with AI-powered scoring

### 🎨 Professional Templates
- Multiple categories: Modern, Classic, Creative, Professional, Minimalist
- Real-time preview and customization
- One-click template application

### 🔐 Blockchain Verification
- Resume authenticity verification using blockchain technology
- Cryptographic hash storage on Polygon Mumbai testnet
- Tamper-proof credentials
- Shareable verification links

### 💼 Job Search Integration
- Live job search powered by JSearch API
- AI match scoring for job recommendations
- Filter by location and keywords
- Direct application links

### 🌓 Modern UI/UX
- Beautiful dark mode support
- Responsive design for all devices
- Smooth animations and transitions

## 🛠️ Technology Stack

### Frontend
- **React** with **Vite** for blazing-fast development
- **TypeScript** for type safety
- **TailwindCSS** for modern styling
- **Wouter** for routing
- **React Query** for data fetching
- **Shadcn UI** for beautiful components

### Backend
- **Node.js** with **Express**
- **Gemini AI** (Google) for content generation
- **ethers.js** for blockchain integration
- **Multer** for file uploads
- **pdf-parse** & **mammoth** for document parsing

### Blockchain
- **Polygon Mumbai Testnet** for verification
- **Solidity** smart contracts for hash storage
- **ethers.js** for Web3 interactions

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- API keys for:
  - Gemini AI
  - JSearch (RapidAPI)
  - Polygon Mumbai RPC (Alchemy/Infura)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd job-lander
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your API keys:
   - `GEMINI_API_KEY`: Get from https://aistudio.google.com/apikey
   - `WEB3_RPC_URL`: Get from https://www.alchemy.com/ or https://infura.io/
   - `JSEARCH_API_KEY`: Get from https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch
   - `SESSION_SECRET`: Any random string

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5000`

## 📁 Project Structure

```
job-lander/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── lib/           # Utilities and helpers
│   │   └── App.tsx        # Main app component
│   └── index.html
├── server/                # Backend Express application
│   ├── services/         # Business logic
│   │   ├── gemini.ts     # AI content generation
│   │   ├── blockchain.ts # Blockchain verification
│   │   └── jobs.ts       # Job search
│   ├── routes.ts         # API routes
│   └── storage.ts        # Data persistence
├── shared/               # Shared types and schemas
│   └── schema.ts         # TypeScript types and Zod schemas
├── .env.example          # Environment variables template
├── package.json
└── README.md
```

## 🔌 API Endpoints

### Resume Management
- `POST /api/parse-resume` - Parse resume from PDF/DOCX
- `POST /api/generate-resume` - Generate enhanced resume
- `GET /api/resumes` - Get all resumes
- `GET /api/resumes/:id` - Get single resume

### Cover Letters
- `POST /api/generate-coverletter` - Generate AI cover letter

### Blockchain Verification
- `POST /api/verify-on-chain` - Create blockchain verification
- `POST /api/verify-resume` - Check if resume is verified

### Job Search
- `GET /api/find-jobs?query=...&location=...` - Search jobs


## 🔐 Blockchain Smart Contract

The application uses a Solidity smart contract to store resume hashes on Polygon Mumbai testnet:

```solidity
// ResumeHashStorage.sol
// Stores cryptographic hashes of resumes for verification
// Each hash is timestamped and linked to the creator's address
```

### Deploying the Smart Contract

1. Install Hardhat (optional, for deployment):
   ```bash
   npm install --save-dev hardhat
   ```

2. Deploy to Polygon Mumbai:
   ```bash
   npx hardhat run scripts/deploy.js --network mumbai
   ```

3. Update `.env` with the contract address:
   ```
   HASH_STORAGE_CONTRACT=0x...
   ```

## 🌐 Deployment

### Deploy to Vercel

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Set environment variables in Vercel dashboard**

### Deploy to AWS

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy using AWS Elastic Beanstalk or EC2
3. Configure environment variables in AWS Console

## 🧪 Testing

Run tests (when implemented):
```bash
npm test
```

## 📝 Usage Guide

### Creating a Resume

1. **Navigate to "Create Resume"**
2. **Upload existing resume** (optional) - AI will parse it automatically
3. **Fill in personal information**
4. **Add work experience** - Use the "Add" button to include multiple positions
5. **Add education** - Include your academic background
6. **Add skills** - List your technical and soft skills
7. **Preview your resume** - See live updates
8. **Generate resume** - Click to create enhanced version with AI
9. **Download PDF** - Get your professional resume

### Verifying a Resume

1. **Go to "Verify" page**
2. **Upload your resume PDF**
3. **Click "Create New Verification"** - This stores a hash on the blockchain
4. **Save the transaction hash** - Use it to prove authenticity
5. **Share verification link** - Anyone can verify your resume's authenticity

### Searching for Jobs

1. **Navigate to "Find Jobs"**
2. **Enter job title or keywords**
3. **Optional: Add location**
4. **Click Search**
5. **View AI match scores** - See how well jobs match your profile
6. **Click "Apply Now"** - Opens job application page

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **Gemini AI** by Google for powerful content generation
- **Polygon** for blockchain infrastructure
- **Shadcn UI** for component library
- **JSearch API** for job listings

## 📧 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Email: support@job-lander.com

## 🗺️ Roadmap

- [ ] User authentication with Clerk/Firebase
- [ ] Resume history and management dashboard
- [ ] Advanced AI features (job description tailoring, skill gap analysis)
- [ ] Collaborative resume sharing
- [ ] Batch resume generation
- [ ] Analytics dashboard
- [ ] Mobile app (React Native)

---

Built with ❤️ for job seekers everywhere
