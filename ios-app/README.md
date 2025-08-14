# iOS App for Sideloading

This directory contains instructions for creating an iOS app that can be sideloaded onto your iPad.

## Option 1: Web View App (Easiest)

Create a simple iOS app that just loads your web app in a WKWebView.

### Requirements
- Xcode (free with Apple ID)
- iOS device for testing
- Apple Developer account ($99/year for App Store, free for sideloading)

### Steps

1. **Create New Xcode Project**:
   - Open Xcode
   - Create new iOS App
   - Name: "Study Hub"
   - Bundle ID: `com.yourname.studyhub`
   - Language: Swift
   - Interface: Storyboard

2. **Add WKWebView**:
   - Add a WKWebView to your main view controller
   - Load your web app URL

3. **Configure Info.plist**:
   - Add network permissions
   - Set app name and description

### Sample Code

```swift
import UIKit
import WebKit

class ViewController: UIViewController, WKNavigationDelegate {
    @IBOutlet weak var webView: WKWebView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        webView.navigationDelegate = self
        
        // Load your web app
        if let url = URL(string: "https://yourdomain.com") {
            let request = URLRequest(url: url)
            webView.load(request)
        }
    }
}
```

## Option 2: AltStore Sideloading

Use AltStore to sideload apps without a developer account.

### Steps

1. **Install AltStore**:
   - Download AltServer on your computer
   - Install AltStore on your iPad via iTunes

2. **Create IPA File**:
   - Build your app in Xcode
   - Export as IPA file

3. **Sideload**:
   - Use AltStore to install the IPA
   - Refresh every 7 days (free account limitation)

## Option 3: TestFlight (If you have developer account)

1. Upload your app to App Store Connect
2. Add it to TestFlight
3. Install via TestFlight app

## Recommended Approach

For your use case, I recommend sticking with the **PWA (web app)** approach because:

1. **No sideloading needed** - Just bookmark in Safari
2. **No 7-day refresh limit** - Works indefinitely
3. **Easier updates** - Just update the web version
4. **Cross-platform** - Works on any device
5. **No developer account needed** - Completely free

## PWA Installation on iPad

1. Open Safari
2. Go to your web app URL
3. Tap Share button
4. Select "Add to Home Screen"
5. The app appears like a native app

This gives you 90% of the native app experience without any of the complexity or limitations of sideloading.

## If You Still Want Native iOS App

The web view approach is simplest:

1. Create new Xcode project
2. Add WKWebView that loads your web app
3. Build and run on your device
4. The app will work for 7 days, then need refreshing

But honestly, the PWA approach is much better for your needs!