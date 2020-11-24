package com.fiction;

<<<<<<< HEAD
=======
import android.content.Intent;
import android.content.res.Configuration;
>>>>>>> 58a1f02... 代码提交
import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "fiction";
  }
<<<<<<< HEAD
=======

  @Override
  public void onConfigurationChanged(Configuration newConfig) {
    super.onConfigurationChanged(newConfig);
    Intent intent = new Intent("onConfigurationChanged");
    intent.putExtra("newConfig", newConfig);
    this.sendBroadcast(intent);
  }
>>>>>>> 58a1f02... 代码提交
}
