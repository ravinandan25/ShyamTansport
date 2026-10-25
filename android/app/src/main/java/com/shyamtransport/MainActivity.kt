package com.shyamtransport

import android.os.Build
import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "ShyamTransport"

  override fun onCreate(savedInstanceState: Bundle?) {
    // null instead of savedInstanceState: react-native-screens can't restore its fragments.
    super.onCreate(null)
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
      // The window background already shows the same splash, so skip the system
      // fade-out (it made the truck flicker) and hand over instantly.
      splashScreen.setOnExitAnimationListener { it.remove() }
    }
  }

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
