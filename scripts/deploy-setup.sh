#!/bin/bash
# Bash Deployment Automation Script (Linux/Mac/Git Bash)
# Description: Automates Git setup, remote configuration, and push to GitHub
# Author: Deployment Automation
# Version: 1.0.0
# Make executable with: chmod +x scripts/deploy-setup.sh

set -e  # Exit on error

# Configuration
REPO_URL="https://github.com/Hashem63YT/salawat-campaign-v2.git"
COMMIT_MESSAGE="Pre-deploy fixes: Supabase + UI + lint"
BRANCH_NAME="main"

# ANSI color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
CYAN='\033[0;36m'
RESET='\033[0m'

# Color output functions
print_success() {
    echo -e "${GREEN}$1${RESET}"
}

print_error() {
    echo -e "${RED}$1${RESET}"
}

print_info() {
    echo -e "${CYAN}$1${RESET}"
}

# Error trap
trap 'print_error "Deployment failed at line $LINENO. Check the error above."; exit 1' ERR

# Check if Git is installed
check_git_installed() {
    print_info "=== Pre-Flight Checks ==="
    if command -v git &> /dev/null; then
        GIT_VERSION=$(git --version)
        print_success "Git is installed: $GIT_VERSION"
    else
        print_error "Git is not installed. Please install Git first:"
        print_error "  - Linux: sudo apt-get install git (Ubuntu/Debian) or sudo yum install git (RHEL/CentOS)"
        print_error "  - Mac: brew install git or download from https://git-scm.com/download/mac"
        exit 1
    fi
}

# Initialize Git if needed
init_git_if_needed() {
    if [ -d ".git" ]; then
        print_info "Git already initialized, skipping"
    else
        print_info "Initializing Git repository..."
        git init
        print_success "Initialized Git repository"
    fi
}

# Configure remote
configure_remote() {
    print_info "=== Remote Configuration ==="
    
    if git remote get-url origin &> /dev/null; then
        EXISTING_URL=$(git remote get-url origin)
        if [ "$EXISTING_URL" = "$REPO_URL" ]; then
            print_info "Remote 'origin' already configured correctly"
        else
            print_info "Updating remote URL to match expected repository"
            git remote set-url origin "$REPO_URL"
            print_success "Updated remote URL"
        fi
    else
        print_info "Adding remote 'origin'..."
        git remote add origin "$REPO_URL"
        print_success "Added remote 'origin'"
    fi
    
    print_info "Verifying remote configuration:"
    git remote -v
}

# Sync with remote
sync_with_remote() {
    print_info "=== Syncing with Remote ==="
    
    # Attempt to fetch (suppress errors if branch doesn't exist)
    if git fetch origin "$BRANCH_NAME" &> /dev/null; then
        print_info "Remote branch '$BRANCH_NAME' exists, pulling changes..."
        if ! git pull origin "$BRANCH_NAME" --allow-unrelated-histories --no-edit &> /dev/null; then
            print_error "Merge conflict detected or pull failed!"
            print_error "Please resolve conflicts manually and run the script again."
            print_info "To resolve conflicts:"
            print_info "  1. Check git status: git status"
            print_info "  2. Resolve conflicts in the files marked"
            print_info "  3. Stage resolved files: git add ."
            print_info "  4. Complete merge: git commit"
            exit 1
        fi
        print_success "Successfully pulled from remote"
    else
        print_info "New repository, skipping pull"
    fi
}

# Stage and commit
stage_and_commit() {
    print_info "=== Staging & Committing ==="
    
    print_info "Staging all changes..."
    git add .
    
    # Check if there are staged changes
    if ! git diff --cached --quiet; then
        print_info "Committing changes..."
        git commit -m "$COMMIT_MESSAGE"
        print_success "Committed changes: $COMMIT_MESSAGE"
    else
        print_info "No changes to commit, skipping"
    fi
}

# Push to GitHub
push_to_github() {
    print_info "=== Pushing to GitHub ==="
    
    print_info "Ensuring branch is named '$BRANCH_NAME'..."
    git branch -M "$BRANCH_NAME"
    
    print_info "Pushing to GitHub..."
    if ! git push -u origin "$BRANCH_NAME"; then
        print_error "Failed to push to GitHub"
        print_error "Troubleshooting steps:"
        print_error "  1. Verify GitHub credentials (SSH key or personal access token)"
        print_error "  2. Check network connection"
        print_error "  3. Ensure repository exists and you have push access"
        print_error "  4. Try: git push -u origin $BRANCH_NAME --force (if you're sure)"
        exit 1
    fi
    print_success "Successfully pushed to GitHub"
}

# Main execution
main() {
    check_git_installed
    init_git_if_needed
    configure_remote
    sync_with_remote
    stage_and_commit
    push_to_github
    
    # Success summary
    print_success "=========================================="
    print_success "✅ Deployment to GitHub successful!"
    print_success "=========================================="
    print_info "Repository: $REPO_URL"
    print_info "Branch: $BRANCH_NAME"
    echo ""
    print_info "Next steps:"
    print_info "  1. Run Vercel deployment (see '.admin/VERCEL_DEPLOY.md')"
    print_info "  2. Set environment variables in Vercel Dashboard"
    print_info "  3. Deploy to production: vercel --prod"
    print_success "=========================================="
}

# Run main function
main

