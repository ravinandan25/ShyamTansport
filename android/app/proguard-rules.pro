# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# react-native-config reads values from BuildConfig by reflection.
-keep class com.shyamtransport.BuildConfig { *; }

# react-native-html-to-pdf -> pdfbox-android: optional JPEG 2000 decoder, not bundled
# (only needed for JPX images, which our PDFs don't contain).
-dontwarn com.gemalto.jp2.JP2Decoder
