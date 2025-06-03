# PowerShell script to remove TypeScript files that have been converted to JavaScript

# Component files
Remove-Item -Path "src\components\InvestmentCopilot.tsx" -Force
Remove-Item -Path "src\components\LoadingAnimation.tsx" -Force
Remove-Item -Path "src\components\Navbar.tsx" -Force
Remove-Item -Path "src\components\OrderForm.tsx" -Force
Remove-Item -Path "src\components\ShariahComplianceVerification.tsx" -Force
Remove-Item -Path "src\components\StockCard.tsx" -Force
Remove-Item -Path "src\components\StockTransactionDialog.tsx" -Force
Remove-Item -Path "src\components\ZakatCalculator.tsx" -Force

# Blockchain component files
Remove-Item -Path "src\components\blockchain\ShariahComplianceVerifier.tsx" -Force
Remove-Item -Path "src\components\blockchain\TransactionHistory.tsx" -Force

# Main entry point
Remove-Item -Path "src\main.tsx" -Force

# Blockchain-related files
Remove-Item -Path "src\blockchain\contracts\CommunityPortfolioABI.ts" -Force
Remove-Item -Path "src\blockchain\contracts\ScholarVerificationABI.ts" -Force
Remove-Item -Path "src\blockchain\interfaces\contracts.ts" -Force
Remove-Item -Path "src\blockchain\services\CommunityPortfolioService.ts" -Force
Remove-Item -Path "src\blockchain\services\ScholarVerificationService.ts" -Force
Remove-Item -Path "src\blockchain\services\SmartContractService.ts" -Force

# API services
Remove-Item -Path "src\services\stockApi.ts" -Force
Remove-Item -Path "src\services\zoyaApi.ts" -Force

# Type definitions
Remove-Item -Path "src\types\ethereum.d.ts" -Force
Remove-Item -Path "src\vite-env.d.ts" -Force

# Utility files
Remove-Item -Path "src\lib\utils.ts" -Force
Remove-Item -Path "src\utils\impactCalculator.ts" -Force
Remove-Item -Path "src\data\sampleImpactData.ts" -Force

# Hooks
Remove-Item -Path "src\hooks\use-toast.ts" -Force
Remove-Item -Path "src\hooks\usePortfolio.ts" -Force
Remove-Item -Path "src\components\ui\use-toast.ts" -Force

Write-Host "All TypeScript files have been removed successfully."
