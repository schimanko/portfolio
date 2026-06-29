import os
import wave
import subprocess
from pathlib import Path
from google import genai
from google.genai import types

print("🔧 Starting script...")

client = genai.Client()
print("✅ Connected to Gemini client")

BASE_DIR = Path(__file__).resolve().parent
AUDIO_DIR = BASE_DIR / "assets" / "audio"
AUDIO_DIR.mkdir(parents=True, exist_ok=True)

temp_wav = AUDIO_DIR / "temp.wav"
output_mp3 = AUDIO_DIR / "output.mp3"

text_content = """

"""

print("📝 Text content loaded")

config = types.GenerateContentConfig(
    response_modalities=["AUDIO"],
    speech_config=types.SpeechConfig(
        voice_config=types.VoiceConfig(
            prebuilt_voice_config=types.PrebuiltVoiceConfig(voice_name="Charon")
        )
    )
)
print("⚙️ Audio config set (voice: Charon)")

print("📡 Sending request to Gemini TTS... (this may take a few seconds)")
response = client.models.generate_content(
    model='gemini-2.5-flash-preview-tts',
    contents=text_content,
    config=config,
)
print("📨 Response received from Gemini")

print("🔍 Extracting audio bytes from response...")
audio_bytes = None
for part in response.candidates[0].content.parts:
    if part.inline_data and part.inline_data.mime_type.startswith("audio/"):
        audio_bytes = part.inline_data.data
        break

if audio_bytes:
    print(f"✅ Audio bytes extracted ({len(audio_bytes):,} bytes)")

    print(f"🏗️ Saving temporary WAV file to: {temp_wav}")
    with wave.open(str(temp_wav), "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(24000)
        wf.writeframes(audio_bytes)
    print("✅ Temporary WAV saved")

    print(f"🎵 Converting to MP3: {output_mp3}")
    subprocess.run(["ffmpeg", "-y", "-i", str(temp_wav), str(output_mp3)], check=True)
    os.remove(temp_wav)
    print(f"✅ MP3 ready: {output_mp3}")
else:
    print("❌ No audio data found. Check your API key and try again.")