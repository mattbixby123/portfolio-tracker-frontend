# Investment Portfolio Tracker - Remix Frontend

- 📖 [Remix docs](https://remix.run/docs)
- 🏦 Full-stack investment portfolio management system
- 🔐 JWT authentication with secure session management
- 📊 Real-time portfolio analytics and performance tracking

## Project Overview

This Remix frontend connects to a Java Spring Boot backend to provide a complete investment portfolio tracking solution. Features include user authentication, stock trading, portfolio analytics, and performance visualization.

## Development

### Prerequisites
- Node.js 18+ 
- Java Spring Boot backend running on port 8080
- Environment variables configured (see setup below)

### Initial Setup

1. **Install dependencies:**
```shellscript
npm install
npm install axios @types/node
```

2. **Configure environment variables:**
Create a `.env` file in the root directory:
```bash
SESSION_SECRET=your-super-secret-session-key-here-make-it-long-and-random
API_BASE_URL=http://localhost:8080
NODE_ENV=development
```

3. **Configure Java Backend CORS:**
Add this configuration to your Spring Boot application to allow frontend requests:
```java
@Configuration
public class CorsConfig {
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
        return source;
    }
}
```

### Run the dev server:

```shellscript
npm run dev
```

The application will be available at `http://localhost:3000`

## Key Features

### 🔐 Authentication System
- User registration and login with JWT tokens
- Secure session management with HTTP-only cookies
- Role-based access control (USER/ADMIN)
- Automatic token refresh and logout handling

### 📊 Portfolio Management
- Real-time portfolio dashboard with key metrics
- Position tracking with profit/loss calculations
- Sector allocation visualization
- Top holdings display with performance indicators

### 💹 Stock Trading
- Buy/sell stock forms with real-time validation
- Stock search and discovery functionality
- Transaction history with filtering and pagination
- Individual stock detail pages with price history

### 📈 Performance Analytics
- Comprehensive performance metrics and charts
- Monthly transaction summaries
- Unrealized vs realized gains tracking
- Fee tracking and cost basis calculations

## Architecture

### Type Safety
- TypeScript interfaces that mirror Java DTOs exactly
- Full type safety from backend to frontend
- Compile-time error checking for API contracts

### API Integration
- Service layer that matches Java Spring Boot controllers
- Automatic JWT token injection for authenticated requests
- Comprehensive error handling with user-friendly messages

### Modern React Patterns
- Server-side rendering with Remix loaders
- Progressive enhancement with Remix actions
- Optimistic UI updates for better UX

## Project Structure

```
app/
├── types/           # TypeScript interfaces matching Java DTOs
│   ├── auth.ts      # Authentication types
│   ├── stock.ts     # Stock data types  
│   ├── position.ts  # Portfolio position types
│   ├── transaction.ts # Transaction types
│   └── user.ts      # User management types
├── services/        # API client services
│   ├── api.ts       # Base API service with auth handling
│   ├── auth.service.ts     # Authentication endpoints
│   ├── stock.service.ts    # Stock data and search
│   ├── portfolio.service.ts # Portfolio analytics
│   ├── position.service.ts  # Position management
│   ├── transaction.service.ts # Trading operations
│   └── user.service.ts     # User profile management
├── utils/          # Server utilities
│   ├── auth.server.ts    # Authentication helpers
│   └── session.server.ts # Session management
├── components/     # Reusable UI components
│   ├── Layout.tsx        # Main application layout
│   ├── PositionCard.tsx  # Portfolio position display
│   ├── StockCard.tsx     # Stock information display
│   ├── TransactionForm.tsx # Buy/sell form component
│   └── PerformanceChart.tsx # Data visualization
└── routes/         # Remix file-based routing
    ├── _index.tsx  # Landing page
    ├── login.tsx   # User authentication
    ├── register.tsx # User registration
    ├── dashboard.tsx # Main portfolio dashboard
    ├── logout.tsx  # Session cleanup
    ├── portfolio/  # Portfolio management routes
    │   ├── _index.tsx     # Portfolio overview
    │   ├── positions.tsx  # All positions view
    │   └── performance.tsx # Detailed analytics
    ├── stocks/     # Stock browsing and search
    │   ├── _index.tsx # Stock search and listing
    │   └── $id.tsx   # Individual stock details
    └── transactions/ # Trading functionality
        ├── _index.tsx # Transaction history
        ├── buy.tsx   # Buy stock form
        └── sell.tsx  # Sell stock form
```

## Deployment

### Production Build

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

### Environment Variables for Production

```bash
SESSION_SECRET=your-production-secret-key-very-long-and-random
API_BASE_URL=https://your-backend-domain.com
NODE_ENV=production
```

### Deployment Targets

The built-in Remix app server is production-ready. Make sure to deploy:

- `build/server`
- `build/client`

### Popular Hosting Options
- **Vercel**: Zero-config deployment with automatic HTTPS
- **Netlify**: JAMstack hosting with serverless functions
- **Railway**: Full-stack deployment with database hosting
- **Fly.io**: Global edge deployment
- **AWS/Azure/GCP**: Enterprise cloud deployment

## Styling

This template uses [Tailwind CSS](https://tailwindcss.com/) for styling with a professional financial application theme. The design system includes:

- Responsive layouts that work on desktop, tablet, and mobile
- Consistent color scheme optimized for financial data
- Accessible form components with proper validation states
- Interactive charts and data visualizations
- Professional typography hierarchy

You can customize the design by modifying the Tailwind configuration or switching to your preferred CSS framework. See the [Vite docs on CSS](https://vitejs.dev/guide/features.html#css) for more information.

## API Integration Notes

### Backend Requirements
Your Java Spring Boot backend should be running and accessible. The frontend expects these API endpoints to be available:

- `POST /api/v1/auth/login` - User authentication
- `POST /api/v1/auth/register` - User registration  
- `GET /api/v1/portfolio/summary` - Portfolio dashboard data
- `GET /api/v1/positions` - User positions
- `GET /api/v1/stocks` - Stock search and data
- `POST /api/v1/transactions/buy` - Buy stock transactions
- `POST /api/v1/transactions/sell` - Sell stock transactions

### Error Handling
The frontend includes comprehensive error handling for:
- Network connectivity issues
- Authentication failures (automatic redirect to login)
- Validation errors (displayed inline on forms)
- Server errors (user-friendly error messages)

## TypeScript Integration

### Type Safety Features
- All Java DTOs are mirrored as TypeScript interfaces
- Compile-time validation of API requests/responses
- IntelliSense support for all data structures
- Automatic error detection when backend changes

### Key Type Files
- `types/auth.ts` - Authentication and user management
- `types/stock.ts` - Stock data and market information
- `types/position.ts` - Portfolio positions and holdings
- `types/transaction.ts` - Trading and transaction data
- `types/user.ts` - User profiles and preferences

## Development Workflow

### Starting Development
1. Start your Java Spring Boot backend on port 8080
2. Run `npm run dev` to start the Remix development server
3. Visit `http://localhost:3000` to access the application
4. Changes to frontend code will hot-reload automatically

### Common Development Tasks
- **Adding new API endpoints**: Update corresponding service files and types
- **Creating new pages**: Add files to the `app/routes/` directory
- **Building components**: Create reusable components in `app/components/`
- **Updating styles**: Modify Tailwind classes or add custom CSS

## Troubleshooting

### Common Issues

**CORS errors:**
- Ensure your Java backend has CORS configured for `http://localhost:3000`
- Check that the `API_BASE_URL` environment variable is correct

**Authentication failures:**
- Verify JWT token handling in the backend
- Check that session secrets are properly configured
- Ensure cookies are being set with the correct domain

**TypeScript errors:**
- Verify that your type definitions match the Java DTOs
- Run `npm run typecheck` to identify type issues
- Update interfaces when backend models change

**Build errors:**
- Clear node_modules and reinstall dependencies
- Check for conflicting package versions
- Ensure all environment variables are set

## Contributing

1. Follow the existing TypeScript patterns
2. Maintain type safety between frontend and backend
3. Add proper error handling for new features
4. Update types when backend DTOs change
5. Test authentication flows thoroughly
6. Write responsive components that work on all devices
7. Follow Remix conventions for loaders and actions

## Support

For issues related to:
- **Remix framework**: Check [Remix documentation](https://remix.run/docs)
- **TypeScript integration**: Verify your type definitions match the Java backend
- **API connectivity**: Ensure CORS is configured and backend is accessible
- **Authentication**: Check JWT token handling and session management
- **Styling**: Reference [Tailwind CSS documentation](https://tailwindcss.com/docs)

## License

This project is part of an investment portfolio tracking system. Please ensure compliance with financial data handling regulations in your jurisdiction.