# 🎬 InternAI Splash Screen Setup Guide

## How to Add Your Intro Video

### Step 1: Get Your Video Ready

**Recommended Video Specs:**
- **Duration:** 5-15 seconds (short and impactful)
- **Format:** MP4 (best compatibility) or WebM
- **Resolution:** 1920x1080 (Full HD) or 1280x720 (HD)
- **Size:** Under 5MB for fast loading

**Convert your video online (if needed):**
- https://cloudconvert.com/video-converter
- https://www.online-convert.com/

### Step 2: Add Video to Your Project

1. **Create a video folder:**
   ```
   lucid-onboarding-glow-90-main/
   └── public/
       └── intro-video.mp4  ← Put your video here
   ```

2. **Or use any path you want:**
   - Just update the path in `splash.html` (line 109-112)

### Step 3: Update Video Path in splash.html

Open `splash.html` and find this section (around line 109):

```html
<video id="intro-video" preload="auto" muted playsinline>
    <!-- Replace these paths with your video location -->
    <source src="./public/intro-video.mp4" type="video/mp4">
    <source src="./public/intro-video.webm" type="video/webm">
</video>
```

**Examples:**
```html
<!-- If video is in public folder -->
<source src="./public/my-video.mp4" type="video/mp4">

<!-- If video is in root -->
<source src="./intro.mp4" type="video/mp4">

<!-- If video is in a videos folder -->
<source src="./videos/intro.mp4" type="video/mp4">

<!-- External URL (not recommended for intro) -->
<source src="https://example.com/video.mp4" type="video/mp4">
```

### Step 4: Set splash.html as Your Entry Point

**Option A: Rename Files**
```
1. Rename current index.html → home.html
2. Rename splash.html → index.html
3. Update HOMEPAGE_URL in splash.html (line 135):
   const HOMEPAGE_URL = './home.html';
```

**Option B: Redirect from index.html**
Add this to the top of your current `index.html`:
```html
<script>
    // Redirect to splash screen on first visit
    if (!sessionStorage.getItem('visited')) {
        sessionStorage.setItem('visited', 'true');
        window.location.href = './splash.html';
    }
</script>
```

**Option C: Keep as separate entry (for testing)**
- Just open `splash.html` directly in browser
- It will redirect to `index.html` after video

### Step 5: Test It!

1. **Clear localStorage (to see intro again):**
   - Browser console (F12) → Console tab
   - Type: `localStorage.removeItem('internai_intro_seen')`
   - Press Enter

2. **Open splash.html in browser**

3. **Features to test:**
   - ✅ Video plays automatically
   - ✅ Skip button (top right)
   - ✅ Progress bar (bottom)
   - ✅ Press 'S' or 'Esc' to skip
   - ✅ After video ends → redirects to homepage
   - ✅ Second visit → skips intro directly

## Features Included

✨ **Auto-play video with mute** (bypasses browser restrictions)  
✨ **Skip button** (top-right corner)  
✨ **Progress bar** (bottom)  
✨ **Keyboard shortcuts** (S or Esc to skip)  
✨ **Remember user** (shows intro only once using localStorage)  
✨ **Loading spinner** (while video loads)  
✨ **Fade-out animation** (smooth transition)  
✨ **Mobile responsive**  
✨ **Fallback** (redirects if video fails to load)  

## Customization

### Change Video Duration Auto-Redirect:
```javascript
// In splash.html, line 136
const AUTO_REDIRECT_DELAY = 500; // Change to 1000 for 1 second
```

### Show Intro Every Time (Don't Remember):
```javascript
// In splash.html, comment out lines 146 and 237:
// localStorage.setItem('internai_intro_seen', 'true');
```

### Change Skip Button Text:
```html
<!-- In splash.html, line 121 -->
<button class="skip-button" id="skipButton">
    Skip →  <!-- Change this text -->
</button>
```

### Change Homepage URL:
```javascript
// In splash.html, line 135
const HOMEPAGE_URL = './index.html'; // Change to your page
```

## Troubleshooting

**Problem: Video not playing**
- Check video path is correct
- Check video format (use MP4)
- Try converting video to lower quality/size
- Check browser console (F12) for errors

**Problem: Autoplay blocked**
- Video is muted (required for autoplay)
- A "Play" button will appear if autoplay fails
- This is normal browser behavior

**Problem: Video too large/slow**
- Compress video: https://www.freeconvert.com/video-compressor
- Use 720p instead of 1080p
- Reduce video duration

**Problem: Intro shows every time**
- Check localStorage is enabled in browser
- Check line 146 is not commented out

## Quick Video Sources

**Free Stock Videos:**
- https://www.pexels.com/videos/
- https://pixabay.com/videos/
- https://coverr.co/

**Create Custom Intro:**
- https://www.canva.com/ (with Pro account)
- https://www.renderforest.com/
- Adobe After Effects / Premiere Pro

## Need Help?

Contact developer or check browser console (F12) for error messages.

---

**Ready to launch! 🚀**
