# **App Name**: LendEase

## Core Features:

- Vault Dashboard: Display total balance, loans given, and interest earned from Firestore.
- User Registration: Collect user details (name, contact, ID) and capture face image. Store data in Firestore.
- Facial Verification: AI tool that checks if the provided ID matches the live picture from the user.
- Loan Application: Process loan applications, calculate interest, and deduct the value of the loan (without interest) from the vault. Store the result in Firestore.
- Transaction History: Log all loan transactions with user details and amounts in Firestore.
- Repayment Module: Process user repayments and update the vault balance. Update transaction history in Firestore.
- Admin Panel: Allow admins to manage users, view transactions, and update vault balance using Firestore.

## Style Guidelines:

- Primary color: Dark teal (#008080) to inspire trust and financial stability.
- Background color: Very light teal (#E0F8F8).
- Accent color: Blue-green (#00A3A3), for interactive elements.
- Headline font: 'Space Grotesk' sans-serif. Body font: 'Inter' sans-serif.
- Code font: 'Source Code Pro' for displaying code snippets.
- Consistent set of financial and user-related icons.
- Subtle transitions during loan application and repayment processes.