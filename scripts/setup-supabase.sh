#!/bin/bash

# Supabase CLI Setup Script
# This script helps you set up Supabase CLI and run migrations

set -e

echo "🚀 Supabase CLI Setup"
echo "======================"
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Installing..."
    npm install -g supabase
    echo "✅ Supabase CLI installed!"
else
    echo "✅ Supabase CLI is already installed"
    supabase --version
fi

echo ""
echo "📋 Next steps:"
echo ""
echo "1. Login to Supabase:"
echo "   npm run supabase:login"
echo ""
echo "2. Link your project (replace YOUR_PROJECT_REF with your actual project ref):"
echo "   npm run supabase:link YOUR_PROJECT_REF"
echo ""
echo "   Or manually:"
echo "   supabase link --project-ref YOUR_PROJECT_REF"
echo ""
echo "3. Run migrations:"
echo "   npm run supabase:migrate"
echo ""
echo "   Or manually:"
echo "   supabase db push"
echo ""
echo "📖 For detailed instructions, see SUPABASE_CLI_SETUP.md"
