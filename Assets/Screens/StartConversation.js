/**
 * InputOutputScreen.js
 *
 * ─── INSTALL THESE 2 PACKAGES ─────────────────────────────────────────────────
 *
 *  npm install react-native-vision-camera
 *  npm install @react-native-voice/voice
 *
 * ─── ANDROID — add inside <manifest> in AndroidManifest.xml ──────────────────
 *
 *  <uses-permission android:name="android.permission.CAMERA" />
 *  <uses-permission android:name="android.permission.RECORD_AUDIO" />
 *  <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
 *
 * ─── iOS — add in Info.plist ──────────────────────────────────────────────────
 *
 *  <key>NSCameraUsageDescription</key>
 *  <string>We need camera access to record video</string>
 *  <key>NSMicrophoneUsageDescription</key>
 *  <string>We need microphone access to record audio</string>
 *
 * ─── BACKEND ──────────────────────────────────────────────────────────────────
 *  Change BACKEND_URL below to your real server URL.
 * ──────────────────────────────────────────────────────────────────────────────
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Platform,
  KeyboardAvoidingView,
  Animated,
  PermissionsAndroid,
} from 'react-native';

// npm install react-native-vision-camera
import { Camera, useCameraDevices } from 'react-native-vision-camera';

// npm install @react-native-voice/voice
import Voice from '@react-native-voice/voice';

// ── Change this to your real backend URL ──────────────────────────────────────
const BACKEND_URL = 'https://your-backend.com/api/process';

// ── Mode constants ────────────────────────────────────────────────────────────
const MODE = { CAMERA: 'camera', VOICE: 'voice', TEXT: 'text' };

// =============================================================================
export default function InputOutputScreen() {

  // ── Active tab ──────────────────────────────────────────────────────────────
  const [activeMode, setActiveMode] = useState(MODE.TEXT);

  // ── Camera ──────────────────────────────────────────────────────────────────
  const devices = useCameraDevices();
  const device = devices.back;
  const cameraRef = useRef(null);
  const [cameraPermission, setCameraPermission] = useState(false);
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const [videoUri, setVideoUri] = useState(null);

  // ── Voice ───────────────────────────────────────────────────────────────────
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [recordSecs, setRecordSecs] = useState(0);
  const timerRef = useRef(null);

  // ── Text ────────────────────────────────────────────────────────────────────
  const [textInput, setTextInput] = useState('');

  // ── Output ──────────────────────────────────────────────────────────────────
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // ─── Setup on mount ──────────────────────────────────────────────────────────
  useEffect(() => {
    requestPermissions();
    setupVoiceListeners();
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
      clearInterval(timerRef.current);
    };
  }, []);

  async function requestPermissions() {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]);
      const allGranted = Object.values(granted).every(
        (v) => v === PermissionsAndroid.RESULTS.GRANTED,
      );
      setCameraPermission(allGranted);
    } else {
      const camStatus = await Camera.requestCameraPermission();
      setCameraPermission(camStatus === 'authorized');
    }
  }

  function setupVoiceListeners() {
    Voice.onSpeechResults = (e) => {
      if (e.value && e.value.length > 0) {
        setVoiceText(e.value[0]);
      }
    };
    Voice.onSpeechError = (e) => {
      Alert.alert('Voice Error', JSON.stringify(e.error));
      setIsRecordingVoice(false);
      clearInterval(timerRef.current);
    };
    Voice.onSpeechEnd = () => {
      setIsRecordingVoice(false);
      clearInterval(timerRef.current);
    };
  }

  // ── Switch mode ───────────────────────────────────────────────────────────────
  function switchMode(mode) {
    if (isRecordingVideo || isRecordingVoice) return;
    setActiveMode(mode);
    setOutput(null);
    fadeAnim.setValue(0);
  }

  // ── Format seconds ────────────────────────────────────────────────────────────
  function formatTime(secs) {
    const m = String(Math.floor(secs / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return `${m}:${s}`;
  }

  // ── VIDEO recording ───────────────────────────────────────────────────────────
  async function toggleVideo() {
    if (!cameraPermission) {
      Alert.alert('Permission Denied', 'Please grant Camera & Microphone permission in device settings.');
      return;
    }
    if (!isRecordingVideo) {
      setVideoUri(null);
      setIsRecordingVideo(true);
      try {
        cameraRef.current.startRecording({
          flash: 'off',
          onRecordingFinished: (video) => {
            setVideoUri(video.path);
            setIsRecordingVideo(false);
          },
          onRecordingError: (error) => {
            Alert.alert('Recording Error', error.message);
            setIsRecordingVideo(false);
          },
        });
      } catch (e) {
        Alert.alert('Camera Error', e.message);
        setIsRecordingVideo(false);
      }
    } else {
      await cameraRef.current.stopRecording();
    }
  }

  // ── VOICE recording (Speech to Text) ─────────────────────────────────────────
  async function toggleVoice() {
    if (!isRecordingVoice) {
      setVoiceText('');
      setRecordSecs(0);
      try {
        await Voice.start('en-US');
        setIsRecordingVoice(true);
        timerRef.current = setInterval(() => setRecordSecs((s) => s + 1), 1000);
      } catch (e) {
        Alert.alert('Voice Error', e.message);
      }
    } else {
      await Voice.stop();
      setIsRecordingVoice(false);
      clearInterval(timerRef.current);
    }
  }

  // ── SUBMIT to backend ─────────────────────────────────────────────────────────
  async function handleSubmit() {
    if (activeMode === MODE.CAMERA && !videoUri) {
      Alert.alert('No Video', 'Please record a video first.'); return;
    }
    if (activeMode === MODE.VOICE && !voiceText) {
      Alert.alert('No Voice', 'Please record your voice first.'); return;
    }
    if (activeMode === MODE.TEXT && !textInput.trim()) {
      Alert.alert('No Text', 'Please type something first.'); return;
    }

    setLoading(true);
    setOutput(null);
    fadeAnim.setValue(0);

    try {
      const form = new FormData();
      form.append('mode', activeMode);

      if (activeMode === MODE.CAMERA) {
        form.append('video', {
          uri: Platform.OS === 'android' ? `file://${videoUri}` : videoUri,
          type: 'video/mp4',
          name: 'video.mp4',
        });
      } else if (activeMode === MODE.VOICE) {
        form.append('voice_text', voiceText);
      } else {
        form.append('text', textInput);
      }

      const res = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: form,
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const json = await res.json();
      setOutput(json);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();

    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  }

  // =============================================================================
  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView
        style={s.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

        {/* ── TOP BAR ──────────────────────────────────────────────────────── */}
        <View style={s.topBar}>

          <TouchableOpacity
            style={[s.tab, activeMode === MODE.CAMERA && s.tabActive]}
            onPress={() => switchMode(MODE.CAMERA)}>
            <Text style={s.tabIcon}>🎥</Text>
            <Text style={[s.tabLabel, activeMode === MODE.CAMERA && s.tabLabelActive]}>
              Camera
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[s.tab, activeMode === MODE.VOICE && s.tabActive]}
            onPress={() => switchMode(MODE.VOICE)}>
            <Text style={s.tabIcon}>🎙️</Text>
            <Text style={[s.tabLabel, activeMode === MODE.VOICE && s.tabLabelActive]}>
              Voice
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[s.tab, activeMode === MODE.TEXT && s.tabActive]}
            onPress={() => switchMode(MODE.TEXT)}>
            <Text style={s.tabIcon}>✏️</Text>
            <Text style={[s.tabLabel, activeMode === MODE.TEXT && s.tabLabelActive]}>
              Text
            </Text>
          </TouchableOpacity>

        </View>

        <ScrollView
          contentContainerStyle={s.scroll}
          keyboardShouldPersistTaps="handled">

          {/* ── INPUT CARD ───────────────────────────────────────────────── */}
          <View style={s.card}>
            <Text style={s.cardTitle}>
              {activeMode === MODE.CAMERA ? '📹  Video Input'
                : activeMode === MODE.VOICE ? '🎙  Voice Input'
                : '✏️  Text Input'}
            </Text>

            {/* ══ CAMERA PANEL ══ */}
            {activeMode === MODE.CAMERA && (
              <View>
                {cameraPermission && device ? (
                  <View style={s.cameraBox}>
                    <Camera
                      ref={cameraRef}
                      style={s.camera}
                      device={device}
                      isActive={activeMode === MODE.CAMERA}
                      video
                      audio
                    />
                    {isRecordingVideo && (
                      <View style={s.recBadge}>
                        <View style={s.redDot} />
                        <Text style={s.recText}>REC</Text>
                      </View>
                    )}
                  </View>
                ) : (
                  <View style={s.permBox}>
                    <Text style={s.permText}>
                      {!cameraPermission
                        ? '⚠️ Camera permission not granted.\nGo to device Settings and allow Camera & Microphone.'
                        : '⚠️ No back camera found on this device.'}
                    </Text>
                  </View>
                )}

                <TouchableOpacity
                  style={[s.recordBtn, isRecordingVideo && s.recordBtnStop]}
                  onPress={toggleVideo}>
                  <Text style={s.recordBtnText}>
                    {isRecordingVideo ? '⏹  Stop Recording' : '⏺  Start Recording'}
                  </Text>
                </TouchableOpacity>

                {videoUri ? (
                  <Text style={s.readyText}>✅  Video ready to send</Text>
                ) : null}
              </View>
            )}

            {/* ══ VOICE PANEL ══ */}
            {activeMode === MODE.VOICE && (
              <View style={s.voicePanel}>

                <TouchableOpacity
                  style={[s.micBtn, isRecordingVoice && s.micBtnActive]}
                  onPress={toggleVoice}>
                  <Text style={s.micIcon}>{isRecordingVoice ? '⏹' : '🎙'}</Text>
                </TouchableOpacity>

                <Text style={s.voiceHint}>
                  {isRecordingVoice
                    ? `Listening…  ${formatTime(recordSecs)}`
                    : voiceText
                    ? 'Done! Tap mic to re-record.'
                    : 'Tap the mic button to start speaking'}
                </Text>

                {voiceText ? (
                  <View style={s.transcriptBox}>
                    <Text style={s.transcriptLabel}>Transcribed Text:</Text>
                    <Text style={s.transcriptText}>{voiceText}</Text>
                  </View>
                ) : null}

              </View>
            )}

            {/* ══ TEXT PANEL ══ */}
            {activeMode === MODE.TEXT && (
              <TextInput
                style={s.textArea}
                placeholder="Type your message here…"
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={6}
                value={textInput}
                onChangeText={setTextInput}
                textAlignVertical="top"
              />
            )}
          </View>

          {/* ── SUBMIT BUTTON ─────────────────────────────────────────────── */}
          <TouchableOpacity
            style={[s.submitBtn, loading && s.submitBtnOff]}
            onPress={handleSubmit}
            disabled={loading}>
            {loading
              ? <ActivityIndicator color="#fff" size="small" />
              : <Text style={s.submitText}>🚀  Process Input</Text>}
          </TouchableOpacity>

          {/* ── OUTPUT CARD — only shown after response ───────────────────── */}
          {output && (
            <Animated.View style={[s.card, s.outputCard, { opacity: fadeAnim }]}>
              <Text style={s.outputTitle}>📤  Result</Text>
              <Text style={s.outputBody}>
                {typeof output.result === 'string'
                  ? output.result
                  : JSON.stringify(output, null, 2)}
              </Text>
              {output.processingTime
                ? <Text style={s.outputMeta}>⏱ {output.processingTime} ms</Text>
                : null}
            </Animated.View>
          )}

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const PURPLE = '#6C63FF';
const RED    = '#EF4444';
const BG     = '#F4F6FB';
const WHITE  = '#FFFFFF';
const DARK   = '#1A1A2E';
const GREY   = '#6B7280';

const s = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: BG },
  flex:   { flex: 1 },
  scroll: { padding: 16, paddingBottom: 48, gap: 16 },

  // Top bar
  topBar: {
    flexDirection: 'row',
    backgroundColor: WHITE,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 6,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    gap: 2,
  },
  tabActive:      { backgroundColor: PURPLE, borderColor: PURPLE },
  tabIcon:        { fontSize: 18 },
  tabLabel:       { fontSize: 12, fontWeight: '600', color: GREY },
  tabLabelActive: { color: WHITE },

  // Card
  card: {
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: { fontSize: 15, fontWeight: '700', color: DARK, marginBottom: 14 },

  // Camera
  cameraBox: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    height: 220,
    position: 'relative',
  },
  camera: { flex: 1 },
  recBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 5,
  },
  redDot:  { width: 8, height: 8, borderRadius: 4, backgroundColor: RED },
  recText: { color: WHITE, fontSize: 11, fontWeight: '800', letterSpacing: 1 },

  permBox: {
    backgroundColor: '#FEF2F2',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  permText: { color: RED, fontSize: 13, textAlign: 'center', lineHeight: 20 },

  recordBtn:     { backgroundColor: PURPLE, borderRadius: 12, paddingVertical: 13, alignItems: 'center' },
  recordBtnStop: { backgroundColor: RED },
  recordBtnText: { color: WHITE, fontWeight: '700', fontSize: 15 },

  readyText: { marginTop: 10, color: '#16A34A', fontWeight: '600', fontSize: 13 },

  // Voice
  voicePanel: { alignItems: 'center', paddingVertical: 24, gap: 16 },
  micBtn: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: PURPLE,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  micBtnActive:    { backgroundColor: RED, shadowColor: RED },
  micIcon:         { fontSize: 36 },
  voiceHint:       { color: GREY, fontSize: 13, textAlign: 'center', lineHeight: 20 },
  transcriptBox:   { backgroundColor: '#F3F4F6', borderRadius: 10, padding: 12, width: '100%' },
  transcriptLabel: { fontSize: 12, color: GREY, marginBottom: 4, fontWeight: '600' },
  transcriptText:  { fontSize: 15, color: DARK, lineHeight: 22 },

  // Text area
  textArea: {
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    color: DARK,
    fontSize: 15,
    lineHeight: 22,
    padding: 12,
    minHeight: 130,
  },

  // Submit
  submitBtn: {
    backgroundColor: PURPLE,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitBtnOff: { opacity: 0.6 },
  submitText:   { color: WHITE, fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },

  // Output
  outputCard:  { borderWidth: 1.5, borderColor: PURPLE },
  outputTitle: { fontSize: 15, fontWeight: '700', color: PURPLE, marginBottom: 10 },
  outputBody:  { color: DARK, fontSize: 15, lineHeight: 24 },
  outputMeta:  { marginTop: 10, color: GREY, fontSize: 12 },
});
