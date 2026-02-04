# Development Tips - Faster Hot Reload

## Quick Fixes for Seeing Changes

### 1. **Fast Refresh (Default)**
Fast Refresh should work automatically. If it's not working:
- Shake your device/emulator and tap "Reload"
- Or press `r` in the Metro terminal

### 2. **Clear Metro Cache**
When changes aren't showing up:
```bash
# Stop the server (Ctrl+C), then:
npx expo start --clear
```

### 3. **Full Cache Clear (If Fast Refresh Fails)**
```bash
# Stop server, then:
rm -rf node_modules/.cache .expo
npx expo start --clear
```

### 4. **Reload Without Uninstalling**
Instead of uninstalling the app:
- **iOS Simulator**: Press `Cmd + R` or shake device → "Reload"
- **Android Emulator**: Press `R` twice or shake device → "Reload"
- **Physical Device**: Shake device → "Reload"

### 5. **When You MUST Rebuild**
Only rebuild when:
- Native dependencies change (like adding new Expo modules)
- `app.json` changes (plugins, permissions, etc.)
- Native code changes

For JavaScript/TypeScript changes, Fast Refresh should work!

## Troubleshooting

### Fast Refresh Not Working?
1. Check for syntax errors (they break Fast Refresh)
2. Make sure you're not using `console.log` in module scope
3. Check that your component exports are correct
4. Try the reload methods above

### Still Having Issues?
```bash
# Nuclear option - full clean:
rm -rf node_modules .expo node_modules/.cache
npm install
npx expo start --clear
```

Then rebuild native app if needed:
- iOS: `npx expo run:ios`
- Android: `npx expo run:android`

## NativeWind Specific

If NativeWind styles aren't updating:
1. Make sure you're using Tailwind classes correctly
2. Clear Metro cache: `npx expo start --clear`
3. Check that `global.css` is imported in `app/_layout.tsx`
