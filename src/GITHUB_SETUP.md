# 🚀 GitHub Setup Guide

Complete instructions for uploading AgriVerse to GitHub.

## Prerequisites

- A GitHub account (create one at https://github.com)
- Git installed on your computer
- Command line/terminal access

## Step-by-Step Instructions

### Option 1: Using GitHub Desktop (Easiest)

1. **Download GitHub Desktop**
   - Visit https://desktop.github.com
   - Download and install for your OS

2. **Create Repository**
   - Open GitHub Desktop
   - Click "File" → "New Repository"
   - Name: `agriverse-climate-game`
   - Description: "3D farming exploration game with NASA climate data"
   - Choose local path (your project folder)
   - Click "Create Repository"

3. **Add Files**
   - GitHub Desktop will automatically detect all files
   - Review the changes in the left panel
   - All files should appear

4. **Make Initial Commit**
   - In the bottom left, enter commit message: "Initial commit - AgriVerse game"
   - Click "Commit to main"

5. **Publish to GitHub**
   - Click "Publish repository" button at top
   - Choose: Public or Private
   - Uncheck "Keep this code private" if you want it public
   - Click "Publish repository"

6. **Done!** Your project is now on GitHub at:
   `https://github.com/yourusername/agriverse-climate-game`

---

### Option 2: Using Command Line

1. **Initialize Git Repository**

```bash
# Navigate to your project folder
cd /path/to/agriverse

# Initialize git
git init

# Add all files
git add .

# Make initial commit
git commit -m "Initial commit - AgriVerse climate farming game"
```

2. **Create GitHub Repository**
   - Go to https://github.com/new
   - Repository name: `agriverse-climate-game`
   - Description: "3D farming exploration game with NASA climate data and AI mentors"
   - Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (you already have these)
   - Click "Create repository"

3. **Link Local to GitHub**

```bash
# Add GitHub as remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/agriverse-climate-game.git

# Verify remote
git remote -v

# Push to GitHub
git branch -M main
git push -u origin main
```

4. **Done!** Visit your repository at:
   `https://github.com/YOUR_USERNAME/agriverse-climate-game`

---

### Option 3: Using Web Interface (Upload Files)

1. **Create Repository on GitHub**
   - Go to https://github.com/new
   - Name: `agriverse-climate-game`
   - Description: "3D farming game with NASA climate data"
   - Choose Public or Private
   - Click "Create repository"

2. **Upload Files**
   - Click "uploading an existing file" link
   - Drag all your project files/folders
   - Add commit message: "Initial commit"
   - Click "Commit changes"

**Note:** This method has upload size limits and is slower for large projects.

---

## After Upload

### 1. Verify Files

Check that these important files are present:
- ✅ README.md
- ✅ package.json
- ✅ .gitignore
- ✅ LICENSE
- ✅ CONTRIBUTING.md
- ✅ All component files
- ✅ All documentation files

### 2. Add Repository Topics

On your GitHub repo page:
- Click the gear icon next to "About"
- Add topics: `climate-change`, `nasa`, `farming-game`, `educational-game`, `react`, `typescript`, `ai-powered`
- Add website URL if deployed
- Click "Save changes"

### 3. Create Repository Description

Update the "About" section with:
```
🌱 AgriVerse: Climate farming game with real NASA data, AI mentors, and eco-sci-fi aesthetics. Learn sustainable farming while restoring planetary balance!
```

### 4. Enable GitHub Pages (Optional)

If you want to deploy for free:
- Go to Settings → Pages
- Source: Deploy from branch
- Branch: main, folder: /docs (or root)
- Save

Note: You may need to configure build settings for React apps.

---

## Repository Settings

### Recommended Settings

1. **General**
   - ✅ Features: Issues, Projects, Wiki (as needed)
   - ✅ Allow merge commits
   - ✅ Automatically delete head branches

2. **Branches**
   - Set `main` as default branch
   - Optional: Add branch protection rules

3. **Security**
   - Enable Dependabot alerts
   - Enable security updates

---

## Maintaining Your Repository

### Making Updates

```bash
# After making changes to your code
git add .
git commit -m "Describe your changes"
git push origin main
```

### Creating Releases

1. Go to Releases → "Create a new release"
2. Tag version: `v1.0.0`
3. Release title: "AgriVerse v1.0.0 - Initial Release"
4. Describe changes
5. Click "Publish release"

### Accepting Contributions

1. Enable Issues in repository settings
2. Review and merge Pull Requests
3. Respond to community feedback
4. Keep CONTRIBUTING.md updated

---

## Troubleshooting

### "Repository already exists"
- Choose a different name
- Or delete the existing repository first

### "Permission denied (publickey)"
- Set up SSH keys: https://docs.github.com/en/authentication/connecting-to-github-with-ssh
- Or use HTTPS instead: `https://github.com/username/repo.git`

### "Large files detected"
- Check .gitignore includes `node_modules/`
- Remove any accidentally added large files
- Use Git LFS for large assets if needed

### Files not uploading
- Check .gitignore isn't excluding needed files
- Verify file permissions
- Try smaller batches if uploading many files

---

## Best Practices

✅ **DO:**
- Write clear commit messages
- Update README for major changes
- Respond to issues promptly
- Keep documentation current
- Tag releases properly
- Use branches for features

❌ **DON'T:**
- Commit API keys or secrets
- Push node_modules folder
- Make large commits without description
- Ignore security alerts
- Delete .gitignore file

---

## Next Steps After Upload

1. **Share Your Repository**
   - Add link to your portfolio
   - Share on social media
   - Submit to NASA challenges
   - Post in relevant communities

2. **Set Up CI/CD (Optional)**
   - GitHub Actions for testing
   - Automated deployments
   - Code quality checks

3. **Monitor Activity**
   - Watch for issues
   - Review pull requests
   - Check star/fork counts
   - Respond to discussions

4. **Improve Documentation**
   - Add screenshots to README
   - Create video demos
   - Write tutorials
   - Add API documentation

---

## Support

- **GitHub Docs**: https://docs.github.com
- **GitHub Desktop Help**: https://docs.github.com/en/desktop
- **Git Documentation**: https://git-scm.com/doc

---

## Repository Visibility

### Public Repository
**Pros:**
- Free hosting
- Community contributions
- Portfolio showcase
- NASA challenge submission

**Cons:**
- Code is visible to everyone
- Need to monitor for spam

### Private Repository
**Pros:**
- Code stays private
- Control who can access
- Development privacy

**Cons:**
- Limited collaborators on free plan
- Can't showcase publicly
- May need paid plan for features

---

**You're ready to upload! Choose your preferred method above and get started! 🚀**

Questions? Check GitHub's documentation or open an issue in your repository.

---

**Good luck with your upload! 🌱**