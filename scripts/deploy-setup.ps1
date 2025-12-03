# PowerShell Deployment Automation Script (Windows)
# Description: Automates Git setup, remote configuration, and push to GitHub
# Author: Deployment Automation
# Version: 1.0.0

# Configuration
$REPO_URL = "https://github.com/Hashem63YT/salawat-campaign-v2.git"
$COMMIT_MESSAGE = "Pre-deploy fixes: Supabase + UI + lint"
$BRANCH_NAME = "main"

# Color output functions
function Write-Success {
    param([string]$Message)
    Write-Host $Message -ForegroundColor Green
}

function Write-Error {
    param([string]$Message)
    Write-Host $Message -ForegroundColor Red
}

function Write-Info {
    param([string]$Message)
    Write-Host $Message -ForegroundColor Cyan
}

# Pre-Flight Checks
Write-Info "=== Pre-Flight Checks ==="

# Check if Git is installed
try {
    $gitVersion = git --version 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Git is not installed. Please install Git first: https://git-scm.com/download/win"
        exit 1
    }
    Write-Success "Git is installed: $gitVersion"
} catch {
    Write-Error "Failed to check Git installation: $_"
    exit 1
}

# Check if .git folder exists
if (Test-Path ".git") {
    Write-Info "Git already initialized, skipping"
} else {
    Write-Info "Initializing Git repository..."
    try {
        git init
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Failed to initialize Git repository"
            exit 1
        }
        Write-Success "Initialized Git repository"
    } catch {
        Write-Error "Error initializing Git: $_"
        exit 1
    }
}

# Remote Configuration
Write-Info "=== Remote Configuration ==="

try {
    $existingRemote = git remote get-url origin 2>&1
    if ($LASTEXITCODE -eq 0) {
        if ($existingRemote -eq $REPO_URL) {
            Write-Info "Remote 'origin' already configured correctly"
        } else {
            Write-Info "Updating remote URL to match expected repository"
            git remote set-url origin $REPO_URL
            if ($LASTEXITCODE -ne 0) {
                Write-Error "Failed to update remote URL"
                exit 1
            }
            Write-Success "Updated remote URL"
        }
    } else {
        Write-Info "Adding remote 'origin'..."
        git remote add origin $REPO_URL
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Failed to add remote 'origin'"
            exit 1
        }
        Write-Success "Added remote 'origin'"
    }
} catch {
    Write-Error "Error configuring remote: $_"
    exit 1
}

# Verify remote
Write-Info "Verifying remote configuration:"
git remote -v
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to verify remote configuration"
    exit 1
}

# Sync with Remote (Conditional)
Write-Info "=== Syncing with Remote ==="

try {
    # Attempt to fetch (suppress errors if branch doesn't exist)
    $fetchOutput = git fetch origin $BRANCH_NAME 2>&1
    $fetchSuccess = $LASTEXITCODE -eq 0
    
    if ($fetchSuccess) {
        Write-Info "Remote branch '$BRANCH_NAME' exists, pulling changes..."
        git pull origin $BRANCH_NAME --allow-unrelated-histories --no-edit 2>&1 | Out-Null
        
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Merge conflict detected or pull failed!"
            Write-Error "Please resolve conflicts manually and run the script again."
            Write-Info "To resolve conflicts:"
            Write-Info "  1. Check git status: git status"
            Write-Info "  2. Resolve conflicts in the files marked"
            Write-Info "  3. Stage resolved files: git add ."
            Write-Info "  4. Complete merge: git commit"
            exit 1
        }
        Write-Success "Successfully pulled from remote"
    } else {
        Write-Info "New repository, skipping pull"
    }
} catch {
    Write-Info "New repository or remote branch doesn't exist yet, continuing..."
}

# Stage & Commit
Write-Info "=== Staging & Committing ==="

try {
    Write-Info "Staging all changes..."
    git add .
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to stage changes"
        exit 1
    }
    
    # Check if there are staged changes
    $stagedChanges = git diff --cached --quiet 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Info "Committing changes..."
        git commit -m $COMMIT_MESSAGE
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Failed to commit changes"
            exit 1
        }
        Write-Success "Committed changes: $COMMIT_MESSAGE"
    } else {
        Write-Info "No changes to commit, skipping"
    }
} catch {
    Write-Error "Error during stage/commit: $_"
    exit 1
}

# Push to GitHub
Write-Info "=== Pushing to GitHub ==="

try {
    Write-Info "Ensuring branch is named '$BRANCH_NAME'..."
    git branch -M $BRANCH_NAME
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to rename branch"
        exit 1
    }
    
    Write-Info "Pushing to GitHub..."
    git push -u origin $BRANCH_NAME
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to push to GitHub"
        Write-Error "Troubleshooting steps:"
        Write-Error "  1. Verify GitHub credentials (SSH key or personal access token)"
        Write-Error "  2. Check network connection"
        Write-Error "  3. Ensure repository exists and you have push access"
        Write-Error "  4. Try: git push -u origin $BRANCH_NAME --force (if you're sure)"
        exit 1
    }
    Write-Success "Successfully pushed to GitHub"
} catch {
    Write-Error "Error during push: $_"
    Write-Error "Please check your Git credentials and network connection"
    exit 1
}

# Success Summary
Write-Success "=========================================="
Write-Success "✅ Deployment to GitHub successful!"
Write-Success "=========================================="
Write-Info "Repository: $REPO_URL"
Write-Info "Branch: $BRANCH_NAME"
Write-Info ""
Write-Info "Next steps:"
Write-Info "  1. Run Vercel deployment (see '.admin/VERCEL_DEPLOY.md')"
Write-Info "  2. Set environment variables in Vercel Dashboard"
Write-Info "  3. Deploy to production: vercel --prod"
Write-Success "=========================================="

